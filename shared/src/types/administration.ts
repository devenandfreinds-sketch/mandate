export type CampaignPromiseStatus = "proposed" | "in_progress" | "fulfilled" | "broken" | "stalled";

export interface CampaignPromise {
  id: string;
  administrationId: string;
  categoryId: string | null;
  categorySlug: string | null;
  title: string;
  description: string;
  status: CampaignPromiseStatus | string;
  datePromised: string | null;
  isPlaceholder: boolean;
}

export interface AdministrationSummary {
  id: string;
  jurisdictionId: string;
  leaderName: string;
  leaderTitle: string;
  politicalParty: string | null;
  coalitionDescription: string | null;
  termNumber: number | null;
  startDate: string;
  endDate: string | null;
  photoUrl: string | null;
  isCurrent: boolean;
  isPlaceholder: boolean;
}

export interface AdministrationDetail extends AdministrationSummary {
  campaignPromises: CampaignPromise[];
}
