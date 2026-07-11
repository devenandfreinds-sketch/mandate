import type { Source } from "./source.js";

export interface DataCatalogEntry {
  metricSlug: string;
  metricName: string;
  categorySlug: string;
  categoryName: string;
  description: string;
  unit: string;
  higherIsBetter: boolean;
  calculationMethod: string | null;
  limitations: string | null;
  primarySource: Source | null;
  jurisdictionsTotal: number;
  jurisdictionsWithRealData: string[];
  jurisdictionsMissing: string[];
  completionPercent: number;
  dataQualityBreakdown: Record<string, number>;
  totalObservations: number;
  firstRealYear: number | null;
  lastRealYear: number | null;
  isFullyPlaceholder: boolean;
}

export interface DataCatalogSummary {
  totalMetrics: number;
  metricsWithAnyRealData: number;
  metricsFullyPlaceholder: number;
  metricsMissingSource: number;
  averageCompletionPercent: number;
}

export interface DataCatalogResponse {
  entries: DataCatalogEntry[];
  summary: DataCatalogSummary;
}
