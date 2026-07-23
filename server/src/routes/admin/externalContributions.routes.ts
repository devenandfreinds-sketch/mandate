import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiError } from "../../middleware/errorHandler.js";
import { requireAdmin } from "../../middleware/adminAuth.js";
import * as externalContributionService from "../../services/externalContribution.service.js";
import { ExternalContributionNotFoundError, ExternalContributionStateError } from "../../services/externalContribution.service.js";

export const adminExternalContributionsRouter = Router();
adminExternalContributionsRouter.use(requireAdmin);

adminExternalContributionsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const data = await externalContributionService.listExternalContributions();
    res.json({ data });
  })
);

/** Moves a submission through the review lifecycle -- see docs/MANDATE_RESEARCH_NETWORK.md, "External Contribution System". */
adminExternalContributionsRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const body = req.body as { status?: string; reviewerId?: string | null; reviewNotes?: string | null };

    try {
      const data = await externalContributionService.reviewExternalContribution(req.params.id, {
        status: body.status,
        reviewerId: body.reviewerId,
        reviewNotes: body.reviewNotes,
      });
      res.json({ data });
    } catch (err) {
      if (err instanceof ExternalContributionNotFoundError) throw ApiError.notFound(err.message);
      if (err instanceof ExternalContributionStateError) throw ApiError.badRequest(err.message);
      if (err instanceof RangeError) throw ApiError.badRequest(err.message);
      throw err;
    }
  })
);
