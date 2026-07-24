/**
 * Seattle — fourth U.S. jurisdiction with real Institutional Pipeline research (see
 * chicagoResearchedPipeline.ts for the pattern this follows). A key finding of this research pass:
 * Seattle's new mayor, Katie Wilson (took office January 2026), is NOT a DSA member and was NOT
 * endorsed by Seattle DSA, which explicitly declined to endorse her after a formal vetting process —
 * see the corrected Administration/Jurisdiction text and docs/DSA_RESEARCH_MASTER_REPORT.md. Her
 * coalition is a labor/tenant-advocacy alliance adjacent to, but organizationally distinct from, DSA.
 *
 * Critically, none of Seattle's three most-advanced institutions below should be credited to Wilson
 * as *creations*: Health One predates Durkan, Harrell, and Wilson entirely (created 2016 under Mayor
 * Ed Murray); the JumpStart payroll tax was created under Durkan (2020); and the Social Housing
 * Developer's charter and funding were both Harrell-era ballot measures (I-135, 2023; Prop 1A, 2025).
 * Wilson's genuine, attributable contribution to date is completing the Social Housing Developer's
 * staffing/first acquisition and a still-pending transit-tax renewal proposal — assessments below are
 * scored at the jurisdiction+policy-area level (an institution's real state today), consistent with
 * how Chicago's pipeline spans multiple mayoral administrations, not attributed to any one mayor.
 *
 * "affordable-housing-institution" (Social Housing Developer) — created via 2023 ballot initiative
 * I-135, funded via a 2025 ballot measure, staffed and made its first property acquisition (a
 * 150-unit Belltown building) in May 2026. Scored stage 3, not yet stage 4: too new to show
 * "operating with observable outputs" beyond the single acquisition.
 *
 * "alternative-crisis-response" — Health One (Seattle Fire's mobile integrated health unit, 2016)
 * reaches stage 5 on real outcome data (76% reduction in 911 utilization, 69% reduction in ED visits
 * among enrolled clients). The newer CARE Department (2023, direct-dispatch expansion Oct 2025) has
 * real operating output but no comparable independent outcome evidence yet — capped at stage 4.
 * Scored here at the higher of the two since the policy area as a whole has cleared stage 5 evidence
 * via Health One; see evidenceSummary for the CARE-specific caveat.
 *
 * "progressive-revenue-institution" (JumpStart payroll tax) — created 2020 under Durkan, now a
 * substantial and durable revenue source, but capped at stage 4 (not 5) because 2024 revenue came in
 * $46.8M below forecast, cutting against a clean "demonstrating improvement" claim.
 *
 * "workforce-development-institution", "permitting-modernization", "transit-expansion-program" are
 * real but more modest findings; "public-innovation-investment" is scored stage 0 as a genuine
 * researched finding (no city-run vehicle exists — Seattle's startup ecosystem is entirely private).
 */
import type { ResearchedPipelineAssessmentSpec } from "./chicagoResearchedPipeline.js";

export const seattleResearchedPipelineAssessments: ResearchedPipelineAssessmentSpec[] = [
  {
    jurisdictionSlug: "seattle",
    policyAreaSlug: "affordable-housing-institution",
    stage: 2,
    dataQuality: "government",
    assessmentDate: "2023-02-01",
    isCurrent: false,
    evidenceSummary:
      "Seattle voters approved Initiative 135 (February 2023), legally establishing the Seattle Social Housing Developer as a public development authority to build and operate mixed-income permanently-affordable rental housing.",
    limitations: "This assessment covers only the legal-creation milestone; the developer had no funding source or staff at this point.",
    evidenceLinks: [
      {
        label: "NLIHC — Seattle voters approve Social Housing Developer initiative",
        description: "Coverage of the I-135 ballot result creating the Seattle Social Housing Developer.",
        url: "https://nlihc.org/resource/seattle-voters-approve-ballot-initiative-fund-social-housing-developer",
        evidenceType: "news_article",
        publicationDate: "2023-02-01",
        publisher: "National Low Income Housing Coalition",
        sourceTier: "alternative",
        sourceKey: "seattle_social_housing",
      },
    ],
    legislation: {
      title: "Initiative 135: Seattle Social Housing Developer",
      billNumber: "I-135",
      status: "enacted",
      dateEnacted: "2023-02-14",
      url: "https://nlihc.org/resource/seattle-voters-approve-ballot-initiative-fund-social-housing-developer",
      sourceKey: "seattle_social_housing",
    },
  },
  {
    jurisdictionSlug: "seattle",
    policyAreaSlug: "affordable-housing-institution",
    stage: 3,
    dataQuality: "estimated",
    assessmentDate: "2026-05-22",
    isCurrent: true,
    evidenceSummary:
      "The Social Housing Developer was funded via a 2025 ballot measure (Prop 1A, an 'excess compensation' tax, realizing roughly $115 million in 2025 — well above initial estimates), hired its first executive staff (Chief Real Estate Officer, Director of Acquisitions, resident liaison) in early 2026, and completed its first property acquisition in May 2026: a 150-unit Belltown building ('Elara'), roughly $60 million, with over 10,000 applicants for units.",
    limitations:
      "The institution is legally created, funded, staffed, and has completed one acquisition (an existing occupied building, not new construction) — real progress, but too new to show 'operating with observable outputs' at program scale. No independent assessment of rent-setting, occupancy outcomes, or program delivery exists yet, so stage 4 is not yet claimed.",
    evidenceLinks: [
      {
        label: "Capitol Hill Seattle — Social Housing Developer funding begins",
        description: "Coverage of the 2025 Prop 1A funding realization and staffing buildout.",
        url: "https://www.capitolhillseattle.com/2026/02/with-a-stronger-than-expected-tax-boost-funding-of-seattle-social-housing-developer-begins-with-115m-push/",
        evidenceType: "news_article",
        publicationDate: "2026-02-01",
        publisher: "Capitol Hill Seattle Blog",
        sourceTier: "alternative",
        sourceKey: "seattle_social_housing",
      },
      {
        label: "Axios Seattle — first Social Housing Developer acquisition",
        description: "Coverage of the Belltown 'Elara' building acquisition, the developer's first property.",
        url: "https://www.axios.com/local/seattle/2026/06/04/seattle-social-housing-first-building-belltown-elara-market-affordable-housing",
        evidenceType: "news_article",
        publicationDate: "2026-06-04",
        publisher: "Axios Seattle",
        sourceTier: "alternative",
        sourceKey: "seattle_social_housing",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "seattle",
    policyAreaSlug: "alternative-crisis-response",
    stage: 5,
    dataQuality: "government",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "Health One, Seattle Fire's mobile integrated health/low-acuity-response unit (created 2016, formalized under that name in 2019 — predating every administration in Mandate's Administration record for Seattle), responded to 2,474 service requests in 2025 and, among enrolled clients, produced a documented 76% reduction in 911 utilization and 69% reduction in emergency-department visits: real, credible, multi-period improvement evidence. The newer CARE Department (created 2023, expanded to direct/primary dispatch in October 2025) separately handled over 2,000 crisis-response calls in 2025 with real operating output, but has no comparable independent outcome evaluation yet.",
    limitations:
      "The stage-5 claim rests specifically on Health One's outcome data, not CARE's; CARE alone would be capped at stage 4 (operating with output, no independently-verified improving trend). Neither program is a creation of the current (Wilson) administration — Health One predates it by a decade, and CARE was created and expanded under Harrell.",
    evidenceLinks: [
      {
        label: "Seattle Fire Department — Health One program page",
        description: "Program description and cited 911-utilization/ED-visit reduction outcomes for enrolled clients.",
        url: "https://www.seattle.gov/fire/safety-and-community/mobile-integrated-health/health-one",
        evidenceType: "dataset",
        publicationDate: null,
        publisher: "Seattle Fire Department",
        sourceTier: "government",
        sourceKey: "seattle_health_one",
      },
      {
        label: "Harrell Mayor's Office — CARE's next phase (direct dispatch expansion)",
        description: "Announcement of CARE's October 2025 expansion to permanent, direct-dispatch operation for behavioral-health and welfare-check calls.",
        url: "https://harrell.seattle.gov/2025/10/22/cares-next-phase-mayor-harrell-delivers-permanent-and-significant-expansion-of-diversified-unarmed-response-unlimited-crisis-responder-hiring-and-direct-dispatch-for-thousands-of-incidents/",
        evidenceType: "policy_document",
        publicationDate: "2025-10-22",
        publisher: "Office of the Mayor of Seattle",
        sourceTier: "government",
        sourceKey: "seattle_mayors_office",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "seattle",
    policyAreaSlug: "progressive-revenue-institution",
    stage: 4,
    dataQuality: "government",
    assessmentDate: "2020-07-06",
    isCurrent: false,
    evidenceSummary:
      "The Seattle City Council passed the JumpStart payroll expense tax on large employers 7-2 on July 6, 2020 (under Mayor Durkan, who let the veto-proof bill become law without her signature) — a real, enacted progressive-revenue institution now generating substantial ongoing city revenue.",
    limitations: "This assessment covers the enactment milestone; see the current assessment for operating-revenue evidence and its stage-5 limitation.",
    evidenceLinks: [],
    legislation: {
      title: "JumpStart Seattle Payroll Expense Tax",
      billNumber: "CB 119810",
      status: "enacted",
      dateEnacted: "2020-07-06",
      url: "https://www.seattle.gov/city-finance/business-taxes-and-licenses/seattle-taxes/payroll-expense-tax",
      sourceKey: "seattle_jumpstart",
    },
  },
  {
    jurisdictionSlug: "seattle",
    policyAreaSlug: "progressive-revenue-institution",
    stage: 4,
    dataQuality: "estimated",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "JumpStart generated roughly $360 million in 2024 revenue, funding a general-fund allocation (~$287M projected for 2025) and now partially repurposed toward Social Housing Developer funding (Prop 1B alternative, $10M over 5 years) after the Council eliminated the JumpStart Oversight Committee and broadened allowable uses in 2024.",
    limitations:
      "2024 revenue came in 11.5% ($46.8M) below forecast, and year-to-year revenue has been volatile (a surplus one year followed by a shortfall the next per local reporting) — this volatility cuts against a clean 'demonstrating improvement' claim, so stage 5 is not claimed despite the tax's real durability and scale.",
    evidenceLinks: [
      {
        label: "Seattle Finance Dept — Payroll Expense Tax",
        description: "Official program page for the JumpStart payroll tax.",
        url: "https://www.seattle.gov/city-finance/business-taxes-and-licenses/seattle-taxes/payroll-expense-tax",
        evidenceType: "dataset",
        publicationDate: null,
        publisher: "Seattle Department of Finance and Administrative Services",
        sourceTier: "government",
        sourceKey: "seattle_jumpstart",
      },
      {
        label: "Capitol Hill Seattle — JumpStart revenue volatility",
        description: "Local-press coverage of JumpStart's year-to-year revenue swings relative to forecast.",
        url: "https://www.capitolhillseattle.com/2025/03/42m-surplus-one-year-47m-shortfall-the-next-seattles-jumpy-jumpstart-payroll-tax-causing-budget-headaches/",
        evidenceType: "news_article",
        publicationDate: "2025-03-01",
        publisher: "Capitol Hill Seattle Blog",
        sourceTier: "alternative",
        sourceKey: "seattle_jumpstart",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "seattle",
    policyAreaSlug: "workforce-development-institution",
    stage: 4,
    dataQuality: "alternative",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "The Workforce Development Council of Seattle-King County, a WIOA-mandated regional board (not a mayoral creation), operates ongoing sector-specific programs (a 2025 hospitality-sector 'Sound Jobs' initiative, Economic Security for All) and received a 2025 national 'WIOA Trailblazer Award.'",
    limitations:
      "No independently-verified, multi-period trend data was located showing the WDC's own programs (as opposed to the regional labor market generally) are improving outcomes, so stage 5 is not claimed. This is also a regional board covering all of King County, not a Seattle-specific institution.",
    evidenceLinks: [],
    legislation: null,
  },
  {
    jurisdictionSlug: "seattle",
    policyAreaSlug: "permitting-modernization",
    stage: 2,
    dataQuality: "government",
    assessmentDate: "2025-09-26",
    isCurrent: true,
    evidenceSummary:
      "Council Bill 121048 (signed September 2025, implementing state HB 1293) suspended mandatory Design Review for most projects, a real enacted streamlining of the permitting process; SDCI separately updated fee schedules in January 2025.",
    limitations:
      "Legislation has been enacted, but no dedicated modernization institution, office, or standing initiative has been formally created or staffed — an October 2025 AI/open-data hackathon explored tooling ideas but produced no adopted program, so stage 3 is not yet claimed. No comparable procurement-modernization program was located.",
    evidenceLinks: [
      {
        label: "SDCI — 2025 Design Review program changes",
        description: "Official notice of the Design Review suspension under Council Bill 121048.",
        url: "https://www.seattle.gov/sdci/codes/changes-to-code/2025-design-review-program-changes",
        evidenceType: "policy_document",
        publicationDate: "2025-09-26",
        publisher: "Seattle Department of Construction and Inspections",
        sourceTier: "government",
        sourceKey: "seattle_sdci",
      },
    ],
    legislation: {
      title: "Council Bill 121048 (Design Review suspension)",
      billNumber: "CB 121048",
      status: "enacted",
      dateEnacted: "2025-09-26",
      url: "https://www.seattle.gov/sdci/codes/changes-to-code/2025-design-review-program-changes",
      sourceKey: "seattle_sdci",
    },
  },
  {
    jurisdictionSlug: "seattle",
    policyAreaSlug: "transit-expansion-program",
    stage: 3,
    dataQuality: "government",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "RapidRide G Line (opened 2024) saw average weekday boardings rise 86% (3,600 to 6,700) between September 2024 and September 2025 — real, multi-period improving-trend data for that specific line. King County Metro's systemwide ridership reached 94.5 million annual riders in 2025, among the fastest-growing of the 10 largest U.S. transit agencies. Mayor Wilson's proposed 2026 Transit Measure (doubling the transit sales tax, funding 280,000 additional annual Metro trips and 22,000 free ORCA passes) has been introduced but not enacted by Council or voters.",
    limitations:
      "Systemwide ridership growth and the RapidRide G Line's individual performance are real and positive, but are King County Metro (regional) achievements, not a City of Seattle-created institution — Wilson's own transit-expansion measure remains unenacted, so this is scored at the level of the existing regional system operating well, not a city-led expansion program reaching a higher stage.",
    evidenceLinks: [
      {
        label: "King County Metro — 2025 ridership growth",
        description: "Metro's own reporting on systemwide ridership growth, cited as second-highest among the ten largest US transit agencies.",
        url: "https://kingcountymetro.blog/2025/10/23/king-county-metro-ridership-growth-second-highest-among-nations-largest-transit-agencies/",
        evidenceType: "dataset",
        publicationDate: "2025-10-23",
        publisher: "King County Metro",
        sourceTier: "government",
        sourceKey: "king_county_metro_blog",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "seattle",
    policyAreaSlug: "public-innovation-investment",
    stage: 0,
    dataQuality: "estimated",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "No city-run venture, equity, or startup-investment vehicle was identified for Seattle. The region's genuine startup/VC activity (roughly $1.5-2.2 billion per quarter across 2025-2026 per PitchBook) is entirely private-sector; Washington State's Small Business Innovation Fund is a state, not Seattle, program.",
    limitations:
      "This is a real, researched finding of likely absence rather than an unresearched placeholder, but was not confirmed via a direct query of every Seattle Office of Economic Development program.",
    evidenceLinks: [],
    legislation: null,
  },
];
