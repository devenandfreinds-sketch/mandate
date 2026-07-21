/**
 * The Institutional Pipeline Index measures institutional development and measurable
 * implementation maturity for a given policy area in a given jurisdiction — NOT ideological
 * agreement with the policy itself. It answers five distinct questions in sequence:
 * did they promise it, did they legally establish it, did they build an institution, is it
 * operating, and is there evidence it's producing results. See /methodology/pipeline for the
 * full explanation surfaced to end users.
 */
export interface PipelineStageDefinition {
  stage: number;
  label: string;
  /** The single diagnostic question this stage answers. */
  question: string;
  /** What qualifies as evidence for an assessment to be placed at this stage. */
  criteria: string;
}

export const PIPELINE_STAGE_DEFINITIONS: PipelineStageDefinition[] = [
  {
    stage: 0,
    label: "Campaign Promise",
    question: "Did they promise something?",
    criteria:
      "A candidate, administration, or governing coalition has publicly committed to this policy area — in a platform, speech, or official statement — but no formal legislative or policy action has yet been taken.",
  },
  {
    stage: 1,
    label: "Policy / Legislative Proposal",
    question: "Has a formal proposal been introduced?",
    criteria:
      "A bill, ordinance, executive order draft, or formal policy proposal has been introduced or published, but has not yet been formally adopted or enacted.",
  },
  {
    stage: 2,
    label: "Legislation Enacted / Formally Adopted",
    question: "Did they legally establish it?",
    criteria:
      "The law, ordinance, or policy has been formally passed, signed, or adopted through the applicable legal process. It is now legally binding, even if no institution or program has been built to carry it out yet.",
  },
  {
    stage: 3,
    label: "Institution or Program Created",
    question: "Did they build an institution?",
    criteria:
      "An agency, office, fund, board, or program has been formally created, staffed, or funded to carry out the enacted policy — a durable mechanism now exists, even if it is not yet fully operating.",
  },
  {
    stage: 4,
    label: "Operating with Observable Outputs",
    question: "Is it operating?",
    criteria:
      "The institution or program is functioning and producing observable outputs (e.g. units built, grants issued, cases handled) — though those outputs have not yet been independently or rigorously assessed for improvement over time.",
  },
  {
    stage: 5,
    label: "Measurable Outputs Demonstrating Improvement",
    question: "Is there evidence it's producing results?",
    criteria:
      "Government, academic, or otherwise credible data shows a measurable, improving trend in outcomes over multiple periods — not just that the program exists and runs, but that it is working.",
  },
];

export const PIPELINE_STAGE_LABELS: Record<number, string> = Object.fromEntries(
  PIPELINE_STAGE_DEFINITIONS.map((d) => [d.stage, d.label])
);

export const PIPELINE_MAX_STAGE = 5;

/** Tier 1/2/3 source hierarchy — mirrors the categories used for evidence and, more broadly, for MetricValue sourcing. */
export const SOURCE_TIERS = [
  { tier: "government", label: "Tier 1 — Government", description: "Official government agencies, departments, or public data portals." },
  { tier: "academic", label: "Tier 2 — Academic", description: "Universities, research institutes, or peer-reviewed research." },
  { tier: "alternative", label: "Tier 3 — Alternative", description: "Nonprofits, industry data providers, or credible news reporting, used when no government or academic source exists." },
] as const;

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
  sourceId: string | null;
  isPlaceholder: boolean;
}

export interface EvidenceLink {
  id: string;
  label: string;
  description: string | null;
  url: string;
  evidenceType: string;
  publicationDate: string | null;
  publisher: string | null;
  /** "government" | "academic" | "alternative" — Tier 1/2/3, describes this specific piece of evidence. */
  sourceTier: string | null;
  sourceId: string | null;
  isPlaceholder: boolean;
}

export interface PipelineAssessment {
  id: string;
  jurisdictionId: string;
  jurisdictionSlug: string;
  policyAreaId: string;
  policyAreaSlug: string;
  policyAreaName: string;
  categorySlug: string | null;
  categoryName: string | null;
  governanceModelSlug: string | null;
  administrationId: string | null;
  stage: number;
  stageLabel: string;
  /** Same vocabulary as MetricValue.dataQuality: government | academic | alternative | estimated | unavailable | placeholder. */
  dataQuality: string;
  assessmentDate: string;
  updatedAt: string;
  isCurrent: boolean;
  timelineNotes: string | null;
  evidenceSummary: string | null;
  limitations: string | null;
  isPlaceholder: boolean;
  legislation: SupportingLegislation[];
  evidenceLinks: EvidenceLink[];
}
