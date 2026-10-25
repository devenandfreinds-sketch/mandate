import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../middleware/errorHandler.js";

/**
 * Access to the outreach CRM (docs/OUTREACH.md). Its own password (OUTREACH_PASSWORD_HASH), so
 * outreach access can be shared without sharing admin. A valid admin session also gets in.
 * Developer-account tokens never do (role check below).
 */
const TOKEN_TTL = "12h";

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set.");
  return secret;
}

export function issueOutreachToken(): string {
  return jwt.sign({ role: "outreach" }, getSessionSecret(), { expiresIn: TOKEN_TTL });
}

export function isOutreachRequest(req: Request): boolean {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return false;
  try {
    const payload = jwt.verify(header.slice("Bearer ".length), getSessionSecret());
    return typeof payload === "object" && (payload.role === "outreach" || payload.role === "admin");
  } catch {
    return false;
  }
}

export function requireOutreach(req: Request, _res: Response, next: NextFunction) {
  if (!isOutreachRequest(req)) {
    next(new ApiError(401, "Outreach login required", "unauthorized"));
    return;
  }
  next();
}
