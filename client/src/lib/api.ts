import type { ApiSuccess } from "@mandate/shared";

// In a single-service deployment (or local dev via the Vite proxy), the API is same-origin and
// this is left unset. In a two-service deployment (client and server as separate Railway services),
// set VITE_API_URL at build time to the server's public URL, e.g. https://mandate-server.up.railway.app.
const API_ORIGIN = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

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

async function get<T>(path: string): Promise<T> {
  return handle<T>(await fetch(`${API_ORIGIN}/api/v1${path}`, { credentials: "include" }));
}

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  return handle<T>(
    await fetch(`${API_ORIGIN}/api/v1${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
  );
}

async function postForm<T>(path: string, formData: FormData): Promise<T> {
  return handle<T>(await fetch(`${API_ORIGIN}/api/v1${path}`, { method: "POST", credentials: "include", body: formData }));
}

export const api = { get, postJson, postForm };
export { ApiRequestError };
