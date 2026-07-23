import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiError } from "../../middleware/errorHandler.js";
import { requireAdmin } from "../../middleware/adminAuth.js";
import * as researchTaskService from "../../services/researchTask.service.js";
import { ResearchTaskNotFoundError, ResearchTaskStateError } from "../../services/researchTask.service.js";

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
      assignedResearcherId?: string | null;
      reviewerId?: string | null;
      sourceStatus?: string | null;
      notes?: string | null;
      dueDate?: string | null;
      nextReviewDate?: string | null;
    };

    try {
      const data = await researchTaskService.updateResearchTask(req.params.id, {
        ...body,
        dueDate: body.dueDate === undefined ? undefined : body.dueDate ? new Date(body.dueDate) : null,
        nextReviewDate: body.nextReviewDate === undefined ? undefined : body.nextReviewDate ? new Date(body.nextReviewDate) : null,
      });
      res.json({ data });
    } catch (err) {
      if (err instanceof ResearchTaskNotFoundError) throw ApiError.notFound(err.message);
      if (err instanceof ResearchTaskStateError) throw ApiError.badRequest(err.message);
      if (err instanceof RangeError) throw ApiError.badRequest(err.message);
      throw err;
    }
  })
);

/** The "ACCEPTED" action of SUBMITTED -> REVIEW -> ACCEPTED/NEEDS REVISION. See docs/RESEARCH_MAP.md. */
adminResearchTasksRouter.post(
  "/:id/accept",
  asyncHandler(async (req, res) => {
    const body = req.body as { reviewerId?: string | null };
    try {
      const data = await researchTaskService.acceptResearchTask(req.params.id, body.reviewerId ?? null);
      res.json({ data });
    } catch (err) {
      if (err instanceof ResearchTaskNotFoundError) throw ApiError.notFound(err.message);
      if (err instanceof ResearchTaskStateError) throw ApiError.badRequest(err.message);
      throw err;
    }
  })
);

/** The "NEEDS REVISION" action. */
adminResearchTasksRouter.post(
  "/:id/request-revision",
  asyncHandler(async (req, res) => {
    const body = req.body as { reviewerId?: string | null; reviewNotes?: string | null };
    try {
      const data = await researchTaskService.requestRevision(req.params.id, body.reviewerId ?? null, body.reviewNotes ?? null);
      res.json({ data });
    } catch (err) {
      if (err instanceof ResearchTaskNotFoundError) throw ApiError.notFound(err.message);
      if (err instanceof ResearchTaskStateError) throw ApiError.badRequest(err.message);
      throw err;
    }
  })
);
