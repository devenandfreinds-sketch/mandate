import { prisma } from "../db.js";
import { toIso } from "../utils/serialize.js";
import { PIPELINE_STAGE_LABELS } from "@mandate/shared";
import type { PipelineAssessment } from "@mandate/shared";

export async function getJurisdictionPipeline(jurisdictionSlug: string): Promise<PipelineAssessment[] | null> {
  const jurisdiction = await prisma.jurisdiction.findUnique({ where: { slug: jurisdictionSlug }, select: { id: true } });
  if (!jurisdiction) return null;

  const rows = await prisma.pipelineAssessment.findMany({
    where: { jurisdictionId: jurisdiction.id, isCurrent: true },
    include: {
      policyArea: { include: { category: { select: { slug: true } } } },
      legislation: true,
      evidenceLinks: true,
    },
    orderBy: { policyArea: { sortOrder: "asc" } },
  });

  return rows.map((a) => ({
    id: a.id,
    jurisdictionId: a.jurisdictionId,
    policyAreaId: a.policyAreaId,
    policyAreaSlug: a.policyArea.slug,
    policyAreaName: a.policyArea.name,
    administrationId: a.administrationId,
    stage: a.stage,
    stageLabel: PIPELINE_STAGE_LABELS[a.stage] ?? "Unknown",
    assessmentDate: toIso(a.assessmentDate),
    isCurrent: a.isCurrent,
    timelineNotes: a.timelineNotes,
    evidenceSummary: a.evidenceSummary,
    isPlaceholder: a.isPlaceholder,
    legislation: a.legislation.map((l) => ({
      id: l.id,
      title: l.title,
      billNumber: l.billNumber,
      status: l.status,
      dateEnacted: toIso(l.dateEnacted),
      url: l.url,
      isPlaceholder: l.isPlaceholder,
    })),
    evidenceLinks: a.evidenceLinks.map((e) => ({
      id: e.id,
      label: e.label,
      url: e.url,
      evidenceType: e.evidenceType,
      isPlaceholder: e.isPlaceholder,
    })),
  }));
}
