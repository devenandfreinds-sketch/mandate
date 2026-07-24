/**
 * Washington, D.C. — fifth U.S. jurisdiction with real Institutional Pipeline research (see
 * chicagoResearchedPipeline.ts for the pattern this follows). Mayor Muriel Bowser (2015-present) is
 * a centrist/moderate Democrat, not DSA-affiliated; D.C.'s place in Mandate's "Democratic Socialism"
 * governance model rests on real, separately-documented DSA influence on the D.C. Council, anchored
 * by Ward 4 Councilmember Janeese Lewis George, a verified DSA member since 2018 — see the updated
 * Jurisdiction summary/description for the important, well-evidenced note that Lewis George won the
 * June 2026 Democratic mayoral primary outright and is heavily favored in the November 2026 general,
 * which would make D.C. the second jurisdiction in this model with a DSA-affiliated chief executive.
 * Bowser remains the administration of record as of this research date (2026-07-24).
 *
 * D.C.'s home-rule structure adds a genuine methodological wrinkle not present elsewhere in this
 * governance model: Council-passed legislation is subject to a congressional review period and can
 * be overridden by Congress — and was, in March 2023 (the Revised Criminal Code Act). Where relevant
 * below, "enacted" is qualified with this durability risk rather than treated as unconditional.
 *
 * "progressive-revenue-institution" is the single best-evidenced DSA-attributable outcome chain found
 * across all four newly-researched jurisdictions: the 2021 Council tax increase (led by Lewis George,
 * Nadeau, and Allen, not Bowser) funded the Early Childhood Educator Pay Equity Fund, which has since
 * been independently evaluated by the Urban Institute and Mathematica with quantified retention,
 * employment, and ROI effects — a genuine, credible stage 5 case.
 *
 * "affordable-housing-institution" (Housing Production Trust Fund) is a long-standing, real,
 * well-funded institution, but its own statutory equity requirement (>=50% of dollars to
 * extremely-low-income households) has been persistently missed (18-48% across recent fiscal years)
 * — scored stage 4 with that limitation explicit, not stage 5.
 */
import type { ResearchedPipelineAssessmentSpec } from "./chicagoResearchedPipeline.js";

export const washingtonDcResearchedPipelineAssessments: ResearchedPipelineAssessmentSpec[] = [
  {
    jurisdictionSlug: "washington-dc",
    policyAreaSlug: "affordable-housing-institution",
    stage: 4,
    dataQuality: "government",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "The Housing Production Trust Fund (D.C. Code Section 42-2802), administered by DHCD's Development Finance Division, is a long-standing, real production-financing institution: roughly $1 billion invested since 2015, an estimated 8,200 units preserved/built, with Mayor Bowser investing over $1.3 billion since 2019 specifically. The District separately reported reaching its '36,000 new homes by 2025' goal, with 36,216 total units produced as of July 2024.",
    limitations:
      "HPTF's own statutory requirement that at least 50% of dollars go to extremely-low-income (<=30% AMI) households has been persistently missed: 27% (FY2021), 24% (FY2022), and approximately 48% (FY2023) per DC Fiscal Policy Institute analysis of a 2021 D.C. Auditor report described as 'scathing.' The institution is real and operating with substantial output (stage 4), but this specific statutory improvement metric it was designed to hit is not durably demonstrated, so stage 5 is not claimed on that basis.",
    evidenceLinks: [
      {
        label: "DHCD — Housing Production Trust Fund",
        description: "Official program page for the Housing Production Trust Fund.",
        url: "https://dhcd.dc.gov/page/housing-production-trust-fund",
        evidenceType: "dataset",
        publicationDate: null,
        publisher: "DC Department of Housing and Community Development",
        sourceTier: "government",
        sourceKey: "dc_dhcd_hptf",
      },
      {
        label: "DCFPI — HPTF equity-compliance analysis",
        description: "Independent nonprofit analysis of HPTF's persistent shortfall against its own extremely-low-income spending requirement.",
        url: "https://dcfpi.org/all/groundbreaking-investments-in-affordable-housing-should-come-with-increased-transparency-and-oversight-2/",
        evidenceType: "report",
        publicationDate: null,
        publisher: "DC Fiscal Policy Institute",
        sourceTier: "alternative",
        sourceKey: "dcfpi",
      },
    ],
    legislation: {
      title: "Housing Production Trust Fund (D.C. Code Section 42-2802)",
      billNumber: "D.C. Code Section 42-2802",
      status: "enacted",
      dateEnacted: "1988-01-01",
      url: "https://code.dccouncil.gov/us/dc/council/code/sections/42-2802",
      sourceKey: "dc_dhcd_hptf",
    },
  },
  {
    jurisdictionSlug: "washington-dc",
    policyAreaSlug: "progressive-revenue-institution",
    stage: 5,
    dataQuality: "academic",
    assessmentDate: "2021-07-21",
    isCurrent: false,
    evidenceSummary:
      "The D.C. Council passed a progressive income-tax increase (top rate to 10.75%, new $250K-$500K and $500K-$1M brackets) in the FY2022 budget vote (8-5, July 2021), led by DSA-affiliated Councilmember Janeese Lewis George alongside Nadeau and Allen — not Mayor Bowser. The revenue funded the Early Childhood Educator Pay Equity Fund, administered by OSSE.",
    limitations:
      "See the current assessment for the independent outcome evaluation supporting stage 5.",
    evidenceLinks: [],
    legislation: {
      title: "FY2022 Budget Support Act (progressive income tax increase)",
      billNumber: null,
      status: "enacted",
      dateEnacted: "2021-07-21",
      url: "https://www.commondreams.org/news/2021/07/21/washington-dc-council-approves-transformational-budget-including-tax-increase",
      sourceKey: "city_state_ny",
    },
  },
  {
    jurisdictionSlug: "washington-dc",
    policyAreaSlug: "progressive-revenue-institution",
    stage: 5,
    dataQuality: "academic",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "An independent evaluation by the Urban Institute (with Mathematica) of the Early Childhood Educator Pay Equity Fund — created by the 2021 DSA-affiliated-led tax increase — found 64% of funded educators retained at the same childcare center, roughly 7% growth in field employment (219 teachers), and a 23% one-year return on investment: real, credible, independently-verified outcome evidence of improvement, the strongest such case found across this research pass.",
    limitations:
      "This is the clearest stage-5 case in the entire DSA research expansion, but it should be attributed to the Council (Lewis George/Nadeau/Allen), not to Mayor Bowser's administration, which did not originate this policy.",
    evidenceLinks: [
      {
        label: "Urban Institute / Mathematica — Early Childhood Educator Pay Equity Fund evaluation",
        description: "Independent academic evaluation finding measurable retention, employment, and ROI effects.",
        url: "https://www.urban.org/research/publication/early-educators-reflections-dc-early-childhood-educator-pay-equity-fund",
        evidenceType: "report",
        publicationDate: null,
        publisher: "Urban Institute, with Mathematica",
        sourceTier: "academic",
        sourceKey: "urban_institute_eccpef",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "washington-dc",
    policyAreaSlug: "public-innovation-investment",
    stage: 4,
    dataQuality: "estimated",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "The DC Venture Capital Program ($26 million, SSBCI-funded, administered by K Street Capital with a required 1:1 private match, $250K-$5M per deal) is a real, operating municipal investment vehicle, alongside the pre-existing Inclusive Innovation Equity Impact Fund ($4.2M deployed to 39 businesses).",
    limitations:
      "Operating with observable output (dollar amounts deployed, businesses funded), but no downstream measurable outcome data (job creation, business survival, portfolio returns) was located, so stage 5 is not claimed. This is a Bowser/DMPED-administered, business-development initiative with no documented connection to DSA-aligned legislators.",
    evidenceLinks: [
      {
        label: "DMPED — DC Venture Capital Program",
        description: "Official program description for the $26M SSBCI-funded venture-capital program.",
        url: "https://dmped.dc.gov/page/dc-venture-capital-program",
        evidenceType: "dataset",
        publicationDate: null,
        publisher: "DC Deputy Mayor for Planning and Economic Development",
        sourceTier: "government",
        sourceKey: "dc_mayors_office",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "washington-dc",
    policyAreaSlug: "workforce-development-institution",
    stage: 4,
    dataQuality: "estimated",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "The DC Infrastructure Academy (created March 2018 by mayoral initiative) has served roughly 2,700 residents in its first four years via a 6-month rapid-training model with stipends, reporting a 96% graduation rate.",
    limitations:
      "The 96% figure measures program completion, not post-program employment or wage outcomes — no such labor-market outcome data was located, so stage 5 is not claimed.",
    evidenceLinks: [
      {
        label: "DC.gov — DC Infrastructure Academy opening",
        description: "Mayoral announcement establishing the Academy.",
        url: "https://dc.gov/release/mayor-bowser-opens-dc-infrastructure-academy",
        evidenceType: "policy_document",
        publicationDate: "2018-03-01",
        publisher: "Office of the Mayor of the District of Columbia",
        sourceTier: "government",
        sourceKey: "dc_mayors_office",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "washington-dc",
    policyAreaSlug: "permitting-modernization",
    stage: 4,
    dataQuality: "government",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "DCRA was split into the Department of Licensing & Consumer Protection and the Department of Buildings (October 2022), which now publishes real service-level-agreement compliance figures: reviewer assigned within 2 days (92.8% reliability, 2025), first review within 30 days (97%), and revision review within 15 days (94%).",
    limitations:
      "SLA compliance percentages are real operating outputs, but no multi-year time series showing these percentages improving was located, so stage 5 is not claimed. No comparable procurement-specific (as opposed to permitting-specific) modernization data was found.",
    evidenceLinks: [
      {
        label: "DC Department of Buildings — Plan Review and Permit Timelines SLAs",
        description: "Published service-level-agreement compliance statistics.",
        url: "https://dob.dc.gov/sites/default/files/dc/sites/dob/publication/attachments/Plan%20Review%20and%20Permit%20Timelines%20-%20Service%20Level%20Agreements.pdf",
        evidenceType: "dataset",
        publicationDate: null,
        publisher: "DC Department of Buildings",
        sourceTier: "government",
        sourceKey: "dc_dob_sla",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "washington-dc",
    policyAreaSlug: "alternative-crisis-response",
    stage: 4,
    dataQuality: "estimated",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "The NEAR Act of 2016 created the Office of Neighborhood Safety and Engagement (ONSE) and the Office of Violence Prevention and Health Equity; separately, the Department of Behavioral Health's Community Response Team has diverted mental-health 911 calls from automatic police dispatch since June 2021. ONSE's Pathways transitional-employment program has served roughly 400 participants aged 18-35.",
    limitations:
      "A four-year academic evaluation (Johns Hopkins Center for Gun Violence Solutions with the University of Maryland) of CVI-program effectiveness is underway but not yet published, so stage 5 is not claimed. A separate WJLA investigative audit found governance/integrity issues at ONSE involving violence-interrupter contracts, which should be weighed alongside the program's outputs.",
    evidenceLinks: [
      {
        label: "ONSE — About the Office",
        description: "Program description including Pathways participation figures.",
        url: "https://onse.dc.gov/page/about-onse",
        evidenceType: "dataset",
        publicationDate: null,
        publisher: "DC Office of Neighborhood Safety and Engagement",
        sourceTier: "government",
        sourceKey: "dc_mayors_office",
      },
    ],
    legislation: {
      title: "NEAR Act of 2016",
      billNumber: "D.C. Law 21-125",
      status: "enacted",
      dateEnacted: "2016-01-01",
      url: "https://code.dccouncil.gov/us/dc/council/laws/21-125",
      sourceKey: "dc_mayors_office",
    },
  },
  {
    jurisdictionSlug: "washington-dc",
    policyAreaSlug: "transit-expansion-program",
    stage: 1,
    dataQuality: "estimated",
    assessmentDate: "2026-07-24",
    isCurrent: true,
    evidenceSummary:
      "The DC Streetcar's Benning Road extension was repeatedly delayed since 2021, and the entire DC Streetcar line ceased operation on March 31, 2026, to be replaced by electric buses — a District-specific transit-expansion program that was funded/committed and then reversed. WMATA (a regional, multi-jurisdictional authority DC does not unilaterally control) separately reported 265.7 million total trips in 2025 (+5.8% year-over-year) and expanded Metrobus service as the DC Circulator was phased out.",
    limitations:
      "The one District-specific expansion program tracked here was abandoned rather than completed — a genuine institutional regression, not just missing data. WMATA's real ridership growth is a regional achievement outside District control and is not credited to this jurisdiction's own institution-building.",
    evidenceLinks: [
      {
        label: "Streetcar Coalition — DC Streetcar extension delays",
        description: "Coverage of the repeated delays to the Benning Road extension.",
        url: "https://www.streetcarcoalition.org/d-c-eyes-2026-for-streetcar-extension/",
        evidenceType: "news_article",
        publicationDate: null,
        publisher: "Streetcar Coalition",
        sourceTier: "alternative",
        sourceKey: "dc_mayors_office",
      },
    ],
    legislation: null,
  },
];
