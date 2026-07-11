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

export interface PipelineSummary {
  governanceModelSlug: string;
  averageStage: number;
  policyAreaCount: number;
  byCategory: Array<{
    categorySlug: string;
    categoryName: string;
    averageStage: number;
  }>;
}
