/**
 * Minneapolis — third U.S. jurisdiction with real Institutional Pipeline research (see
 * chicagoResearchedPipeline.ts for the pattern this follows). Minneapolis is NOT led by a
 * DSA-affiliated mayor (Jacob Frey is DFL-establishment and opposed the 2021 police-restructuring
 * ballot measure); its place in Mandate's "Democratic Socialism" governance model rests on real,
 * separately-documented DSA/left-coalition influence on the City Council and on the 2021 ballot
 * measure itself — see the updated Jurisdiction summary/description and
 * docs/DSA_RESEARCH_MASTER_REPORT.md for the full classification discussion.
 *
 * "alternative-crisis-response" — two assessments. The Office of Community Safety (created by
 * mayoral Executive Order 2022-02, consolidating 911/Fire/OEM/Police/Neighborhood Safety) is a real,
 * durable structure, and its Behavioral Crisis Response unit has operated 24/7 since 2023 with
 * roughly 30,000 cumulative calls through April 2025. Stage 5 is deliberately NOT claimed: no
 * independent outcome evaluation exists, and OCS's own leadership was in open dispute with the
 * City Council as of mid-2026 (two 7-6 votes against reappointing its commissioner), a live
 * governance instability that this assessment's limitations flag rather than paper over.
 *
 * "affordable-housing-institution" — the Affordable Housing Trust Fund is a real, operating
 * production-financing institution (~$400M invested, ~4,679 units since 2018 per the city's own
 * reporting). The separate 2040 Comprehensive Plan (ending single-family-only zoning) is
 * deliberately NOT folded into this assessment — it is land-use deregulation, not a production
 * institution, and its effect on housing supply is genuinely contested between credible sources
 * (Minneapolis Fed vs. advocacy critics) — see limitations and the taxonomy-gap note in the master
 * report.
 *
 * "workforce-development-institution" — the Minneapolis Workforce Development Board, a real
 * WIOA-mandated institution, reaches stage 4 (operating, no independently-verified improving trend).
 *
 * "permitting-modernization" — a real but narrowly-scoped digitization of ~15 permit types (event,
 * food, seasonal vendor), stage 3-4. Full building-permit and procurement modernization data was not
 * found in this pass.
 *
 * "progressive-revenue-institution" — scored conservatively at stage 2. The only real revenue
 * mechanism found is a Minnesota Legislature-created regional sales tax (not a Minneapolis-originated
 * institution) that the city administers a designated share of; Minneapolis's own 2021-23 rent
 * stabilization effort stalled before enactment and is not itself a revenue institution.
 *
 * "transit-expansion-program" — scored stage 2. Major capital projects (Blue Line and Green Line
 * extensions) remain under construction/planning, years behind original schedules, and the existing
 * system's ridership fell in 2025 — this is also a Metropolitan Council (regional), not city,
 * institution, flagged as a governance-layer mismatch.
 *
 * "public-innovation-investment" — scored stage 0 as a genuine, researched finding (not an
 * unresearched placeholder): no dedicated City of Minneapolis venture/innovation investment vehicle
 * was found; the closest analog is the State of Minnesota's Launch Minnesota program, which the city
 * does not control.
 */
import type { ResearchedPipelineAssessmentSpec } from "./chicagoResearchedPipeline.js";

export const minneapolisResearchedPipelineAssessments: ResearchedPipelineAssessmentSpec[] = [
  {
    jurisdictionSlug: "minneapolis",
    policyAreaSlug: "alternative-crisis-response",
    stage: 3,
    dataQuality: "government",
    assessmentDate: "2022-06-01",
    isCurrent: false,
    evidenceSummary:
      "Mayoral Executive Order 2022-02 created the Office of Community Safety, consolidating 911 dispatch, Fire, the Office of Emergency Management, Police, and Neighborhood Safety/Violence Prevention under one commissioner reporting to the mayor — a durable institutional mechanism created in the aftermath of the failed 2021 police-restructuring ballot measure.",
    limitations:
      "This assessment covers only the institution-creation milestone. It does not by itself establish operating output — the Behavioral Crisis Response unit's 24/7 service did not begin until 2023.",
    evidenceLinks: [
      {
        label: "Executive Order 2022-02",
        description: "The mayoral order creating the Office of Community Safety.",
        url: "https://minneapolismn.gov/government/mayor/executive-orders/executive-order-2022-02/",
        evidenceType: "policy_document",
        publicationDate: "2022-06-01",
        publisher: "Office of the Mayor of Minneapolis",
        sourceTier: "government",
        sourceKey: "mpls_eo_2022_02",
      },
    ],
    legislation: {
      title: "Executive Order 2022-02: Establishment of the Office of Community Safety",
      billNumber: "EO 2022-02",
      status: "enacted",
      dateEnacted: "2022-06-01",
      url: "https://minneapolismn.gov/government/mayor/executive-orders/executive-order-2022-02/",
      sourceKey: "mpls_eo_2022_02",
    },
  },
  {
    jurisdictionSlug: "minneapolis",
    policyAreaSlug: "alternative-crisis-response",
    stage: 4,
    dataQuality: "estimated",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "The Behavioral Crisis Response (BCR) unit, operated by Canopy Roots under the Office of Community Safety, has run 24/7 citywide since 2023 and responded to roughly 30,000 cumulative calls from December 2021 through April 2025 (over 10,000 in its first full year of 24/7 service alone) — a real, operating, multi-year institution with observable output.",
    limitations:
      "All operating figures are self-reported by the city/operator via local press; no independent outcome evaluation (e.g., effect on use-of-force incidents or overall public-safety outcomes) was located, so stage 5 is not claimed. Separately and materially: the parent Office of Community Safety is institutionally unstable as of this assessment — the City Council voted twice in 2026 (7-6) against reappointing its commissioner, with a councilmember publicly calling OCS 'a failed experiment,' and the mayor has vowed to veto the ouster. This is a live governance dispute, not a settled success, even though BCR itself has kept operating throughout.",
    evidenceLinks: [
      {
        label: "Minneapolis Behavioral Crisis Response — program page",
        description: "City program page describing BCR's scope and 24/7 operation.",
        url: "https://www.minneapolismn.gov/resident-services/public-safety/unarmed-public-safety/behavioral-crisis-response",
        evidenceType: "dataset",
        publicationDate: null,
        publisher: "City of Minneapolis",
        sourceTier: "government",
        sourceKey: "mpls_bcr",
      },
      {
        label: "MinnPost — first full year of 24/7 BCR service",
        description: "Independent local-press reporting on BCR's call volume in its first full year of round-the-clock service.",
        url: "https://www.minnpost.com/public-safety/2024/07/in-first-full-year-of-24-7-service-minneapolis-behavioral-crisis-team-responds-to-more-than-10000-calls/",
        evidenceType: "news_article",
        publicationDate: "2024-07-01",
        publisher: "MinnPost",
        sourceTier: "alternative",
        sourceKey: "minnpost",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "minneapolis",
    policyAreaSlug: "affordable-housing-institution",
    stage: 4,
    dataQuality: "estimated",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "The Affordable Housing Trust Fund is a real, operating production-financing institution: a competitive NOFA-based fund financing 10+-unit affordable/mixed-income rental projects, with the city reporting roughly $400 million invested and 4,679 units produced since 2018 (nearly double the 2011-2017 pace).",
    limitations:
      "Figures are the city's own cumulative self-report (Way Home progress reports), not independently audited, and are not broken out by year in a way that supports a clean multi-year trend claim, so stage 5 is not claimed. The separate 2040 Comprehensive Plan zoning reform (ending single-family-only zoning) is deliberately excluded from this assessment: it is land-use deregulation, not a funded production institution, and its effect on housing supply is genuinely contested (Minneapolis Fed data-tool analysis vs. advocacy critiques disagree on whether the plan itself, versus pre-existing corridor zoning, drove observed multifamily growth). See docs/DSA_RESEARCH_MASTER_REPORT.md for the taxonomy-gap discussion.",
    evidenceLinks: [
      {
        label: "City of Minneapolis — Affordable Housing Trust Fund",
        description: "Program page describing the fund's financing mechanism and eligibility.",
        url: "https://www.minneapolismn.gov/business-services/business-assistance/financing-developers/ahtf/",
        evidenceType: "dataset",
        publicationDate: null,
        publisher: "City of Minneapolis",
        sourceTier: "government",
        sourceKey: "mpls_way_home",
      },
      {
        label: "City of Minneapolis — Way Home Report (October 2025)",
        description: "City reporting cumulative AHTF investment and unit-production totals since 2018.",
        url: "https://www.minneapolismn.gov/news/2025/october/way-home-report",
        evidenceType: "report",
        publicationDate: "2025-10-01",
        publisher: "City of Minneapolis",
        sourceTier: "government",
        sourceKey: "mpls_way_home",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "minneapolis",
    policyAreaSlug: "workforce-development-institution",
    stage: 4,
    dataQuality: "estimated",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "The Minneapolis Workforce Development Board (MWDB), a real WIOA-mandated 21-member board appointed by the mayor and confirmed by Council, oversees CareerForce Minneapolis North/South and the Cedar-Riverside Opportunity Center; the city invests roughly $1.6 million/year in training and employment support for low-income workers.",
    limitations:
      "No independently-measured wage or employment-outcome improvement data was located for MWDB's programs specifically, so stage 5 is not claimed.",
    evidenceLinks: [
      {
        label: "Minneapolis Workforce Development Board",
        description: "City program page describing MWDB's structure, board, and funding.",
        url: "http://www.minneapolismn.gov/cped/metp/MWDB",
        evidenceType: "dataset",
        publicationDate: null,
        publisher: "City of Minneapolis",
        sourceTier: "government",
        sourceKey: "mpls_wdb",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "minneapolis",
    policyAreaSlug: "permitting-modernization",
    stage: 3,
    dataQuality: "estimated",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "The city migrated roughly 15 permit types (event, food, and seasonal vendor permits) to a Smartsheet-based digital workflow with online credit-card payment, cutting administrative review time roughly in half for those permit types.",
    limitations:
      "The reported time-reduction figure is scoped only to event/food/vendor permits, not full building permitting or procurement — treat this as a narrow, real modernization rather than a comprehensive one. No comparable procurement-modernization program or metric was located.",
    evidenceLinks: [
      {
        label: "StateScoop — Minneapolis permitting automation",
        description: "Trade-press coverage of the Smartsheet-based permit-workflow digitization and its reported time savings.",
        url: "https://statescoop.com/automation-slashed-permitting-approval-times-in-minneapolis/",
        evidenceType: "news_article",
        publicationDate: null,
        publisher: "StateScoop",
        sourceTier: "alternative",
        sourceKey: "statescoop_permitting",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "minneapolis",
    policyAreaSlug: "progressive-revenue-institution",
    stage: 2,
    dataQuality: "government",
    assessmentDate: "2023-07-01",
    isCurrent: true,
    evidenceSummary:
      "The Minnesota Legislature created a 0.25% seven-county metro sales tax for affordable housing and homelessness (effective October 2023); Minneapolis receives and administers a designated share (roughly $3.6M initial estimate, ~$6.2M in 2024 collections) toward rent assistance, nonprofit housing grants, and new construction.",
    limitations:
      "This is a regional, state-legislated revenue institution, not one Minneapolis itself created or controls — Minneapolis is a beneficiary/administrator of a slice, not the author. Scored conservatively at stage 2 (enacted, funds flowing to designated uses) rather than higher, since the city did not enact its own progressive revenue mechanism: a separate 2021-23 Minneapolis rent-stabilization effort stalled before any ordinance was enacted, and no city income, wealth, or dedicated real-estate transfer tax was found. See the master report for the city-originated-vs-regional taxonomy note.",
    evidenceLinks: [
      {
        label: "MinnPost — metro sales tax for affordable housing",
        description: "Coverage of the Minnesota Legislature's 2023 metro-area housing sales tax and its city-level allocations.",
        url: "https://www.minnpost.com/state-government/2023/05/minnesota-legislative-big-big-deal-spends-1b-on-affordable-housing-adds-metro-sales-tax/",
        evidenceType: "news_article",
        publicationDate: "2023-05-01",
        publisher: "MinnPost",
        sourceTier: "alternative",
        sourceKey: "minnpost",
      },
    ],
    legislation: {
      title: "Metropolitan Area Housing/Homelessness Sales and Use Tax",
      billNumber: null,
      status: "enacted",
      dateEnacted: "2023-10-01",
      url: "https://www.revenue.state.mn.us/sites/default/files/2023-07/general-notice-metro-area-tax-housing.pdf",
      sourceKey: "mn_metro_sales_tax",
    },
  },
  {
    jurisdictionSlug: "minneapolis",
    policyAreaSlug: "transit-expansion-program",
    stage: 2,
    dataQuality: "estimated",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "The Green Line Extension (Southwest LRT) is under construction but now expected to open in 2027, nearly a decade behind its original schedule; the Blue Line Extension remains in planning/environmental review. Existing Metro Transit ridership fell roughly 4% in 2025 versus 2024 (light rail specifically down about 14%).",
    limitations:
      "Both major capital projects remain funded/under-construction or in planning, not yet operating (stage 2-3 at most), and the existing network's usage trend is a regression, not an improvement — stage 5 is not supportable on current evidence. This is also a Metropolitan Council (regional transit authority) program, not a City of Minneapolis institution — scoring the city administration on transit stages risks misattributing decisions made regionally, flagged explicitly as a governance-layer mismatch in the master report.",
    evidenceLinks: [
      {
        label: "Star Tribune — Southwest LRT delay",
        description: "Coverage of the Green Line Extension's schedule slip to 2027.",
        url: "https://www.startribune.com/metro-transit-southwest-green-line-light-rail/601597185",
        evidenceType: "news_article",
        publicationDate: null,
        publisher: "Star Tribune",
        sourceTier: "alternative",
        sourceKey: "star_tribune",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "minneapolis",
    policyAreaSlug: "public-innovation-investment",
    stage: 0,
    dataQuality: "estimated",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "No dedicated City of Minneapolis venture-capital, equity, or startup-investment vehicle was identified. The city's economic-development functions run through CPED's business-assistance grants/loans (e.g., the Affordable Housing Trust Fund above), not a startup-investment fund; the closest analog, Launch Minnesota, is a State of Minnesota program the city does not control.",
    limitations:
      "This is a real, researched finding of likely absence rather than an unresearched placeholder, but it has not been confirmed by a human researcher directly querying CPED's full program list — see the corresponding ResearchTask before treating 'no vehicle exists' as fully settled.",
    evidenceLinks: [],
    legislation: null,
  },
];
