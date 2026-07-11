export const PIPELINE_STAGE_LABELS: Record<number, string> = {
  0: "Campaign Promise",
  1: "Legislation Proposed",
  2: "Institution Created",
  3: "Program Operating",
  4: "Measurable Outputs Improving",
  5: "Institution Producing Durable Results",
};

export const PIPELINE_MAX_STAGE = 5;

export interface PolicyArea {
  id: string;
  categoryId: string | null;
  categorySlug: string | null;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  isPlaceholder: boolean;
}

export interface SupportingLegislation {
  id: string;
  title: string;
  billNumber: string | null;
  status: string | null;
  dateEnacted: string | null;
  url: string | null;
  isPlaceholder: boolean;
}

export interface EvidenceLink {
  id: string;
  label: string;
  url: string;
  evidenceType: string;
  isPlaceholder: boolean;
}

export interface PipelineAssessment {
  id: string;
  jurisdictionId: string;
  policyAreaId: string;
  policyAreaSlug: string;
  policyAreaName: string;
  administrationId: string | null;
  stage: number;
  stageLabel: string;
  assessmentDate: string;
  isCurrent: boolean;
  timelineNotes: string | null;
  evidenceSummary: string | null;
  isPlaceholder: boolean;
  legislation: SupportingLegislation[];
  evidenceLinks: EvidenceLink[];
}
