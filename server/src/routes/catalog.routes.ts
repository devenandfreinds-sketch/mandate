import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as catalogService from "../services/catalog.service.js";

export const catalogRouter = Router();

catalogRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const data = await catalogService.getDataCatalog();
    res.json({ data });
  })
);
