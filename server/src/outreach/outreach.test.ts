import "dotenv/config";
import { randomBytes } from "node:crypto";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import { prisma } from "../db.js";

/**
 * Outreach CRM integration tests (docs/OUTREACH.md), against the LOCAL database only (skipped unless
 * DATABASE_URL is localhost). They set a throwaway in-memory outreach password for this process (never
 * written to .env), create accounts named "zz-test-*" and delete them afterwards.
 */
const isLocalDb = /@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL ?? "");
const PREFIX = "zz-test-";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonResponse = Omit<Response, "json"> & { json(): Promise<any> };

describe.skipIf(!isLocalDb)("Outreach CRM", () => {
  let server: Server;
  let base: string;
  let token: string;
  const password = randomBytes(18).toString("base64url");
  const savedHash = process.env.OUTREACH_PASSWORD_HASH;

  const call = (path: string, init: { method?: string; body?: unknown; auth?: string | null } = {}) =>
    fetch(`${base}/api/v1/outreach${path}`, {
      method: init.method ?? (init.body === undefined ? "GET" : "POST"),
      headers: {
        "content-type": "application/json",
        ...(init.auth === null ? {} : { authorization: `Bearer ${init.auth ?? token}` }),
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    }) as Promise<JsonResponse>;

  async function cleanup() {
    await prisma.outreachAccount.deleteMany({ where: { name: { startsWith: PREFIX } } });
    await prisma.outreachTemplate.deleteMany({ where: { name: { startsWith: PREFIX } } });
  }

  beforeAll(async () => {
    process.env.OUTREACH_PASSWORD_HASH = bcrypt.hashSync(password, 4);
    await cleanup();
    server = createApp().listen(0);
    await new Promise<void>((r) => server.once("listening", () => r()));
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    const login = await call("/login", { auth: null, body: { password } });
    expect(login.status).toBe(200);
    token = (await login.json()).data.token;
  });

  afterAll(async () => {
    await cleanup();
    process.env.OUTREACH_PASSWORD_HASH = savedHash;
    await new Promise((r) => server?.close(r));
    await prisma.$disconnect();
  });

  describe("access", () => {
    it("requires a session for every data route", async () => {
      for (const path of ["/summary", "/accounts", "/activities", "/templates", "/export.csv"]) {
        expect((await call(path, { auth: null })).status).toBe(401);
      }
    });

    it("rejects a wrong password", async () => {
      const res = await call("/login", { auth: null, body: { password: "not-the-password" } });
      expect(res.status).toBe(401);
    });

    it("accepts an admin session, and rejects developer-account tokens", async () => {
      const admin = jwt.sign({ role: "admin" }, process.env.SESSION_SECRET!, { expiresIn: "1m" });
      expect((await call("/accounts", { auth: admin })).status).toBe(200);
      const developer = jwt.sign({ role: "developer" }, process.env.SESSION_SECRET!, { expiresIn: "1m", subject: "x" });
      expect((await call("/accounts", { auth: developer })).status).toBe(401);
    });

    it("does not let an outreach session into admin routes", async () => {
      const res = (await fetch(`${base}/api/v1/admin/me`, { headers: { authorization: `Bearer ${token}` } })) as JsonResponse;
      expect((await res.json()).data.authenticated).toBe(false);
    });
  });

  describe("accounts and activity", () => {
    let id: string;

    it("creates an account and validates input", async () => {
      expect((await call("/accounts", { body: { city: "New York" } })).status).toBe(400);
      expect((await call("/accounts", { body: { name: `${PREFIX}Fund`, city: "New York", fitScore: 9 } })).status).toBe(400);
      const res = await call("/accounts", { body: { name: `${PREFIX}Fund`, city: "New York", fitScore: 4, contactEmail: "info@example.com" } });
      expect(res.status).toBe(201);
      id = (await res.json()).data.id;
    });

    it("moves the stage forward when an email is logged, and records it", async () => {
      expect((await call(`/accounts/${id}/activities`, { body: { type: "email_sent", subject: "Intro" } })).status).toBe(201);
      const acct = (await (await call(`/accounts/${id}`)).json()).data;
      expect(acct.stage).toBe("contacted");
      expect(acct.activities[0].type).toBe("email_sent");
    });

    it("never moves the stage backward", async () => {
      await call(`/accounts/${id}`, { method: "PATCH", body: { stage: "meeting" } });
      await call(`/accounts/${id}/activities`, { body: { type: "email_received" } });
      const acct = (await (await call(`/accounts/${id}`)).json()).data;
      expect(acct.stage).toBe("meeting");
      expect(acct.activities.some((a: { type: string }) => a.type === "stage_change")).toBe(true);
    });

    it("rejects unknown stages and activity types", async () => {
      expect((await call(`/accounts/${id}`, { method: "PATCH", body: { stage: "closed" } })).status).toBe(400);
      expect((await call(`/accounts/${id}/activities`, { body: { type: "sms" } })).status).toBe(400);
    });

    it("adds people and ties activity to them", async () => {
      const contact = (await (await call(`/accounts/${id}/contacts`, { body: { name: "Test Person", role: "Head of Research" } })).json()).data;
      const res = await call(`/accounts/${id}/activities`, { body: { type: "call", contactId: contact.id, subject: "Intro call" } });
      expect(res.status).toBe(201);
      const other = (await (await call("/accounts", { body: { name: `${PREFIX}Other`, city: "Chicago" } })).json()).data;
      expect((await call(`/accounts/${other.id}/activities`, { body: { type: "call", contactId: contact.id } })).status).toBe(400);
    });

    it("an opt-out flags do-not-contact and then blocks logging new emails", async () => {
      await call(`/accounts/${id}/activities`, { body: { type: "opt_out", subject: "Asked to stop" } });
      const acct = (await (await call(`/accounts/${id}`)).json()).data;
      expect(acct.doNotContact).toBe(true);
      const blocked = await call(`/accounts/${id}/activities`, { body: { type: "email_sent" } });
      expect(blocked.status).toBe(409);
      expect((await blocked.json()).error.code).toBe("do_not_contact");
    });

    it("reports pipeline numbers in the summary", async () => {
      const s = (await (await call("/summary")).json()).data;
      expect(s.doNotContact).toBeGreaterThanOrEqual(1);
      expect(s.accountsContacted).toBeGreaterThanOrEqual(1);
      expect(typeof s.byStage.prospect).toBe("number");
    });

    it("exports CSV", async () => {
      const res = await call("/export.csv");
      expect(res.headers.get("content-type")).toContain("text/csv");
      expect(await res.text()).toContain(`${PREFIX}Fund`);
    });

    it("saves templates", async () => {
      const t = await call("/templates", { body: { name: `${PREFIX}tpl`, subject: "S", body: "B" } });
      expect(t.status).toBe(201);
      expect((await call("/templates", { body: { name: `${PREFIX}bad` } })).status).toBe(400);
    });
  });


});
