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

const START_YEAR = 2015;
const END_YEAR = 2025;

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
  administrations: AdministrationWindow[]
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
    const yearsElapsed = year - START_YEAR;
    const trendMultiplier = Math.pow(1 + spec.trendPercentPerYear, yearsElapsed);
    const noise = 1 + (rng() * 2 - 1) * spec.variancePercent;
    const admin = administrationForYear(administrations, year);
    const effectMultiplier = admin ? (adminEffects.get(admin.id) ?? 1) : 1;

    let value = base * trendMultiplier * noise * effectMultiplier;
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
