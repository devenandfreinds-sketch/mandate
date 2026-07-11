import type { AdministrationSummary } from "./administration.js";
import type { TimelineEvent } from "./timeline.js";

export type JurisdictionKind = "city" | "metro_region";

export interface JurisdictionSummary {
  id: string;
  slug: string;
  name: string;
  kind: JurisdictionKind | string;
  stateOrRegion: string | null;
  country: string;
  population: number | null;
  populationYear: number | null;
  governanceModelSlug: string;
  governanceModelName: string;
  summary: string;
  isPlaceholder: boolean;
}

export interface JurisdictionDetail extends JurisdictionSummary {
  latitude: number | null;
  longitude: number | null;
  description: string;
  administrations: AdministrationSummary[];
  currentAdministration: AdministrationSummary | null;
  timelineEvents: TimelineEvent[];
}
