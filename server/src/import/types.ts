export type PeriodType = "year" | "quarter" | "month";

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
