import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiRequestError, getAdminToken } from "@/lib/api";

/**
 * Outreach CRM data (docs/OUTREACH.md). Uses its own session token; an admin session also works,
 * so a logged-in admin is never asked for the outreach password.
 */
const TOKEN_KEY = "mandate_outreach_token";

function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? getAdminToken();
  } catch {
    return null;
  }
}

export function clearOutreachToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage blocked: nothing persisted to clear
  }
}

async function request<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(api.url(`/outreach${path}`), {
    method: init.method ?? "GET",
    headers: {
      ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiRequestError(res.status, body?.error?.message ?? res.statusText, body?.error?.code ?? "unknown_error");
  return body.data as T;
}

export const STAGES = [
  { key: "prospect", label: "Prospect" },
  { key: "contacted", label: "Contacted" },
  { key: "replied", label: "Replied" },
  { key: "meeting", label: "Meeting" },
  { key: "trial", label: "Trial" },
  { key: "negotiating", label: "Negotiating" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
  { key: "not_fit", label: "Not a fit" },
] as const;
export const STAGE_LABEL: Record<string, string> = Object.fromEntries(STAGES.map((s) => [s.key, s.label]));

export const ACTIVITY_TYPES = [
  { key: "email_sent", label: "Email sent" },
  { key: "email_received", label: "Reply received" },
  { key: "call", label: "Call" },
  { key: "meeting", label: "Meeting" },
  { key: "trial", label: "Trial started" },
  { key: "note", label: "Note" },
  { key: "bounce", label: "Bounced" },
  { key: "opt_out", label: "Asked not to be contacted" },
] as const;
export const ACTIVITY_LABEL: Record<string, string> = {
  ...Object.fromEntries(ACTIVITY_TYPES.map((a) => [a.key, a.label])),
  stage_change: "Stage changed",
};

export interface AccountRow {
  id: string;
  slug: string;
  name: string;
  city: string;
  segment: string | null;
  fitScore: number | null;
  stage: string;
  priority: string | null;
  doNotContact: boolean;
  contactEmail: string | null;
  contactEmailType: string | null;
  nextStep: string | null;
  nextStepDate: string | null;
  dealTier: string | null;
  dealValueAnnual: number | null;
  aumLabel: string | null;
  updatedAt: string;
  contactCount: number;
  activityCount: number;
  lastActivity: { type: string; occurredAt: string } | null;
}

export interface Contact {
  id: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
}

export interface Activity {
  id: string;
  type: string;
  occurredAt: string;
  subject: string | null;
  body: string | null;
  contact: { name: string } | null;
  account?: { id: string; name: string; city: string };
}

export interface AccountDetail extends Omit<AccountRow, "contactCount" | "activityCount" | "lastActivity"> {
  website: string | null;
  hq: string | null;
  strategy: string | null;
  aumSource: string | null;
  fitReason: string | null;
  whyMandate: string | null;
  evidence: { fact: string; url?: string }[] | null;
  sources: string[] | null;
  caveats: string | null;
  contactEmailSource: string | null;
  contactOther: string | null;
  draftSubject: string | null;
  draftBody: string | null;
  notes: string | null;
  contacts: Contact[];
  activities: Activity[];
}

export interface Summary {
  byStage: Record<string, number>;
  byCity: { city: string; count: number }[];
  last30: { emailsSent: number; repliesReceived: number; meetings: number };
  accountsContacted: number;
  replyRate: number | null;
  followUpsDue: number;
  followUpsOverdue: number;
  openPipelineAnnualValue: number;
  doNotContact: number;
}

export interface Template {
  id: string;
  name: string;
  purpose: string | null;
  subject: string;
  body: string;
}

export function useOutreachSession() {
  return useQuery({ queryKey: ["outreach", "me"], queryFn: () => request<{ authenticated: boolean }>("/me"), retry: false });
}

export function useOutreachLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (password: string) => request<{ token: string }>("/login", { method: "POST", body: { password } }),
    onSuccess: (data) => {
      try {
        localStorage.setItem(TOKEN_KEY, data.token);
      } catch {
        // storage blocked: the session lasts only for this page view
      }
      qc.invalidateQueries({ queryKey: ["outreach"] });
    },
  });
}

export function useOutreachLogout() {
  const qc = useQueryClient();
  return () => {
    clearOutreachToken();
    qc.resetQueries({ queryKey: ["outreach"] });
  };
}

export const useSummary = () => useQuery({ queryKey: ["outreach", "summary"], queryFn: () => request<Summary>("/summary") });
export const useAccounts = () => useQuery({ queryKey: ["outreach", "accounts"], queryFn: () => request<AccountRow[]>("/accounts") });
export const useAccount = (id: string | null) =>
  useQuery({ queryKey: ["outreach", "account", id], queryFn: () => request<AccountDetail>(`/accounts/${id}`), enabled: !!id });
export const useActivities = () => useQuery({ queryKey: ["outreach", "activities"], queryFn: () => request<Activity[]>("/activities?limit=200") });
export const useTemplates = () => useQuery({ queryKey: ["outreach", "templates"], queryFn: () => request<Template[]>("/templates") });

/** Any write refreshes every outreach view, so counts, lists and timelines never disagree. */
function useWrite<V, R = unknown>(fn: (v: V) => Promise<R>) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: () => qc.invalidateQueries({ queryKey: ["outreach"] }) });
}

export const useUpdateAccount = () =>
  useWrite(({ id, ...patch }: { id: string } & Record<string, unknown>) => request(`/accounts/${id}`, { method: "PATCH", body: patch }));
export const useCreateAccount = () => useWrite((body: Record<string, unknown>) => request<AccountDetail>("/accounts", { method: "POST", body }));
export const useDeleteAccount = () => useWrite((id: string) => request(`/accounts/${id}`, { method: "DELETE" }));
export const useAddContact = () =>
  useWrite(({ accountId, ...body }: { accountId: string } & Record<string, unknown>) => request(`/accounts/${accountId}/contacts`, { method: "POST", body }));
export const useDeleteContact = () => useWrite((id: string) => request(`/contacts/${id}`, { method: "DELETE" }));
export const useLogActivity = () =>
  useWrite(({ accountId, ...body }: { accountId: string } & Record<string, unknown>) => request(`/accounts/${accountId}/activities`, { method: "POST", body }));
export const useDeleteActivity = () => useWrite((id: string) => request(`/activities/${id}`, { method: "DELETE" }));
export const useSaveTemplate = () =>
  useWrite(({ id, ...body }: { id?: string } & Record<string, unknown>) =>
    id ? request(`/templates/${id}`, { method: "PATCH", body }) : request("/templates", { method: "POST", body })
  );
export const useDeleteTemplate = () => useWrite((id: string) => request(`/templates/${id}`, { method: "DELETE" }));

/** CSV export needs the auth header, so fetch it and hand the browser a blob. */
export async function downloadOutreachCsv() {
  const token = getToken();
  const res = await fetch(api.url("/outreach/export.csv"), { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!res.ok) throw new Error("Export failed");
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `mandate-outreach-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}
