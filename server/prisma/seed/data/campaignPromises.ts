export interface CampaignPromiseSeedSpec {
  jurisdictionSlug: string;
  leaderName: string;
  termNumber: number;
  categorySlug: string | null;
  title: string;
  description: string;
  status: "proposed" | "in_progress" | "fulfilled" | "broken" | "stalled";
  datePromised: string | null;
}

export const campaignPromises: CampaignPromiseSeedSpec[] = [
  // NYC — Eric Adams
  {
    jurisdictionSlug: "new-york-city",
    leaderName: "Eric Adams",
    termNumber: 1,
    categorySlug: "public-safety",
    title: "Expand the Gun Violence Suppression Division",
    description: "Reduce shootings through a reorganized, precision-policing focused unit.",
    status: "in_progress",
    datePromised: "2021-11-02",
  },
  {
    jurisdictionSlug: "new-york-city",
    leaderName: "Eric Adams",
    termNumber: 1,
    categorySlug: "housing",
    title: "\"Get Stuff Built\" Housing Plan",
    description: "Streamline zoning and permitting to accelerate housing production citywide.",
    status: "in_progress",
    datePromised: "2023-09-21",
  },
  // Chicago — Brandon Johnson
  {
    jurisdictionSlug: "chicago",
    leaderName: "Brandon Johnson",
    termNumber: 1,
    categorySlug: "public-safety",
    title: "Establish Non-Police Crisis Response Teams",
    description: "Route a share of 911 mental-health calls to non-police crisis responders.",
    status: "in_progress",
    datePromised: "2023-02-01",
  },
  {
    jurisdictionSlug: "chicago",
    leaderName: "Brandon Johnson",
    termNumber: 1,
    categorySlug: "fiscal-health",
    title: "\"Bring Chicago Home\" Real Estate Transfer Tax",
    description: "Raise the transfer tax on high-value property sales to fund homelessness services.",
    status: "broken",
    datePromised: "2023-02-01",
  },
  // Minneapolis — Jacob Frey
  {
    jurisdictionSlug: "minneapolis",
    leaderName: "Jacob Frey",
    termNumber: 1,
    categorySlug: "housing",
    title: "Minneapolis 2040 Plan Implementation",
    description: "Eliminate single-family-only zoning citywide to expand housing supply.",
    status: "fulfilled",
    datePromised: "2018-06-01",
  },
  {
    jurisdictionSlug: "minneapolis",
    leaderName: "Jacob Frey",
    termNumber: 1,
    categorySlug: "public-safety",
    title: "Community-Led Public Safety Restructuring",
    description: "Build a public-health-oriented alternative response model alongside policing.",
    status: "stalled",
    datePromised: "2021-06-01",
  },
  // Seattle — Bruce Harrell
  {
    jurisdictionSlug: "seattle",
    leaderName: "Bruce Harrell",
    termNumber: 1,
    categorySlug: "housing",
    title: "\"One Seattle\" Housing Acceleration",
    description: "Speed up permitting and expand middle-density housing near transit.",
    status: "in_progress",
    datePromised: "2021-11-02",
  },
  {
    jurisdictionSlug: "seattle",
    leaderName: "Bruce Harrell",
    termNumber: 1,
    categorySlug: "government-capacity",
    title: "Downtown Activation Plan",
    description: "Modernize permitting and business licensing to speed downtown recovery.",
    status: "in_progress",
    datePromised: "2022-09-01",
  },
  // Washington, D.C. — Muriel Bowser (3rd term)
  {
    jurisdictionSlug: "washington-dc",
    leaderName: "Muriel Bowser",
    termNumber: 3,
    categorySlug: "housing",
    title: "Housing in the Pipeline Initiative",
    description: "Deliver 36,000 new housing units by 2025, a third of them affordable.",
    status: "in_progress",
    datePromised: "2019-03-01",
  },
  {
    jurisdictionSlug: "washington-dc",
    leaderName: "Muriel Bowser",
    termNumber: 3,
    categorySlug: "transit",
    title: "Vision Zero Streets Redesign",
    description: "Redesign high-injury corridors to eliminate traffic deaths.",
    status: "stalled",
    datePromised: "2015-02-01",
  },
  // Greater Manchester — Andy Burnham (3rd term)
  {
    jurisdictionSlug: "greater-manchester",
    leaderName: "Andy Burnham",
    termNumber: 3,
    categorySlug: "transit",
    title: "Complete the Bee Network Bus Franchising Rollout",
    description: "Bring all Greater Manchester bus routes under public control and single branding/fares.",
    status: "in_progress",
    datePromised: "2021-05-01",
  },
  {
    jurisdictionSlug: "greater-manchester",
    leaderName: "Andy Burnham",
    termNumber: 3,
    categorySlug: "housing",
    title: "Places for Everyone Spatial Framework",
    description: "Deliver a joint spatial development strategy across nine boroughs for brownfield-first housing.",
    status: "fulfilled",
    datePromised: "2016-11-01",
  },
];
