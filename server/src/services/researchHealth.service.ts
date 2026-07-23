import { prisma } from "../db.js";
import { toIso } from "../utils/serialize.js";

/**
 * Powers the Research Queue's "Research Health" / "System Health" panel (see
 * docs/MANDATE_OPERATING_SYSTEM.md, "Research Queue as Operating Center"). Every number here is
 * computed directly from real database state -- nothing here is a vanity metric or a fabricated
 * score, and each one corresponds to a concrete next action a jurisdiction lead or researcher can
 * take. If a number is 0 because a field (like nextReviewDate) hasn't been populated on any rows
 * yet, that's an honest reflection of current coverage, not a bug.
 */
export interface ResearchHealthSummary {
  pipelineCoverage: {
    totalPairs: number;
    researchedPairs: number; // current assessment is not a placeholder
    unresearchedPairs: Array<{ jurisdictionSlug: string; jurisdictionName: string; policyAreaSlug: string; policyAreaName: string }>;
  };
  staleAssessments: Array<{ id: string; jurisdictionName: string; policyAreaName: string; nextReviewDate: string }>;
  staleMetrics: Array<{ id: string; metricName: string; jurisdictionName: string; nextReviewDate: string }>;
  missingEvidence: Array<{ id: string; jurisdictionName: string; policyAreaName: string; stage: number }>;
  unavailableMetricPairCount: number;
  dataQualityBreakdown: Record<string, number>; // across all non-placeholder MetricValue + PipelineAssessment rows combined
}

export async function getResearchHealthSummary(): Promise<ResearchHealthSummary> {
  const now = new Date();

  const [allPolicyAreas, allJurisdictions, currentAssessments] = await Promise.all([
    prisma.policyArea.findMany({ select: { id: true, slug: true, name: true } }),
    prisma.jurisdiction.findMany({ select: { id: true, slug: true, name: true } }),
    prisma.pipelineAssessment.findMany({
      where: { isCurrent: true },
      select: {
        id: true,
        isPlaceholder: true,
        stage: true,
        nextReviewDate: true,
        jurisdictionId: true,
        policyAreaId: true,
        jurisdiction: { select: { name: true } },
        policyArea: { select: { name: true } },
        evidenceLinks: { select: { id: true } },
        legislation: { select: { id: true } },
      },
    }),
  ]);

  const totalPairs = allJurisdictions.length * allPolicyAreas.length;
  const researchedPairs = currentAssessments.filter((a) => !a.isPlaceholder).length;

  const researchedPairKeys = new Set(currentAssessments.filter((a) => !a.isPlaceholder).map((a) => `${a.jurisdictionId}::${a.policyAreaId}`));
  const unresearchedPairs: ResearchHealthSummary["pipelineCoverage"]["unresearchedPairs"] = [];
  for (const j of allJurisdictions) {
    for (const p of allPolicyAreas) {
      if (!researchedPairKeys.has(`${j.id}::${p.id}`)) {
        unresearchedPairs.push({ jurisdictionSlug: j.slug, jurisdictionName: j.name, policyAreaSlug: p.slug, policyAreaName: p.name });
      }
    }
  }

  const staleAssessments = currentAssessments
    .filter((a) => a.nextReviewDate && a.nextReviewDate < now)
    .map((a) => ({
      id: a.id,
      jurisdictionName: a.jurisdiction.name,
      policyAreaName: a.policyArea.name,
      nextReviewDate: toIso(a.nextReviewDate)!,
    }));

  const missingEvidence = currentAssessments
    .filter((a) => !a.isPlaceholder && a.stage > 0 && a.evidenceLinks.length === 0 && a.legislation.length === 0)
    .map((a) => ({ id: a.id, jurisdictionName: a.jurisdiction.name, policyAreaName: a.policyArea.name, stage: a.stage }));

  const staleMetricRows = await prisma.metricValue.findMany({
    where: { nextReviewDate: { lt: now } },
    select: {
      id: true,
      nextReviewDate: true,
      metricDefinition: { select: { name: true } },
      jurisdiction: { select: { name: true } },
    },
    take: 50,
  });
  const staleMetrics = staleMetricRows.map((m) => ({
    id: m.id,
    metricName: m.metricDefinition.name,
    jurisdictionName: m.jurisdiction.name,
    nextReviewDate: toIso(m.nextReviewDate)!,
  }));

  const unavailableMetricPairCount = await prisma.metricValue
    .groupBy({ by: ["metricDefinitionId", "jurisdictionId"], where: { dataQuality: "unavailable" } })
    .then((rows) => rows.length);

  const [metricQualityRows, assessmentQualityRows] = await Promise.all([
    prisma.metricValue.groupBy({ by: ["dataQuality"], where: { isPlaceholder: false }, _count: { _all: true } }),
    prisma.pipelineAssessment.groupBy({ by: ["dataQuality"], where: { isPlaceholder: false }, _count: { _all: true } }),
  ]);
  const dataQualityBreakdown: Record<string, number> = {};
  for (const row of [...metricQualityRows, ...assessmentQualityRows]) {
    dataQualityBreakdown[row.dataQuality] = (dataQualityBreakdown[row.dataQuality] ?? 0) + row._count._all;
  }

  return {
    pipelineCoverage: { totalPairs, researchedPairs, unresearchedPairs },
    staleAssessments,
    staleMetrics,
    missingEvidence,
    unavailableMetricPairCount,
    dataQualityBreakdown,
  };
}
