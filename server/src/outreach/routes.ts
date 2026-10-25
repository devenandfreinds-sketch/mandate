import { Router } from "express";
import bcrypt from "bcryptjs";
import type { Prisma } from "@prisma/client";
import { prisma } from "../db.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import { ipThrottle } from "./throttle.js";
import { isOutreachRequest, issueOutreachToken, requireOutreach } from "./outreachAuth.js";

/**
 * Outreach CRM API, mounted at /api/v1/outreach (docs/OUTREACH.md). Internal only: nothing else in
 * the app reads these tables, and no public route exposes them.
 */
export const outreachRouter = Router();

export const STAGES = ["prospect", "contacted", "replied", "meeting", "trial", "negotiating", "won", "lost", "not_fit"] as const;
export const ACTIVITY_TYPES = ["email_sent", "email_received", "call", "meeting", "note", "stage_change", "bounce", "opt_out", "trial"] as const;
const STAGE_RANK: Record<string, number> = Object.fromEntries(STAGES.map((s, i) => [s, i]));
/** Logging an activity moves an account forward (never backward, never out of won/lost/not_fit). */
const AUTO_ADVANCE: Record<string, string> = { email_sent: "contacted", email_received: "replied", meeting: "meeting", trial: "trial" };
const TERMINAL = new Set(["won", "lost", "not_fit"]);

const authThrottle = ipThrottle(10, 10 * 60 * 1000);

// ------------------------------------------------------------------ helpers

function str(v: unknown, field: string, max = 5000): string | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  if (typeof v !== "string") throw ApiError.badRequest(`${field} must be text`);
  if (v.length > max) throw ApiError.badRequest(`${field} is too long (max ${max} characters)`);
  return v.trim();
}

function int(v: unknown, field: string, min: number, max: number): number | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isInteger(n) || n < min || n > max) throw ApiError.badRequest(`${field} must be a whole number from ${min} to ${max}`);
  return n;
}

function date(v: unknown, field: string): Date | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  if (typeof v !== "string" || Number.isNaN(Date.parse(v))) throw ApiError.badRequest(`${field} must be a date`);
  return new Date(v);
}

function oneOf<T extends string>(v: unknown, field: string, allowed: readonly T[]): T | undefined {
  if (v === undefined) return undefined;
  if (typeof v !== "string" || !(allowed as readonly string[]).includes(v)) {
    throw ApiError.badRequest(`${field} must be one of: ${allowed.join(", ")}`);
  }
  return v as T;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "account";
}

/** Only these account fields are editable from the UI. */
function accountPatch(body: Record<string, unknown>): Prisma.OutreachAccountUpdateInput {
  const patch: Prisma.OutreachAccountUpdateInput = {};
  const s = (k: string, max?: number) => {
    const v = str(body[k], k, max);
    if (v !== undefined) (patch as Record<string, unknown>)[k] = v;
  };
  ["name", "city", "segment", "website", "hq", "strategy", "aumLabel", "aumSource", "fitReason", "whyMandate", "caveats",
    "contactEmail", "contactEmailType", "contactEmailSource", "contactOther", "nextStep", "dealTier", "draftSubject", "notes"].forEach((k) => s(k));
  s("draftBody", 20000);
  const fit = int(body.fitScore, "fitScore", 1, 5);
  if (fit !== undefined) patch.fitScore = fit;
  const value = int(body.dealValueAnnual, "dealValueAnnual", 0, 100_000_000);
  if (value !== undefined) patch.dealValueAnnual = value;
  const next = date(body.nextStepDate, "nextStepDate");
  if (next !== undefined) patch.nextStepDate = next;
  const priority = body.priority === null ? null : oneOf(body.priority, "priority", ["high", "medium", "low"] as const);
  if (priority !== undefined) patch.priority = priority;
  if (body.doNotContact !== undefined) {
    if (typeof body.doNotContact !== "boolean") throw ApiError.badRequest("doNotContact must be true or false");
    patch.doNotContact = body.doNotContact;
  }
  if (patch.name === null) throw ApiError.badRequest("name is required");
  if (patch.city === null) throw ApiError.badRequest("city is required");
  return patch;
}

// ------------------------------------------------------------------ auth

outreachRouter.post(
  "/login",
  authThrottle,
  asyncHandler(async (req, res) => {
    const hash = process.env.OUTREACH_PASSWORD_HASH;
    if (!hash) throw new ApiError(500, "Outreach password is not configured on the server", "outreach_not_configured");
    const password = (req.body as { password?: unknown })?.password;
    if (typeof password !== "string" || !bcrypt.compareSync(password, hash)) {
      throw new ApiError(401, "Incorrect password", "invalid_credentials");
    }
    res.json({ data: { authenticated: true, token: issueOutreachToken() } });
  })
);

outreachRouter.get("/me", (req, res) => {
  res.json({ data: { authenticated: isOutreachRequest(req) } });
});

outreachRouter.use(requireOutreach);

// ------------------------------------------------------------------ overview

outreachRouter.get(
  "/summary",
  asyncHandler(async (_req, res) => {
    const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const [byStage, byCity, sent30, received30, meetings30, sentAll, accountsReplied, dueCount, overdueCount, pipelineValue] = await Promise.all([
      prisma.outreachAccount.groupBy({ by: ["stage"], _count: { _all: true }, where: { doNotContact: false } }),
      prisma.outreachAccount.groupBy({ by: ["city"], _count: { _all: true } }),
      prisma.outreachActivity.count({ where: { type: "email_sent", occurredAt: { gte: since30 } } }),
      prisma.outreachActivity.count({ where: { type: "email_received", occurredAt: { gte: since30 } } }),
      prisma.outreachActivity.count({ where: { type: "meeting", occurredAt: { gte: since30 } } }),
      prisma.outreachActivity.groupBy({ by: ["accountId"], where: { type: "email_sent" } }),
      prisma.outreachActivity.groupBy({ by: ["accountId"], where: { type: "email_received" } }),
      prisma.outreachAccount.count({ where: { nextStepDate: { lte: endOfToday }, doNotContact: false, stage: { notIn: [...TERMINAL] } } }),
      prisma.outreachAccount.count({ where: { nextStepDate: { lt: new Date(new Date().setHours(0, 0, 0, 0)) }, doNotContact: false, stage: { notIn: [...TERMINAL] } } }),
      prisma.outreachAccount.aggregate({ _sum: { dealValueAnnual: true }, where: { stage: { in: ["meeting", "trial", "negotiating"] } } }),
    ]);
    const contacted = new Set(sentAll.map((r) => r.accountId));
    const replied = accountsReplied.filter((r) => contacted.has(r.accountId)).length;
    res.json({
      data: {
        byStage: Object.fromEntries(STAGES.map((s) => [s, byStage.find((b) => b.stage === s)?._count._all ?? 0])),
        byCity: byCity.map((c) => ({ city: c.city, count: c._count._all })),
        last30: { emailsSent: sent30, repliesReceived: received30, meetings: meetings30 },
        accountsContacted: contacted.size,
        replyRate: contacted.size ? replied / contacted.size : null,
        followUpsDue: dueCount,
        followUpsOverdue: overdueCount,
        openPipelineAnnualValue: pipelineValue._sum.dealValueAnnual ?? 0,
        doNotContact: await prisma.outreachAccount.count({ where: { doNotContact: true } }),
      },
    });
  })
);

// ------------------------------------------------------------------ accounts

outreachRouter.get(
  "/accounts",
  asyncHandler(async (_req, res) => {
    const rows = await prisma.outreachAccount.findMany({
      orderBy: [{ fitScore: "desc" }, { name: "asc" }],
      select: {
        id: true, slug: true, name: true, city: true, segment: true, fitScore: true, stage: true, priority: true,
        doNotContact: true, contactEmail: true, contactEmailType: true, nextStep: true, nextStepDate: true,
        dealTier: true, dealValueAnnual: true, aumLabel: true, updatedAt: true,
        _count: { select: { contacts: true, activities: true } },
        activities: { orderBy: { occurredAt: "desc" }, take: 1, select: { type: true, occurredAt: true } },
      },
    });
    res.json({
      data: rows.map(({ activities, _count, ...a }) => ({
        ...a,
        contactCount: _count.contacts,
        activityCount: _count.activities,
        lastActivity: activities[0] ?? null,
      })),
    });
  })
);

outreachRouter.get(
  "/accounts/:id",
  asyncHandler(async (req, res) => {
    const account = await prisma.outreachAccount.findUnique({
      where: { id: req.params.id },
      include: {
        contacts: { orderBy: { createdAt: "asc" } },
        activities: { orderBy: { occurredAt: "desc" }, include: { contact: { select: { name: true } } } },
      },
    });
    if (!account) throw ApiError.notFound("Account not found");
    res.json({ data: account });
  })
);

outreachRouter.post(
  "/accounts",
  asyncHandler(async (req, res) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const name = str(body.name, "name", 200);
    const city = str(body.city, "city", 100);
    if (!name || !city) throw ApiError.badRequest("name and city are required");
    const patch = accountPatch(body);
    let slug = slugify(name);
    if (await prisma.outreachAccount.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString(36)}`;
    const created = await prisma.outreachAccount.create({ data: { ...(patch as Prisma.OutreachAccountCreateInput), name, city, slug } });
    res.status(201).json({ data: created });
  })
);

outreachRouter.patch(
  "/accounts/:id",
  asyncHandler(async (req, res) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const existing = await prisma.outreachAccount.findUnique({ where: { id: req.params.id } });
    if (!existing) throw ApiError.notFound("Account not found");
    const patch = accountPatch(body);
    const stage = oneOf(body.stage, "stage", STAGES);
    const log: Prisma.OutreachActivityCreateManyInput[] = [];
    if (stage && stage !== existing.stage) {
      patch.stage = stage;
      log.push({ accountId: existing.id, type: "stage_change", subject: `${existing.stage} → ${stage}` });
    }
    if (patch.doNotContact === true && !existing.doNotContact) {
      log.push({ accountId: existing.id, type: "opt_out", subject: "Marked do not contact" });
    }
    const [updated] = await prisma.$transaction([
      prisma.outreachAccount.update({ where: { id: existing.id }, data: patch }),
      prisma.outreachActivity.createMany({ data: log }),
    ]);
    res.json({ data: updated });
  })
);

outreachRouter.delete(
  "/accounts/:id",
  asyncHandler(async (req, res) => {
    await prisma.outreachAccount.delete({ where: { id: req.params.id } }).catch(() => {
      throw ApiError.notFound("Account not found");
    });
    res.json({ data: { deleted: true } });
  })
);

// ------------------------------------------------------------------ contacts

outreachRouter.post(
  "/accounts/:id/contacts",
  asyncHandler(async (req, res) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const name = str(body.name, "name", 200);
    if (!name) throw ApiError.badRequest("name is required");
    if (!(await prisma.outreachAccount.findUnique({ where: { id: req.params.id }, select: { id: true } }))) throw ApiError.notFound("Account not found");
    const contact = await prisma.outreachContact.create({
      data: {
        accountId: req.params.id,
        name,
        role: str(body.role, "role", 200) ?? null,
        email: str(body.email, "email", 320) ?? null,
        phone: str(body.phone, "phone", 50) ?? null,
        notes: str(body.notes, "notes") ?? null,
      },
    });
    res.status(201).json({ data: contact });
  })
);

outreachRouter.patch(
  "/contacts/:id",
  asyncHandler(async (req, res) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const data: Prisma.OutreachContactUpdateInput = {};
    for (const [k, max] of [["name", 200], ["role", 200], ["email", 320], ["phone", 50], ["notes", 5000]] as const) {
      const v = str(body[k], k, max);
      if (v !== undefined) (data as Record<string, unknown>)[k] = v;
    }
    if (data.name === null) throw ApiError.badRequest("name is required");
    const updated = await prisma.outreachContact.update({ where: { id: req.params.id }, data }).catch(() => {
      throw ApiError.notFound("Contact not found");
    });
    res.json({ data: updated });
  })
);

outreachRouter.delete(
  "/contacts/:id",
  asyncHandler(async (req, res) => {
    await prisma.outreachContact.delete({ where: { id: req.params.id } }).catch(() => {
      throw ApiError.notFound("Contact not found");
    });
    res.json({ data: { deleted: true } });
  })
);

// ------------------------------------------------------------------ activities

outreachRouter.post(
  "/accounts/:id/activities",
  asyncHandler(async (req, res) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const type = oneOf(body.type, "type", ACTIVITY_TYPES);
    if (!type) throw ApiError.badRequest("type is required");
    const account = await prisma.outreachAccount.findUnique({ where: { id: req.params.id } });
    if (!account) throw ApiError.notFound("Account not found");
    if (type === "email_sent" && account.doNotContact) {
      throw new ApiError(409, "This account is marked do not contact.", "do_not_contact");
    }
    const contactId = str(body.contactId, "contactId", 50) ?? null;
    if (contactId && !(await prisma.outreachContact.findFirst({ where: { id: contactId, accountId: account.id } }))) {
      throw ApiError.badRequest("contactId does not belong to this account");
    }
    const activity = await prisma.outreachActivity.create({
      data: {
        accountId: account.id,
        contactId,
        type,
        occurredAt: date(body.occurredAt, "occurredAt") ?? new Date(),
        subject: str(body.subject, "subject", 500) ?? null,
        body: str(body.body, "body", 20000) ?? null,
      },
    });
    // Move the account forward on meaningful activity; opt-outs flag it do-not-contact.
    const target = AUTO_ADVANCE[type];
    const updates: Prisma.OutreachAccountUpdateInput = {};
    if (target && !TERMINAL.has(account.stage) && STAGE_RANK[target] > STAGE_RANK[account.stage]) updates.stage = target;
    if (type === "opt_out") updates.doNotContact = true;
    if (Object.keys(updates).length) await prisma.outreachAccount.update({ where: { id: account.id }, data: updates });
    res.status(201).json({ data: activity });
  })
);

outreachRouter.delete(
  "/activities/:id",
  asyncHandler(async (req, res) => {
    await prisma.outreachActivity.delete({ where: { id: req.params.id } }).catch(() => {
      throw ApiError.notFound("Activity not found");
    });
    res.json({ data: { deleted: true } });
  })
);

outreachRouter.get(
  "/activities",
  asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const rows = await prisma.outreachActivity.findMany({
      orderBy: { occurredAt: "desc" },
      take: limit,
      include: { account: { select: { id: true, name: true, city: true } }, contact: { select: { name: true } } },
    });
    res.json({ data: rows });
  })
);

// ------------------------------------------------------------------ templates

outreachRouter.get(
  "/templates",
  asyncHandler(async (_req, res) => {
    res.json({ data: await prisma.outreachTemplate.findMany({ orderBy: { name: "asc" } }) });
  })
);

outreachRouter.post(
  "/templates",
  asyncHandler(async (req, res) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const name = str(body.name, "name", 200);
    const subject = str(body.subject, "subject", 500);
    const text = str(body.body, "body", 20000);
    if (!name || !subject || !text) throw ApiError.badRequest("name, subject and body are required");
    const t = await prisma.outreachTemplate.create({ data: { name, subject, body: text, purpose: str(body.purpose, "purpose", 50) ?? null } });
    res.status(201).json({ data: t });
  })
);

outreachRouter.patch(
  "/templates/:id",
  asyncHandler(async (req, res) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const data: Prisma.OutreachTemplateUpdateInput = {};
    for (const [k, max] of [["name", 200], ["subject", 500], ["body", 20000], ["purpose", 50]] as const) {
      const v = str(body[k], k, max);
      if (v !== undefined) (data as Record<string, unknown>)[k] = v;
    }
    const t = await prisma.outreachTemplate.update({ where: { id: req.params.id }, data }).catch(() => {
      throw ApiError.notFound("Template not found");
    });
    res.json({ data: t });
  })
);

outreachRouter.delete(
  "/templates/:id",
  asyncHandler(async (req, res) => {
    await prisma.outreachTemplate.delete({ where: { id: req.params.id } }).catch(() => {
      throw ApiError.notFound("Template not found");
    });
    res.json({ data: { deleted: true } });
  })
);

// ------------------------------------------------------------------ export

function csvCell(v: unknown): string {
  const s = v === null || v === undefined ? "" : v instanceof Date ? v.toISOString().slice(0, 10) : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

outreachRouter.get(
  "/export.csv",
  asyncHandler(async (_req, res) => {
    const rows = await prisma.outreachAccount.findMany({ orderBy: [{ city: "asc" }, { name: "asc" }] });
    const cols = ["name", "city", "segment", "stage", "fitScore", "priority", "doNotContact", "contactEmail", "contactEmailType", "nextStep", "nextStepDate", "dealTier", "dealValueAnnual", "aumLabel", "website", "notes"] as const;
    const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(","))].join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="mandate-outreach.csv"');
    res.send(csv);
  })
);
