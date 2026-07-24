/**
 * New York City — sixth U.S. jurisdiction with real Institutional Pipeline research (see
 * chicagoResearchedPipeline.ts for the pattern this follows), and the strongest-evidenced DSA
 * affiliation of any jurisdiction in this governance model: Mayor Zohran Mamdani (took office
 * January 2026) is a verified, self-identified DSA member, formally endorsed by NYC-DSA, who has
 * called the chapter "his political home" — confirmed on multiple independent levels, not merely a
 * media framing (contrast with Seattle, where the equivalent claim does NOT hold up).
 *
 * Notably, DSA's relationship with Mamdani is not uncritical: NYC-DSA publicly broke with him in
 * June 2026 over an NYPD headcount increase in the FY2027 budget, describing it as running "counter
 * to the values of the socialist and working-class movement that elected him" — evidence the chapter
 * functions as an independent political actor, cited in the relevant assessment below.
 *
 * Assessments below are scored at the jurisdiction+policy-area level (an institution's real state
 * today, spanning administrations), consistent with Chicago's multi-mayor pipeline. Two categories
 * genuinely reach a high stage on evidence that predates or is independent of Mamdani specifically
 * (HPD/HDC affordable housing production; B-HEARD alternative crisis response) — this is flagged
 * explicitly in each assessment's evidenceSummary/limitations rather than conflated with Mamdani's
 * own new initiatives, most of which (per the 7-month-old administration) remain at early stages.
 *
 * "affordable-housing-institution" reaches stage 5: HPD/HDC set consecutive production records in
 * FY2024 (25,266 units) and FY2025 (28,281 units) — real, multi-year, improving output from a
 * long-standing institution, on top of which Mamdani's new "Block by Block" plan and RFQ-based
 * fast-track mechanisms are still in the developer-selection phase (too new to move the stage
 * further, noted as a limitation).
 */
import type { ResearchedPipelineAssessmentSpec } from "./chicagoResearchedPipeline.js";

export const newYorkCityResearchedPipelineAssessments: ResearchedPipelineAssessmentSpec[] = [
  {
    jurisdictionSlug: "new-york-city",
    policyAreaSlug: "affordable-housing-institution",
    stage: 5,
    dataQuality: "government",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "HPD/HDC, New York City's long-standing affordable-housing finance and production institution, set consecutive annual production records: 25,266 units financed in FY2024 (the highest on record at the time) and 28,281 units in FY2025 — real, credible, multi-year improving-output evidence, independent of any single mayor.",
    limitations:
      "Mayor Mamdani's own 'Block by Block' plan (May 2026, 200,000 units/10 years, ~$5B capital) and the Neighborhood Builders Fast Track RFQ remain in the site-identification/developer-selection phase, with no completed unit yet attributable to these new mechanisms — the stage-5 finding rests on the pre-existing HPD/HDC institution's output trend, not on Mamdani-era initiatives specifically.",
    evidenceLinks: [
      {
        label: "NYC Housing Production Snapshot",
        description: "DCP's annual accounting of housing completions and HPD-financed unit production.",
        url: "https://www.nyc.gov/assets/planning/download/pdf/planning-level/housing-economy/2023-nyc-housing-production-snapshot.pdf",
        evidenceType: "dataset",
        publicationDate: null,
        publisher: "NYC Department of City Planning",
        sourceTier: "government",
        sourceKey: "nyc_dcp_housing_snapshot",
      },
      {
        label: "Mayor Mamdani — 'Block by Block' housing plan",
        description: "The current administration's own new housing production plan, still in early implementation.",
        url: "https://www.nyc.gov/mayors-office/news/2026/05/mayor-mamdani-releases--block-by-block--the-housing-plan-for-a-n",
        evidenceType: "policy_document",
        publicationDate: "2026-05-01",
        publisher: "Office of the Mayor of New York City",
        sourceTier: "government",
        sourceKey: "nyc_mayors_office",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "new-york-city",
    policyAreaSlug: "alternative-crisis-response",
    stage: 3,
    dataQuality: "government",
    assessmentDate: "2026-03-19",
    isCurrent: true,
    evidenceSummary:
      "Executive Order 15 (March 19, 2026) created the Office of Community Safety, coordinating the pre-existing B-HEARD program with the Neighborhood Safety, Gun Violence Prevention, and Hate Crimes offices under a deputy mayor, with stated plans to expand B-HEARD citywide and add peer counselors.",
    limitations:
      "The new coordinating office is staffed with only a deputy mayor and one staffer so far and has not itself produced independent operating output — B-HEARD precinct coverage remains 31 of 78 precincts as of this research date. Independent sources (NYC IBO vs. NYPD leadership testimony) give conflicting B-HEARD response-rate figures (22% vs. roughly 8%), a real discrepancy this assessment does not attempt to resolve; NYC IBO's own precinct-level data shows a declining response-rate trend for the underlying B-HEARD program, which counts as evidence against, not for, a higher stage for the pipeline as a whole.",
    evidenceLinks: [
      {
        label: "NYC IBO — B-HEARD precinct-level data",
        description: "Independent Budget Office analysis of B-HEARD response rates by precinct, showing a declining trend.",
        url: "https://www.ibo.nyc.gov/assets/ibo/downloads/pdf/public-safety/2026/2026-january-bheard-a-look-at-precinct-level-data.pdf",
        evidenceType: "report",
        publicationDate: "2026-01-01",
        publisher: "New York City Independent Budget Office",
        sourceTier: "government",
        sourceKey: "nyc_ibo",
      },
    ],
    legislation: {
      title: "Executive Order 15: Office of Community Safety",
      billNumber: "EO 15",
      status: "enacted",
      dateEnacted: "2026-03-19",
      url: "https://www.nyc.gov/mayors-office/news",
      sourceKey: "nyc_mayors_office",
    },
  },
  {
    jurisdictionSlug: "new-york-city",
    policyAreaSlug: "progressive-revenue-institution",
    stage: 2,
    dataQuality: "government",
    assessmentDate: "2026-05-28",
    isCurrent: true,
    evidenceSummary:
      "New York State's FY2026-27 budget (signed May 28, 2026) created a Pied-a-Terre Tax on NYC non-primary residences valued at $5 million or more (projected at roughly $500 million/year, effective July 1, 2026, sunsetting 2031) — a real, legally-binding revenue mechanism, administered through existing state/city tax apparatus with no new dedicated agency created.",
    limitations:
      "Mamdani's marquee campaign proposal — a 2% surtax on income over $1 million plus a corporate tax increase — did not pass the state legislature at all, the clearest illustration of the Albany bottleneck that constrains all NYC fiscal policy of this kind: the city cannot unilaterally enact this category of tax. The pied-a-terre tax is real but is a narrower consolation measure, not the institution Mamdani campaigned on, so this is scored conservatively at stage 2 (enacted, no dedicated collection institution) rather than higher.",
    evidenceLinks: [
      {
        label: "Holland & Knight — New York State enacts Pied-a-Terre Tax",
        description: "Legal analysis of the enacted pied-a-terre tax's scope, rate, and effective date.",
        url: "https://www.hklaw.com/en/insights/publications/2026/06/new-york-state-enacts-pied-a-terre-tax",
        evidenceType: "report",
        publicationDate: "2026-06-01",
        publisher: "Holland & Knight",
        sourceTier: "alternative",
        sourceKey: "city_state_ny",
      },
      {
        label: "City & State NY — what Mamdani got and didn't get in Albany",
        description: "Coverage of the failed millionaire's-tax proposal alongside the enacted pied-a-terre tax.",
        url: "https://www.cityandstateny.com/policy/2026/06/what-mamdani-got-and-didnt-get-albany-year/414015/",
        evidenceType: "news_article",
        publicationDate: "2026-06-01",
        publisher: "City & State NY",
        sourceTier: "news",
        sourceKey: "city_state_ny",
      },
    ],
    legislation: {
      title: "FY2026-27 New York State Budget — Pied-a-Terre Tax",
      billNumber: null,
      status: "enacted",
      dateEnacted: "2026-05-28",
      url: "https://www.hklaw.com/en/insights/publications/2026/06/new-york-state-enacts-pied-a-terre-tax",
      sourceKey: "city_state_ny",
    },
  },
  {
    jurisdictionSlug: "new-york-city",
    policyAreaSlug: "transit-expansion-program",
    stage: 1,
    dataQuality: "government",
    assessmentDate: "2026-07-08",
    isCurrent: true,
    evidenceSummary:
      "Mayor Mamdani and Governor Hochul jointly announced an $882 million 'fast buses' plan (July 8, 2026) covering 50 corridors with a 20% speed-improvement target — a real, funded proposal, not yet under construction.",
    limitations:
      "Mamdani's separate campaign promise of free/fare-free buses has been explicitly walked back (conceded in April 2026 as unaffordable this term, at an estimated $700M-1B/year, and outside city control since the MTA sets fares) — scored as stage 0 for that specific promise and not folded into this assessment. The fast-buses plan itself remains at the funded-proposal stage (stage 1), with no corridor yet built.",
    evidenceLinks: [
      {
        label: "NYC Mayor's Office — Mamdani/Hochul fast buses plan",
        description: "Joint announcement of the $882 million bus-speed improvement plan.",
        url: "https://www.nyc.gov/mayors-office/news/2026/07/mayor-mamdani-and-governor-hochul-unveil-historic-plan-to-build-",
        evidenceType: "policy_document",
        publicationDate: "2026-07-08",
        publisher: "Office of the Mayor of New York City",
        sourceTier: "government",
        sourceKey: "nyc_mayors_office",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "new-york-city",
    policyAreaSlug: "workforce-development-institution",
    stage: 3,
    dataQuality: "government",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "The 'Made in NY' Academy (CUNY media/entertainment training, launched June 2026) and the GROW green-jobs pilot ($4.5M with The Doe Fund, April 2026) are real, funded new programs, alongside the pre-existing Workforce1 system (250,000+ served since 2021).",
    limitations:
      "The new Mamdani-era pilots are only weeks-to-months old with no placement or completion data yet; Workforce1's own longer-running data shows no clear multi-year improving trend. A proposed 'Workforce Czar'/Economic Mobility Cabinet has not been established.",
    evidenceLinks: [
      {
        label: "NYC Mayor's Office — GROW green-jobs pilot",
        description: "Announcement of the GROW pilot with The Doe Fund.",
        url: "https://www.nyc.gov/mayors-office/news/2026/04/mamdani-administration-launches--4-5-million-pilot-with-the-doe-",
        evidenceType: "policy_document",
        publicationDate: "2026-04-01",
        publisher: "Office of the Mayor of New York City",
        sourceTier: "government",
        sourceKey: "nyc_mayors_office",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "new-york-city",
    policyAreaSlug: "permitting-modernization",
    stage: 1,
    dataQuality: "government",
    assessmentDate: "2026-07-21",
    isCurrent: true,
    evidenceSummary:
      "The mayoral Commission on Government Efficiency released five ballot proposals (July 21, 2026), including DOB commissioner delegation authority and a unified digital permit hub spanning 40 permit types across 18 agencies.",
    limitations:
      "These are charter-revision ballot measures requiring voter ratification in November 2026 — not yet binding law, so scored conservatively at stage 1 (formal proposal) rather than stage 2.",
    evidenceLinks: [
      {
        label: "NYC Mayor's Office — Commission on Government Efficiency final report",
        description: "The five ballot proposals for permitting and procurement reform.",
        url: "https://www.nyc.gov/mayors-office/news/2026/07/coge-releases-5-ballot-proposals-and-final-report-to-make-govern",
        evidenceType: "policy_document",
        publicationDate: "2026-07-21",
        publisher: "Office of the Mayor of New York City",
        sourceTier: "government",
        sourceKey: "nyc_mayors_office",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "new-york-city",
    policyAreaSlug: "public-innovation-investment",
    stage: 1,
    dataQuality: "estimated",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "The NYC Future Fund was expanded to $80 million (small-business lending, not equity/startup investment) and a $20 million municipal deposit was placed in Ponce Bank using an existing Banking Development District program; a state Public Banking Act Mamdani co-sponsors remains unenacted.",
    limitations:
      "This category is a poor fit for NYC's actual 'public ownership' agenda: Mamdani's signature ideas (public banking, municipal grocery stores) are financial-utility/retail concepts, not a startup-investment vehicle. Scored at a low stage reflecting the weak categorical fit rather than a genuine absence of activity — see the taxonomy-gap discussion in the master report.",
    evidenceLinks: [],
    legislation: null,
  },
];
