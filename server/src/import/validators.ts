import type { PeriodType } from "./types.js";

export function resolveJurisdictionSlug(raw: string, aliases: Record<string, string> | undefined): string {
  const trimmed = raw.trim();
  return aliases?.[trimmed] ?? trimmed;
}

export interface ParsedPeriod {
  periodStart: Date;
  periodEnd: Date;
  periodLabel: string;
}

export function parsePeriod(periodType: PeriodType, raw: string): ParsedPeriod | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (periodType === "year") {
    if (!/^\d{4}$/.test(trimmed)) return null;
    const year = Number(trimmed);
    return {
      periodStart: new Date(Date.UTC(year, 0, 1)),
      periodEnd: new Date(Date.UTC(year, 11, 31)),
      periodLabel: trimmed,
    };
  }

  if (periodType === "uk_fiscal_year") {
    const match = /^(\d{4})-(\d{2})$/.exec(trimmed);
    if (!match) return null;
    const startYear = Number(match[1]);
    const endYearSuffix = Number(match[2]);
    if (endYearSuffix !== (startYear + 1) % 100) return null;
    return {
      periodStart: new Date(Date.UTC(startYear, 3, 1)),
      periodEnd: new Date(Date.UTC(startYear + 1, 2, 31)),
      periodLabel: `FY${trimmed}`,
    };
  }

  if (periodType === "uk_academic_year") {
    const match = /^(\d{4})-(\d{2})$/.exec(trimmed);
    if (!match) return null;
    const startYear = Number(match[1]);
    const endYearSuffix = Number(match[2]);
    if (endYearSuffix !== (startYear + 1) % 100) return null;
    return {
      periodStart: new Date(Date.UTC(startYear, 7, 1)),
      periodEnd: new Date(Date.UTC(startYear + 1, 6, 31)),
      periodLabel: `AY${trimmed}`,
    };
  }

  if (periodType === "quarter") {
    const match = /^(\d{4})-Q([1-4])$/.exec(trimmed);
    if (!match) return null;
    const year = Number(match[1]);
    const quarter = Number(match[2]);
    const startMonth = (quarter - 1) * 3;
    return {
      periodStart: new Date(Date.UTC(year, startMonth, 1)),
      periodEnd: new Date(Date.UTC(year, startMonth + 3, 0)),
      periodLabel: trimmed,
    };
  }

  // month: "2019-03"
  const match = /^(\d{4})-(\d{2})$/.exec(trimmed);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  if (month < 0 || month > 11) return null;
  return {
    periodStart: new Date(Date.UTC(year, month, 1)),
    periodEnd: new Date(Date.UTC(year, month + 1, 0)),
    periodLabel: trimmed,
  };
}

export function parseValue(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, "");
  if (trimmed === "") return null;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

// Percent-unit metrics that can legitimately exceed 100% in the real world (e.g. an over-funded
// pension plan, assets > liabilities) get their own, wider ceiling here instead of the generic
// 105 cap -- otherwise real government-reported values get rejected as if they were data-entry
// errors. Keep this list narrow: every other percent metric in this project (unemployment rate,
// vacancy rate, mode share, etc.) is capped well under 100 by definition, so the generic 105 cap
// still catches genuine fat-finger errors (e.g. "1043" typed for "104.3") for those metrics.
const PERCENT_METRICS_ALLOWING_OVER_100: Record<string, number> = {
  pension_funding_ratio: 150,
};

/** Sanity-checks a value against its metric's unit. Not exhaustive — catches clearly impossible values. */
export function isValueInRange(value: number, unit: string, metricSlug?: string): { valid: boolean; reason?: string } {
  if (unit === "percent") {
    const ceiling = (metricSlug && PERCENT_METRICS_ALLOWING_OVER_100[metricSlug]) || 105;
    if (value < -1 || value > ceiling) return { valid: false, reason: `Percent value ${value} is outside a plausible 0-${ceiling} range` };
  }
  if ((unit === "count" || unit === "days" || unit === "minutes" || unit === "miles") && value < 0) {
    return { valid: false, reason: `${unit} value ${value} cannot be negative` };
  }
  return { valid: true };
}
