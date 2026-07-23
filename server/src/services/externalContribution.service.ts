import { prisma } from "../db.js";
import { toIso } from "../utils/serialize.js";
import { CONTRIBUTION_TYPE_SLUGS, CONTRIBUTION_STATUS_SLUGS } from "@mandate/shared";
import type { ExternalContribution } from "@mandate/shared";
import type { Prisma } from "@prisma/client";

const CONTRIBUTION_INCLUDE = {
  jurisdiction: { select: { slug: true, name: true } },
  reviewer: { select: { id: true, name: true } },
} satisfies Prisma.ExternalContributionInclude;

type ContributionRow = Prisma.ExternalContributionGetPayload<{ include: typeof CONTRIBUTION_INCLUDE }>;

function mapContribution(c: ContributionRow): ExternalContribution {
  return {
    id: c.id,
    contributorName: c.contributorName,
    contributorEmail: c.contributorEmail,
    contributorAffiliation: c.contributorAffiliation,
    contributorUserId: c.contributorUserId,
    contributionType: c.contributionType,
    topic: c.topic,
    jurisdictionSlug: c.jurisdiction?.slug ?? null,
    jurisdictionName: c.jurisdiction?.name ?? null,
    description: c.description,
    evidenceUrl: c.evidenceUrl,
    relationToExistingResearch: c.relationToExistingResearch,
    limitations: c.limitations,
    status: c.status,
    reviewerId: c.reviewerId,
    reviewerName: c.reviewer?.name ?? null,
    reviewNotes: c.reviewNotes,
    reviewedAt: toIso(c.reviewedAt),
    createdAt: toIso(c.createdAt),
    updatedAt: toIso(c.updatedAt),
  };
}

export class ExternalContributionNotFoundError extends Error {}
export class ExternalContributionStateError extends Error {}

/** Newest submissions first, since review triage reads top-to-bottom. */
export async function listExternalContributions(): Promise<ExternalContribution[]> {
  const rows = await prisma.externalContribution.findMany({
    include: CONTRIBUTION_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapContribution);
}

export interface SubmitExternalContributionInput {
  contributorName: string;
  contributorEmail?: string | null;
  contributorAffiliation?: string | null;
  contributionType: string;
  topic: string;
  jurisdictionSlug?: string | null;
  description: string;
  evidenceUrl?: string | null;
  relationToExistingResearch?: string | null;
  limitations?: string | null;
}

/**
 * The public entry point (no admin auth) -- anyone outside the organization can reach this. It
 * only ever creates a "submitted" row; nothing here touches any other table, so there's no path
 * from an anonymous submission to a production data change (see docs/MANDATE_RESEARCH_NETWORK.md,
 * "External Contribution System").
 */
export async function submitExternalContribution(input: SubmitExternalContributionInput): Promise<ExternalContribution> {
  if (!input.contributorName.trim()) throw new RangeError("contributorName is required");
  if (!input.topic.trim()) throw new RangeError("topic is required");
  if (!input.description.trim()) throw new RangeError("description is required");
  if (!CONTRIBUTION_TYPE_SLUGS.includes(input.contributionType)) {
    throw new RangeError(`contributionType must be one of ${CONTRIBUTION_TYPE_SLUGS.join(", ")}, got "${input.contributionType}"`);
  }

  let jurisdictionId: string | null = null;
  if (input.jurisdictionSlug) {
    const jurisdiction = await prisma.jurisdiction.findUnique({ where: { slug: input.jurisdictionSlug }, select: { id: true } });
    if (!jurisdiction) throw new RangeError(`Jurisdiction "${input.jurisdictionSlug}" not found`);
    jurisdictionId = jurisdiction.id;
  }

  const row = await prisma.externalContribution.create({
    data: {
      contributorName: input.contributorName.trim(),
      contributorEmail: input.contributorEmail?.trim() || null,
      contributorAffiliation: input.contributorAffiliation?.trim() || null,
      contributionType: input.contributionType,
      topic: input.topic.trim(),
      jurisdictionId,
      description: input.description.trim(),
      evidenceUrl: input.evidenceUrl?.trim() || null,
      relationToExistingResearch: input.relationToExistingResearch?.trim() || null,
      limitations: input.limitations?.trim() || null,
    },
    include: CONTRIBUTION_INCLUDE,
  });
  return mapContribution(row);
}

export interface ReviewExternalContributionInput {
  status?: string;
  reviewerId?: string | null;
  reviewNotes?: string | null;
}

/**
 * The internal review action -- moves a submission to under_review/accepted/rejected/incorporated/
 * cited, and/or assigns a reviewer. A contributor who already has a User roster row
 * (contributorUserId) can't review their own submission, same self-review principle as the
 * Research Queue.
 */
export async function reviewExternalContribution(id: string, input: ReviewExternalContributionInput): Promise<ExternalContribution> {
  if (input.status !== undefined && !CONTRIBUTION_STATUS_SLUGS.includes(input.status)) {
    throw new RangeError(`status must be one of ${CONTRIBUTION_STATUS_SLUGS.join(", ")}, got "${input.status}"`);
  }

  const existing = await prisma.externalContribution.findUnique({ where: { id } });
  if (!existing) throw new ExternalContributionNotFoundError(`External contribution "${id}" not found`);

  const effectiveReviewerId = input.reviewerId !== undefined ? input.reviewerId : existing.reviewerId;
  if (existing.contributorUserId && effectiveReviewerId && existing.contributorUserId === effectiveReviewerId) {
    throw new ExternalContributionStateError("A contributor cannot review their own submission — assign a different internal reviewer.");
  }

  const movingPastSubmitted = input.status !== undefined && input.status !== "submitted";

  const row = await prisma.externalContribution.update({
    where: { id },
    data: {
      status: input.status,
      reviewerId: input.reviewerId,
      reviewNotes: input.reviewNotes,
      reviewedAt: movingPastSubmitted ? new Date() : existing.reviewedAt,
    },
    include: CONTRIBUTION_INCLUDE,
  });
  return mapContribution(row);
}
