import type { ApiSuccess } from "@mandate/shared";

// In a single-service deployment (or local dev via the Vite proxy), the API is same-origin and
// this is left unset. In a two-service deployment (client and server as separate Railway services),
// set VITE_API_URL at build time to the server's public URL, e.g. https://mandate-server.up.railway.app.
const API_ORIGIN = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

// Admin auth is a bearer token in localStorage, not a cookie. Railway registers *.up.railway.app on
// the public suffix list (the same trick GitHub Pages/Vercel use), so the client and server -- on
// two separate Railway services -- count as fully separate "sites" to a browser, not just
// subdomains of one site. That makes the session cookie a genuine third-party cookie, which Safari
// blocks by default, Firefox's Total Cookie Protection blocks by default, and Chrome is moving
// toward blocking too -- no cookie flag combination fixes that. A bearer token sidesteps the whole
// problem, at the cost of being readable by client-side JS (unlike the httpOnly cookie it replaces)
// -- an acceptable trade-off for this internal admin tool.
const ADMIN_TOKEN_KEY = "mandate_admin_token";

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

class ApiRequestError extends Error {
  status: number;
  code: string;

  constructor(status: number, message: string, code: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiRequestError(res.status, body?.error?.message ?? res.statusText, body?.error?.code ?? "unknown_error");
  }
  const body = (await res.json()) as ApiSuccess<T>;
  return body.data;
}

// Every API URL — whether hit via fetch() or used directly as an <a href>/download link —
// MUST be built through this function. Never inline `/api/v1${path}` or `/api${path}` anywhere
// else in the client; that bypasses VITE_API_URL and silently breaks in any deployment where the
// client and server aren't the same origin (e.g. two separate Railway services).
function buildUrl(path: string): string {
  return `${API_ORIGIN}/api/v1${path}`;
}

async function get<T>(path: string): Promise<T> {
  return handle<T>(await fetch(buildUrl(path), { headers: { ...authHeaders() } }));
}

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  return handle<T>(
    await fetch(buildUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    })
  );
}

async function postForm<T>(path: string, formData: FormData): Promise<T> {
  return handle<T>(await fetch(buildUrl(path), { method: "POST", headers: { ...authHeaders() }, body: formData }));
}

async function patchJson<T>(path: string, payload: unknown): Promise<T> {
  return handle<T>(
    await fetch(buildUrl(path), {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    })
  );
}

export const api = { get, postJson, postForm, patchJson, url: buildUrl };
export { ApiRequestError };
