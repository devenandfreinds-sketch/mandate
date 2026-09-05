import { seededRandom } from "./prng.js";

export interface MetricSeedSpec {
  slug: string;
  name: string;
  description: string;
  unit: string;
  higherIsBetter: boolean;
  decimalPrecision: number;
  sortOrder: number;
  /** true: baseValue is a rate per 100k population, scaled by jurisdiction size. false: baseValue is used as-is (rates, percentages, indices, per-capita $). */
  scalesWithPopulation: boolean;
  baseValue: number;
  /** Per-jurisdiction override of baseValue, used when scalesWithPopulation is false and cities plausibly differ (e.g. median rent). */
  jurisdictionOverrides?: Record<string, number>;
  trendPercentPerYear: number;
  variancePercent: number;
  floor?: number;
  ceiling?: number;
}

export interface AdministrationWindow {
  id: string;
  startDate: Date;
  endDate: Date | null;
}

export interface GeneratedPoint {
  year: number;
  periodStart: Date;
  periodEnd: Date;
  periodLabel: string;
  value: number;
  administrationId: string | null;
}

/** A year already backed by real (non-placeholder, non-unavailable) MetricValue data. */
export interface RealAnchorPoint {
  year: number;
  value: number;
}

const START_YEAR = 2015;
const END_YEAR = 2025;

/**
 * Blend a still-missing year toward whatever real data already exists for this metric+jurisdiction,
 * instead of an independent from-scratch synthetic value. Without this, a metric that's mostly real
 * (e.g. Chicago's median_rent, real for 9 of 11 years) gets a placeholder/unavailable filler for its
 * one or two remaining gap years that has no relationship to the real trend it sits next to -- on a
 * line chart this reads as a nonsensical spike or valley, not a plausible gap-filler. Linear (additive,
 * not multiplicative) interpolation/extrapolation is used throughout because several metrics
 * (e.g. budget_balance) can be zero or negative, where a growth-rate multiplier breaks down.
 */
function estimateFromRealAnchors(year: number, realPoints: RealAnchorPoint[], fallbackTrendPercentPerYear: number): number {
  const sorted = [...realPoints].sort((a, b) => a.year - b.year);
  const before = [...sorted].reverse().find((p) => p.year <= year);
  const after = sorted.find((p) => p.year >= year);

  if (before && after && before.year !== after.year) {
    const t = (year - before.year) / (after.year - before.year);
    return before.value + (after.value - before.value) * t;
  }

  const anchor = (before ?? after)!;
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (first.year !== last.year) {
    const slope = (last.value - first.value) / (last.year - first.year);
    return anchor.value + slope * (year - anchor.year);
  }

  // Only one real year exists overall -- no slope to extrapolate, fall back to the metric's own
  // modeled trend rate applied to that single anchor.
  return anchor.value * Math.pow(1 + fallbackTrendPercentPerYear, year - anchor.year);
}

function administrationForYear(
  administrations: AdministrationWindow[],
  year: number
): AdministrationWindow | null {
  const midYear = new Date(Date.UTC(year, 6, 1));
  for (const admin of administrations) {
    const started = admin.startDate <= midYear;
    const stillActive = !admin.endDate || admin.endDate >= midYear;
    if (started && stillActive) return admin;
  }
  return null;
}

export function generateAnnualSeries(
  spec: MetricSeedSpec,
  jurisdictionSlug: string,
  population: number | null,
  administrations: AdministrationWindow[],
  realAnchors: RealAnchorPoint[] = []
): GeneratedPoint[] {
  const rng = seededRandom(jurisdictionSlug, spec.slug);
  const base = spec.scalesWithPopulation
    ? spec.baseValue * ((population ?? 500_000) / 100_000)
    : (spec.jurisdictionOverrides?.[jurisdictionSlug] ?? spec.baseValue);

  // Deterministic per-administration effect: a modest, direction-neutral shift
  // applied from the year after a leadership transition, so charts visibly
  // track administration changes without asserting any real-world outcome.
  const adminEffects = new Map<string, number>();
  for (const admin of administrations) {
    const effectRng = seededRandom(jurisdictionSlug, spec.slug, admin.id, "effect");
    const sign = effectRng() > 0.5 ? 1 : -1;
    const magnitude = 0.03 + effectRng() * 0.05; // 3%-8%
    adminEffects.set(admin.id, 1 + sign * magnitude);
  }

  const points: GeneratedPoint[] = [];
  for (let year = START_YEAR; year <= END_YEAR; year++) {
    const admin = administrationForYear(administrations, year);

    let value: number;
    if (realAnchors.length > 0) {
      const estimated = estimateFromRealAnchors(year, realAnchors, spec.trendPercentPerYear);
      // A smaller, capped wobble than the fully-synthetic case -- enough that a run of gap-filler
      // years isn't a perfectly straight line, but not enough to reintroduce the disconnect from the
      // real trend this branch exists to avoid.
      const wobble = 1 + (rng() * 2 - 1) * Math.min(spec.variancePercent, 0.05);
      value = estimated * wobble;
    } else {
      const yearsElapsed = year - START_YEAR;
      const trendMultiplier = Math.pow(1 + spec.trendPercentPerYear, yearsElapsed);
      const noise = 1 + (rng() * 2 - 1) * spec.variancePercent;
      const effectMultiplier = admin ? (adminEffects.get(admin.id) ?? 1) : 1;
      value = base * trendMultiplier * noise * effectMultiplier;
    }
    if (spec.floor !== undefined) value = Math.max(spec.floor, value);
    if (spec.ceiling !== undefined) value = Math.min(spec.ceiling, value);
    value = Number(value.toFixed(spec.decimalPrecision));

    points.push({
      year,
      periodStart: new Date(Date.UTC(year, 0, 1)),
      periodEnd: new Date(Date.UTC(year, 11, 31)),
      periodLabel: String(year),
      value,
      administrationId: admin?.id ?? null,
    });
  }
  return points;
}
