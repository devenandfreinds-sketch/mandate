export interface CorePrioritySeedSpec {
  title: string;
  description: string;
  sortOrder: number;
}

export interface GovernanceModelSeedSpec {
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  overview: string;
  history: string;
  politicalContext: string;
  foundedYear: number;
  colorHex: string;
  corePriorities: CorePrioritySeedSpec[];
}

export const governanceModels: GovernanceModelSeedSpec[] = [
  {
    slug: "democratic-socialism",
    name: "Democratic Socialism",
    shortName: "DSA-Aligned Cities",
    summary:
      "U.S. municipal administrations elected with support from democratic socialist and left-progressive electoral coalitions since the mid-2010s.",
    overview:
      "This governance model tracks cities where democratic socialist and left-progressive organizing has meaningfully shaped municipal governance — through elected officials, ballot initiatives, or coalition pressure on incumbent administrations. It is used here purely as a comparative grouping for measuring governance outcomes, not as a claim about any individual official's personal political identification.",
    history:
      "Following the 2016 and 2020 Bernie Sanders presidential campaigns and the 2018 election of Alexandria Ocasio-Cortez, membership in the Democratic Socialists of America grew sharply, and DSA-endorsed or DSA-aligned candidates began winning city council seats and, in some cases, the mayoralty in cities including Chicago and Minneapolis. This model groups jurisdictions where that broader municipal-left movement has been electorally significant since roughly 2018.",
    politicalContext:
      "Typical coalitions combine organized labor (particularly public-sector and service unions), tenant organizing groups, racial justice movements, and younger progressive voters. Governing priorities commonly emphasize tenant protections, public transit investment, alternatives to traditional policing, and progressive taxation, though the specific mix and level of institutional follow-through varies significantly by city.",
    foundedYear: 2018,
    colorHex: "#dc2626",
    corePriorities: [
      {
        title: "Tenant Protections & Affordable Housing",
        description: "Rent stabilization, eviction defense, and public/social housing investment.",
        sortOrder: 0,
      },
      {
        title: "Public Transit & Infrastructure Investment",
        description: "Expanding public transit access and reducing car dependency.",
        sortOrder: 1,
      },
      {
        title: "Alternative Public Safety Models",
        description: "Community-based crisis response and reinvestment in violence prevention.",
        sortOrder: 2,
      },
      {
        title: "Progressive Revenue & Fiscal Policy",
        description: "Shifting municipal revenue toward corporate, high-income, and vacancy taxes.",
        sortOrder: 3,
      },
    ],
  },
  {
    slug: "greater-manchester-devolution",
    name: "Greater Manchester Devolution",
    shortName: "Manchesterism",
    summary:
      "England's most advanced regional devolution settlement, combining ten local authorities under a directly elected Metro Mayor with devolved transport, skills, and housing powers.",
    overview:
      "Greater Manchester operates under a combined-authority devolution model unique in England: ten historically independent local councils pool strategic powers under a directly elected Metro Mayor, enabling region-wide coordination on transport, housing, and skills that individual boroughs could not achieve alone. This model tracks that institution's measurable outputs as a distinct comparative case.",
    history:
      "The 2014 Greater Manchester Agreement created the combined authority and paved the way for the 2017 devolution deal, which introduced a directly elected Metro Mayor — a role won by Andy Burnham in the inaugural 2017 election. Subsequent 'Trailblazer' devolution agreements (from 2023) extended devolved control over additional funding streams, including an integrated transport settlement and single funding pot.",
    politicalContext:
      "The combined authority spans boroughs governed by multiple parties, though it has been Labour-led at the mayoral level since inception. Governance emphasizes cross-party and cross-borough coordination, partnership with the Greater Manchester Chamber of Commerce and other business bodies, and a franchised, London-style public transport model (the Bee Network) as a flagship institutional achievement.",
    foundedYear: 2017,
    colorHex: "#0891b2",
    corePriorities: [
      {
        title: "Integrated Public Transport (Bee Network)",
        description: "Franchised bus, tram, and rail integration under single fares and branding.",
        sortOrder: 0,
      },
      {
        title: "Housing & Brownfield Regeneration",
        description: "Region-wide spatial framework and brownfield-first housing delivery.",
        sortOrder: 1,
      },
      {
        title: "Skills Devolution",
        description: "Devolved adult education budget and employer-facing skills programs.",
        sortOrder: 2,
      },
      {
        title: "Health & Social Care Integration",
        description: "Joint working across NHS and local authority health and care budgets.",
        sortOrder: 3,
      },
    ],
  },
];
