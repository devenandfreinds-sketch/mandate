import { prisma } from "../db.js";
import { toIso } from "../utils/serialize.js";
import { PIPELINE_STAGE_LABELS, DATA_QUALITY_LEVEL_SLUGS } from "@mandate/shared";
import type { PipelineAssessment } from "@mandate/shared";
import type { Prisma } from "@prisma/client";

const ASSESSMENT_INCLUDE = {
  jurisdiction: { select: { slug: true, governanceModelId: true, governanceModel: { select: { slug: true } } } },
  policyArea: { include: { category: { select: { slug: true, name: true } } } },
  legislation: true,
  evidenceLinks: true,
} satisfies Prisma.PipelineAssessmentInclude;

type AssessmentRow = Prisma.PipelineAssessmentGetPayload<{ include: typeof ASSESSMENT_INCLUDE }>;

function mapAssessment(a: AssessmentRow): PipelineAssessment {
  return {
    id: a.id,
    jurisdictionId: a.jurisdictionId,
    jurisdictionSlug: a.jurisdiction.slug,
    policyAreaId: a.policyAreaId,
    policyAreaSlug: a.policyArea.slug,
    policyAreaName: a.policyArea.name,
    categorySlug: a.policyArea.category?.slug ?? null,
    categoryName: a.policyArea.category?.name ?? null,
    governanceModelSlug: a.jurisdiction.governanceModel?.slug ?? null,
    administrationId: a.administrationId,
    stage: a.stage,
    stageLabel: PIPELINE_STAGE_LABELS[a.stage] ?? "Unknown",
    dataQuality: a.dataQuality,
    assessmentDate: toIso(a.assessmentDate),
    updatedAt: toIso(a.updatedAt),
    isCurrent: a.isCurrent,
    timelineNotes: a.timelineNotes,
    evidenceSummary: a.evidenceSummary,
    limitations: a.limitations,
    isPlaceholder: a.isPlaceholder,
    legislation: a.legislation.map((l) => ({
      id: l.id,
      title: l.title,
      billNumber: l.billNumber,
      status: l.status,
      dateEnacted: toIso(l.dateEnacted),
      url: l.url,
      sourceId: l.sourceId,
      isPlaceholder: l.isPlaceholder,
    })),
    evidenceLinks: a.evidenceLinks.map((e) => ({
      id: e.id,
      label: e.label,
      description: e.description,
      url: e.url,
      evidenceType: e.evidenceType,
      publicationDate: toIso(e.publicationDate),
      publisher: e.publisher,
      sourceTier: e.sourceTier,
      sourceId: e.sourceId,
      isPlaceholder: e.isPlaceholder,
    })),
  };
}

export async function getJurisdictionPipeline(jurisdictionSlug: string): Promise<PipelineAssessment[] | null> {
  const jurisdiction = await prisma.jurisdiction.findUnique({ where: { slug: jurisdictionSlug }, select: { id: true } });
  if (!jurisdiction) return null;

  const rows = await prisma.pipelineAssessment.findMany({
    where: { jurisdictionId: jurisdiction.id, isCurrent: true },
    include: ASSESSMENT_INCLUDE,
    orderBy: { policyArea: { sortOrder: "asc" } },
  });

  return rows.map(mapAssessment);
}

export interface CreatePipelineAssessmentInput {
  jurisdictionSlug: string;
  policyAreaSlug: string;
  stage: number;
  dataQuality: string;
  assessmentDate: Date;
  administrationId?: string | null;
  evidenceSummary?: string | null;
  limitations?: string | null;
  evidence: Array<{
    evidenceType: string;
    label: string;
    description?: string | null;
    url: string;
    publicationDate?: Date | null;
    publisher?: string | null;
    sourceTier?: string | null;
    sourceName?: string | null;
  }>;
  legislation?: {
    title: string;
    billNumber?: string | null;
    status?: string | null;
    dateEnacted?: Date | null;
    url?: string | null;
    sourceName?: string | null;
  } | null;
}

export class PipelineNotFoundError extends Error {}
export class PipelineConflictError extends Error {}

async function resolveSourceIdByName(name: string | null | undefined): Promise<string | null> {
  if (!name) return null;
  const source = await prisma.source.findUnique({ where: { name } });
  if (!source) throw new PipelineNotFoundError(`No Source found with name "${name}". Create it in the Source registry first.`);
  return source.id;
}

/**
 * Researcher write path: creates a new assessment (a new stage/evidence/date record). The new row only
 * becomes `isCurrent` — and only flips the previous current row to false — if its assessmentDate is on
 * or after the latest existing assessment for this jurisdiction+policyArea (or there is no existing
 * assessment at all). An earlier-dated submission is a historical backfill: it's inserted into the
 * timeline as isCurrent: false without touching whichever row is genuinely most recent. Without this
 * check, backfilling an old milestone would incorrectly steal the "current" flag from the real current
 * score. This is how the timeline in getPipelineAssessmentHistory() is built up over time — each call
 * adds one more point in the institutional-development history rather than overwriting it.
 */
export async function createPipelineAssessment(input: CreatePipelineAssessmentInput): Promise<PipelineAssessment> {
  const jurisdiction = await prisma.jurisdiction.findUnique({ where: { slug: input.jurisdictionSlug }, select: { id: true } });
  if (!jurisdiction) throw new PipelineNotFoundError(`Jurisdiction "${input.jurisdictionSlug}" not found`);

  const policyArea = await prisma.policyArea.findUnique({ where: { slug: input.policyAreaSlug }, select: { id: true } });
  if (!policyArea) throw new PipelineNotFoundError(`Policy area "${input.policyAreaSlug}" not found`);

  if (!Number.isInteger(input.stage) || input.stage < 0 || input.stage > 5) {
    throw new RangeError(`stage must be an integer 0-5, got ${input.stage}`);
  }
  if (!DATA_QUALITY_LEVEL_SLUGS.includes(input.dataQuality)) {
    throw new RangeError(`dataQuality must be one of ${DATA_QUALITY_LEVEL_SLUGS.join(", ")}, got "${input.dataQuality}"`);
  }

  const evidenceWithSourceIds = await Promise.all(
    input.evidence.map(async (e) => ({ ...e, sourceId: await resolveSourceIdByName(e.sourceName) }))
  );
  const legislationSourceId = input.legislation ? await resolveSourceIdByName(input.legislation.sourceName) : null;

  let created: AssessmentRow;
  try {
    created = await prisma.$transaction(async (tx) => {
      const latestExisting = await tx.pipelineAssessment.findFirst({
        where: { jurisdictionId: jurisdiction.id, policyAreaId: policyArea.id },
        orderBy: { assessmentDate: "desc" },
        select: { assessmentDate: true },
      });
      const isCurrent = !latestExisting || input.assessmentDate >= latestExisting.assessmentDate;

      if (isCurrent) {
        await tx.pipelineAssessment.updateMany({
          where: { jurisdictionId: jurisdiction.id, policyAreaId: policyArea.id, isCurrent: true },
          data: { isCurrent: false },
        });
      }

      return tx.pipelineAssessment.create({
        data: {
          jurisdictionId: jurisdiction.id,
          policyAreaId: policyArea.id,
          administrationId: input.administrationId ?? null,
          stage: input.stage,
          dataQuality: input.dataQuality,
          assessmentDate: input.assessmentDate,
          isCurrent,
          evidenceSummary: input.evidenceSummary ?? null,
          limitations: input.limitations ?? null,
          isPlaceholder: false,
          evidenceLinks: {
            create: evidenceWithSourceIds.map((e) => ({
              label: e.label,
              description: e.description ?? null,
              url: e.url,
              evidenceType: e.evidenceType,
              publicationDate: e.publicationDate ?? null,
              publisher: e.publisher ?? null,
              sourceTier: e.sourceTier ?? null,
              sourceId: e.sourceId,
              isPlaceholder: false,
            })),
          },
          legislation: input.legislation
            ? {
                create: [
                  {
                    title: input.legislation.title,
                    billNumber: input.legislation.billNumber ?? null,
                    status: input.legislation.status ?? null,
                    dateEnacted: input.legislation.dateEnacted ?? null,
                    url: input.legislation.url ?? null,
                    sourceId: legislationSourceId,
                    isPlaceholder: false,
                  },
                ],
              }
            : undefined,
        },
        include: ASSESSMENT_INCLUDE,
      });
    });
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
      throw new PipelineConflictError(
        `An assessment for this jurisdiction, policy area, and exact assessment date already exists. Use a different date, or edit the existing entry directly.`
      );
    }
    throw err;
  }

  return mapAssessment(created);
}

/** Full history (not just the current assessment) for one jurisdiction + policy area, ordered oldest to newest — powers the Pipeline Detail Page timeline. */
export async function getPipelineAssessmentHistory(
  jurisdictionSlug: string,
  policyAreaSlug: string
): Promise<PipelineAssessment[] | null> {
  const jurisdiction = await prisma.jurisdiction.findUnique({ where: { slug: jurisdictionSlug }, select: { id: true } });
  if (!jurisdiction) return null;

  const policyArea = await prisma.policyArea.findUnique({ where: { slug: policyAreaSlug }, select: { id: true } });
  if (!policyArea) return null;

  const rows = await prisma.pipelineAssessment.findMany({
    where: { jurisdictionId: jurisdiction.id, policyAreaId: policyArea.id },
    include: ASSESSMENT_INCLUDE,
    orderBy: { assessmentDate: "asc" },
  });

  return rows.map(mapAssessment);
}
