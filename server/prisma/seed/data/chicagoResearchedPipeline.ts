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
 * "alternative-crisis-response" (CARE program) — five assessments spanning 2021-2026. Chicago has
 * built and sustained a durable interagency crisis-response institution for nearly five years,
 * surviving a full staffing-model overhaul and a change of mayoral administration — clearing stage 3.
 * Stage 4 is deliberately NOT claimed: even after a May 2026 "citywide expansion" announcement,
 * independent reporting through July 2026 found the program still roughly half-staffed, dispatcher
 * utilization collapsing rather than growing, and full capacity buildout explicitly deferred to 2027 —
 * the pipeline as a whole does not yet show reliable, routine, citywide-scale operation.
 *
 * "permitting-modernization" — three assessments spanning 2017-2026. This policy area's name bundles
 * two institutionally distinct topics: permitting (a clean, well-documented single-agency reform, the
 * DOB Express Permit Program) and procurement (fragmented, with its main modernization effort — a
 * "Category Management" proposal — never enacted). Scored conservatively at the level of the weaker,
 * unenacted procurement half rather than the level permitting alone would justify; see limitations on
 * the current row for the recommendation to treat these as separate pipelines in a future pass.
 *
 * "progressive-revenue-institution" (Bring Chicago Home) — three assessments spanning 2023-2026, and
 * deliberately the lowest-scoring case in Chicago's portfolio. A well-organized, heavily-covered
 * campaign for a graduated real-estate transfer tax went through a full formal process (City Council
 * referendum authorization, litigation to the Illinois Supreme Court, a public vote) but was defeated
 * (52.17% No, certified April 9, 2024) before the substantive tax-rate ordinance it would have required
 * was ever even attempted. No institution, dedicated fund, or collection mechanism was ever created.
 *
 * "workforce-development-institution" (Chicago Cook Workforce Partnership) — three assessments
 * spanning 2012-2026. A real, durable, jointly-governed City/Cook County institution (a federally
 * designated Local Workforce Investment Area, 10 American Job Centers, ~$78M annual budget) that
 * publishes real operating-output data (sector placements, apprenticeship completions, training
 * outcome rates). Stage 5 is not claimed: reporting metrics are inconsistent year to year (no clean
 * multi-year trend line), and the most recent audited financials show an operating deficit.
 *
 * The remaining 3 Chicago policy areas remain the synthetic placeholder generator's output — they are
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
  // ---------------------------------------------------------------------------------------------
  // Alternative Crisis Response (CARE program) — 5 assessments, 2021-2026
  // ---------------------------------------------------------------------------------------------
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "alternative-crisis-response",
    stage: 3,
    dataQuality: "estimated",
    assessmentDate: "2021-09-01",
    isCurrent: false,
    evidenceSummary:
      "Chicago launched CARE (Crisis Assistance Response and Engagement) as a joint pilot of the Mayor's Office, Chicago Dept. of Public Health, Chicago Fire Dept., Chicago Police Dept., Office of Emergency Management and Communications, Illinois EMS Region 11, and UIC's Community Outreach Intervention Projects — a formally created, staffed interagency Multidisciplinary Response Team model deployed in two police districts to respond to non-violent mental-health 911 calls without an armed police response as first contact.",
    limitations:
      "Pilot-scale only (2 of 22 police districts). The University of Chicago Health Lab/Urban Labs evaluation covering this period documents that CARE's own administrative data could not systematically capture all CARE-eligible events, so early call-volume figures are approximate.",
    evidenceLinks: [
      {
        label: "CARE Pilot: Implementation Evaluation Findings",
        description: "Academic evaluation of the CARE pilot's 2021-2023 launch, staffing model, and interagency structure.",
        url: "https://assets.joycefdn.org/content/uploads/CARE-Final-Report_overviewfullbriefing_Joycefdn-Jan2025.pdf",
        evidenceType: "report",
        publicationDate: "2025-01-15",
        publisher: "University of Chicago Health Lab / Urban Labs",
        sourceTier: "academic",
        sourceKey: "uchicago_urban_labs_care",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "alternative-crisis-response",
    stage: 3,
    dataQuality: "estimated",
    assessmentDate: "2022-05-26",
    isCurrent: false,
    evidenceSummary:
      "Program expanded to four additional Southwest Side police districts and introduced a second response model (Alternate Response Team: paramedic + clinician, no police officer), alongside a public data dashboard tracking dispatches and outcomes — evidence of a durable, institutionally growing mechanism rather than a one-off pilot.",
    limitations:
      "The city's own press releases announcing this expansion could not be independently re-verified by direct document fetch in this research pass (blocked at the source); dates are corroborated by contemporaneous WTTW reporting but should be treated as estimated pending direct verification.",
    evidenceLinks: [],
    legislation: null,
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "alternative-crisis-response",
    stage: 3,
    dataQuality: "estimated",
    assessmentDate: "2024-09-23",
    isCurrent: false,
    evidenceSummary:
      "CARE fully transitioned to a Chicago Dept. of Public Health-only model, removing CPD officers and CFD paramedics from response teams — reframed by the city as ending law-enforcement involvement in mental-health crisis response entirely. The city cited over 1,500 cumulative calls since 2021 with zero arrests and a use-of-force rate below 0.1%, evidence the interagency mechanism had matured into a standing, city-owned institution even as its staffing model was substantially restructured.",
    limitations:
      "Restructuring itself is evidence of institutional durability (the program survived a major operating-model change), but is also the point at which dispatcher utilization and call volumes began declining — see the 2025-07-25 assessment.",
    evidenceLinks: [
      {
        label: "City of Chicago Transitions Mental Health Crisis Response Program to Public Health",
        description: "Official city announcement of CARE's transition to a CDPH-only response model, ending CPD/CFD participation.",
        url: "https://www.chicago.gov/city/en/depts/mayor/press_room/press_releases/2024/september/Mental-Health-Crisis-Response-Program.html",
        evidenceType: "report",
        publicationDate: "2024-09-23",
        publisher: "City of Chicago Department of Public Health / Mayor's Press Office",
        sourceTier: "government",
        sourceKey: "chicago_gov_care_transition",
      },
      {
        label: "City Removing Police And Fire Departments From Mental Health Emergency Response Program",
        description: "Independent reporting corroborating the CDPH-only transition and citing city-provided cumulative statistics.",
        url: "https://blockclubchicago.org/2024/09/26/city-removing-police-and-fire-departments-from-mental-health-emergency-response-program/",
        evidenceType: "article",
        publicationDate: "2024-09-26",
        publisher: "Block Club Chicago",
        sourceTier: "alternative",
        sourceKey: "blockclub_care",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "alternative-crisis-response",
    stage: 3,
    dataQuality: "estimated",
    assessmentDate: "2025-07-25",
    isCurrent: false,
    evidenceSummary:
      "A joint investigation by MindSite News and Northwestern's Medill Investigative Lab found that, following the 2024 restructuring, CPD dispatcher referrals to CARE fell from a 33% peak to 9%, CARE responded to well under 1% of an estimated 96,000 annual mental-health-related 911 calls, and the program remained roughly half-staffed against its own budgeted positions, with its main ARPA funding source set to expire by the end of 2026.",
    limitations:
      "Treated as evidence against advancing to stage 4: the institution exists and operates, but not yet at a scale or reliability that constitutes routine, citywide operational capacity. Call-volume figures across sources (Urban Labs, MindSite News, EMS1) are not fully mutually consistent, reflecting CARE's own documented data-capture gaps.",
    evidenceLinks: [
      {
        label: "CARE at the Crossroads: Chicago Crisis Response at Tipping Point",
        description: "Six-month joint investigation finding declining dispatcher utilization, under-1%-of-calls coverage, and chronic understaffing following the 2024 restructuring.",
        url: "https://mindsitenews.org/2025/07/25/chicago-crisis-response-program-at-tipping-point/",
        evidenceType: "article",
        publicationDate: "2025-07-25",
        publisher: "MindSite News, with Medill Investigative Lab-Chicago",
        sourceTier: "alternative",
        sourceKey: "mindsite_medill_care",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "alternative-crisis-response",
    stage: 3,
    dataQuality: "estimated",
    assessmentDate: "2026-07-22",
    isCurrent: true,
    evidenceSummary:
      "In May 2026 the City announced CARE had expanded citywide to all 22 police districts and broadened eligible call types beyond mental-health crises to general 'socio-emotional distress.' Independent reporting in the following two months found the program still only about one-third to one-half staffed against budgeted positions, with full capacity buildout explicitly deferred to 2027 pending contested new tax revenue (the SMART tax, under active legal challenge). Chicago has built and sustained a durable institutional mechanism for non-police crisis response for nearly five years, surviving a change in mayoral administration and a full staffing-model overhaul — clearing stage 3. But the pipeline as a whole — not any single announcement — does not yet show operating with reliable, routine, citywide-scale outputs, so stage 4 is not yet supported.",
    limitations:
      "This is a genuinely contested judgment call: call-volume, staffing, and dispatcher-utilization figures reported across five independent sources are not fully mutually consistent, and CARE's own administrative data has documented gaps in capturing the complete universe of CARE-eligible events. The May 2026 'citywide expansion' is a real, dated policy action, but the most current independent reporting (through July 2026) describes actual operational capacity as still substantially short of that citywide framing. This assessment does not evaluate individual-level client outcomes, nor compare Chicago's program to peer cities.",
    evidenceLinks: [
      {
        label: "Chicago's New Social Media Tax Could Expand A Crisis Mental Health Program — If It Survives A Lawsuit",
        description: "Reports CARE staffing at roughly one-third of budgeted positions and full buildout deferred to 2027, contingent on the contested SMART tax.",
        url: "https://www.citybureau.org/newswire/2026/6/22/care-chicago-budget-expansion-mental-health-program-social-media-tax",
        evidenceType: "article",
        publicationDate: "2026-06-22",
        publisher: "City Bureau",
        sourceTier: "alternative",
        sourceKey: "citybureau_care",
      },
      {
        label: "Chicago CARE mental health response program sees 911 dispatches decline amid staffing challenges",
        description: "Reports CARE roughly half-staffed and only ~70 total dispatches citywide in the first half of 2026, with CPD having revoked CARE vans' self-dispatch terminals.",
        url: "https://www.ems1.com/behavioral-health/chicago-mental-health-response-teams-see-911-calls-plummet",
        evidenceType: "article",
        publicationDate: "2026-07-03",
        publisher: "EMS1",
        sourceTier: "alternative",
        sourceKey: "ems1_care",
      },
      {
        label: "Mental Health Emergency Response Program Expands Citywide",
        description: "City announcement of CARE's expansion to all 22 police districts and broadened eligible call types.",
        url: "https://blockclubchicago.org/2026/05/13/non-police-mental-health-emergency-response-program-expands-citywide/",
        evidenceType: "report",
        publicationDate: "2026-05-13",
        publisher: "Block Club Chicago",
        sourceTier: "alternative",
        sourceKey: "blockclub_care",
      },
    ],
    legislation: null,
  },
  // ---------------------------------------------------------------------------------------------
  // Permitting & Procurement Modernization — 3 assessments, 2017-2026
  // ---------------------------------------------------------------------------------------------
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "permitting-modernization",
    stage: 1,
    dataQuality: "estimated",
    assessmentDate: "2017-06-14",
    isCurrent: false,
    evidenceSummary:
      "The City announced intent to modernize procurement through a new online eProcurement/iSupplier system, replacing a paper-intensive process. This is a proposal/intent announcement for the procurement half of this bundled policy area; permitting had not yet been reformed at this point.",
    limitations: null,
    evidenceLinks: [],
    legislation: null,
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "permitting-modernization",
    stage: 2,
    dataQuality: "estimated",
    assessmentDate: "2023-11-06",
    isCurrent: false,
    evidenceSummary:
      "The Dept. of Buildings launched the Express Permit Program, a fully web-based system replacing the legacy Easy Permit, Solar Express, and Short Form processes — a real, operating reform on the permitting side. Taken alone, this would support a stage 3-4 assessment for permitting specifically. However, this policy area's name bundles permitting with procurement, and the Chicago Office of Inspector General had, months earlier (Feb. 2023), reported the City's prior procurement-modernization task force closed with its central recommendation (a 'universal procurement system') never implemented. The composite score for this bundled policy area is scored conservatively at the level of its weaker, unenacted procurement half.",
    limitations:
      "See the current assessment's limitations for a full explanation of why this policy area should likely be split into two separate pipelines in a future research pass.",
    evidenceLinks: [
      {
        label: "Express Permit Program",
        description: "Department of Buildings' web-based permit platform, replacing Easy Permit, Solar Express, and Short Form processes.",
        url: "https://www.chicago.gov/city/en/depts/bldgs/provdrs/permits/svcs/express-permits.html",
        evidenceType: "report",
        publicationDate: "2023-11-06",
        publisher: "City of Chicago Department of Buildings",
        sourceTier: "government",
        sourceKey: "chicago_dob_express_permit",
      },
      {
        label: "Chicago's Procurement Reform Task Force Concludes Work with Unfinished Business",
        description: "Inspector General report finding the Procurement Reform Task Force's central digital-modernization recommendation was never completed.",
        url: "https://igchicago.org/2023/02/21/chicagos-procurement-reform-task-force-concludes-work-with-unfinished-business/",
        evidenceType: "report",
        publicationDate: "2023-02-21",
        publisher: "Chicago Office of Inspector General",
        sourceTier: "government",
        sourceKey: "chicago_oig_procurement",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "permitting-modernization",
    stage: 2,
    dataQuality: "estimated",
    assessmentDate: "2026-07-22",
    isCurrent: true,
    evidenceSummary:
      "The Express Permit Program expanded further in Sept. 2024 (electrical, porch/deck, fire-alarm, and stormwater permits added), and the Mayor's 'Cut the Tape' initiative reported 90% of its 107 recommendations underway or complete as of May 2025. Meanwhile, the procurement side's only current modernization proposal ('Category Management,' from an FY2026-budget-referenced consultant report) remains an unenacted recommendation with no dedicated ordinance, fund, or implementation mechanism, per independent Civic Federation analysis. This bundled policy area is scored conservatively at the level of its weaker, unenacted procurement half rather than at the level its stronger permitting half would independently justify.",
    limitations:
      "This policy area's name bundles two institutionally distinct topics with no shared coordinating office: permitting modernization (Dept. of Buildings-led, mature, well-documented) and procurement modernization (Dept. of Procurement Services-led, stalled since a 2022 task force closure, no enacted reform). Recommend Mandate split this into two separate policy areas in a future pass; scored 'estimated' rather than 'government' precisely because reaching one composite conclusion required synthesizing across these two unrelated institutional tracks. Independent analysis (Illinois Policy Institute) also cautions that roughly half of Cut the Tape's 'completed' items only created committees, checklists, or trainings rather than substantive reforms.",
    evidenceLinks: [
      {
        label: "Mayor Brandon Johnson Announces Year of Progress on 'Cut the Tape' Initiative",
        description: "City reporting on permitting/development-approval reform progress, including a Planned Development approval-time reduction from 131 to 79 days (a zoning process distinct from Express Permit issuance).",
        url: "https://www.chicago.gov/city/en/depts/mayor/press_room/press_releases/2025/may/Cut-the-Tape-Year-of-Progress.html",
        evidenceType: "report",
        publicationDate: "2025-05-19",
        publisher: "City of Chicago Mayor's Press Office",
        sourceTier: "government",
        sourceKey: "chicago_gov_cut_the_tape",
      },
      {
        label: "Which Cuts Didn't Make the Cut — Efficiency Opportunities for Chicago's FY2026 Budget",
        description: "Independent analysis finding the procurement 'Category Management' modernization proposal has no enacted ordinance or implementation mechanism.",
        url: "https://www.civicfed.org/blog/which-cuts-didnt-make-cut-efficiency-opportunities-chicagos-fy2026-budget",
        evidenceType: "report",
        publicationDate: "2025-11-07",
        publisher: "Civic Federation",
        sourceTier: "academic",
        sourceKey: "civicfed_procurement",
      },
    ],
    legislation: null,
  },
  // ---------------------------------------------------------------------------------------------
  // Progressive Revenue Institution (Bring Chicago Home) — 3 assessments, 2023-2026
  // ---------------------------------------------------------------------------------------------
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "progressive-revenue-institution",
    stage: 1,
    dataQuality: "estimated",
    assessmentDate: "2023-11-07",
    isCurrent: false,
    evidenceSummary:
      "Chicago City Council voted 32-17 to place a graduated real-estate transfer tax ('Bring Chicago Home,' intended to fund homelessness services) on the March 2024 ballot as a referendum question. This vote authorized only a procedural referendum question — not the substantive tax-rate ordinance itself, which would still have required a separate Council vote even if the referendum passed.",
    limitations: null,
    evidenceLinks: [
      {
        label: "Bring Chicago Home Heads To Chicago Voters After Council Passage Tuesday",
        description: "Reports the 32-17 City Council vote authorizing the March 2024 referendum question.",
        url: "https://blockclubchicago.org/2023/11/07/bring-chicago-home-heads-to-chicago-voters-after-council-passage-tuesday/",
        evidenceType: "article",
        publicationDate: "2023-11-07",
        publisher: "Block Club Chicago",
        sourceTier: "alternative",
        sourceKey: "blockclub_bring_chicago_home",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "progressive-revenue-institution",
    stage: 1,
    dataQuality: "estimated",
    assessmentDate: "2024-04-09",
    isCurrent: false,
    evidenceSummary:
      "Following litigation up to the Illinois Supreme Court (which declined to block the vote), the Bring Chicago Home referendum was certified defeated: 169,492 Yes (47.83%) vs. 184,890 No (52.17%). The substantive transfer-tax ordinance that would have followed a 'Yes' result was never attempted, since the referendum failed at the ballot.",
    limitations:
      "Vote totals are corroborated across contemporaneous news reporting but were not independently verified against the Chicago Board of Election Commissioners' primary canvass document in this research pass.",
    evidenceLinks: [
      {
        label: "Bring Chicago Home Referendum Fails, AP Says",
        description: "Reports the Associated Press's call that the referendum failed, following the March 19, 2024 vote.",
        url: "https://blockclubchicago.org/2024/03/22/bring-chicago-home-referendum-fails/",
        evidenceType: "article",
        publicationDate: "2024-03-22",
        publisher: "Block Club Chicago",
        sourceTier: "alternative",
        sourceKey: "blockclub_bring_chicago_home",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "progressive-revenue-institution",
    stage: 1,
    dataQuality: "estimated",
    assessmentDate: "2026-01-29",
    isCurrent: true,
    evidenceSummary:
      "No ordinance reintroducing Bring Chicago Home or an equivalent graduated transfer-tax mechanism has been introduced since the 2024 defeat. A separate progressive-revenue mechanism — a revived corporate 'head tax' proposed in Mayor Johnson's FY2026 budget — was also excluded from the final enacted revenue ordinance (Dec. 19-20, 2025 Council vote). As of the most recent evidence, the administration has stated only an intention to possibly attempt a second Bring Chicago Home-style referendum, with no resolution or ordinance filed. No agency, dedicated fund, or collection mechanism for a progressive real-estate or corporate revenue tax has ever been created in Chicago during this period — this remains a proposal-stage policy area, not an institution.",
    limitations:
      "This is very likely correctly the lowest-scoring case in Mandate's Chicago portfolio: a well-organized, heavily covered campaign that never crossed into enacted law, let alone institutional capacity. The one historical institutional analogue — Chicago's 1973-2014 corporate 'head tax' — was fully repealed over a decade ago and is not part of this pipeline's current status. Council vote counts for the Dec. 2025 budget are reported inconsistently across outlets (29-19 vs. 30-18), likely reflecting two different procedural votes rather than a factual conflict.",
    evidenceLinks: [
      {
        label: "Chicago City Council votes 29-19 to approve 2026 revenue plan without mayor's controversial head tax",
        description: "Reports the December 2025 budget vote excluding a revived corporate head tax from the enacted FY2026 revenue ordinance.",
        url: "https://www.cbsnews.com/chicago/news/chicago-city-council-passes-2026-revenue-plan-budget-vote-brandon-johnson/",
        evidenceType: "article",
        publicationDate: "2025-12-19",
        publisher: "CBS News Chicago",
        sourceTier: "alternative",
        sourceKey: "cbs_chicago_headtax_2025",
      },
    ],
    legislation: null,
  },
  // ---------------------------------------------------------------------------------------------
  // Workforce Development Institution (Chicago Cook Workforce Partnership) — 3 assessments, 2012-2026
  // ---------------------------------------------------------------------------------------------
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "workforce-development-institution",
    stage: 3,
    dataQuality: "estimated",
    assessmentDate: "2012-07-01",
    isCurrent: false,
    evidenceSummary:
      "The Chicago Cook Workforce Partnership formally launched, merging previously separate City of Chicago and Cook County federal workforce-service systems into a single nonprofit-managed Local Workforce Investment Area (LWIA 7) — described as the largest nonprofit-managed LWIA in the nation. This is a durable institution: a persistent legal entity with a governing board, dedicated staff, and an operating budget, not a list of disconnected grants.",
    limitations:
      "This is a jointly City-of-Chicago/Cook-County-governed regional institution, not a City-of-Chicago-only body; its outcome reporting is not disaggregated by jurisdiction (see the current assessment's limitations).",
    evidenceLinks: [
      {
        label: "Chicago Cook Workforce Partnership agency page",
        description: "Cook County's own description of the Partnership's 2012 founding, merging City and County workforce systems into one nonprofit-managed federal Local Workforce Investment Area.",
        url: "https://www.cookcountyil.gov/agency/chicago-cook-workforce-partnership",
        evidenceType: "report",
        publicationDate: null,
        publisher: "Cook County, Illinois",
        sourceTier: "government",
        sourceKey: "cookcounty_gov_workforce_partnership",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "workforce-development-institution",
    stage: 4,
    dataQuality: "estimated",
    assessmentDate: "2024-03-19",
    isCurrent: false,
    evidenceSummary:
      "The Partnership's PY2023 Annual Report documents real, routine operating outputs: 10 American Job Centers (5 within Chicago city limits), ~90 community-based partner organizations, and published sector-program outcomes (construction, manufacturing, hospitality, and healthcare placements; a ConstructionWorks apprenticeship pipeline with over 50% program-transition rate). This is genuine observable-output evidence, not just a program announcement.",
    limitations:
      "Aggregate outcome statistics are reported at the regional (City + Cook County) level, not broken out by jurisdiction in any published document reviewed; only physical/locational facts (which of the 10 AJCs sit within Chicago) are directly City-specific.",
    evidenceLinks: [
      {
        label: "Chicago Cook Workforce Partnership Annual Report 2023",
        description: "Self-published annual report documenting 10 American Job Centers, ~90 partner organizations, and sector-program placement outcomes.",
        url: "https://chicookworks.org/annual-report-2023/",
        evidenceType: "report",
        publicationDate: "2024-03-19",
        publisher: "Chicago Cook Workforce Partnership",
        sourceTier: "alternative",
        sourceKey: "chicookworks_annual_report",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "workforce-development-institution",
    stage: 4,
    dataQuality: "estimated",
    assessmentDate: "2026-07-22",
    isCurrent: true,
    evidenceSummary:
      "The Partnership's most recent annual report (PY2024, published early 2026) shows continued routine operating outputs: $19.1M invested in Individual Training Accounts (2,800+ issued, 77% completion rate, 86% post-training employment rate), continued sector partnerships (Healthcare, Hospitality, IT, Transportation/Distribution/Logistics), and further co-location of American Job Centers inside City Colleges of Chicago campuses (Malcolm X, Daley, and Truman Colleges). This is a durable, operating institution producing real, ongoing outputs.",
    limitations:
      "Stage 5 is not supported: the Partnership's own reporting metrics change from year to year (PY2023 emphasized raw sector-placement counts; PY2024 pivoted to ITA completion/employment rates), preventing any genuine multi-year trend line from public reporting alone. The Partnership's most recent audited financials (FY2025, via IRS Form 990 data) show an operating deficit (-$2.24M net income) and declining net assets, and prior audits (FY2021-2022) flagged internal-control material weaknesses — evidence of institutional strain, not demonstrated improvement. As with the earlier assessments, outcome statistics are reported at the regional (City + Cook County) level, not disaggregated by jurisdiction; only AJC/co-location locations are directly attributable to Chicago specifically.",
    evidenceLinks: [
      {
        label: "Chicago Cook Workforce Partnership Annual Report 2025 (PY2024)",
        description: "Most recent annual report: ITA investment/completion/employment rates, sector partnerships, and continued City Colleges co-locations.",
        url: "https://chicookworks.org/annual-report-2025/",
        evidenceType: "report",
        publicationDate: null,
        publisher: "Chicago Cook Workforce Partnership",
        sourceTier: "alternative",
        sourceKey: "chicookworks_annual_report",
      },
      {
        label: "The Chicago Cook Workforce Partnership Co-Locates Third American Job Center at City Colleges of Chicago",
        description: "Public institution's own announcement of continued AJC co-locations at City Colleges campuses within Chicago.",
        url: "https://colleges.ccc.edu/2024/09/03/the-chicago-cook-workforce-partnership-co-locates-third-american-job-center-ajc-at-city-colleges-of-chicago-2/",
        evidenceType: "report",
        publicationDate: "2024-09-03",
        publisher: "City Colleges of Chicago",
        sourceTier: "government",
        sourceKey: "ccc_workforce_colocation",
      },
      {
        label: "ProPublica Nonprofit Explorer — Chicago Cook Workforce Partnership financials",
        description: "IRS Form 990 data showing an FY2025 operating deficit and declining net assets, plus prior-year internal-control findings.",
        url: "https://projects.propublica.org/nonprofits/organizations/364122225",
        evidenceType: "dataset",
        publicationDate: null,
        publisher: "ProPublica (IRS Form 990 data)",
        sourceTier: "government",
        sourceKey: "propublica_990_workforce",
      },
    ],
    legislation: null,
  },
];
