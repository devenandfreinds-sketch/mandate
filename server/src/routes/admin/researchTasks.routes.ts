import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiError } from "../../middleware/errorHandler.js";
import { requireAdmin } from "../../middleware/adminAuth.js";
import * as researchTaskService from "../../services/researchTask.service.js";
import { ResearchTaskNotFoundError } from "../../services/researchTask.service.js";

export const adminResearchTasksRouter = Router();
adminResearchTasksRouter.use(requireAdmin);

adminResearchTasksRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const data = await researchTaskService.listResearchTasks();
    res.json({ data });
  })
);

adminResearchTasksRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const body = req.body as {
      status?: string;
      assignedResearcher?: string | null;
      sourceStatus?: string | null;
      notes?: string | null;
    };

    try {
      const data = await researchTaskService.updateResearchTask(req.params.id, body);
      res.json({ data });
    } catch (err) {
      if (err instanceof ResearchTaskNotFoundError) throw ApiError.notFound(err.message);
      if (err instanceof RangeError) throw ApiError.badRequest(err.message);
      throw err;
    }
  })
);
