import type { NextFunction, Request, Response } from "express";

export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, message: string, code = "internal_error") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }

  static notFound(message = "Not found") {
    return new ApiError(404, message, "not_found");
  }

  static badRequest(message: string) {
    return new ApiError(400, message, "bad_request");
  }

  static conflict(message: string) {
    return new ApiError(409, message, "conflict");
  }
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: { message: "Route not found", code: "not_found" } });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: { message: err.message, code: err.code } });
    return;
  }
  console.error(err);
  res.status(500).json({ error: { message: "Internal server error", code: "internal_error" } });
}
