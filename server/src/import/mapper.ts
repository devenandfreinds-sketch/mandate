import type { ImportMappingConfig, RawRow, ValidatedRow, ValidationError } from "./types.js";
import { isValueInRange, parsePeriod, parseValue, resolveJurisdictionSlug } from "./validators.js";

export interface MetricLookup {
  id: string;
  slug: string;
  unit: string;
}

export interface JurisdictionLookup {
  id: string;
  slug: string;
}

export interface MapRowsResult {
  validated: ValidatedRow[];
  errors: ValidationError[];
}

export function mapRows(
  rawRows: RawRow[],
  mapping: ImportMappingConfig,
  metricsBySlug: Map<string, MetricLookup>,
  jurisdictionsBySlug: Map<string, JurisdictionLookup>
): MapRowsResult {
  const validated: ValidatedRow[] = [];
  const errors: ValidationError[] = [];
  const seenKeys = new Set<string>();

  for (const raw of rawRows) {
    const fail = (message: string) => errors.push({ rowNumber: raw.rowNumber, rawData: raw.data, message });

    const rawJurisdiction = raw.data[mapping.columns.jurisdiction];
    if (!rawJurisdiction) {
      fail(`Missing jurisdiction value (column "${mapping.columns.jurisdiction}")`);
      continue;
    }
    const jurisdictionSlug = resolveJurisdictionSlug(rawJurisdiction, mapping.jurisdictionAliases);
    const jurisdiction = jurisdictionsBySlug.get(jurisdictionSlug);
    if (!jurisdiction) {
      fail(`Unknown jurisdiction "${rawJurisdiction}" (resolved to slug "${jurisdictionSlug}")`);
      continue;
    }

    let metricSlug = mapping.fixedMetricSlug;
    if (!metricSlug && mapping.columns.metric) {
      metricSlug = raw.data[mapping.columns.metric]?.trim();
    }
    if (!metricSlug) {
      fail("Missing metric slug (no fixedMetricSlug configured and no metric column value present)");
      continue;
    }
    const metric = metricsBySlug.get(metricSlug);
    if (!metric) {
      fail(`Unknown metric slug "${metricSlug}"`);
      continue;
    }

    const rawPeriod = raw.data[mapping.columns.period];
    if (!rawPeriod) {
      fail(`Missing period value (column "${mapping.columns.period}")`);
      continue;
    }
    const period = parsePeriod(mapping.periodType, rawPeriod);
    if (!period) {
      fail(`Could not parse period "${rawPeriod}" as a ${mapping.periodType}`);
      continue;
    }

    const rawValue = raw.data[mapping.columns.value];
    if (rawValue === undefined || rawValue.trim() === "") {
      fail(`Missing value (column "${mapping.columns.value}")`);
      continue;
    }
    const value = parseValue(rawValue);
    if (value === null) {
      fail(`Could not parse value "${rawValue}" as a number`);
      continue;
    }
    const range = isValueInRange(value, metric.unit);
    if (!range.valid) {
      fail(range.reason ?? `Value ${value} is out of range for unit "${metric.unit}"`);
      continue;
    }

    const key = `${metric.slug}::${jurisdiction.slug}::${mapping.periodType}::${period.periodLabel}`;
    if (seenKeys.has(key)) {
      fail(`Duplicate observation within this import batch for ${metric.slug} / ${jurisdiction.slug} / ${period.periodLabel}`);
      continue;
    }
    seenKeys.add(key);

    validated.push({
      rowNumber: raw.rowNumber,
      rawData: raw.data,
      metricDefinitionId: metric.id,
      metricSlug: metric.slug,
      jurisdictionId: jurisdiction.id,
      jurisdictionSlug: jurisdiction.slug,
      periodType: mapping.periodType,
      periodStart: period.periodStart,
      periodEnd: period.periodEnd,
      periodLabel: period.periodLabel,
      value,
      confidence: mapping.columns.confidence ? raw.data[mapping.columns.confidence]?.trim() || null : null,
      notes: mapping.columns.notes ? raw.data[mapping.columns.notes]?.trim() || null : null,
    });
  }

  return { validated, errors };
}
