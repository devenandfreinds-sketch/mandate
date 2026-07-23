import { prisma } from "../db.js";
import { toIso } from "../utils/serialize.js";
import { PIPELINE_STAGE_LABELS } from "@mandate/shared";

/**
 * Powers the public Research Map (/research). See docs/RESEARCH_MAP.md.
 *
 * Central rule this whole file exists to enforce: research coverage is always DERIVED from the
 * underlying MetricValue/PipelineAssessment rows' own dataQuality/isPlaceholder fields — never from
 * ResearchTask.status. A task can be marked "complete" (accepted) without that alone moving the
 * needle here; only real, evidence-backed, non-synthetic data does. This is what keeps
 * "submitted" and "verified" from ever being conflated in the numbers shown to the team.
 *
 * A second rule: "unavailable" (Mandate genuinely investigated and found no responsible source)
 * and "unresearched" (nobody has looked yet) are always reported as distinct buckets, never
 * merged into one "resolved" number that would misrepresent how much is actually measured.
 */

export interface CoverageBreakdown {
  measured: number;
  unavailable: number;
  unresearched: number;
  total: number;
  measuredPercent: number;
  unavailablePercent: number;
  unresearchedPercent: number;
  /** measured + unavailable — "Mandate has investigated this and reached a conclusion," whether or not the conclusion is a number. */
  coveragePercent: number;
}

function buildBreakdown(measured: number, unavailable: number, unresearched: number): CoverageBreakdown {
  const total = measured + unavailable + unresearched;
  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 1000) / 10);
  return {
    measured,
    unavailable,
    unresearched,
    total,
    measuredPercent: pct(measured),
    unavailablePercent: pct(unavailable),
    unresearchedPercent: pct(unresearched),
    coveragePercent: pct(measured + unavailable),
  };
}

export interface JurisdictionProgress {
  jurisdictionSlug: string;
  jurisdictionName: string;
  dataCoverage: CoverageBreakdown;
  pipelineCoverage: CoverageBreakdown;
  /** Simple average of dataCoverage.coveragePercent and pipelineCoverage.coveragePercent — two coequal workstreams, not weighted by row count (metrics vastly outnumber policy areas per jurisdiction, so an unweighted row-count average would make pipeline coverage nearly invisible). */
  overallCoveragePercent: number;
  tasksInProgress: number;
  tasksAwaitingReview: number;
  tasksNeedingRevision: number;
}

export interface FrontierItem {
  kind: "pipeline" | "metric";
  label: string;
  hasOpenTask: boolean;
  taskPriority: number | null;
}

export interface ActiveResearchItem {
  taskId: string;
  jurisdictionSlug: string;
  jurisdictionName: string;
  label: string;
  taskType: string;
  status: string;
  updatedAt: string;
}

export interface RecentlyVerifiedItem {
  jurisdictionSlug: string;
  jurisdictionName: string;
  policyAreaName: string;
  stage: number;
  stageLabel: string;
  dataQuality: string;
  verifiedAt: string;
  researchedByName: string | null;
}

export interface ResearchMapData {
  overall: {
    dataCoverage: CoverageBreakdown;
    pipelineCoverage: CoverageBreakdown;
    overallCoveragePercent: number;
  };
  jurisdictions: JurisdictionProgress[];
  frontiers: Record<string, FrontierItem[]>;
  activeResearch: ActiveResearchItem[];
  recentlyVerified: RecentlyVerifiedItem[];
}

const FRONTIER_LIMIT_PER_JURISDICTION = 6;
const RECENTLY_VERIFIED_LIMIT = 12;

export async function getResearchMapData(): Promise<ResearchMapData> {
  const [jurisdictions, policyAreas, metricValues, currentAssessments, openTasks, recentAssessments] = await Promise.all([
    prisma.jurisdiction.findMany({ select: { id: true, slug: true, name: true }, orderBy: { name: "asc" } }),
    prisma.policyArea.findMany({ select: { id: true, slug: true, name: true } }),
    prisma.metricValue.findMany({ select: { jurisdictionId: true, metricDefinitionId: true, dataQuality: true } }),
    prisma.pipelineAssessment.findMany({
      where: { isCurrent: true },
      select: { jurisdictionId: true, policyAreaId: true, dataQuality: true, isPlaceholder: true },
    }),
    prisma.researchTask.findMany({
      where: { status: { in: ["unassigned", "in_progress", "awaiting_review", "changes_requested"] } },
      select: {
        id: true,
        jurisdictionId: true,
        policyAreaId: true,
        metricDefinitionId: true,
        taskType: true,
        status: true,
        priority: true,
        updatedAt: true,
        jurisdiction: { select: { slug: true, name: true } },
        policyArea: { select: { name: true } },
        metricDefinition: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.pipelineAssessment.findMany({
      where: { isPlaceholder: false },
      orderBy: { createdAt: "desc" },
      take: RECENTLY_VERIFIED_LIMIT,
      select: {
        jurisdictionId: true,
        stage: true,
        dataQuality: true,
        createdAt: true,
        jurisdiction: { select: { slug: true, name: true } },
        policyArea: { select: { name: true } },
        researchedBy: { select: { name: true } },
      },
    }),
  ]);

  // ---- Per-jurisdiction data coverage (from MetricValue rows) ----
  const dataByJurisdiction = new Map<string, { measured: number; unavailable: number; unresearched: number }>();
  for (const j of jurisdictions) dataByJurisdiction.set(j.id, { measured: 0, unavailable: 0, unresearched: 0 });
  for (const mv of metricValues) {
    const bucket = dataByJurisdiction.get(mv.jurisdictionId);
    if (!bucket) continue;
    if (mv.dataQuality === "placeholder") bucket.unresearched++;
    else if (mv.dataQuality === "unavailable") bucket.unavailable++;
    else bucket.measured++;
  }

  // ---- Per-jurisdiction pipeline coverage (from current PipelineAssessment rows) ----
  const pipelineByJurisdiction = new Map<string, { measured: number; unavailable: number; unresearched: number }>();
  const measuredPolicyAreasByJurisdiction = new Map<string, Set<string>>();
  for (const j of jurisdictions) {
    pipelineByJurisdiction.set(j.id, { measured: 0, unavailable: 0, unresearched: 0 });
    measuredPolicyAreasByJurisdiction.set(j.id, new Set());
  }
  for (const a of currentAssessments) {
    const bucket = pipelineByJurisdiction.get(a.jurisdictionId);
    if (!bucket) continue;
    if (a.isPlaceholder) bucket.unresearched++;
    else if (a.dataQuality === "unavailable") bucket.unavailable++;
    else {
      bucket.measured++;
      measuredPolicyAreasByJurisdiction.get(a.jurisdictionId)?.add(a.policyAreaId);
    }
  }

  // ---- Open-task lookups, for frontiers + active research ----
  const taskByPolicyAreaKey = new Map<string, (typeof openTasks)[number]>();
  const taskByMetricKey = new Map<string, (typeof openTasks)[number]>();
  for (const t of openTasks) {
    if (t.policyAreaId) taskByPolicyAreaKey.set(`${t.jurisdictionId}::${t.policyAreaId}`, t);
    if (t.metricDefinitionId) taskByMetricKey.set(`${t.jurisdictionId}::${t.metricDefinitionId}`, t);
  }

  // Which (jurisdiction, metricDefinition) pairs have at least one non-placeholder row (i.e. not fully unresearched)?
  const metricHasAnyRealRow = new Set<string>();
  const metricHasAnyPlaceholderRow = new Set<string>();
  for (const mv of metricValues) {
    const key = `${mv.jurisdictionId}::${mv.metricDefinitionId}`;
    if (mv.dataQuality === "placeholder") metricHasAnyPlaceholderRow.add(key);
    else metricHasAnyRealRow.add(key);
  }

  const metricDefs = await prisma.metricDefinition.findMany({ select: { id: true, name: true } });

  const jurisdictionProgress: JurisdictionProgress[] = [];
  const frontiers: Record<string, FrontierItem[]> = {};

  for (const j of jurisdictions) {
    const d = dataByJurisdiction.get(j.id)!;
    const p = pipelineByJurisdiction.get(j.id)!;
    const dataCoverage = buildBreakdown(d.measured, d.unavailable, d.unresearched);
    const pipelineCoverage = buildBreakdown(p.measured, p.unavailable, p.unresearched);
    const overallCoveragePercent = Math.round(((dataCoverage.coveragePercent + pipelineCoverage.coveragePercent) / 2) * 10) / 10;

    const jurisdictionTasks = openTasks.filter((t) => t.jurisdictionId === j.id);
    jurisdictionProgress.push({
      jurisdictionSlug: j.slug,
      jurisdictionName: j.name,
      dataCoverage,
      pipelineCoverage,
      overallCoveragePercent,
      tasksInProgress: jurisdictionTasks.filter((t) => t.status === "in_progress").length,
      tasksAwaitingReview: jurisdictionTasks.filter((t) => t.status === "awaiting_review").length,
      tasksNeedingRevision: jurisdictionTasks.filter((t) => t.status === "changes_requested").length,
    });

    // Frontiers: unresearched policy areas + metrics with any remaining placeholder rows for this jurisdiction.
    const items: FrontierItem[] = [];
    for (const pa of policyAreas) {
      const isMeasured = measuredPolicyAreasByJurisdiction.get(j.id)?.has(pa.id);
      if (isMeasured) continue;
      const task = taskByPolicyAreaKey.get(`${j.id}::${pa.id}`);
      items.push({ kind: "pipeline", label: pa.name, hasOpenTask: Boolean(task), taskPriority: task?.priority ?? null });
    }
    for (const m of metricDefs) {
      const key = `${j.id}::${m.id}`;
      if (!metricHasAnyPlaceholderRow.has(key)) continue; // fully resolved (measured or unavailable) already
      const task = taskByMetricKey.get(key);
      items.push({ kind: "metric", label: m.name, hasOpenTask: Boolean(task), taskPriority: task?.priority ?? null });
    }
    // Order: an open task beats no task; among those, lower priority number (more urgent) wins;
    // otherwise a pipeline gap beats a metric gap (there are only ~7 policy areas per jurisdiction
    // vs. ~50 metrics, so an unresearched institution is the rarer, more strategically notable
    // signal — without this, the metric list's alphabetical breadth would bury it every time).
    items.sort((a, b) => {
      if (a.hasOpenTask !== b.hasOpenTask) return a.hasOpenTask ? -1 : 1;
      if (a.taskPriority !== null && b.taskPriority !== null) return a.taskPriority - b.taskPriority;
      if (a.kind !== b.kind) return a.kind === "pipeline" ? -1 : 1;
      return a.label.localeCompare(b.label);
    });
    frontiers[j.slug] = items.slice(0, FRONTIER_LIMIT_PER_JURISDICTION);
  }

  const overallD = Array.from(dataByJurisdiction.values()).reduce(
    (acc, b) => ({ measured: acc.measured + b.measured, unavailable: acc.unavailable + b.unavailable, unresearched: acc.unresearched + b.unresearched }),
    { measured: 0, unavailable: 0, unresearched: 0 }
  );
  const overallP = Array.from(pipelineByJurisdiction.values()).reduce(
    (acc, b) => ({ measured: acc.measured + b.measured, unavailable: acc.unavailable + b.unavailable, unresearched: acc.unresearched + b.unresearched }),
    { measured: 0, unavailable: 0, unresearched: 0 }
  );
  const overallDataCoverage = buildBreakdown(overallD.measured, overallD.unavailable, overallD.unresearched);
  const overallPipelineCoverage = buildBreakdown(overallP.measured, overallP.unavailable, overallP.unresearched);

  const activeResearch: ActiveResearchItem[] = openTasks
    .filter((t) => t.status === "in_progress" || t.status === "awaiting_review")
    .map((t) => ({
      taskId: t.id,
      jurisdictionSlug: t.jurisdiction.slug,
      jurisdictionName: t.jurisdiction.name,
      label: t.policyArea?.name ?? t.metricDefinition?.name ?? "—",
      taskType: t.taskType,
      status: t.status,
      updatedAt: toIso(t.updatedAt),
    }));

  const recentlyVerified: RecentlyVerifiedItem[] = recentAssessments.map((a) => ({
    jurisdictionSlug: a.jurisdiction.slug,
    jurisdictionName: a.jurisdiction.name,
    policyAreaName: a.policyArea.name,
    stage: a.stage,
    stageLabel: PIPELINE_STAGE_LABELS[a.stage] ?? "Unknown",
    dataQuality: a.dataQuality,
    verifiedAt: toIso(a.createdAt),
    researchedByName: a.researchedBy?.name ?? null,
  }));

  return {
    overall: {
      dataCoverage: overallDataCoverage,
      pipelineCoverage: overallPipelineCoverage,
      overallCoveragePercent: Math.round(((overallDataCoverage.coveragePercent + overallPipelineCoverage.coveragePercent) / 2) * 10) / 10,
    },
    jurisdictions: jurisdictionProgress,
    frontiers,
    activeResearch,
    recentlyVerified,
  };
}

export type MetricDetailStatus = "measured" | "partial" | "unavailable" | "unresearched";

export interface MetricDetailItem {
  metricSlug: string;
  metricName: string;
  categoryName: string;
  measuredYears: number;
  unavailableYears: number;
  unresearchedYears: number;
  totalYears: number;
  status: MetricDetailStatus;
  openTask: { id: string; status: string; priority: number } | null;
}

export interface PolicyAreaDetailItem {
  policyAreaSlug: string;
  policyAreaName: string;
  categoryName: string | null;
  status: "measured" | "unavailable" | "unresearched";
  stage: number | null;
  stageLabel: string | null;
  dataQuality: string | null;
  openTask: { id: string; status: string; priority: number } | null;
}

export interface JurisdictionResearchDetail {
  jurisdictionSlug: string;
  jurisdictionName: string;
  dataCoverage: CoverageBreakdown;
  pipelineCoverage: CoverageBreakdown;
  overallCoveragePercent: number;
  metrics: MetricDetailItem[];
  policyAreas: PolicyAreaDetailItem[];
}

function metricStatus(measured: number, unavailable: number, unresearched: number): MetricDetailStatus {
  if (unresearched === 0 && measured > 0) return "measured";
  if (unresearched === 0 && measured === 0) return "unavailable";
  if (unresearched > 0 && measured === 0 && unavailable === 0) return "unresearched";
  return "partial";
}

/** Everything researched, in progress, unavailable, and remaining for one jurisdiction — the "click into a city" drill-down. */
export async function getJurisdictionResearchDetail(jurisdictionSlug: string): Promise<JurisdictionResearchDetail | null> {
  const jurisdiction = await prisma.jurisdiction.findUnique({ where: { slug: jurisdictionSlug }, select: { id: true, slug: true, name: true } });
  if (!jurisdiction) return null;

  const [metricValues, metricDefs, currentAssessments, policyAreas, openTasks] = await Promise.all([
    prisma.metricValue.findMany({ where: { jurisdictionId: jurisdiction.id }, select: { metricDefinitionId: true, dataQuality: true } }),
    prisma.metricDefinition.findMany({ select: { id: true, slug: true, name: true, category: { select: { name: true } } }, orderBy: { name: "asc" } }),
    prisma.pipelineAssessment.findMany({
      where: { jurisdictionId: jurisdiction.id, isCurrent: true },
      select: { policyAreaId: true, stage: true, dataQuality: true, isPlaceholder: true },
    }),
    prisma.policyArea.findMany({ select: { id: true, slug: true, name: true, category: { select: { name: true } } }, orderBy: { name: "asc" } }),
    prisma.researchTask.findMany({
      where: { jurisdictionId: jurisdiction.id, status: { in: ["unassigned", "in_progress", "awaiting_review", "changes_requested"] } },
      select: { id: true, policyAreaId: true, metricDefinitionId: true, status: true, priority: true },
    }),
  ]);

  const taskByPolicyAreaId = new Map(openTasks.filter((t) => t.policyAreaId).map((t) => [t.policyAreaId!, t]));
  const taskByMetricId = new Map(openTasks.filter((t) => t.metricDefinitionId).map((t) => [t.metricDefinitionId!, t]));

  const valuesByMetric = new Map<string, { measured: number; unavailable: number; unresearched: number }>();
  for (const mv of metricValues) {
    const bucket = valuesByMetric.get(mv.metricDefinitionId) ?? { measured: 0, unavailable: 0, unresearched: 0 };
    if (mv.dataQuality === "placeholder") bucket.unresearched++;
    else if (mv.dataQuality === "unavailable") bucket.unavailable++;
    else bucket.measured++;
    valuesByMetric.set(mv.metricDefinitionId, bucket);
  }

  const metrics: MetricDetailItem[] = metricDefs.map((m) => {
    const b = valuesByMetric.get(m.id) ?? { measured: 0, unavailable: 0, unresearched: 0 };
    const task = taskByMetricId.get(m.id);
    return {
      metricSlug: m.slug,
      metricName: m.name,
      categoryName: m.category.name,
      measuredYears: b.measured,
      unavailableYears: b.unavailable,
      unresearchedYears: b.unresearched,
      totalYears: b.measured + b.unavailable + b.unresearched,
      status: metricStatus(b.measured, b.unavailable, b.unresearched),
      openTask: task ? { id: task.id, status: task.status, priority: task.priority } : null,
    };
  });

  const assessmentByPolicyAreaId = new Map(currentAssessments.map((a) => [a.policyAreaId, a]));
  const policyAreaItems: PolicyAreaDetailItem[] = policyAreas.map((pa) => {
    const a = assessmentByPolicyAreaId.get(pa.id);
    const task = taskByPolicyAreaId.get(pa.id);
    let status: PolicyAreaDetailItem["status"] = "unresearched";
    if (a && !a.isPlaceholder) status = a.dataQuality === "unavailable" ? "unavailable" : "measured";
    return {
      policyAreaSlug: pa.slug,
      policyAreaName: pa.name,
      categoryName: pa.category?.name ?? null,
      status,
      stage: a ? a.stage : null,
      stageLabel: a ? PIPELINE_STAGE_LABELS[a.stage] ?? "Unknown" : null,
      dataQuality: a?.dataQuality ?? null,
      openTask: task ? { id: task.id, status: task.status, priority: task.priority } : null,
    };
  });

  const dMeasured = metrics.reduce((n, m) => n + m.measuredYears, 0);
  const dUnavailable = metrics.reduce((n, m) => n + m.unavailableYears, 0);
  const dUnresearched = metrics.reduce((n, m) => n + m.unresearchedYears, 0);
  const dataCoverage = buildBreakdown(dMeasured, dUnavailable, dUnresearched);

  const pMeasured = policyAreaItems.filter((p) => p.status === "measured").length;
  const pUnavailable = policyAreaItems.filter((p) => p.status === "unavailable").length;
  const pUnresearched = policyAreaItems.filter((p) => p.status === "unresearched").length;
  const pipelineCoverage = buildBreakdown(pMeasured, pUnavailable, pUnresearched);

  return {
    jurisdictionSlug: jurisdiction.slug,
    jurisdictionName: jurisdiction.name,
    dataCoverage,
    pipelineCoverage,
    overallCoveragePercent: Math.round(((dataCoverage.coveragePercent + pipelineCoverage.coveragePercent) / 2) * 10) / 10,
    metrics,
    policyAreas: policyAreaItems,
  };
}
