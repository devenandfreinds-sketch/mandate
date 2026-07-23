import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { requireAdmin } from "../../middleware/adminAuth.js";
import { getResearchHealthSummary } from "../../services/researchHealth.service.js";

export const adminResearchHealthRouter = Router();
adminResearchHealthRouter.use(requireAdmin);

adminResearchHealthRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const data = await getResearchHealthSummary();
    res.json({ data });
  })
);
