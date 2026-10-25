import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ACTIVITY_LABEL,
  ACTIVITY_TYPES,
  STAGES,
  STAGE_LABEL,
  downloadOutreachCsv,
  useAccount,
  useAccounts,
  useActivities,
  useAddContact,
  useCreateAccount,
  useDeleteActivity,
  useDeleteContact,
  useDeleteTemplate,
  useLogActivity,
  useOutreachLogin,
  useOutreachLogout,
  useOutreachSession,
  useSaveTemplate,
  useSummary,
  useTemplates,
  useUpdateAccount,
  type AccountRow,
  type Template,
} from "@/hooks/useOutreach";

/**
 * Customer outreach CRM for the Mandate API (docs/OUTREACH.md). Reachable only at /outreach (no nav
 * link, noindex) and behind its own password. Every list reads live data from the outreach tables.
 */

const input = "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm";
const label = "text-xs font-medium uppercase tracking-wide text-muted-foreground";

const STAGE_TONE: Record<string, string> = {
  prospect: "bg-muted text-muted-foreground",
  contacted: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  replied: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  meeting: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  trial: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  negotiating: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  won: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  lost: "bg-muted text-muted-foreground line-through",
  not_fit: "bg-muted text-muted-foreground line-through",
};

function StagePill({ stage }: { stage: string }) {
  return <span className={cn("whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium", STAGE_TONE[stage])}>{STAGE_LABEL[stage] ?? stage}</span>;
}

const fmtDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "";
const fmtMoney = (n: number | null | undefined) =>
  n ? n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }) : "";
const todayIso = () => new Date().toISOString().slice(0, 10);
const startOfToday = () => new Date(new Date().setHours(0, 0, 0, 0));

function dueState(iso: string | null): "overdue" | "today" | "upcoming" | null {
  if (!iso) return null;
  const d = new Date(iso);
  const start = startOfToday();
  const end = new Date(start.getTime() + 86_400_000);
  if (d < start) return "overdue";
  if (d < end) return "today";
  return "upcoming";
}

function CopyButton({ text, children = "Copy" }: { text: string; children?: ReactNode }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          setDone(false);
        }
      }}
    >
      {done ? "Copied" : children}
    </Button>
  );
}

// ------------------------------------------------------------------ login

function LoginForm() {
  const [password, setPassword] = useState("");
  const login = useOutreachLogin();
  return (
    <PageContainer className="flex items-center justify-center py-24">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Outreach</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-3"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              login.mutate(password);
            }}
          >
            <label htmlFor="outreach-password" className="sr-only">Password</label>
            <input id="outreach-password" type="password" autoFocus placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
            {login.isError && <p className="text-sm text-destructive">{login.error.message}</p>}
            <Button type="submit" className="w-full" disabled={login.isPending || !password}>
              {login.isPending ? "Checking…" : "Enter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

// ------------------------------------------------------------------ overview

function Stat({ label: l, value, hint, tone }: { label: string; value: ReactNode; hint?: string; tone?: "warn" | "bad" }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className={label}>{l}</div>
      <div className={cn("mt-1 text-2xl font-semibold tabular-nums", tone === "bad" && "text-destructive", tone === "warn" && "text-amber-600 dark:text-amber-400")}>{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function Overview({ open }: { open: (id: string) => void }) {
  const { data: s } = useSummary();
  const { data: accounts } = useAccounts();
  if (!s) return <p className="text-sm text-muted-foreground">Loading…</p>;
  const total = Object.values(s.byStage).reduce((a, b) => a + b, 0);
  const max = Math.max(1, ...Object.values(s.byStage));
  const hot = (accounts ?? [])
    .filter((a) => !a.doNotContact && ["replied", "meeting", "trial", "negotiating"].includes(a.stage))
    .slice(0, 8);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Accounts" value={total} hint={s.byCity.map((c) => `${c.city} ${c.count}`).join(" · ")} />
        <Stat label="Contacted" value={s.accountsContacted} hint={`${s.last30.emailsSent} emails in the last 30 days`} />
        <Stat label="Reply rate" value={s.replyRate === null ? "None yet" : `${Math.round(s.replyRate * 100)}%`} hint={`${s.last30.repliesReceived} replies in 30 days`} />
        <Stat label="Meetings (30 days)" value={s.last30.meetings} />
        <Stat label="Follow-ups due" value={s.followUpsDue} tone={s.followUpsDue ? "warn" : undefined} hint={s.followUpsOverdue ? `${s.followUpsOverdue} overdue` : "None overdue"} />
        <Stat label="Open pipeline" value={fmtMoney(s.openPipelineAnnualValue) || "$0"} hint="Annual value in meeting, trial or negotiating" />
        <Stat label="Won" value={s.byStage.won ?? 0} />
        <Stat label="Do not contact" value={s.doNotContact} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {STAGES.map((st) => (
              <div key={st.key} className="grid grid-cols-[7rem_1fr_2.5rem] items-center gap-2 text-sm">
                <span className="text-muted-foreground">{st.label}</span>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${((s.byStage[st.key] ?? 0) / max) * 100}%` }} />
                </div>
                <span className="text-right tabular-nums">{s.byStage[st.key] ?? 0}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active conversations</CardTitle>
          </CardHeader>
          <CardContent>
            {hot.length ? (
              <ul className="divide-y divide-border">
                {hot.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-2 py-2">
                    <button className="truncate text-left text-sm font-medium hover:underline" onClick={() => open(a.id)}>
                      {a.name}
                    </button>
                    <StagePill stage={a.stage} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No replies or meetings yet. Accounts appear here once someone responds.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ pipeline board

function Pipeline({ open }: { open: (id: string) => void }) {
  const { data: accounts } = useAccounts();
  const update = useUpdateAccount();
  const cols = STAGES.filter((s) => !["lost", "not_fit"].includes(s.key));
  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-[1100px] grid-cols-7 gap-3">
        {cols.map((col) => {
          const items = (accounts ?? []).filter((a) => a.stage === col.key && !a.doNotContact);
          return (
            <div key={col.key} className="rounded-lg bg-muted/40 p-2">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-sm font-semibold">{col.label}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((a) => (
                  <div key={a.id} className="rounded-md border border-border bg-card p-2 text-sm">
                    <button className="w-full text-left font-medium hover:underline" onClick={() => open(a.id)}>
                      {a.name}
                    </button>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {a.city} · {a.segment ?? "n/a"} · fit {a.fitScore ?? "?"}
                    </div>
                    {a.nextStepDate && (
                      <div className={cn("mt-1 text-xs", dueState(a.nextStepDate) === "overdue" && "text-destructive")}>Next: {fmtDate(a.nextStepDate)}</div>
                    )}
                    <label className="sr-only" htmlFor={`stage-${a.id}`}>Stage</label>
                    <select
                      id={`stage-${a.id}`}
                      className="mt-1.5 w-full rounded border border-border bg-background px-1 py-0.5 text-xs"
                      value={a.stage}
                      onChange={(e) => update.mutate({ id: a.id, stage: e.target.value })}
                    >
                      {STAGES.map((s) => (
                        <option key={s.key} value={s.key}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ accounts

function AddAccount({ onDone }: { onDone: (id: string) => void }) {
  const create = useCreateAccount();
  const [f, setF] = useState({ name: "", city: "New York", segment: "", website: "", contactEmail: "" });
  return (
    <form
      className="grid gap-2 rounded-lg border border-border p-3 md:grid-cols-6"
      onSubmit={(e) => {
        e.preventDefault();
        create.mutate(f, { onSuccess: (a) => { setF({ ...f, name: "", website: "", contactEmail: "" }); onDone(a.id); } });
      }}
    >
      <input aria-label="Firm name" required placeholder="Firm name" className={cn(input, "md:col-span-2")} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <input aria-label="City" required placeholder="City" className={input} value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} />
      <input aria-label="Segment" placeholder="Segment" className={input} value={f.segment} onChange={(e) => setF({ ...f, segment: e.target.value })} />
      <input aria-label="Published inbox" placeholder="Published inbox" className={input} value={f.contactEmail} onChange={(e) => setF({ ...f, contactEmail: e.target.value })} />
      <Button type="submit" disabled={create.isPending}>Add account</Button>
      {create.isError && <p className="text-sm text-destructive md:col-span-6">{create.error.message}</p>}
    </form>
  );
}

function Accounts({ open }: { open: (id: string) => void }) {
  const { data: accounts, isLoading } = useAccounts();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [stage, setStage] = useState("");
  const [segment, setSegment] = useState("");
  const [onlyEmail, setOnlyEmail] = useState(false);
  const [adding, setAdding] = useState(false);
  const cities = useMemo(() => [...new Set((accounts ?? []).map((a) => a.city))].sort(), [accounts]);
  const segments = useMemo(() => [...new Set((accounts ?? []).map((a) => a.segment).filter(Boolean) as string[])].sort(), [accounts]);
  const rows = (accounts ?? []).filter(
    (a) =>
      (!q || a.name.toLowerCase().includes(q.toLowerCase())) &&
      (!city || a.city === city) &&
      (!stage || a.stage === stage) &&
      (!segment || a.segment === segment) &&
      (!onlyEmail || !!a.contactEmail)
  );
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input aria-label="Search accounts" placeholder="Search firms" className={cn(input, "max-w-xs")} value={q} onChange={(e) => setQ(e.target.value)} />
        <select aria-label="City" className={cn(input, "w-auto")} value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">All cities</option>
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select aria-label="Segment" className={cn(input, "w-auto")} value={segment} onChange={(e) => setSegment(e.target.value)}>
          <option value="">All segments</option>
          {segments.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select aria-label="Stage" className={cn(input, "w-auto")} value={stage} onChange={(e) => setStage(e.target.value)}>
          <option value="">All stages</option>
          {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" checked={onlyEmail} onChange={(e) => setOnlyEmail(e.target.checked)} /> Has published inbox
        </label>
        <span className="text-sm text-muted-foreground">{rows.length} shown</span>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={() => downloadOutreachCsv().catch(() => undefined)}>Export CSV</Button>
          <Button size="sm" onClick={() => setAdding((v) => !v)}>{adding ? "Close" : "Add account"}</Button>
        </div>
      </div>
      {adding && <AddAccount onDone={(id) => { setAdding(false); open(id); }} />}
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Firm</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Segment</TableHead>
              <TableHead className="text-right">Fit</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Inbox</TableHead>
              <TableHead>Last activity</TableHead>
              <TableHead>Next step</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={8} className="text-muted-foreground">Loading…</TableCell></TableRow>
            )}
            {rows.map((a) => (
              <TableRow key={a.id} className={cn("cursor-pointer", a.doNotContact && "opacity-50")} onClick={() => open(a.id)}>
                <TableCell className="font-medium">{a.name}{a.doNotContact && <span className="ml-2 text-xs text-destructive">do not contact</span>}</TableCell>
                <TableCell>{a.city}</TableCell>
                <TableCell>{a.segment}</TableCell>
                <TableCell className="text-right tabular-nums">{a.fitScore ?? ""}</TableCell>
                <TableCell><StagePill stage={a.stage} /></TableCell>
                <TableCell className="text-xs">{a.contactEmail ? `${a.contactEmailType ?? "general"}` : <span className="text-muted-foreground">none</span>}</TableCell>
                <TableCell className="text-xs">{a.lastActivity ? `${ACTIVITY_LABEL[a.lastActivity.type] ?? a.lastActivity.type}, ${fmtDate(a.lastActivity.occurredAt)}` : ""}</TableCell>
                <TableCell className={cn("text-xs", dueState(a.nextStepDate) === "overdue" && "text-destructive")}>
                  {a.nextStep ? `${a.nextStep}${a.nextStepDate ? ` (${fmtDate(a.nextStepDate)})` : ""}` : ""}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ follow-ups

function FollowUps({ open }: { open: (id: string) => void }) {
  const { data: accounts } = useAccounts();
  const live = (accounts ?? []).filter((a) => !a.doNotContact && !["won", "lost", "not_fit"].includes(a.stage));
  const scheduled = live.filter((a) => a.nextStepDate).sort((a, b) => a.nextStepDate!.localeCompare(b.nextStepDate!));
  const tenDaysAgo = Date.now() - 10 * 86_400_000;
  const quiet = live.filter(
    (a) => a.stage === "contacted" && !a.nextStepDate && a.lastActivity?.type === "email_sent" && new Date(a.lastActivity.occurredAt).getTime() < tenDaysAgo
  );
  const group = (k: "overdue" | "today" | "upcoming") => scheduled.filter((a) => dueState(a.nextStepDate) === k);
  const Section = ({ title, items, tone }: { title: string; items: AccountRow[]; tone?: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-base", tone)}>{title} <span className="text-muted-foreground">({items.length})</span></CardTitle>
      </CardHeader>
      <CardContent>
        {items.length ? (
          <ul className="divide-y divide-border">
            {items.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <button className="font-medium hover:underline" onClick={() => open(a.id)}>{a.name}</button>
                <span className="text-muted-foreground">{a.nextStep ?? "Follow up"}{a.nextStepDate ? `, ${fmtDate(a.nextStepDate)}` : ""}</span>
                <StagePill stage={a.stage} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nothing here.</p>
        )}
      </CardContent>
    </Card>
  );
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Section title="Overdue" items={group("overdue")} tone="text-destructive" />
      <Section title="Due today" items={group("today")} />
      <Section title="Upcoming" items={group("upcoming")} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">No reply after 10 days <span className="text-muted-foreground">({quiet.length})</span></CardTitle>
        </CardHeader>
        <CardContent>
          {quiet.length ? (
            <ul className="divide-y divide-border">
              {quiet.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                  <button className="font-medium hover:underline" onClick={() => open(a.id)}>{a.name}</button>
                  <span className="text-muted-foreground">emailed {fmtDate(a.lastActivity?.occurredAt)}; one follow-up at most</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No contacted accounts waiting on a reply without a scheduled next step.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ------------------------------------------------------------------ activity feed

function ActivityFeed({ open }: { open: (id: string) => void }) {
  const { data } = useActivities();
  const [type, setType] = useState("");
  const rows = (data ?? []).filter((a) => !type || a.type === type);
  return (
    <div className="space-y-3">
      <select aria-label="Activity type" className={cn(input, "w-auto")} value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">All activity</option>
        {[...ACTIVITY_TYPES, { key: "stage_change", label: "Stage changed" }].map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
      </select>
      {rows.length ? (
        <ol className="divide-y divide-border rounded-lg border border-border">
          {rows.map((a) => (
            <li key={a.id} className="grid gap-1 p-3 text-sm md:grid-cols-[8rem_10rem_1fr]">
              <span className="text-muted-foreground tabular-nums">{fmtDate(a.occurredAt)}</span>
              <span className="font-medium">{ACTIVITY_LABEL[a.type] ?? a.type}</span>
              <span className="min-w-0">
                {a.account && (
                  <button className="font-medium hover:underline" onClick={() => open(a.account!.id)}>{a.account.name}</button>
                )}
                {a.contact && <span className="text-muted-foreground"> · {a.contact.name}</span>}
                {a.subject && <span className="block truncate text-muted-foreground">{a.subject}</span>}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-muted-foreground">No activity logged yet. Log an email, call or meeting from an account's panel.</p>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ templates

function Templates() {
  const { data } = useTemplates();
  const save = useSaveTemplate();
  const del = useDeleteTemplate();
  const [edit, setEdit] = useState<Partial<Template> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  return (
    <div className="grid gap-4 md:grid-cols-[18rem_1fr]">
      <div className="space-y-2">
        <Button size="sm" onClick={() => setEdit({ name: "", subject: "", body: "", purpose: "first_touch" })}>New template</Button>
        <ul className="divide-y divide-border rounded-lg border border-border">
          {(data ?? []).map((t) => (
            <li key={t.id}>
              <button className={cn("w-full p-3 text-left text-sm hover:bg-muted/50", edit?.id === t.id && "bg-muted")} onClick={() => setEdit(t)}>
                <span className="font-medium">{t.name}</span>
                <span className="block text-xs text-muted-foreground">{t.purpose}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">Placeholders like {"{{firm}}"} and {"{{postal address}}"} are filled in by hand before sending. Keep the opt-out line and your postal address in every first-touch email.</p>
      </div>
      {edit ? (
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate(edit as Record<string, unknown>, { onSuccess: () => setEdit(null) });
          }}
        >
          <label className={label} htmlFor="tpl-name">Name</label>
          <input id="tpl-name" required className={input} value={edit.name ?? ""} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
          <label className={label} htmlFor="tpl-purpose">Purpose</label>
          <select id="tpl-purpose" className={input} value={edit.purpose ?? ""} onChange={(e) => setEdit({ ...edit, purpose: e.target.value })}>
            <option value="first_touch">First touch</option>
            <option value="follow_up">Follow-up</option>
            <option value="reply">Reply</option>
            <option value="meeting_recap">Meeting recap</option>
          </select>
          <label className={label} htmlFor="tpl-subject">Subject</label>
          <input id="tpl-subject" required className={input} value={edit.subject ?? ""} onChange={(e) => setEdit({ ...edit, subject: e.target.value })} />
          <label className={label} htmlFor="tpl-body">Body</label>
          <textarea id="tpl-body" required rows={14} className={cn(input, "font-mono text-xs")} value={edit.body ?? ""} onChange={(e) => setEdit({ ...edit, body: e.target.value })} />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={save.isPending}>Save</Button>
            <CopyButton text={`Subject: ${edit.subject ?? ""}\n\n${edit.body ?? ""}`}>Copy</CopyButton>
            {edit.id && (confirmDelete === edit.id ? (
              <>
                <span className="text-sm">Delete this template?</span>
                <Button type="button" variant="outline" size="sm" onClick={() => del.mutate(edit.id!, { onSuccess: () => { setEdit(null); setConfirmDelete(null); } })}>Yes, delete</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              </>
            ) : (
              <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmDelete(edit.id!)}>Delete</Button>
            ))}
          </div>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">Pick a template to edit, or create a new one.</p>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ do not contact

function DoNotContact({ open }: { open: (id: string) => void }) {
  const { data } = useAccounts();
  const rows = (data ?? []).filter((a) => a.doNotContact);
  return rows.length ? (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {rows.map((a) => (
        <li key={a.id} className="flex items-center justify-between gap-2 p-3 text-sm">
          <button className="font-medium hover:underline" onClick={() => open(a.id)}>{a.name}</button>
          <span className="text-muted-foreground">{a.city}</span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-muted-foreground">
      Nobody has asked not to be contacted. When someone does, log "Asked not to be contacted" on their account and it moves here. Logging an email to them is then blocked.
    </p>
  );
}

// ------------------------------------------------------------------ account panel

function AccountPanel({ id, close }: { id: string; close: () => void }) {
  const { data: a, isLoading } = useAccount(id);
  const update = useUpdateAccount();
  const logActivity = useLogActivity();
  const delActivity = useDeleteActivity();
  const addContact = useAddContact();
  const delContact = useDeleteContact();
  const [notes, setNotes] = useState("");
  const [draft, setDraft] = useState({ subject: "", body: "" });
  const [plan, setPlan] = useState({ nextStep: "", nextStepDate: "", dealTier: "", dealValueAnnual: "" });
  const [act, setAct] = useState({ type: "email_sent", occurredAt: todayIso(), subject: "", body: "", contactId: "" });
  const [contact, setContact] = useState({ name: "", role: "", email: "", phone: "" });
  const [saved, setSaved] = useState("");

  useEffect(() => {
    if (!a) return;
    setNotes(a.notes ?? "");
    setDraft({ subject: a.draftSubject ?? "", body: a.draftBody ?? "" });
    setPlan({
      nextStep: a.nextStep ?? "",
      nextStepDate: a.nextStepDate ? a.nextStepDate.slice(0, 10) : "",
      dealTier: a.dealTier ?? "",
      dealValueAnnual: a.dealValueAnnual ? String(a.dealValueAnnual) : "",
    });
  }, [a?.id, a?.updatedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const flash = (m: string) => { setSaved(m); setTimeout(() => setSaved(""), 1500); };
  const patch = (p: Record<string, unknown>, msg = "Saved") => update.mutate({ id, ...p }, { onSuccess: () => flash(msg) });

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30" onClick={close}>
      <aside
        className="h-full w-full max-w-2xl overflow-y-auto bg-background p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        aria-label="Account details"
      >
        {isLoading || !a ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{a.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {[a.city, a.segment, a.hq, a.aumLabel].filter(Boolean).join(" · ")}
                </p>
                {a.website && <a className="text-sm underline" href={a.website} target="_blank" rel="noreferrer">{a.website.replace(/^https?:\/\//, "")}</a>}
              </div>
              <div className="flex items-center gap-2">
                {saved && <span className="text-xs text-emerald-600">{saved}</span>}
                <Button variant="ghost" size="sm" onClick={close}>Close</Button>
              </div>
            </div>

            {a.doNotContact && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
                This firm asked not to be contacted. Logging new emails is blocked.
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className={label} htmlFor="p-stage">Stage</label>
                <select id="p-stage" className={input} value={a.stage} onChange={(e) => patch({ stage: e.target.value })}>
                  {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="p-priority">Priority</label>
                <select id="p-priority" className={input} value={a.priority ?? ""} onChange={(e) => patch({ priority: e.target.value || null })}>
                  <option value="">None</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className={label} htmlFor="p-fit">Fit (1-5)</label>
                <select id="p-fit" className={input} value={a.fitScore ?? ""} onChange={(e) => patch({ fitScore: e.target.value ? Number(e.target.value) : null })}>
                  <option value="">?</option>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <section className="space-y-2 rounded-lg border border-border p-3">
              <h3 className="text-sm font-semibold">Contact</h3>
              {a.contactEmail ? (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-mono">{a.contactEmail}</span>
                  <CopyButton text={a.contactEmail} />
                  <span className="text-xs uppercase text-muted-foreground">{a.contactEmailType}</span>
                  {a.contactEmailSource && <a className="text-xs underline" href={a.contactEmailSource} target="_blank" rel="noreferrer">where it's published</a>}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No published inbox.</p>
              )}
              {a.contactOther && <p className="text-sm text-muted-foreground">{a.contactOther}</p>}

              <div className="space-y-1 pt-1">
                <div className={label}>People</div>
                {a.contacts.length ? (
                  <ul className="space-y-1 text-sm">
                    {a.contacts.map((c) => (
                      <li key={c.id} className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{c.name}</span>
                        {c.role && <span className="text-muted-foreground">{c.role}</span>}
                        {c.email && <span className="font-mono text-xs">{c.email}</span>}
                        {c.phone && <span className="text-xs">{c.phone}</span>}
                        <button className="text-xs text-muted-foreground hover:text-destructive" onClick={() => delContact.mutate(c.id)}>remove</button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">Add someone once they reply or you're introduced.</p>
                )}
                <form
                  className="grid gap-2 sm:grid-cols-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    addContact.mutate({ accountId: id, ...contact }, { onSuccess: () => { setContact({ name: "", role: "", email: "", phone: "" }); flash("Contact added"); } });
                  }}
                >
                  <input aria-label="Name" required placeholder="Name" className={input} value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                  <input aria-label="Role" placeholder="Role" className={input} value={contact.role} onChange={(e) => setContact({ ...contact, role: e.target.value })} />
                  <input aria-label="Email" placeholder="Email" className={input} value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                  <input aria-label="Phone" placeholder="Phone" className={input} value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                  <Button type="submit" variant="outline" size="sm" disabled={addContact.isPending}>Add person</Button>
                </form>
              </div>
            </section>

            <section className="space-y-2 rounded-lg border border-border p-3">
              <h3 className="text-sm font-semibold">Plan</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="p-next">Next step</label>
                  <input id="p-next" className={input} value={plan.nextStep} onChange={(e) => setPlan({ ...plan, nextStep: e.target.value })} placeholder="e.g. Send Lakeview sample" />
                </div>
                <div>
                  <label className={label} htmlFor="p-nextdate">Due</label>
                  <input id="p-nextdate" type="date" className={input} value={plan.nextStepDate} onChange={(e) => setPlan({ ...plan, nextStepDate: e.target.value })} />
                </div>
                <div>
                  <label className={label} htmlFor="p-tier">Likely plan</label>
                  <select id="p-tier" className={input} value={plan.dealTier} onChange={(e) => setPlan({ ...plan, dealTier: e.target.value })}>
                    <option value="">Unknown</option>
                    <option value="developer">Developer</option>
                    <option value="professional">Professional</option>
                    <option value="institutional">Institutional</option>
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="p-value">Expected annual value ($)</label>
                  <input id="p-value" inputMode="numeric" className={input} value={plan.dealValueAnnual} onChange={(e) => setPlan({ ...plan, dealValueAnnual: e.target.value.replace(/[^0-9]/g, "") })} />
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  patch({
                    nextStep: plan.nextStep || null,
                    nextStepDate: plan.nextStepDate ? new Date(`${plan.nextStepDate}T12:00:00`).toISOString() : null,
                    dealTier: plan.dealTier || null,
                    dealValueAnnual: plan.dealValueAnnual ? Number(plan.dealValueAnnual) : null,
                  })
                }
              >
                Save plan
              </Button>
            </section>

            <section className="space-y-2 rounded-lg border border-border p-3">
              <h3 className="text-sm font-semibold">Log activity</h3>
              <form
                className="grid gap-2 sm:grid-cols-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  logActivity.mutate(
                    { accountId: id, ...act, occurredAt: new Date(`${act.occurredAt}T12:00:00`).toISOString(), contactId: act.contactId || null },
                    { onSuccess: () => { setAct({ ...act, subject: "", body: "" }); flash("Logged"); } }
                  );
                }}
              >
                <select aria-label="Activity type" className={input} value={act.type} onChange={(e) => setAct({ ...act, type: e.target.value })}>
                  {ACTIVITY_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                </select>
                <input aria-label="Date" type="date" className={input} value={act.occurredAt} onChange={(e) => setAct({ ...act, occurredAt: e.target.value })} />
                <select aria-label="Person" className={input} value={act.contactId} onChange={(e) => setAct({ ...act, contactId: e.target.value })}>
                  <option value="">Firm (no specific person)</option>
                  {a.contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input aria-label="Subject or summary" placeholder="Subject or one-line summary" className={cn(input, "sm:col-span-3")} value={act.subject} onChange={(e) => setAct({ ...act, subject: e.target.value })} />
                <textarea aria-label="Details" placeholder="Details (optional)" rows={2} className={cn(input, "sm:col-span-3")} value={act.body} onChange={(e) => setAct({ ...act, body: e.target.value })} />
                <div className="flex items-center gap-2 sm:col-span-3">
                  <Button type="submit" size="sm" disabled={logActivity.isPending}>Log</Button>
                  {logActivity.isError && <span className="text-sm text-destructive">{logActivity.error.message}</span>}
                  <span className="text-xs text-muted-foreground">Emails, replies, meetings and trials move the stage forward automatically.</span>
                </div>
              </form>
              {a.activities.length > 0 && (
                <ol className="mt-2 divide-y divide-border text-sm">
                  {a.activities.map((x) => (
                    <li key={x.id} className="flex items-start justify-between gap-2 py-2">
                      <div className="min-w-0">
                        <span className="tabular-nums text-muted-foreground">{fmtDate(x.occurredAt)}</span>{" "}
                        <span className="font-medium">{ACTIVITY_LABEL[x.type] ?? x.type}</span>
                        {x.contact && <span className="text-muted-foreground"> · {x.contact.name}</span>}
                        {x.subject && <div className="text-muted-foreground">{x.subject}</div>}
                        {x.body && <div className="whitespace-pre-wrap text-xs text-muted-foreground">{x.body}</div>}
                      </div>
                      <button className="text-xs text-muted-foreground hover:text-destructive" onClick={() => delActivity.mutate(x.id)}>delete</button>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section className="space-y-2 rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Draft email</h3>
                <CopyButton text={`Subject: ${draft.subject}\n\n${draft.body}`}>Copy draft</CopyButton>
              </div>
              <input aria-label="Draft subject" className={input} value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} />
              <textarea aria-label="Draft body" rows={12} className={cn(input, "text-sm")} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => patch({ draftSubject: draft.subject, draftBody: draft.body }, "Draft saved")}>Save draft</Button>
                <span className="text-xs text-muted-foreground">Add your postal address and an opt-out line before sending.</span>
              </div>
            </section>

            <section className="space-y-2 rounded-lg border border-border p-3">
              <h3 className="text-sm font-semibold">Notes</h3>
              <textarea aria-label="Notes" rows={4} className={input} value={notes} onChange={(e) => setNotes(e.target.value)} />
              <Button size="sm" variant="outline" onClick={() => patch({ notes }, "Notes saved")}>Save notes</Button>
            </section>

            <section className="space-y-2 rounded-lg border border-border p-3 text-sm">
              <h3 className="text-sm font-semibold">Research</h3>
              {a.strategy && <p>{a.strategy}</p>}
              {a.whyMandate && <p><span className="font-medium">Why Mandate: </span>{a.whyMandate}</p>}
              {a.fitReason && <p className="text-muted-foreground">Fit: {a.fitReason}</p>}
              {a.aumSource && <p className="text-muted-foreground">Assets: {a.aumSource}</p>}
              {a.evidence && a.evidence.length > 0 && (
                <ul className="list-disc space-y-1 pl-5">
                  {a.evidence.map((e, i) => (
                    <li key={i}>{e.fact} {e.url && <a className="underline" href={e.url} target="_blank" rel="noreferrer">source</a>}</li>
                  ))}
                </ul>
              )}
              {a.caveats && <p className="text-muted-foreground">Caveats: {a.caveats}</p>}
            </section>

            <section className="flex flex-wrap items-center gap-2">
              {a.doNotContact ? (
                <Button size="sm" variant="outline" onClick={() => patch({ doNotContact: false }, "Removed from do-not-contact")}>Remove do-not-contact</Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => patch({ doNotContact: true }, "Marked do not contact")}>Mark do not contact</Button>
              )}
            </section>
          </div>
        )}
      </aside>
    </div>
  );
}

// ------------------------------------------------------------------ page

const TAB_KEY = "mandate_outreach_tab";

export function OutreachPage() {
  const session = useOutreachSession();
  const logout = useOutreachLogout();
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState(() => {
    try {
      return localStorage.getItem(TAB_KEY) ?? "overview";
    } catch {
      return "overview";
    }
  });

  // Unlisted page: keep it out of search engines.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = "Outreach · Mandate";
    return () => {
      meta.remove();
      document.title = prevTitle;
    };
  }, []);

  if (session.isLoading) return <PageContainer><p className="text-sm text-muted-foreground">Checking access…</p></PageContainer>;
  if (!session.data?.authenticated) return <LoginForm />;

  const changeTab = (t: string) => {
    setTab(t);
    try {
      localStorage.setItem(TAB_KEY, t);
    } catch {
      // storage blocked: tab just won't be remembered
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Outreach</h1>
          <p className="text-sm text-muted-foreground">Customer acquisition for the Mandate API. Private: unlisted and password-protected.</p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>Log out</Button>
      </div>
      <Tabs value={tab} onValueChange={changeTab} className="mt-5">
        <div className="overflow-x-auto">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="followups">Follow-ups</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="dnc">Do not contact</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview"><Overview open={setOpenId} /></TabsContent>
        <TabsContent value="pipeline"><Pipeline open={setOpenId} /></TabsContent>
        <TabsContent value="accounts"><Accounts open={setOpenId} /></TabsContent>
        <TabsContent value="followups"><FollowUps open={setOpenId} /></TabsContent>
        <TabsContent value="activity"><ActivityFeed open={setOpenId} /></TabsContent>
        <TabsContent value="templates"><Templates /></TabsContent>
        <TabsContent value="dnc"><DoNotContact open={setOpenId} /></TabsContent>
      </Tabs>
      {openId && <AccountPanel id={openId} close={() => setOpenId(null)} />}
    </PageContainer>
  );
}
