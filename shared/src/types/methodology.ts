/**
 * Methodology version registry. See docs/MANDATE_OPERATING_SYSTEM.md ("Methodology Governance").
 *
 * The point of this file is narrow: give every researched MetricValue, PipelineAssessment, and
 * ResearchTask a stable string to record ("this was produced under methodology vX.Y.Z"), so that a
 * future change to the Institutional Pipeline stage rubric or the data-quality vocabulary doesn't
 * silently invalidate or reinterpret past research. It is deliberately NOT a rules engine, a
 * database table, or a migration system for scoring logic -- just a versioned changelog plus one
 * "current version" pointer. Only the Methodology Lead / founder may add a new entry (see the
 * decision-rights matrix in docs/MANDATE_OPERATING_SYSTEM.md); adding one is a deliberate,
 * documented act, not something that happens as a side effect of routine research.
 *
 * A version bump does NOT retroactively touch existing research. Existing rows keep whichever
 * version they were stamped with. A bump only means: (1) new research is stamped with the new
 * version going forward, and (2) old research stamped with an earlier version becomes a candidate
 * for the "requires revalidation" queue if the change was substantive enough to affect its
 * conclusions (a judgment call documented in the new version's `changes` list, not automated).
 */
export interface MethodologyVersion {
  version: string;
  effectiveDate: string; // ISO date (YYYY-MM-DD)
  summary: string;
  changes: string[];
  /** True if research stamped with an earlier version should be flagged for a human to re-check it against this version. */
  triggersRevalidationReview: boolean;
}

export const METHODOLOGY_VERSIONS: MethodologyVersion[] = [
  {
    version: "1.0.0",
    effectiveDate: "2026-07-10",
    summary:
      "Initial Institutional Pipeline (0-5 stage) methodology, the 6-level data-quality vocabulary, and the 3-tier source hierarchy, as documented in docs/PIPELINE_METHODOLOGY.md.",
    changes: [
      "Established the 0-5 Institutional Pipeline stage rubric (see PIPELINE_STAGE_DEFINITIONS).",
      "Established the 6-level data-quality vocabulary: government | academic | alternative | estimated | unavailable | placeholder (see DATA_QUALITY_LEVELS).",
      "Established the 3-tier source hierarchy: government (Tier 1) | academic (Tier 2) | named alternative (Tier 3), with a strict rule against vague source labels.",
      "Established the conservative-scoring principle: never advance a stage or a data-quality label without evidence that directly supports it; when torn between two stages, choose the lower one.",
    ],
    triggersRevalidationReview: false,
  },
];

export const CURRENT_METHODOLOGY_VERSION: string =
  METHODOLOGY_VERSIONS[METHODOLOGY_VERSIONS.length - 1].version;

export function getMethodologyVersion(version: string): MethodologyVersion | undefined {
  return METHODOLOGY_VERSIONS.find((v) => v.version === version);
}

/** Versions strictly newer than the given one, in effective-date order. Empty if `version` is current or unknown. */
export function methodologyVersionsAfter(version: string): MethodologyVersion[] {
  const index = METHODOLOGY_VERSIONS.findIndex((v) => v.version === version);
  if (index === -1) return [];
  return METHODOLOGY_VERSIONS.slice(index + 1);
}
