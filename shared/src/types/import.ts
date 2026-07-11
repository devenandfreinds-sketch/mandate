export type ImportType = "csv" | "json" | "manual" | "api";
export type ImportJobStatus = "previewed" | "completed" | "failed" | "rolled_back";
export type ImportRowStatus = "created" | "updated" | "skipped" | "rejected";

export interface ImportRowResult {
  id: string;
  importJobId: string;
  rowNumber: number;
  status: ImportRowStatus;
  message: string | null;
  metricValueId: string | null;
  rawData: Record<string, unknown>;
}

/** Row outcome as returned inline by preview/commit (before persistence assigns an id/importJobId). */
export interface ImportRowOutcome {
  rowNumber: number;
  status: ImportRowStatus;
  message?: string;
  metricValueId?: string;
  rawData: Record<string, unknown>;
}

export interface ImportJob {
  id: string;
  filename: string;
  importType: ImportType;
  categorySlug: string | null;
  status: ImportJobStatus;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  createdCount: number;
  updatedCount: number;
  errorSummary: string | null;
  triggeredBy: string | null;
  createdAt: string;
  completedAt: string | null;
  rolledBackAt: string | null;
}

export interface ImportJobDetail extends ImportJob {
  rows: ImportRowResult[];
}

export interface ImportSummary {
  importJobId?: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  createdCount: number;
  updatedCount: number;
  rows: ImportRowOutcome[];
}
