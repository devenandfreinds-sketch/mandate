import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../middleware/errorHandler.js";

/**
 * Small in-memory per-IP throttle for the outreach login, to blunt password guessing. Relies on
 * app.set("trust proxy", 1) so req.ip is the visitor, not Railway's proxy. Per-process memory is
 * fine for one server instance.
 */
export function ipThrottle(maxPerWindow: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return (req: Request, _res: Response, next: NextFunction) => {
    const now = Date.now();
    const ip = req.ip ?? "unknown";
    const entry = hits.get(ip);
    if (!entry || entry.resetAt <= now) {
      hits.set(ip, { count: 1, resetAt: now + windowMs });
      if (hits.size > 10_000) for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
      next();
      return;
    }
    entry.count += 1;
    if (entry.count > maxPerWindow) {
      next(new ApiError(429, "Too many attempts. Try again in a few minutes.", "rate_limited"));
      return;
    }
    next();
  };
}
