/**
 * Derived series-level data-quality classification.
 *
 * MetricValue.dataQuality (see pipeline.ts::DATA_QUALITY_LEVELS) is a per-ROW label — it says nothing
 * about how much of a metric's full time series is actually researched. Before this classifier existed,
 * the only series-level signal was `dominantDataQuality()` (client/src/components/governance/
 * DataQualityBadge.tsx), a "worst value anywhere in the series wins" reducer: a single leftover
 * placeholder year among ten real years produced the exact same "Placeholder Data" badge as a series
 * with zero real years. That collapses "we've done real research here" and "nobody has looked" into one
 * label, which is the opposite of Mandate's own conservatism principle — it's not conservative, it's just
 * imprecise in the direction that happens to look cautious.
 *
 * This module NEVER touches row-level truth. It only reads an array of {dataQuality, periodStart} pairs
 * and derives one of six series-level categories, calibrated against Mandate's actual data (see
 * docs/DATA_QUALITY_MODEL.md for the calibration query and reasoning) rather than picked arbitrarily:
 *
 *   fully_measured       — evidence covers nearly the whole series with no untouched (placeholder) gap.
 *   mostly_measured       — most periods are evidenced; a few placeholder/unavailable periods remain.
 *   partially_measured    — a meaningful share of the series is real, but substantial gaps remain.
 *   limited_evidence      — some real evidence exists, but it's too sparse, too scattered across large
 *                           gaps, or too short a run (below MIN_PERIODS_FOR_BROAD_CLAIM) to support a
 *                           historical-trend claim.
 *   fully_placeholder     — no real evidence anywhere; this series has not been meaningfully researched.
 *   unavailable           — the series has been substantively investigated and found to have no
 *                           measurable evidence for essentially all periods (dominated by "unavailable"
 *                           rows, not "placeholder" rows) — a real research conclusion, not silence.
 *
 * Two modifiers refine the raw evidence-fraction threshold rather than being folded into more categories
 * (six is already the number the brief asked for):
 *   - Recency: fully_measured/mostly_measured are downgraded one level if the MOST RECENT period has no
 *     evidence — a series can't fairly be called "nearly complete" if its current state is unknown.
 *   - Fragmentation: several small isolated evidence clusters (e.g. three single scattered years across
 *     an 11-year span) are treated as weaker than the same count concentrated in one contiguous run,
 *     per the brief's explicit example — capped at limited_evidence regardless of the raw fraction.
 *
 * What this model deliberately does NOT attempt: detecting substantive methodology inconsistency within
 * "real" data (e.g. two real years measured by genuinely different methods) — that requires reading the
 * researcher's own notes/limitations text, not inferable from a dataQuality string, and is out of scope
 * for a generic classifier. Flag such cases in the MetricValue.notes field instead.
 */

export type SeriesQualityCategory =
  | "fully_measured"
  | "mostly_measured"
  | "partially_measured"
  | "limited_evidence"
  | "fully_placeholder"
  | "unavailable";

export interface SeriesQualityDefinition {
  category: SeriesQualityCategory;
  label: string;
  description: string;
}

export const SERIES_QUALITY_DEFINITIONS: SeriesQualityDefinition[] = [
  {
    category: "fully_measured",
    label: "Fully Measured",
    description: "Nearly every period has real evidence, with no meaningful untouched gap.",
  },
  {
    category: "mostly_measured",
    label: "Mostly Measured",
    description: "Most periods are real, with a limited number of estimated, unavailable, or placeholder periods remaining.",
  },
  {
    category: "partially_measured",
    label: "Partially Measured",
    description: "A meaningful share of the series is real, but substantial gaps remain.",
  },
  {
    category: "limited_evidence",
    label: "Limited Evidence",
    description: "Some real evidence exists, but it is too sparse, too scattered, or too short a run to support a broad historical conclusion.",
  },
  {
    category: "fully_placeholder",
    label: "Fully Placeholder",
    description: "No meaningful real evidence has been incorporated — this series has not yet been researched.",
  },
  {
    category: "unavailable",
    label: "Unavailable",
    description: "Explicitly investigated and found to have no measurable evidence for essentially the whole series — a research conclusion, not silence.",
  },
];

export const SERIES_QUALITY_LABELS: Record<SeriesQualityCategory, string> = Object.fromEntries(
  SERIES_QUALITY_DEFINITIONS.map((d) => [d.category, d.label])
) as Record<SeriesQualityCategory, string>;

export interface SeriesQualityBreakdown {
  total: number;
  /** government + academic + alternative + legacy "official" — a conclusion read directly off one authoritative source. */
  real: number;
  estimated: number;
  unavailable: number;
  placeholder: number;
}

export interface SeriesQualityResult {
  category: SeriesQualityCategory;
  breakdown: SeriesQualityBreakdown;
  /** Whether the chronologically last period in the input has real or estimated evidence. */
  latestPeriodHasEvidence: boolean;
  /** Whether real/estimated evidence is split across several small isolated clusters rather than one contiguous run. */
  fragmented: boolean;
}

export interface SeriesQualityInput {
  dataQuality: string;
  periodStart: string | Date;
}

// Real-evidence tiers: government/academic/alternative (tierRank 3 in DATA_QUALITY_LEVELS) plus the
// legacy "official" value (pre-dates the 6-level vocabulary, never used for new rows, but existing rows
// carry it and DataQualityBadge's own RANK map already treats it identically to "government").
const REAL_LEVELS = new Set(["government", "academic", "alternative", "official"]);

// Below this many total observed periods, no series can claim more than "limited_evidence" regardless of
// what fraction is real — a metric with only 1-3 periods ever recorded (e.g. a UK fiscal-year metric with
// a single real value and no synthetic placeholder rows generated for it at all) cannot support a "broad
// historical conclusion" even at 100% real, per the brief's own definition of what separates
// "limited_evidence" from the tiers above it. Calibrated against Mandate's actual data: most series have
// 10-11 periods (annual, 2015-2025); a handful of newly-introduced non-annual-period metrics have as few
// as 1-2 rows total, which is exactly the case this floor exists to catch.
const MIN_PERIODS_FOR_BROAD_CLAIM = 4;

const hasEvidence = (dataQuality: string): boolean => REAL_LEVELS.has(dataQuality) || dataQuality === "estimated";

/**
 * The fraction-threshold core shared by both the full per-row classifier and the counts-only fallback
 * below. Takes NO position on recency or fragmentation, since those require per-row period ordering
 * that a plain breakdown of counts doesn't carry — callers with that information apply it on top (see
 * `classifySeriesQuality`).
 */
function classifyFromCounts(breakdown: SeriesQualityBreakdown): SeriesQualityCategory {
  const { total, real, estimated, unavailable, placeholder } = breakdown;
  if (total === 0) return "fully_placeholder";

  const evidence = real + estimated;
  if (evidence === 0) {
    // No real or estimated value anywhere. Distinguish "genuinely investigated and found unmeasurable"
    // from "nobody has looked yet" by which one dominates -- never merge the two, per Mandate's existing
    // researchProgress.service.ts convention of keeping "unavailable" and "unresearched" as separate buckets.
    return unavailable / total >= 0.7 ? "unavailable" : "fully_placeholder";
  }

  const evidenceFrac = evidence / total;
  const resolvedFrac = (evidence + unavailable) / total;

  if (total < MIN_PERIODS_FOR_BROAD_CLAIM) return "limited_evidence";
  if (evidenceFrac >= 0.9 && placeholder === 0) return "fully_measured";
  if (evidenceFrac >= 0.7 || (resolvedFrac >= 0.9 && evidenceFrac >= 0.5)) return "mostly_measured";
  if (evidenceFrac >= 0.35) return "partially_measured";
  return "limited_evidence";
}

export function classifySeriesQuality(rows: SeriesQualityInput[]): SeriesQualityResult {
  const total = rows.length;
  const real = rows.filter((r) => REAL_LEVELS.has(r.dataQuality)).length;
  const estimated = rows.filter((r) => r.dataQuality === "estimated").length;
  const unavailable = rows.filter((r) => r.dataQuality === "unavailable").length;
  const placeholder = rows.filter((r) => r.dataQuality === "placeholder").length;
  const breakdown: SeriesQualityBreakdown = { total, real, estimated, unavailable, placeholder };

  if (total === 0) {
    return { category: "fully_placeholder", breakdown, latestPeriodHasEvidence: false, fragmented: false };
  }

  const sorted = [...rows].sort(
    (a, b) => new Date(a.periodStart).getTime() - new Date(b.periodStart).getTime()
  );
  const latestPeriodHasEvidence = hasEvidence(sorted[sorted.length - 1].dataQuality);

  // Count contiguous runs of evidenced periods, in chronological order.
  let clusters = 0;
  let inRun = false;
  for (const r of sorted) {
    if (hasEvidence(r.dataQuality)) {
      if (!inRun) clusters++;
      inRun = true;
    } else {
      inRun = false;
    }
  }
  const evidence = real + estimated;
  const fragmented = clusters >= 3 && evidence > 0 && evidence / clusters <= 1.5;

  let category = fragmented ? "limited_evidence" : classifyFromCounts(breakdown);

  // Recency safeguard: don't call a series "nearly complete" if its most recent period is unresearched.
  if (!latestPeriodHasEvidence) {
    if (category === "fully_measured") category = "mostly_measured";
    else if (category === "mostly_measured") category = "partially_measured";
  }

  return { category, breakdown, latestPeriodHasEvidence, fragmented };
}

export interface SeriesQualityFromBreakdownResult {
  category: SeriesQualityCategory;
  breakdown: SeriesQualityBreakdown;
}

/**
 * A coarser fallback for call sites that only have an aggregate `Record<dataQuality, count>` (e.g. a
 * catalog view summarizing one metric across every jurisdiction) rather than individual dated rows.
 * Applies the same fraction thresholds as `classifySeriesQuality` but cannot apply the recency or
 * fragmentation modifiers, since those require knowing WHICH periods are evidenced, not just how many.
 * Unknown/legacy quality strings (e.g. "official") are bucketed as real, matching REAL_LEVELS.
 */
export function classifySeriesQualityFromBreakdown(
  rawCounts: Record<string, number>
): SeriesQualityFromBreakdownResult {
  let real = 0;
  let estimated = 0;
  let unavailable = 0;
  let placeholder = 0;
  let total = 0;
  for (const [quality, count] of Object.entries(rawCounts)) {
    total += count;
    if (REAL_LEVELS.has(quality)) real += count;
    else if (quality === "estimated") estimated += count;
    else if (quality === "unavailable") unavailable += count;
    else placeholder += count; // "placeholder" and any unrecognized value both read as unresearched
  }
  const breakdown: SeriesQualityBreakdown = { total, real, estimated, unavailable, placeholder };
  return { category: classifyFromCounts(breakdown), breakdown };
}
