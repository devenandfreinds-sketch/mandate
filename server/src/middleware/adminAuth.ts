import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "./errorHandler.js";

const COOKIE_NAME = "mandate_admin_session";
const TOKEN_TTL = "12h";

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set. Run `npm run admin:set-password -w server -- <password>` first.");
  return secret;
}

export function issueAdminToken(): string {
  return jwt.sign({ role: "admin" }, getSessionSecret(), { expiresIn: TOKEN_TTL });
}

export function setAdminCookie(res: Response, token: string) {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    // Client and server are typically separate origins in production (e.g. two Railway services),
    // which requires SameSite=None (and Secure, which browsers mandate alongside it) for the cookie
    // to be sent on cross-origin fetches. Locally, client and server share an origin via the Vite
    // proxy, where Lax is safer and sufficient.
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 12 * 60 * 60 * 1000,
  });
}

export function clearAdminCookie(res: Response) {
  res.clearCookie(COOKIE_NAME);
}

export function isAdminRequest(req: Request): boolean {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return false;
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
