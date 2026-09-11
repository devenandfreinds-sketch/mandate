import type { JurisdictionSummary } from "./jurisdiction.js";
import type { TimelineEvent } from "./timeline.js";

export interface CorePriority {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  isPlaceholder: boolean;
}

export interface GovernanceModelSummary {
  id: string;
  slug: string;
  name: string;
  shortName: string | null;
  summary: string;
  colorHex: string | null;
  jurisdictionCount: number;
  isPlaceholder: boolean;
}

export interface GovernanceModelDetail extends GovernanceModelSummary {
  overview: string;
  history: string;
  politicalContext: string;
  foundedYear: number | null;
  corePriorities: CorePriority[];
  jurisdictions: JurisdictionSummary[];
  timelineEvents: TimelineEvent[];
}

/**
 * The Mandate Institutional Index for a governance model: how far, on average, its jurisdictions'
 * institutions have progressed along the 0-5 pipeline (see PIPELINE_STAGE_DEFINITIONS), computed
 * ONLY from assessments a researcher has actually completed (dataQuality !== "placeholder"). This
 * is deliberate: a governance model with 2 real assessments and a model with 20 should never look
 * identical just because unresearched policy areas were quietly averaged in as if they were real
 * findings. `policyAreaCount` is the total assessed (including placeholders, for coverage context);
 * `researchedPolicyAreaCount` is the subset actually backing `averageStage` and `byCategory`.
 */
export interface PipelineSummary {
  governanceModelSlug: string;
  averageStage: number;
  policyAreaCount: number;
  researchedPolicyAreaCount: number;
  byCategory: Array<{
    categorySlug: string;
    categoryName: string;
    averageStage: number;
    researchedCount: number;
  }>;
}
