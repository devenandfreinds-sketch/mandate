import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiError } from "../../middleware/errorHandler.js";
import { requireAdmin } from "../../middleware/adminAuth.js";
import * as userService from "../../services/user.service.js";
import { UserNotFoundError, UserConflictError } from "../../services/user.service.js";

/**
 * Manages Mandate's researcher identity roster (see docs/MANDATE_OPERATING_SYSTEM.md, "User model").
 * This is deliberately NOT a login/account system -- creating a User here does not grant anyone
 * new access; it exists so real people can be attributed on ResearchTask/PipelineAssessment/
 * MetricValue rows instead of a free-text name. Still gated by the single shared admin credential
 * like every other admin write path, until (if ever) per-person login is built.
 */
export const adminUsersRouter = Router();
adminUsersRouter.use(requireAdmin);

adminUsersRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const data = await userService.listUsers();
    res.json({ data });
  })
);

adminUsersRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = req.body as { name?: string; email?: string; role?: string; certificationLevel?: string };
    if (!body.name) throw ApiError.badRequest('Missing "name"');
    if (!body.email) throw ApiError.badRequest('Missing "email"');

    try {
      const data = await userService.createUser({ name: body.name, email: body.email, role: body.role, certificationLevel: body.certificationLevel });
      res.status(201).json({ data });
    } catch (err) {
      if (err instanceof UserConflictError) throw ApiError.badRequest(err.message);
      if (err instanceof RangeError) throw ApiError.badRequest(err.message);
      throw err;
    }
  })
);

adminUsersRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const body = req.body as { name?: string; role?: string; certificationLevel?: string; isActive?: boolean };
    try {
      const data = await userService.updateUser(req.params.id, body);
      res.json({ data });
    } catch (err) {
      if (err instanceof UserNotFoundError) throw ApiError.notFound(err.message);
      if (err instanceof RangeError) throw ApiError.badRequest(err.message);
      throw err;
    }
  })
);
