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

/**
 * The 6-level data-quality vocabulary shared by MetricValue and PipelineAssessment. This deliberately
 * separates four distinct concepts that are easy to conflate:
 *  - SOURCE quality (who published the underlying evidence — government/academic/alternative)
 *  - EVIDENCE quality (does verifiable evidence exist at all for this specific claim)
 *  - RESEARCHER SYNTHESIS (did a human have to interpret/combine evidence to reach a conclusion,
 *    vs. reading a single number directly off one authoritative publication)
 *  - ABSENCE of data (no credible evidence exists — an honest gap, not a guess)
 * A label of "government" describes the SOURCE tier of the evidence, not the confidence of the
 * conclusion drawn from it — a stage score can cite a Tier-1 government document and still be
 * labeled "estimated" if reaching that stage required the researcher's own synthesis across
 * fragmented evidence rather than a single government publication stating the conclusion outright.
 * See docs/PIPELINE_METHODOLOGY.md for the full specification and worked examples.
 */
export interface DataQualityLevel {
  level: string;
  label: string;
  /** Relative strength for summary/rollup purposes only — NOT a substitute for reading the label itself. */
  tierRank: number;
  description: string;
}

export const DATA_QUALITY_LEVELS: DataQualityLevel[] = [
  {
    level: "government",
    label: "Government",
    tierRank: 3,
    description:
      "The evidence is an official government agency publication (dataset, report, filing, or legal record), AND the conclusion follows directly from it without requiring the researcher to interpret or combine multiple sources.",
  },
  {
    level: "academic",
    label: "Academic",
    tierRank: 3,
    description: "The evidence is peer-reviewed research or a university/research-institute publication, used the same way a government source would be.",
  },
  {
    level: "alternative",
    label: "Alternative",
    tierRank: 3,
    description:
      "The evidence is a named, credible non-government/non-academic source (an established nonprofit, industry data provider, or specific credible news outlet) — used only when no government or academic source exists for this claim.",
  },
  {
    level: "estimated",
    label: "Estimated",
    tierRank: 2,
    description:
      "A researcher's synthesis or numerical estimate drawn from cited evidence, not a conclusion read directly off one authoritative publication. The evidence itself may well be Tier 1 government material — this label flags that reaching the stated conclusion required interpretation, aggregation across fragmented sources, or approximation, not that the underlying sources are weak.",
  },
  {
    level: "unavailable",
    label: "Unavailable",
    tierRank: 1,
    description:
      "No credible evidence was found for this metric or assessment after a genuine search. This is an honest absence-of-data marker — prefer it over fabricating a number or a stage.",
  },
  {
    level: "placeholder",
    label: "Placeholder",
    tierRank: 0,
    description:
      "Synthetic demonstration data generated for development purposes. Not a research finding of any kind, and must never be presented to end users as a real assessment or measurement.",
  },
] as const;

export const DATA_QUALITY_LEVEL_SLUGS = DATA_QUALITY_LEVELS.map((d) => d.level);

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
  /** Research Passport fields — see docs/MANDATE_OPERATING_SYSTEM.md. Null means "not yet captured," not an error. */
  researchedById: string | null;
  researchedByName: string | null;
  reviewedById: string | null;
  reviewedByName: string | null;
  reviewedAt: string | null;
  methodologyVersion: string | null;
  nextReviewDate: string | null;
}
