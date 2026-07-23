import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "./errorHandler.js";

const TOKEN_TTL = "12h";

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set. Run `npm run admin:set-password -w server -- <password>` first.");
  return secret;
}

export function issueAdminToken(): string {
  return jwt.sign({ role: "admin" }, getSessionSecret(), { expiresIn: TOKEN_TTL });
}

/**
 * Auth is a bearer token, not a cookie -- see client/src/lib/api.ts for why. Railway registers
 * *.up.railway.app on the public suffix list, so the client and server (two separate Railway
 * services) count as fully separate "sites" to a browser, making a session cookie a genuine
 * third-party cookie that Safari/Firefox block by default regardless of SameSite/Secure flags. A
 * bearer token in an Authorization header sidesteps that entirely.
 */
export function isAdminRequest(req: Request): boolean {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return false;
  const token = header.slice("Bearer ".length);
  try {
    jwt.verify(token, getSessionSecret());
    return true;
  } catch {
    return false;
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!isAdminRequest(req)) {
    next(new ApiError(401, "Admin authentication required", "unauthorized"));
    return;
  }
  next();
}
