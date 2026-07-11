import type { ApiSuccess } from "@mandate/shared";

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
  return handle<T>(await fetch(`/api/v1${path}`));
}

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  return handle<T>(
    await fetch(`/api/v1${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
}

async function postForm<T>(path: string, formData: FormData): Promise<T> {
  return handle<T>(await fetch(`/api/v1${path}`, { method: "POST", body: formData }));
}

export const api = { get, postJson, postForm };
export { ApiRequestError };
