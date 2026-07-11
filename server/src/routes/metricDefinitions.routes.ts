import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import * as metricService from "../services/metric.service.js";

export const metricDefinitionsRouter = Router();

metricDefinitionsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const categorySlug = typeof req.query.category === "string" ? req.query.category : undefined;
    const data = await metricService.listMetricDefinitions(categorySlug);
    res.json({ data });
  })
);

metricDefinitionsRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const data = await metricService.getMetricDefinitionDetail(req.params.slug);
    if (!data) throw ApiError.notFound(`Metric "${req.params.slug}" not found`);
    res.json({ data });
  })
);

metricDefinitionsRouter.get(
  "/:slug/values",
  asyncHandler(async (req, res) => {
    const jurisdictionSlugs =
      typeof req.query.jurisdictions === "string" && req.query.jurisdictions.length > 0
        ? req.query.jurisdictions.split(",")
        : [];
    const from = typeof req.query.from === "string" ? new Date(`${req.query.from}-01-01`) : undefined;
    const to = typeof req.query.to === "string" ? new Date(`${req.query.to}-12-31`) : undefined;

    const data = await metricService.getMetricValuesAcrossJurisdictions(req.params.slug, jurisdictionSlugs, from, to);
    if (data === null) throw ApiError.notFound(`Metric "${req.params.slug}" not found`);
    res.json({ data });
  })
);
