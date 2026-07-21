import { Router, type Request } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import * as jurisdictionService from "../services/jurisdiction.service.js";
import * as metricService from "../services/metric.service.js";
import * as pipelineService from "../services/pipeline.service.js";
import * as exportService from "../services/export.service.js";
import type { JurisdictionMetricsFilter } from "../services/metric.service.js";

export const jurisdictionsRouter = Router();

function parseMetricsFilter(req: Request): JurisdictionMetricsFilter {
  const query = req.query;
  const categorySlug = typeof query.category === "string" ? query.category : undefined;
  const metricSlugs =
    typeof query.metric === "string" && query.metric.length > 0 ? query.metric.split(",") : undefined;
  const administrationId = typeof query.administrationId === "string" ? query.administrationId : undefined;
  const periodType = typeof query.periodType === "string" ? query.periodType : undefined;

  const from = parseYearOrDate(query.from);
  const to = parseYearOrDate(query.to, true);

  return { categorySlug, metricSlugs, administrationId, periodType, from, to };
}

function parseYearOrDate(value: unknown, endOfYear = false): Date | undefined {
  if (typeof value !== "string" || value.length === 0) return undefined;
  if (/^\d{4}$/.test(value)) {
    return endOfYear ? new Date(Date.UTC(Number(value), 11, 31)) : new Date(Date.UTC(Number(value), 0, 1));
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

jurisdictionsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const governanceModel = typeof req.query.governanceModel === "string" ? req.query.governanceModel : undefined;
    const data = await jurisdictionService.listJurisdictions(governanceModel);
    res.json({ data });
  })
);

jurisdictionsRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const data = await jurisdictionService.getJurisdictionBySlug(req.params.slug);
    if (!data) throw ApiError.notFound(`Jurisdiction "${req.params.slug}" not found`);
    res.json({ data });
  })
);

jurisdictionsRouter.get(
  "/:slug/administrations",
  asyncHandler(async (req, res) => {
    const data = await jurisdictionService.getAdministrations(req.params.slug);
    if (!data) throw ApiError.notFound(`Jurisdiction "${req.params.slug}" not found`);
    res.json({ data });
  })
);

jurisdictionsRouter.get(
  "/:slug/administrations/:id",
  asyncHandler(async (req, res) => {
    const data = await jurisdictionService.getAdministrationDetail(req.params.slug, req.params.id);
    if (!data) throw ApiError.notFound(`Administration not found`);
    res.json({ data });
  })
);

jurisdictionsRouter.get(
  "/:slug/metrics",
  asyncHandler(async (req, res) => {
    const filter = parseMetricsFilter(req);
    const data = await metricService.getJurisdictionMetrics(req.params.slug, filter);
    if (data === null) throw ApiError.notFound(`Jurisdiction "${req.params.slug}" not found`);
    res.json({ data });
  })
);

jurisdictionsRouter.get(
  "/:slug/pipeline",
  asyncHandler(async (req, res) => {
    const data = await pipelineService.getJurisdictionPipeline(req.params.slug);
    if (data === null) throw ApiError.notFound(`Jurisdiction "${req.params.slug}" not found`);
    res.json({ data });
  })
);

jurisdictionsRouter.get(
  "/:slug/pipeline/:policyAreaSlug",
  asyncHandler(async (req, res) => {
    const data = await pipelineService.getPipelineAssessmentHistory(req.params.slug, req.params.policyAreaSlug);
    if (data === null) throw ApiError.notFound(`Jurisdiction "${req.params.slug}" or policy area "${req.params.policyAreaSlug}" not found`);
    res.json({ data });
  })
);

jurisdictionsRouter.get(
  "/:slug/export",
  asyncHandler(async (req, res) => {
    const format = typeof req.query.format === "string" ? req.query.format : "json";
    const filter = parseMetricsFilter(req);

    if (format === "csv") {
      const csv = await exportService.exportJurisdictionMetricsCsv(req.params.slug, filter);
      if (csv === null) throw ApiError.notFound(`Jurisdiction "${req.params.slug}" not found`);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="${req.params.slug}-metrics.csv"`);
      res.send(csv);
      return;
    }

    const data = await metricService.getJurisdictionMetrics(req.params.slug, filter);
    if (data === null) throw ApiError.notFound(`Jurisdiction "${req.params.slug}" not found`);
    res.json({ data });
  })
);
