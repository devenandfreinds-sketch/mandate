import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import * as sourceService from "../services/source.service.js";

export const sourcesRouter = Router();

sourcesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const data = await sourceService.listSources();
    res.json({ data });
  })
);

sourcesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const data = await sourceService.getSourceById(req.params.id);
    if (!data) throw ApiError.notFound(`Source "${req.params.id}" not found`);
    res.json({ data });
  })
);
