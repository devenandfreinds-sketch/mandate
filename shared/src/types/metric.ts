import type { Source } from "./source.js";

export type MetricUnit = "count" | "usd" | "percent" | "years" | "index" | "days" | "minutes" | "miles";
export type PeriodType = "year" | "quarter" | "month";
export type Confidence = "high" | "estimated" | "modeled";
export type IngestionMethod = "seed" | "csv" | "json" | "manual" | "api";
export type DataQuality = "government" | "academic" | "alternative" | "estimated" | "unavailable" | "placeholder" | "official";

export interface MetricDefinition {
  id: string;
  categoryId: string;
  categorySlug: string;
  slug: string;
  name: string;
  description: string;
  unit: MetricUnit | string;
  higherIsBetter: boolean;
  decimalPrecision: number;
  sortOrder: number;
  isPlaceholder: boolean;
}

export interface MetricDefinitionDetail extends MetricDefinition {
  calculationMethod: string | null;
  coverageNote: string | null;
  limitations: string | null;
  primarySource: Source | null;
  lastUpdated: string | null;
  coverage: {
    jurisdictionCount: number;
    periodStart: string | null;
    periodEnd: string | null;
    valueCount: number;
    dataQualityBreakdown: Record<string, number>;
  };
}

export interface MetricValue {
  id: string;
  metricDefinitionId: string;
  metricSlug: string;
  jurisdictionId: string;
  jurisdictionSlug: string;
  administrationId: string | null;
  sourceId: string;
  periodType: PeriodType | string;
  periodStart: string;
  periodEnd: string;
  periodLabel: string;
  value: number;
  confidence: Confidence | string | null;
  notes: string | null;
  ingestionMethod: IngestionMethod | string;
  dataQuality: DataQuality | string;
  isPlaceholder: boolean;
}

export interface MetricSeries {
  metricDefinition: MetricDefinition;
  jurisdictionSlug: string;
  jurisdictionName: string;
  values: MetricValue[];
}

export interface DashboardHeadlineMetric {
  categorySlug: string;
  categoryName: string;
  metricSlug: string;
  metricName: string;
  unit: string;
  higherIsBetter: boolean;
  byJurisdiction: Array<{
    jurisdictionSlug: string;
    jurisdictionName: string;
    governanceModelSlug: string;
    latestValue: number | null;
    latestPeriodLabel: string | null;
    dataQuality: DataQuality | string;
    isPlaceholder: boolean;
  }>;
}

export interface DashboardSummary {
  governanceModelCount: number;
  jurisdictionCount: number;
  metricDefinitionCount: number;
  metricValueCount: number;
  headlineMetrics: DashboardHeadlineMetric[];
}
