/**
 * Source hierarchy enforcement. Mandate's rule: 1. Government, 2. Academic, 3. Named alternative
 * sources -- and an alternative source must always be a specific, identifiable outlet/organization,
 * never a vague label like "Internet," "Media," "News," or "Other." See docs/PIPELINE_METHODOLOGY.md.
 *
 * SOURCE_TYPES is the enforced vocabulary (previously `SourceType | string`, which TypeScript
 * silently collapses to plain `string` -- providing zero actual type safety; three of the seven
 * values already in use, government_report/financial_data/advocacy_report, weren't even members of
 * the old union). isValidSourceType() gives every write path (seed script, CSV import, admin API) a
 * single place to catch a typo'd or invented sourceType before it reaches the database.
 */
export interface SourceTypeOption {
  type: string;
  label: string;
  /** Which tier of the 3-tier hierarchy this sourceType belongs to, for rollups/badges. */
  tier: "government" | "academic" | "alternative";
}

export const SOURCE_TYPES: SourceTypeOption[] = [
  { type: "government_dataset", label: "Government Dataset", tier: "government" },
  { type: "government_report", label: "Government Report", tier: "government" },
  { type: "financial_data", label: "Financial Data (regulatory filing)", tier: "government" },
  { type: "academic", label: "Academic / Research Institute", tier: "academic" },
  { type: "advocacy_report", label: "Named Advocacy/Nonprofit Report", tier: "alternative" },
  { type: "news", label: "Named News Outlet", tier: "alternative" },
  { type: "placeholder", label: "Placeholder (synthetic, not a real source)", tier: "alternative" },
];

export type SourceType = (typeof SOURCE_TYPES)[number]["type"];

export const SOURCE_TYPE_SLUGS: string[] = SOURCE_TYPES.map((s) => s.type);

export function isValidSourceType(value: string): boolean {
  return SOURCE_TYPE_SLUGS.includes(value);
}

/** Source names that are too vague to satisfy the "always named/identifiable" rule — a real registry entry should never use one of these as its `name`. */
export const FORBIDDEN_VAGUE_SOURCE_NAMES = ["internet", "media", "news", "other", "various sources", "unknown"];

export function isVagueSourceName(name: string): boolean {
  return FORBIDDEN_VAGUE_SOURCE_NAMES.includes(name.trim().toLowerCase());
}

export type UpdateFrequency = "annual" | "quarterly" | "monthly" | "one_time";

export interface Source {
  id: string;
  name: string;
  publisher: string | null;
  url: string | null;
  sourceType: string;
  citation: string | null;
  retrievedAt: string | null;
  isPlaceholder: boolean;
  publicationDate: string | null;
  updateFrequency: UpdateFrequency | string | null;
  methodology: string | null;
  defaultConfidence: string | null;
  /** Country the PUBLISHER belongs to (not the jurisdiction the data is ABOUT). NULL = not yet recorded. See docs/INTERNATIONAL_SOURCE_HIERARCHY.md. */
  country: string | null;
  /** BCP-47-ish language code the source is published in (e.g. "en", "ja"). NULL = not yet recorded, not assumed English. */
  language: string | null;
}
