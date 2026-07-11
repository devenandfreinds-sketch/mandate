import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as metricService from "../services/metric.service.js";

export const dashboardRouter = Router();

dashboardRouter.get(
  "/summary",
  asyncHandler(async (_req, res) => {
    const data = await metricService.getDashboardSummary();
    res.json({ data });
  })
);
