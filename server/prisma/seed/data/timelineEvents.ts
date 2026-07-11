export interface TimelineEventSeedSpec {
  scope: "governanceModel" | "jurisdiction";
  slug: string; // governanceModelSlug or jurisdictionSlug depending on scope
  eventDate: string;
  title: string;
  description: string;
  eventType: "election" | "legislation" | "program_launch" | "milestone";
}

export const timelineEvents: TimelineEventSeedSpec[] = [
  // Democratic Socialism — governance-model level
  {
    scope: "governanceModel",
    slug: "democratic-socialism",
    eventDate: "2016-02-01",
    title: "Bernie Sanders 2016 Campaign Fuels DSA Membership Growth",
    description: "National DSA membership grows from roughly 6,000 to over 25,000 within two years.",
    eventType: "milestone",
  },
  {
    scope: "governanceModel",
    slug: "democratic-socialism",
    eventDate: "2018-06-26",
    title: "Alexandria Ocasio-Cortez Wins NY-14 Primary",
    description: "A DSA-backed primary win raises the national profile of democratic-socialist electoral organizing.",
    eventType: "election",
  },
  {
    scope: "governanceModel",
    slug: "democratic-socialism",
    eventDate: "2021-11-02",
    title: "Minneapolis Public Safety Ballot Measure Rejected",
    description: "Voters reject a measure to replace the police department with a Department of Public Safety.",
    eventType: "election",
  },
  {
    scope: "governanceModel",
    slug: "democratic-socialism",
    eventDate: "2023-04-04",
    title: "Brandon Johnson Elected Mayor of Chicago",
    description: "A CTU-backed, DSA-supported candidate wins a major-city mayoralty for the first time.",
    eventType: "election",
  },
  // Greater Manchester — governance-model level
  {
    scope: "governanceModel",
    slug: "greater-manchester-devolution",
    eventDate: "2014-11-03",
    title: "Greater Manchester Agreement Signed",
    description: "Ten local authorities agree to form a combined authority with a directly elected mayor.",
    eventType: "legislation",
  },
  {
    scope: "governanceModel",
    slug: "greater-manchester-devolution",
    eventDate: "2017-05-04",
    title: "First Greater Manchester Mayoral Election",
    description: "Andy Burnham is elected as the first Metro Mayor of Greater Manchester.",
    eventType: "election",
  },
  {
    scope: "governanceModel",
    slug: "greater-manchester-devolution",
    eventDate: "2021-03-24",
    title: "Bee Network Bus Franchising Announced",
    description: "Greater Manchester becomes the first English region outside London to franchise its bus network.",
    eventType: "legislation",
  },
  {
    scope: "governanceModel",
    slug: "greater-manchester-devolution",
    eventDate: "2023-03-16",
    title: "Trailblazer Devolution Deal Agreed",
    description: "Greater Manchester and the UK government agree an expanded single-settlement devolution deal.",
    eventType: "legislation",
  },
  // Jurisdiction-level
  {
    scope: "jurisdiction",
    slug: "chicago",
    eventDate: "2023-04-04",
    title: "Brandon Johnson Wins Runoff Election",
    description: "Johnson defeats Paul Vallas in a closely watched mayoral runoff.",
    eventType: "election",
  },
  {
    scope: "jurisdiction",
    slug: "minneapolis",
    eventDate: "2018-12-07",
    title: "Minneapolis 2040 Plan Adopted",
    description: "City council adopts a comprehensive plan eliminating single-family-only zoning citywide.",
    eventType: "legislation",
  },
  {
    scope: "jurisdiction",
    slug: "greater-manchester",
    eventDate: "2023-09-24",
    title: "First Bee Network Bus Routes Launch",
    description: "The first franchised, publicly controlled bus routes begin operating under Bee Network branding.",
    eventType: "program_launch",
  },
  {
    scope: "jurisdiction",
    slug: "new-york-city",
    eventDate: "2023-09-21",
    title: "\"Get Stuff Built\" Housing Plan Announced",
    description: "The Adams administration announces a package of zoning and permitting reforms to accelerate housing production.",
    eventType: "program_launch",
  },
];
