import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import * as governanceModelService from "../services/governanceModel.service.js";

export const governanceModelsRouter = Router();

governanceModelsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const data = await governanceModelService.listGovernanceModels();
    res.json({ data });
  })
);

governanceModelsRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const data = await governanceModelService.getGovernanceModelBySlug(req.params.slug);
    if (!data) throw ApiError.notFound(`Governance model "${req.params.slug}" not found`);
    res.json({ data });
  })
);

governanceModelsRouter.get(
  "/:slug/pipeline-summary",
  asyncHandler(async (req, res) => {
    const data = await governanceModelService.getPipelineSummary(req.params.slug);
    if (!data) throw ApiError.notFound(`Governance model "${req.params.slug}" not found`);
    res.json({ data });
  })
);
