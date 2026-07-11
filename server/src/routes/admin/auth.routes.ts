import { Router } from "express";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiError } from "../../middleware/errorHandler.js";
import { clearAdminCookie, isAdminRequest, issueAdminToken, setAdminCookie } from "../../middleware/adminAuth.js";

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
    setAdminCookie(res, issueAdminToken());
    res.json({ data: { authenticated: true } });
  })
);

adminAuthRouter.post("/logout", (_req, res) => {
  clearAdminCookie(res);
  res.json({ data: { authenticated: false } });
});

adminAuthRouter.get("/me", (req, res) => {
  res.json({ data: { authenticated: isAdminRequest(req) } });
});
