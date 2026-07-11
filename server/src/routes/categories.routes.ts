import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import * as metricService from "../services/metric.service.js";

export const categoriesRouter = Router();

categoriesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const data = await metricService.listCategories();
    res.json({ data });
  })
);

categoriesRouter.get(
  "/:slug/metric-definitions",
  asyncHandler(async (req, res) => {
    const data = await metricService.getCategoryWithMetricDefinitions(req.params.slug);
    if (!data) throw ApiError.notFound(`Category "${req.params.slug}" not found`);
    res.json({ data: data.metricDefinitions });
  })
);
