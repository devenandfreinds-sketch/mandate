import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as policyAreaService from "../services/policyArea.service.js";

export const policyAreasRouter = Router();

policyAreasRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const data = await policyAreaService.listPolicyAreas();
    res.json({ data });
  })
);
