/**
 * Chicago is the pilot jurisdiction for real Institutional Pipeline research (see docs on the
 * Pipeline Detail Page / methodology page). This file replaces the synthetic PRNG-generated
 * assessment for specific (jurisdiction, policyArea) pairs with real, cited research.
 *
 * "affordable-housing-institution" — two assessments:
 *   2021-10-01  stage 2  Legislation Enacted / Formally Adopted   (ARO 2021 amendment)
 *   2026-07-21  stage 4  Operating with Observable Outputs        (DOH Annual Report production data)
 *
 * Stage 5 ("Measurable Outputs Demonstrating Improvement") is deliberately NOT claimed: DOH's own
 * annual production figures fluctuate year to year rather than show a clean improving trend, so
 * "producing results" is not yet supported by the evidence on hand.
 *
 * "transit-expansion-program" — nine assessments spanning 2018-2026 (see the approved research
 * memo). Deliberately scored at the PIPELINE level, not the flagship-project level: even though
 * two individual projects (RPM Phase One, the Chicago Avenue bus lane) reached "operating with
 * observable outputs" status, the overall institutional pipeline is scored stage 3 throughout —
 * per the approved methodology, a single completed project does not by itself elevate the
 * composite pipeline's score, since RPM's own Phase Two remains an unfunded proposal, most planned
 * bus corridors remain in study, the flagship Red Line Extension is still under construction, and
 * NITA has not yet begun operating. Stage 4/5 are deliberately NOT claimed for the same reason.
 *
 * The other 5 Chicago policy areas remain the synthetic placeholder generator's output — they are
 * NOT researched, and continue to be marked isPlaceholder/dataQuality: "placeholder" accordingly.
 */

export interface ResearchedPipelineAssessmentSpec {
  jurisdictionSlug: string;
  policyAreaSlug: string;
  stage: number;
  dataQuality: string;
  assessmentDate: string;
  isCurrent: boolean;
  evidenceSummary: string;
  limitations: string | null;
  evidenceLinks: Array<{
    label: string;
    description: string;
    url: string;
    evidenceType: string;
    publicationDate: string | null;
    publisher: string;
    sourceTier: string;
    sourceKey: string | null;
  }>;
  legislation: {
    title: string;
    billNumber: string | null;
    status: string;
    dateEnacted: string | null;
    url: string | null;
    sourceKey: string | null;
  } | null;
}

export const chicagoResearchedPipelineAssessments: ResearchedPipelineAssessmentSpec[] = [
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "affordable-housing-institution",
    stage: 2,
    dataQuality: "government",
    assessmentDate: "2021-10-01",
    isCurrent: false,
    evidenceSummary:
      "Chicago's inclusionary housing requirement was formally re-enacted and strengthened via the 2021 Affordable Requirements Ordinance amendment, legally requiring affordable units in qualifying developments.",
    limitations:
      "This assessment covers only the legal-enactment milestone; it does not by itself establish that a dedicated production institution was newly created (Chicago's Department of Housing already existed prior to this ordinance).",
    evidenceLinks: [],
    legislation: {
      title: "Affordable Requirements Ordinance (2021 Amendment)",
      billNumber: "Municipal Code of Chicago Ch. 2-44-085",
      status: "enacted",
      dateEnacted: "2021-10-01",
      url: "https://www.chicago.gov/city/en/sites/affordable-requirements-ordinance/home.html",
      sourceKey: "chicago_aro",
    },
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "affordable-housing-institution",
    stage: 4,
    dataQuality: "estimated",
    assessmentDate: "2026-07-21",
    isCurrent: true,
    evidenceSummary:
      "The Chicago Department of Housing is an established institution administering the Affordable Requirements Ordinance and Low-Income Housing Tax Credit allocation, and publishes annual production figures showing the program is actively operating and producing housing units. Whether output is durably improving over time is not yet established (see limitations).",
    limitations:
      "Observable-output evidence (units produced per year) comes from DOH's own Annual Report, which presents this only as a chart with no accompanying data table — figures were extracted by measuring bar height, not read from exact published digits (see the chicago_doh_annual_report Source's methodology). Production also fluctuates year to year rather than showing a clean improving trend, so this assessment does not claim stage 5 (measurable, improving results). The most recent DOH Annual Report edition available covers only through 2022; a newer edition would be needed to confirm the institution's current-year output.",
    evidenceLinks: [
      {
        label: "Affordable Requirements Ordinance — official program page",
        description:
          "City of Chicago's official ARO page, confirming the ordinance is in active effect and administered by the Department of Housing.",
        url: "https://www.chicago.gov/city/en/sites/affordable-requirements-ordinance/home.html",
        evidenceType: "dataset",
        publicationDate: null,
        publisher: "City of Chicago Department of Housing",
        sourceTier: "government",
        sourceKey: "chicago_aro",
      },
      {
        label: "Chicago DOH Annual Report — total affordable units produced per year",
        description:
          "Department of Housing's own annual report shows total affordable multi-family units produced per year, 2014-2022, by Area Median Income band — the clearest available evidence that the institution is operating and producing observable output.",
        url: "https://www.chicago.gov/content/dam/city/depts/doh/plans/Annual%20Report%20Final%208.29.23.pdf",
        evidenceType: "report",
        publicationDate: "2023-08-29",
        publisher: "City of Chicago Department of Housing",
        sourceTier: "government",
        sourceKey: "chicago_doh_annual_report",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "transit-expansion-program",
    stage: 1,
    dataQuality: "estimated",
    assessmentDate: "2018-01-26",
    isCurrent: false,
    evidenceSummary:
      "CTA announced the Locally Preferred Alignment for the Red Line Extension (95th Street to 130th Street), the formal planning step preceding environmental review and funding.",
    limitations: "A planning/alignment decision, not yet a legal approval, funding commitment, or institutional creation.",
    evidenceLinks: [],
    legislation: null,
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "transit-expansion-program",
    stage: 3,
    dataQuality: "estimated",
    assessmentDate: "2019-10-02",
    isCurrent: false,
    evidenceSummary:
      "Construction began on Red & Purple Modernization Phase One, a $2.1B rebuild of the North Red/Purple Line — the ecosystem's first clear evidence of a funded, staffed program under active execution, even though the flagship new-mileage project (RLE) was still only at the planning stage.",
    limitations: "RPM rebuilds and adds capacity to an existing line; it does not itself add new route-miles.",
    evidenceLinks: [
      {
        label: "Red & Purple Modernization Program overview",
        description: "CTA's official RPM program page, describing Phase One's scope and construction timeline (October 2019 start).",
        url: "https://www.transitchicago.com/rpm/",
        evidenceType: "report",
        publicationDate: null,
        publisher: "Chicago Transit Authority",
        sourceTier: "government",
        sourceKey: "cta_rpm",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "transit-expansion-program",
    stage: 3,
    dataQuality: "estimated",
    assessmentDate: "2022-08-12",
    isCurrent: false,
    evidenceSummary:
      "The Red Line Extension cleared federal environmental review: CTA/FTA issued the Final Environmental Impact Statement and Record of Decision, the formal federal approval required before funding could be committed. The composite pipeline score remains 3 (unchanged from 2019), since RPM had already demonstrated institution-level execution; this milestone deepens rather than newly establishes that finding for the flagship project specifically.",
    limitations: "An environmental/regulatory approval, not yet a funding commitment or construction start for RLE itself.",
    evidenceLinks: [
      {
        label: "Red Line Extension Final EIS / Record of Decision",
        description: "CTA/FTA's joint federal environmental review document and Record of Decision, the formal approval clearing RLE to proceed toward funding.",
        url: "https://www.transitchicago.com/assets/1/6/CTA_RLE_FEIS_20220805_AppH_Transportation_1of2.pdf",
        evidenceType: "report",
        publicationDate: "2022-08-12",
        publisher: "Chicago Transit Authority / Federal Transit Administration",
        sourceTier: "government",
        sourceKey: "cta_fta_rle_feis",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "transit-expansion-program",
    stage: 3,
    dataQuality: "estimated",
    assessmentDate: "2024-05-01",
    isCurrent: false,
    evidenceSummary:
      "CDOT and CTA completed a 3.9-mile continuous dedicated bus lane on Chicago Avenue (covering ~40% of Route #66), the first corridor delivered under the December 2023 Better Streets for Buses plan. This is a real operating output for that specific corridor, but 12 of the plan's 17 candidate corridors remained in study rather than funded construction, so it does not by itself elevate the overall pipeline's composite stage.",
    limitations: "One of 17 planned corridors built; the broader bus-priority network remains mostly in the evaluation stage.",
    evidenceLinks: [
      {
        label: "Better Streets for Buses — Chicago Avenue dedicated bus lane",
        description: "City of Chicago (CDOT) announcement of the completed Chicago Avenue dedicated bus lane, the first corridor delivered under the 2023 Better Streets for Buses plan.",
        url: "https://www.chicago.gov/city/en/depts/cdot/provdrs/transit_facilities/news/2024/may/cdot-and-cta-announce-new-dedicated-bus-only-lanes-along-chicago.html",
        evidenceType: "report",
        publicationDate: "2024-05-01",
        publisher: "City of Chicago Department of Transportation",
        sourceTier: "government",
        sourceKey: "chicago_cdot_bus_lanes",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "transit-expansion-program",
    stage: 3,
    dataQuality: "estimated",
    assessmentDate: "2025-01-16",
    isCurrent: false,
    evidenceSummary:
      "CTA and FTA finalized a Full Funding Grant Agreement committing approximately $1.97B in federal funding (34.3% of the $5.75B total) to the Red Line Extension, formally securing the flagship expansion project's funding.",
    limitations: "Funding secured on paper; construction had not yet begun at this date.",
    evidenceLinks: [
      {
        label: "Red Line Extension Full Funding Grant Agreement Profile",
        description: "FTA's official Capital Investment Grants program profile confirming the FFGA and the ~$1.97B federal funding commitment.",
        url: "https://www.transit.dot.gov/sites/fta.dot.gov/files/2025-01/IL-Chicago-Red-Line-Extension-FFGA-Profile-FY26-01-16-2025_0.pdf",
        evidenceType: "report",
        publicationDate: "2025-01-16",
        publisher: "U.S. Federal Transit Administration",
        sourceTier: "government",
        sourceKey: "fta_rle_ffga",
      },
      {
        label: "Mayor's Office announcement of $1.9B Red Line Extension funding",
        description: "City of Chicago press release corroborating the FFGA finalization.",
        url: "https://www.chicago.gov/city/en/depts/mayor/press_room/press_releases/2025/january/1_9B_Funding_for_Red_Line_Extension_Project.html",
        evidenceType: "article",
        publicationDate: "2025-01-16",
        publisher: "City of Chicago Office of the Mayor",
        sourceTier: "government",
        sourceKey: "chicago_mayor_rle_funding",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "transit-expansion-program",
    stage: 3,
    dataQuality: "estimated",
    assessmentDate: "2025-07-20",
    isCurrent: false,
    evidenceSummary:
      "Red & Purple Modernization Phase One reached substantial completion — the largest completed capital project in CTA history, delivering four new stations and the Clark Junction flying junction. However, RPM Phase Two remains only a proposal with no secured funding, so this completed project is treated as evidence of institutional execution capacity rather than proof of a durably operating expansion pipeline; the composite score does not advance to stage 4 on this basis alone.",
    limitations: "Phase Two of the same program is unfunded and in the proposal stage — the completion of Phase One did not translate into a continuing, funded pipeline for this program specifically.",
    evidenceLinks: [
      {
        label: "RPM Phase One reaches substantial completion",
        description: "CTA's official announcement confirming Phase One's substantial completion (July 20, 2025) and noting Phase Two's status as a proposed, unfunded future phase.",
        url: "https://www.transitchicago.com/cta-moves-forward-with-promised-transit-oriented-development-plan-as-agency-completes-historic-red-and-purple-modernization-rpm-phase-one-project/",
        evidenceType: "report",
        publicationDate: "2025-07-20",
        publisher: "Chicago Transit Authority",
        sourceTier: "government",
        sourceKey: "cta_rpm",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "transit-expansion-program",
    stage: 3,
    dataQuality: "estimated",
    assessmentDate: "2025-12-16",
    isCurrent: false,
    evidenceSummary:
      "Governor Pritzker signed the Northern Illinois Transit Authority Act, restructuring regional transit governance and raising roughly $1.5B to address a projected fiscal shortfall. This is a major institutional/funding reform, but NITA does not begin operating until September 2026, so it is scored as legislation enacted rather than an operating institution.",
    limitations: "Enacted but not yet operational; its practical effectiveness (including the Capital Fast Track Program for major projects) is unproven.",
    evidenceLinks: [],
    legislation: {
      title: "Northern Illinois Transit Authority Act (SB 2111)",
      billNumber: "SB 2111",
      status: "enacted",
      dateEnacted: "2025-12-16",
      url: "https://gov-pritzker-newsroom.prezly.com/gov-pritzker-signs-northern-illinois-transit-authority-act",
      sourceKey: "il_gov_nita_act",
    },
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "transit-expansion-program",
    stage: 3,
    dataQuality: "estimated",
    assessmentDate: "2026-04-24",
    isCurrent: false,
    evidenceSummary:
      "CTA held the official groundbreaking for the Red Line Extension at the future Michigan Avenue station site, beginning construction after surviving a federal funding freeze (paused October 2025, temporarily restored by a federal court order in March 2026). Construction underway deepens confidence in stage 3 but is not yet an operating outcome — station construction is not planned to begin until 2027, with completion planned for 2030.",
    limitations: "Sourced via WTTW News rather than a CTA/City press release specifically confirming this date, since no official page documenting the groundbreaking event itself was found at time of research (corroborated by Chicago Sun-Times, Chicago YIMBY, and Urbanize Chicago coverage). The underlying federal funding litigation remains unresolved.",
    evidenceLinks: [
      {
        label: "CTA breaks ground on Red Line Extension",
        description: "News coverage of the April 24, 2026 groundbreaking at the future Michigan Avenue station site, following the temporary court-ordered restoration of paused federal funding.",
        url: "https://news.wttw.com/2026/04/24/cta-kicks-construction-long-awaited-57b-red-line-extension-far-south-side",
        evidenceType: "article",
        publicationDate: "2026-04-24",
        publisher: "WTTW News",
        sourceTier: "alternative",
        sourceKey: "wttw_transit_news",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "transit-expansion-program",
    stage: 3,
    dataQuality: "estimated",
    assessmentDate: "2026-07-21",
    isCurrent: true,
    evidenceSummary:
      "Chicago has an established institutional ecosystem capable of planning, funding, and executing transit expansion projects, but the overall pipeline remains fragmented and is still transitioning toward a more integrated regional structure. The Stage 3 score should not imply that Chicago lacks functioning transit institutions. It means the broader institutional pipeline has not yet demonstrated the sustained, system-wide output necessary for Stage 4 or Stage 5.",
    limitations:
      "Fragmented governance across CTA, RTA/NITA, CMAP, CDOT, IDOT, and FTA. Federal funding for the Red Line Extension and Red & Purple Modernization was paused in October 2025 and only temporarily restored by court order in March 2026; the underlying litigation remains unresolved. NITA does not begin operating until September 2026 and its effectiveness is unproven. No clean multi-year network-coverage or ridership trend was found that is clearly attributable to expansion rather than general capital spending. Metra expansion (the South Shore Line capacity project) was not fully researched this pass. CMAP's next regional transportation plan (2026 RTP) is still in development and was not factored into this score.",
    evidenceLinks: [
      {
        label: "Red Line Extension Full Funding Grant Agreement Profile",
        description: "FTA's official Capital Investment Grants program profile confirming the FFGA and the ~$1.97B federal funding commitment for the flagship expansion project.",
        url: "https://www.transit.dot.gov/sites/fta.dot.gov/files/2025-01/IL-Chicago-Red-Line-Extension-FFGA-Profile-FY26-01-16-2025_0.pdf",
        evidenceType: "report",
        publicationDate: "2025-01-16",
        publisher: "U.S. Federal Transit Administration",
        sourceTier: "government",
        sourceKey: "fta_rle_ffga",
      },
      {
        label: "RPM Phase One reaches substantial completion",
        description: "CTA's confirmation of Phase One's completion, alongside Phase Two's unfunded proposal status — evidence of execution capacity, not a continuing operating pipeline.",
        url: "https://www.transitchicago.com/cta-moves-forward-with-promised-transit-oriented-development-plan-as-agency-completes-historic-red-and-purple-modernization-rpm-phase-one-project/",
        evidenceType: "report",
        publicationDate: "2025-07-20",
        publisher: "Chicago Transit Authority",
        sourceTier: "government",
        sourceKey: "cta_rpm",
      },
      {
        label: "Better Streets for Buses — Chicago Avenue dedicated bus lane",
        description: "The one completed corridor (of 17 planned) under the city's bus-priority program.",
        url: "https://www.chicago.gov/city/en/depts/cdot/provdrs/transit_facilities/news/2024/may/cdot-and-cta-announce-new-dedicated-bus-only-lanes-along-chicago.html",
        evidenceType: "report",
        publicationDate: "2024-05-01",
        publisher: "City of Chicago Department of Transportation",
        sourceTier: "government",
        sourceKey: "chicago_cdot_bus_lanes",
      },
    ],
    legislation: {
      title: "Northern Illinois Transit Authority Act (SB 2111)",
      billNumber: "SB 2111",
      status: "enacted",
      dateEnacted: "2025-12-16",
      url: "https://gov-pritzker-newsroom.prezly.com/gov-pritzker-signs-northern-illinois-transit-authority-act",
      sourceKey: "il_gov_nita_act",
    },
  },
];
