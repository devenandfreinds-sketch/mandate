export interface AdministrationSeedSpec {
  jurisdictionSlug: string;
  leaderName: string;
  leaderTitle: string;
  politicalParty: string | null;
  coalitionDescription: string;
  termNumber: number;
  startDate: string;
  endDate: string | null;
}

export const administrations: AdministrationSeedSpec[] = [
  // New York City
  {
    jurisdictionSlug: "new-york-city",
    leaderName: "Bill de Blasio",
    leaderTitle: "Mayor",
    politicalParty: "Democratic",
    coalitionDescription: "Labor unions, tenant advocacy groups, and outer-borough Democratic organizations.",
    termNumber: 1,
    startDate: "2014-01-01",
    endDate: "2021-12-31",
  },
  {
    jurisdictionSlug: "new-york-city",
    leaderName: "Eric Adams",
    leaderTitle: "Mayor",
    politicalParty: "Democratic",
    coalitionDescription: "Public-safety-focused Democratic coalition with outer-borough and law-enforcement support.",
    termNumber: 1,
    startDate: "2022-01-01",
    endDate: null,
  },
  // Chicago
  {
    jurisdictionSlug: "chicago",
    leaderName: "Rahm Emanuel",
    leaderTitle: "Mayor",
    politicalParty: "Democratic",
    coalitionDescription: "Business-aligned Democratic coalition (nonpartisan office).",
    termNumber: 1,
    startDate: "2011-05-16",
    endDate: "2019-05-20",
  },
  {
    jurisdictionSlug: "chicago",
    leaderName: "Lori Lightfoot",
    leaderTitle: "Mayor",
    politicalParty: "Democratic",
    coalitionDescription: "Reform-oriented coalition (nonpartisan office).",
    termNumber: 1,
    startDate: "2019-05-20",
    endDate: "2023-05-15",
  },
  {
    jurisdictionSlug: "chicago",
    leaderName: "Brandon Johnson",
    leaderTitle: "Mayor",
    politicalParty: "Democratic",
    coalitionDescription: "Chicago Teachers Union and DSA-aligned aldermanic coalition (nonpartisan office).",
    termNumber: 1,
    startDate: "2023-05-15",
    endDate: null,
  },
  // Minneapolis
  {
    jurisdictionSlug: "minneapolis",
    leaderName: "Betsy Hodges",
    leaderTitle: "Mayor",
    politicalParty: "DFL",
    coalitionDescription: "Minnesota Democratic-Farmer-Labor coalition.",
    termNumber: 1,
    startDate: "2014-01-02",
    endDate: "2018-01-02",
  },
  {
    jurisdictionSlug: "minneapolis",
    leaderName: "Jacob Frey",
    leaderTitle: "Mayor",
    politicalParty: "DFL",
    coalitionDescription: "Minnesota Democratic-Farmer-Labor coalition.",
    termNumber: 1,
    startDate: "2018-01-02",
    endDate: null,
  },
  // Seattle
  {
    jurisdictionSlug: "seattle",
    leaderName: "Jenny Durkan",
    leaderTitle: "Mayor",
    politicalParty: "Democratic",
    coalitionDescription: "Business-aligned Democratic coalition (nonpartisan office).",
    termNumber: 1,
    startDate: "2018-01-01",
    endDate: "2022-01-01",
  },
  {
    jurisdictionSlug: "seattle",
    leaderName: "Bruce Harrell",
    leaderTitle: "Mayor",
    politicalParty: "Democratic",
    coalitionDescription: "Broad Democratic coalition (nonpartisan office).",
    termNumber: 1,
    startDate: "2022-01-01",
    endDate: null,
  },
  // Washington, D.C.
  {
    jurisdictionSlug: "washington-dc",
    leaderName: "Muriel Bowser",
    leaderTitle: "Mayor",
    politicalParty: "Democratic",
    coalitionDescription: "Ward-based Democratic coalition.",
    termNumber: 1,
    startDate: "2015-01-02",
    endDate: "2019-01-02",
  },
  {
    jurisdictionSlug: "washington-dc",
    leaderName: "Muriel Bowser",
    leaderTitle: "Mayor",
    politicalParty: "Democratic",
    coalitionDescription: "Ward-based Democratic coalition.",
    termNumber: 2,
    startDate: "2019-01-02",
    endDate: "2023-01-02",
  },
  {
    jurisdictionSlug: "washington-dc",
    leaderName: "Muriel Bowser",
    leaderTitle: "Mayor",
    politicalParty: "Democratic",
    coalitionDescription: "Ward-based Democratic coalition.",
    termNumber: 3,
    startDate: "2023-01-02",
    endDate: null,
  },
  // Greater Manchester
  {
    jurisdictionSlug: "greater-manchester",
    leaderName: "Andy Burnham",
    leaderTitle: "Metro Mayor",
    politicalParty: "Labour",
    coalitionDescription: "Cross-borough combined authority coalition, Labour-led.",
    termNumber: 1,
    startDate: "2017-05-08",
    endDate: "2021-05-07",
  },
  {
    jurisdictionSlug: "greater-manchester",
    leaderName: "Andy Burnham",
    leaderTitle: "Metro Mayor",
    politicalParty: "Labour",
    coalitionDescription: "Cross-borough combined authority coalition, Labour-led.",
    termNumber: 2,
    startDate: "2021-05-07",
    endDate: "2024-05-07",
  },
  {
    jurisdictionSlug: "greater-manchester",
    leaderName: "Andy Burnham",
    leaderTitle: "Metro Mayor",
    politicalParty: "Labour",
    coalitionDescription: "Cross-borough combined authority coalition, Labour-led.",
    termNumber: 3,
    startDate: "2024-05-07",
    endDate: null,
  },
];
