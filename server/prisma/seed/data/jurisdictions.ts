export interface JurisdictionSeedSpec {
  slug: string;
  name: string;
  kind: "city" | "metro_region";
  stateOrRegion: string | null;
  country: string;
  population: number;
  populationYear: number;
  latitude: number;
  longitude: number;
  summary: string;
  description: string;
  governanceModelSlug: string;
}

export const jurisdictions: JurisdictionSeedSpec[] = [
  {
    slug: "new-york-city",
    name: "New York City",
    kind: "city",
    stateOrRegion: "New York",
    country: "United States",
    population: 8_335_897,
    populationYear: 2022,
    latitude: 40.7128,
    longitude: -74.006,
    summary: "The largest U.S. city, with a large and organizationally significant DSA chapter shaping council and state-legislative races.",
    description:
      "New York City's municipal government spans five boroughs and roughly 8.3 million residents. The New York City chapter of the Democratic Socialists of America is among the largest and most electorally active in the country, having helped elect multiple state legislators and city council members, and, with Zohran Mamdani's 2025 mayoral victory, the mayoralty itself.",
    governanceModelSlug: "democratic-socialism",
  },
  {
    slug: "chicago",
    name: "Chicago",
    kind: "city",
    stateOrRegion: "Illinois",
    country: "United States",
    population: 2_665_039,
    populationYear: 2022,
    latitude: 41.8781,
    longitude: -87.6298,
    summary: "Elected a mayor in 2023 backed by the Chicago Teachers Union and DSA-aligned aldermen.",
    description:
      "Chicago elected Brandon Johnson, a former Chicago Teachers Union organizer, as mayor in 2023 with support from a coalition including CTU and several DSA-endorsed city council members, making it one of the clearest cases of municipal-left executive power in a major U.S. city.",
    governanceModelSlug: "democratic-socialism",
  },
  {
    slug: "minneapolis",
    name: "Minneapolis",
    kind: "city",
    stateOrRegion: "Minnesota",
    country: "United States",
    population: 429_954,
    populationYear: 2022,
    latitude: 44.9778,
    longitude: -93.265,
    summary: "Site of a high-profile 2021 ballot measure on public safety restructuring following the murder of George Floyd; DSA influence runs through the City Council and a serious 2025 mayoral primary challenge, not the sitting mayor.",
    description:
      "Minneapolis has had multiple DSA-endorsed city council members and was the site of a closely watched 2021 ballot measure to replace the police department with a Department of Public Safety, which voters rejected, making it a significant test case for public-safety-model reform proposals.",
    governanceModelSlug: "democratic-socialism",
  },
  {
    slug: "seattle",
    name: "Seattle",
    kind: "city",
    stateOrRegion: "Washington",
    country: "United States",
    population: 749_256,
    populationYear: 2022,
    latitude: 47.6062,
    longitude: -122.3321,
    summary: "Home to a long-serving DSA-endorsed city council member and an early municipal minimum-wage push; the 2026 mayor is a labor-progressive ally, not a DSA member.",
    description:
      "Seattle's city council included a DSA-endorsed member (Kshama Sawant) continuously from 2014-2023, and the city was an early mover on municipal minimum wage increases and business taxation debates that later shaped national progressive municipal policy discussions. Mayor Katie Wilson (took office Jan 2026) is frequently grouped in national coverage with DSA-affiliated mayors elsewhere, but Seattle DSA explicitly declined to endorse her and confirmed she is not a member — her actual coalition is a labor/tenant-advocacy alliance (Transit Riders Union, Working Families Party, building-trades and service-sector unions) adjacent to but organizationally distinct from DSA.",
    governanceModelSlug: "democratic-socialism",
  },
  {
    slug: "washington-dc",
    name: "Washington, D.C.",
    kind: "city",
    stateOrRegion: "District of Columbia",
    country: "United States",
    population: 671_803,
    populationYear: 2022,
    latitude: 38.9072,
    longitude: -77.0369,
    summary: "Growing DSA chapter influence on D.C. Council races amid a long-serving mayoral administration — a dynamic likely to change after the 2026 mayoral election.",
    description:
      "Washington, D.C.'s local DSA chapter (Metro DC DSA) has grown its influence on D.C. Council races and legislation, anchored by Ward 4 Councilmember Janeese Lewis George, a verified DSA member since 2018, even as the mayoralty has remained with a mainstream Democratic administration (Muriel Bowser, 2015-present, not seeking a fourth term). This illustrates a governance dynamic where movement influence has so far operated primarily through the legislative branch. That dynamic is likely to change: Lewis George won the June 2026 Democratic primary for mayor outright and, with no Republican on the ballot, is heavily favored to win the November 2026 general election, which would make D.C. the second jurisdiction in this governance model (after Chicago and New York City) with a DSA-affiliated chief executive. D.C.'s home-rule structure adds a jurisdiction-specific wrinkle not present elsewhere in this model: Council-passed legislation is subject to a congressional review period and can be — and in 2023 was — overridden by Congress, which affects how durably \"enacted\" should be read for this jurisdiction specifically.",
    governanceModelSlug: "democratic-socialism",
  },
  {
    slug: "greater-manchester",
    name: "Greater Manchester Combined Authority",
    kind: "metro_region",
    stateOrRegion: "North West England",
    country: "United Kingdom",
    population: 2_867_800,
    populationYear: 2021,
    latitude: 53.4808,
    longitude: -2.2426,
    summary: "England's leading devolved city-region, governed by ten boroughs under a directly elected Metro Mayor.",
    description:
      "Greater Manchester is a combined authority of ten metropolitan boroughs (including Manchester, Salford, Bolton, and Stockport) that pools strategic transport, housing, skills, and health powers under a directly elected Metro Mayor — the most advanced regional devolution settlement in England.",
    governanceModelSlug: "greater-manchester-devolution",
  },
  {
    slug: "durham-county",
    name: "Durham County Council",
    kind: "city",
    stateOrRegion: "North East England",
    country: "United Kingdom",
    population: 530_000,
    populationYear: 2023,
    latitude: 54.7761,
    longitude: -1.5733,
    summary: "A single-tier unitary authority in North East England, won outright by Reform UK in the May 2025 local elections.",
    description:
      "Durham County Council (ONS code E06000047) is a unitary authority covering roughly 530,000 residents, holding full single-tier local-government responsibility (education, adult and children's social care, highways, waste, and strategic planning, though not policing, which sits with a separately elected Police and Crime Commissioner, or local bus franchising, which sits with the North East Combined Authority's directly-elected Mayor). Reform UK won outright control in the May 2025 local elections, ending the prior administration and marking the party's first sustained governing record at full council scale. It was selected as Mandate's first Reform UK case study, over the more nationally publicized Clacton-on-Sea, because it is the structural type closest to how Mandate already profiles a U.S. city: one governing body with broad (if not total) service responsibility, under continuous, uncontested Reform control.",
    governanceModelSlug: "reform-uk",
  },
];
