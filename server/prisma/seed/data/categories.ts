export interface CategorySeedSpec {
  slug: string;
  name: string;
  description: string;
  icon: string;
  colorHex: string;
  sortOrder: number;
}

export const categories: CategorySeedSpec[] = [
  {
    slug: "housing",
    name: "Housing",
    description: "Permitting, construction, affordability, and vacancy trends across the housing pipeline.",
    icon: "home",
    colorHex: "#2563eb",
    sortOrder: 0,
  },
  {
    slug: "innovation",
    name: "Innovation",
    description: "Venture investment, business formation, patents, and technology/life-sciences employment.",
    icon: "lightbulb",
    colorHex: "#7c3aed",
    sortOrder: 1,
  },
  {
    slug: "workforce",
    name: "Workforce",
    description: "Employment, wages, labor force participation, and skills training.",
    icon: "briefcase",
    colorHex: "#0891b2",
    sortOrder: 2,
  },
  {
    slug: "government-capacity",
    name: "Government Capacity",
    description: "Permitting speed, procurement timelines, agency staffing, and digital service delivery.",
    icon: "building",
    colorHex: "#ca8a04",
    sortOrder: 3,
  },
  {
    slug: "transit",
    name: "Transit",
    description: "Ridership, reliability, commute times, and active/public transportation infrastructure.",
    icon: "train",
    colorHex: "#16a34a",
    sortOrder: 4,
  },
  {
    slug: "public-safety",
    name: "Public Safety",
    description: "Crime rates, clearance rates, and emergency response performance.",
    icon: "shield",
    colorHex: "#dc2626",
    sortOrder: 5,
  },
  {
    slug: "fiscal-health",
    name: "Fiscal Health",
    description: "Budget balance, debt burden, pension funding, bond ratings, and capital investment.",
    icon: "landmark",
    colorHex: "#4338ca",
    sortOrder: 6,
  },
];
