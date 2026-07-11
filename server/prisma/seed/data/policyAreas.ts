export interface PolicyAreaSeedSpec {
  categorySlug: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
}

export const policyAreas: PolicyAreaSeedSpec[] = [
  {
    categorySlug: "housing",
    slug: "affordable-housing-institution",
    name: "Affordable Housing Production Institution",
    description: "A durable institutional capacity (agency, fund, or mandate) for producing below-market-rate housing.",
    sortOrder: 0,
  },
  {
    categorySlug: "innovation",
    slug: "public-innovation-investment",
    name: "Public Innovation & Startup Investment Vehicle",
    description: "A public or quasi-public fund or program supporting local startup and R&D activity.",
    sortOrder: 1,
  },
  {
    categorySlug: "workforce",
    slug: "workforce-development-institution",
    name: "Workforce Development Institution",
    description: "A standing institution coordinating skills training and job placement pipelines.",
    sortOrder: 2,
  },
  {
    categorySlug: "government-capacity",
    slug: "permitting-modernization",
    name: "Permitting & Procurement Modernization",
    description: "Digital and process reforms to permitting, licensing, and procurement systems.",
    sortOrder: 3,
  },
  {
    categorySlug: "transit",
    slug: "transit-expansion-program",
    name: "Transit Network Expansion Program",
    description: "A funded, institutionalized program for expanding or integrating public transit.",
    sortOrder: 4,
  },
  {
    categorySlug: "public-safety",
    slug: "alternative-crisis-response",
    name: "Alternative Crisis Response Program",
    description: "A non-police response capacity for mental health and low-risk emergency calls.",
    sortOrder: 5,
  },
  {
    categorySlug: "fiscal-health",
    slug: "progressive-revenue-institution",
    name: "Progressive Revenue Institution",
    description: "A durable revenue mechanism (tax, fee, or fund) targeting higher-income or corporate sources.",
    sortOrder: 6,
  },
];
