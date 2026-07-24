import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiError } from "../../middleware/errorHandler.js";
import { requireAdmin } from "../../middleware/adminAuth.js";
import * as pipelineService from "../../services/pipeline.service.js";
import { PipelineNotFoundError, PipelineConflictError } from "../../services/pipeline.service.js";

export const adminPipelineRouter = Router();
adminPipelineRouter.use(requireAdmin);

// Reading existing history is not admin-gated data — the admin form reuses the public
// GET /jurisdictions/:slug/pipeline/:policyAreaSlug endpoint (via usePipelineHistory) to show
// existing assessments before adding a new one. Only the write path below needs requireAdmin.

adminPipelineRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = req.body as {
      jurisdictionSlug?: string;
      policyAreaSlug?: string;
      institutionName?: string;
      stage?: number;
      dataQuality?: string;
      assessmentDate?: string;
      administrationId?: string | null;
      evidenceSummary?: string | null;
      limitations?: string | null;
      researchedById?: string | null;
      reviewedById?: string | null;
      reviewedAt?: string | null;
      methodologyVersion?: string | null;
      nextReviewDate?: string | null;
      evidence?: Array<{
        evidenceType: string;
        label: string;
        description?: string | null;
        url: string;
        publicationDate?: string | null;
        publisher?: string | null;
        sourceTier?: string | null;
        sourceName?: string | null;
      }>;
      legislation?: {
        title: string;
        billNumber?: string | null;
        status?: string | null;
        dateEnacted?: string | null;
        url?: string | null;
        sourceName?: string | null;
      } | null;
    };

    if (!body.jurisdictionSlug) throw ApiError.badRequest("Missing \"jurisdictionSlug\"");
    if (!body.policyAreaSlug) throw ApiError.badRequest("Missing \"policyAreaSlug\"");
    if (typeof body.stage !== "number") throw ApiError.badRequest("Missing or invalid \"stage\" (expected 0-5)");
    if (!body.dataQuality) throw ApiError.badRequest("Missing \"dataQuality\"");
    if (!body.assessmentDate) throw ApiError.badRequest("Missing \"assessmentDate\"");

    try {
      const data = await pipelineService.createPipelineAssessment({
        jurisdictionSlug: body.jurisdictionSlug,
        policyAreaSlug: body.policyAreaSlug,
        institutionName: body.institutionName,
        stage: body.stage,
        dataQuality: body.dataQuality,
        assessmentDate: new Date(body.assessmentDate),
        administrationId: body.administrationId ?? null,
        evidenceSummary: body.evidenceSummary ?? null,
        limitations: body.limitations ?? null,
        researchedById: body.researchedById ?? null,
        reviewedById: body.reviewedById ?? null,
        reviewedAt: body.reviewedAt ? new Date(body.reviewedAt) : null,
        methodologyVersion: body.methodologyVersion ?? null,
        nextReviewDate: body.nextReviewDate ? new Date(body.nextReviewDate) : null,
        evidence: (body.evidence ?? []).map((e) => ({
          ...e,
          publicationDate: e.publicationDate ? new Date(e.publicationDate) : null,
        })),
        legislation: body.legislation
          ? { ...body.legislation, dateEnacted: body.legislation.dateEnacted ? new Date(body.legislation.dateEnacted) : null }
          : null,
      });
      res.status(201).json({ data });
    } catch (err) {
      if (err instanceof PipelineNotFoundError) throw ApiError.notFound(err.message);
      if (err instanceof PipelineConflictError) throw ApiError.conflict(err.message);
      if (err instanceof RangeError) throw ApiError.badRequest(err.message);
      throw err;
    }
  })
);
