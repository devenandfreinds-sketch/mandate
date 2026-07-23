import { Router } from "express";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiError } from "../../middleware/errorHandler.js";
import { isAdminRequest, issueAdminToken } from "../../middleware/adminAuth.js";

export const adminAuthRouter = Router();

adminAuthRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { password } = req.body as { password?: string };
    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash) throw new ApiError(500, "Admin password is not configured on the server", "admin_not_configured");
    if (!password || !bcrypt.compareSync(password, hash)) {
      throw new ApiError(401, "Incorrect password", "invalid_credentials");
    }
    // Returned in the body, not set as a cookie -- see middleware/adminAuth.ts for why. The client
    // stores it and sends it back as an Authorization: Bearer header on every subsequent request.
    res.json({ data: { authenticated: true, token: issueAdminToken() } });
  })
);

// Logout is client-side only now (the client just discards its stored token) -- the JWT itself is
// stateless, so there's nothing for the server to invalidate. Kept as a no-op endpoint for API
// shape continuity with useAdminLogout(), which still calls it before clearing the local token.
adminAuthRouter.post("/logout", (_req, res) => {
  res.json({ data: { authenticated: false } });
});

adminAuthRouter.get("/me", (req, res) => {
  res.json({ data: { authenticated: isAdminRequest(req) } });
});
