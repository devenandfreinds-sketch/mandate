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
      "New York City's municipal government spans five boroughs and roughly 8.3 million residents. The New York City chapter of the Democratic Socialists of America is among the largest and most electorally active in the country, having helped elect multiple state legislators and city council members, though the mayoralty itself has been held by mainstream Democratic administrations.",
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
    summary: "Site of a high-profile 2021 ballot measure on public safety restructuring following the murder of George Floyd.",
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
    summary: "Home to a long-serving DSA-endorsed city council member and an early municipal minimum-wage push.",
    description:
      "Seattle's city council has included DSA-endorsed members holding a council seat continuously since 2014, and the city was an early mover on municipal minimum wage increases and business taxation debates that later shaped national progressive municipal policy discussions.",
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
    summary: "Growing DSA chapter influence on D.C. Council races amid a long-serving mayoral administration.",
    description:
      "Washington, D.C.'s local DSA chapter has grown its influence on D.C. Council races and ballot initiatives even as the mayoralty has remained with a mainstream Democratic administration, illustrating a governance dynamic where movement influence operates primarily through the legislative branch.",
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
];
