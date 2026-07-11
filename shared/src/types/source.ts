export type SourceType = "government_dataset" | "academic" | "news" | "placeholder" | "api";
export type UpdateFrequency = "annual" | "quarterly" | "monthly" | "one_time";

export interface Source {
  id: string;
  name: string;
  publisher: string | null;
  url: string | null;
  sourceType: SourceType | string;
  citation: string | null;
  retrievedAt: string | null;
  isPlaceholder: boolean;
  publicationDate: string | null;
  updateFrequency: UpdateFrequency | string | null;
  methodology: string | null;
  defaultConfidence: string | null;
}
