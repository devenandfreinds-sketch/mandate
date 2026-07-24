import type { SeriesQualityResult } from "./seriesQuality.js";

/**
 * Types for the public Research Map (/research). See docs/RESEARCH_MAP.md. Every number here is
 * derived from real MetricValue/PipelineAssessment rows at request time — nothing is a stored
 * percentage, and nothing here reflects ResearchTask.status (a task being "complete" doesn't move
 * these numbers; only real, non-placeholder, evidence-backed data does).
 */
export interface CoverageBreakdown {
  measured: number;
  unavailable: number;
  unresearched: number;
  total: number;
  measuredPercent: number;
  unavailablePercent: number;
  unresearchedPercent: number;
  coveragePercent: number;
}

export interface JurisdictionProgress {
  jurisdictionSlug: string;
  jurisdictionName: string;
  dataCoverage: CoverageBreakdown;
  pipelineCoverage: CoverageBreakdown;
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

export interface OpenTaskRef {
  id: string;
  status: string;
  priority: number;
}

export interface MetricDetailItem {
  metricSlug: string;
  metricName: string;
  categoryName: string;
  /** Series-level classification (see shared/src/types/seriesQuality.ts) -- replaces the old flat
   * measured/partial/unavailable/unresearched status with a model that distinguishes HOW MUCH of the
   * series is real, not just whether any of it is. */
  seriesQuality: SeriesQualityResult;
  openTask: OpenTaskRef | null;
}

export interface PolicyAreaDetailItem {
  policyAreaSlug: string;
  policyAreaName: string;
  categoryName: string | null;
  status: "measured" | "unavailable" | "unresearched";
  stage: number | null;
  stageLabel: string | null;
  dataQuality: string | null;
  openTask: OpenTaskRef | null;
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
