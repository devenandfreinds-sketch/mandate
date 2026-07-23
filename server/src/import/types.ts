// "uk_fiscal_year": UK government fiscal year (6 April-5 April; treated here as 1 Apr-31 Mar for
// simplicity, matching how MHCLG reports it). "uk_academic_year": UK academic year (1 Aug-31 Jul,
// how DfE reports apprenticeship statistics) -- a distinct convention from the fiscal year, not
// interchangeable. Real UK government series are fiscal/academic-year native -- forcing them
// through "year" would silently mislabel the actual measurement window. Raw format for both:
// "YYYY-YY", e.g. "2019-20" for 1 Apr/Aug 2019-31 Mar/Jul 2020.
export type PeriodType = "year" | "quarter" | "month" | "uk_fiscal_year" | "uk_academic_year";

export type DataQuality = "government" | "academic" | "alternative" | "estimated" | "unavailable" | "placeholder" | "official";

export interface RawRow {
  rowNumber: number;
  data: Record<string, string>;
}

export interface ImportMappingConfig {
  columns: {
    jurisdiction: string;
    metric?: string;
    period: string;
    value: string;
    notes?: string;
    confidence?: string;
  };
  periodType: PeriodType;
  fixedMetricSlug?: string;
  jurisdictionAliases?: Record<string, string>;
}

export interface ValidatedRow {
  rowNumber: number;
  rawData: Record<string, string>;
  metricDefinitionId: string;
  metricSlug: string;
  jurisdictionId: string;
  jurisdictionSlug: string;
  periodType: string;
  periodStart: Date;
  periodEnd: Date;
  periodLabel: string;
  value: number;
  confidence: string | null;
  notes: string | null;
}

export interface ValidationError {
  rowNumber: number;
  rawData: Record<string, string>;
  message: string;
}

export interface RowOutcome {
  rowNumber: number;
  status: "created" | "updated" | "skipped" | "rejected";
  message?: string;
  metricValueId?: string;
  previousValueJson?: string;
  rawData: Record<string, string>;
}

export interface ImportSummary {
  importJobId?: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  createdCount: number;
  updatedCount: number;
  rows: RowOutcome[];
}

export interface RunImportOptions {
  rawRows: RawRow[];
  mapping: ImportMappingConfig;
  sourceId: string;
  dataQuality: DataQuality;
  confidenceOverride?: string;
  importType: "csv" | "json" | "manual" | "api";
  filename: string;
  categorySlug?: string;
  triggeredBy: string;
  dryRun: boolean;
}
