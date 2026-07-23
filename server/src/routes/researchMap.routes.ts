import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import { getResearchMapData, getJurisdictionResearchDetail } from "../services/researchProgress.service.js";

/** Public — institutional transparency, not an admin capability. See docs/RESEARCH_MAP.md. */
export const researchMapRouter = Router();

researchMapRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const data = await getResearchMapData();
    res.json({ data });
  })
);

researchMapRouter.get(
  "/:jurisdictionSlug",
  asyncHandler(async (req, res) => {
    const data = await getJurisdictionResearchDetail(req.params.jurisdictionSlug);
    if (!data) throw ApiError.notFound(`Jurisdiction "${req.params.jurisdictionSlug}" not found`);
    res.json({ data });
  })
);
