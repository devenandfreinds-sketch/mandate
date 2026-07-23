import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";
import * as externalContributionService from "../services/externalContribution.service.js";

/**
 * Public submission endpoint -- no requireAdmin. This is the front door for anyone outside the
 * organization to submit a critique, dataset, or correction (see docs/MANDATE_RESEARCH_NETWORK.md).
 * It only ever creates a "submitted" row; see admin/externalContributions.routes.ts for the
 * internal review path that actually decides what happens to it.
 */
export const externalContributionsRouter = Router();

externalContributionsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = req.body as {
      contributorName?: string;
      contributorEmail?: string;
      contributorAffiliation?: string;
      contributionType?: string;
      topic?: string;
      jurisdictionSlug?: string;
      description?: string;
      evidenceUrl?: string;
      relationToExistingResearch?: string;
      limitations?: string;
    };
    if (!body.contributorName) throw ApiError.badRequest('Missing "contributorName"');
    if (!body.contributionType) throw ApiError.badRequest('Missing "contributionType"');
    if (!body.topic) throw ApiError.badRequest('Missing "topic"');
    if (!body.description) throw ApiError.badRequest('Missing "description"');

    try {
      const data = await externalContributionService.submitExternalContribution({
        contributorName: body.contributorName,
        contributorEmail: body.contributorEmail,
        contributorAffiliation: body.contributorAffiliation,
        contributionType: body.contributionType,
        topic: body.topic,
        jurisdictionSlug: body.jurisdictionSlug,
        description: body.description,
        evidenceUrl: body.evidenceUrl,
        relationToExistingResearch: body.relationToExistingResearch,
        limitations: body.limitations,
      });
      res.status(201).json({ data });
    } catch (err) {
      if (err instanceof RangeError) throw ApiError.badRequest(err.message);
      throw err;
    }
  })
);
