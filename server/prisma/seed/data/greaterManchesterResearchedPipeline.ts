/**
 * Greater Manchester is the second real-research jurisdiction (after Chicago — see
 * chicagoResearchedPipeline.ts for the pattern this follows) and the first non-US case, used to
 * stress-test whether Mandate's architecture generalizes. See docs/GREATER_MANCHESTER_CASE_STUDY.md
 * for full research notes and docs/GREATER_MANCHESTER_RESEARCH_ROADMAP.md for what's deliberately
 * left unresearched.
 *
 * All research below applies to the Greater Manchester Combined Authority (GMCA) jurisdiction row —
 * not Manchester City Council — because GMCA is the actual institutional actor for every pipeline
 * researched here (transport franchising, the housing investment fund, and devolved skills funding
 * are all GMCA-level powers, not Manchester-borough-level ones). See the case study for why no
 * borough-level Jurisdiction rows were created this pass.
 *
 * "transit-expansion-program" (Bee Network bus franchising) — four assessments spanning 2017-2025.
 * Scored stage 4 as of the current (5 Jan 2025) row: 100% of the Greater Manchester bus network is
 * now under public franchise control, with real TfGM-published patronage/punctuality data spanning
 * over a year. This is scored independently of Metrolink/rail integration under the same Bee Network
 * brand, which remains stage 1-2 (a committed Dec 2026 rail-integration date exists but has not yet
 * occurred) — see limitations on the current row for why the composite is NOT held down to rail's
 * lower stage: bus franchising is a complete, independently-authorized institutional transformation
 * of the dominant transit mode by ridership, not one unfinished sub-project within a single unified
 * program (contrast with Chicago's transit-expansion-program, where the flagship project itself
 * remains under construction). Stage 5 is deliberately NOT claimed: only ~1 year of full-network data
 * exists, an academic source (with a disclosed TfGM/DfT funding relationship) found benefits
 * concentrated in central Manchester with peripheral boroughs still underserved, a bus-operator trade
 * body's rising-subsidy-cost claim (£227m/year) is unverified by any independent source, and no
 * arm's-length multi-year outcomes audit (NAO or academic) yet exists.
 *
 * "affordable-housing-institution" (Greater Manchester Housing Investment Loans Fund) — three
 * assessments spanning 2014-2024. GMHILF is a decade-old, still-operating revolving loan fund with
 * real lending/completion data and at least one independent evaluation. Stage 5 is NOT claimed: that
 * evaluation was reactive (commissioned only after sustained media/political pressure in 2024, not a
 * routine review cycle), GMCA's own "11,000 homes" claim does not reconcile with the independent
 * evaluation's ~7,800-completed figure (reported via investigative journalism, not a directly-read
 * primary evaluation document), and funding was found heavily concentrated toward one developer
 * (Renaker) and central Manchester, undercutting GMCA's "across all ten boroughs" framing. Two other
 * real GM housing institutions were researched but are NOT separately modeled here — the GM
 * Brownfield Housing Fund (stage 3: real disbursements against named schemes, but almost all public
 * "homes delivered" figures found are funding-tranche targets, not confirmed completions) and Places
 * for Everyone, the joint spatial development plan covering 9 of 10 boroughs (formally adopted 21 Mar
 * 2024, in real documented use in individual planning decisions through 2025 — arguably stage 4 in
 * its own right) — see docs/GREATER_MANCHESTER_CASE_STUDY.md for why the current PolicyArea taxonomy
 * can only cleanly hold one "current" institution per (jurisdiction, policyArea) pair, and why Places
 * for Everyone in particular doesn't fit any of Mandate's existing 7 policy areas.
 *
 * "workforce-development-institution" (devolved Adult Education Budget / Adult Skills Fund) — three
 * assessments spanning 2017-2023. GMCA has directly administered this devolved budget since 1 Aug
 * 2019 with multiple years of real participation data. Stage 5 is deliberately NOT claimed: GMCA's
 * own commissioned, methodologically independent evaluators (Institute for Employment Studies with
 * Learning and Work Institute, 2023) stated in their own report that "robust evidence and data on
 * wider outcomes and impact of learning are not available" — this is the single most load-bearing
 * fact for this pipeline's conservative scoring, and is preserved verbatim in the evidence below
 * rather than summarized away.
 *
 * "alternative-crisis-response" (Right Care, Right Person / Mental Health Tactical Advice Service) —
 * two assessments spanning 2018-2024. This REPLACES a synthetic placeholder that had incorrectly
 * claimed stage 4 ("established track record with measurable, improving outcomes") on
 * dataQuality: "placeholder" — a serious overclaim caught during the flagship-case-study pass. The
 * real institution is a call-triage/diversion policy (Right Care, Right Person, GM-wide from 30 Sept
 * 2024) layered onto an existing police-NHS liaison desk (MHTAS, running since 2018) — not a dedicated
 * alternative-responder field unit in the US CAHOOTS/STAR/CARE sense. Capped at stage 3, NOT 4: GMP was
 * explicitly excluded from the only independent national process evaluation of RCRP (GOV.UK, Dec 2024),
 * and a July 2025 coronial Prevention of Future Deaths report documents a live, unresolved safety
 * controversy with a GM RCRP-related case. Serenity Integrated Mentoring (SIM), a nationally-scrutinized
 * scheme sometimes confused with GM crisis-response programs, is confirmed NOT in use here (Health
 * Innovation Manchester's own page states this directly) — a researched dead end, not silently omitted.
 *
 * "public-innovation-investment" (GC Angels / The Enterprise Fund Limited) — two assessments spanning
 * 2018-2025. This REPLACES a synthetic stage-1 placeholder. GC Angels is an FCA-regulated early-stage
 * investment vehicle operated by The Enterprise Fund Limited (a Growth Company subsidiary) under a
 * recurring GMCA public-funding relationship (confirmed via a 28 March 2025 GMCA decision awarding
 * £1m of Retained Business Rates funding for FY2025-26 delivery) — GMCA is a funder/commissioner, not
 * a board-level governor. Northern Gritstone, a university-spinout fund sometimes assumed to be a GM
 * public institution, is a confirmed dead end for this PolicyArea: GMCA made a one-off £1.5m investment
 * (25 Mar 2022) among a dozen+ institutional/private backers, with no board seat or governance role —
 * a private vehicle GMCA co-invested in, not a GMCA institution.
 *
 * "progressive-revenue-institution" — one assessment (2024), dataQuality: "unavailable" rather than a
 * scored stage. This is a deliberate, researched "no clean fit" finding, not an unresearched gap: GM's
 * one genuine, well-evidenced revenue institution (100% Business Rates Retention, piloted 2017,
 * permanent since 1 Apr 2024 under the March 2023 Trailblazer devolution deal, funding a ~£2bn
 * investment vehicle) redistributes revenue BETWEEN TIERS of government (central to local), not
 * between income groups — UK local government structurally lacks a US-style progressive tax
 * institution (council tax is a flat banded property tax; there is no local income tax). Every
 * genuinely redistributive/equity-framed revenue tool GM considered (the 2008 congestion charge,
 * rejected 78.8% in referendum; the 2018 workplace parking levy, rejected by council leadership; the
 * 2022 charging Clean Air Zone, approved then scrapped before ever charging a driver) died before
 * collecting a single pound. See docs/GREATER_MANCHESTER_CASE_STUDY.md for the full writeup and a
 * flagged recommendation to rename/reframe this PolicyArea (e.g. "Fiscal Devolution Institution")
 * rather than "Progressive" — a taxonomy question requiring methodology-lead sign-off, not implemented.
 *
 * "permitting-modernization" remains the synthetic placeholder generator's output — the one candidate
 * investigated (Places for Everyone, the 9-borough joint spatial plan) was found to be a genuine
 * category mismatch (a strategic land-use allocation plan, not an individual permit/procurement
 * process reform) and is documented separately under "affordable-housing-institution" and in the case
 * study rather than scored here. See docs/GREATER_MANCHESTER_CASE_STUDY.md for the recommendation that
 * Mandate consider a new "Regional Spatial Planning" PolicyArea to hold Places for Everyone and similar
 * joint development plans cleanly — also pending methodology-lead sign-off. Whether a genuine,
 * different GM permitting/procurement-reform institution exists (distinct from PfE) remains an open
 * question for a future research pass.
 */

import type { ResearchedPipelineAssessmentSpec } from "./chicagoResearchedPipeline.js";

export const greaterManchesterResearchedPipelineAssessments: ResearchedPipelineAssessmentSpec[] = [
  // ===================== Transit: Bee Network bus franchising =====================
  {
    jurisdictionSlug: "greater-manchester",
    policyAreaSlug: "transit-expansion-program",
    stage: 1,
    dataQuality: "government",
    assessmentDate: "2017-05-01",
    isCurrent: false,
    evidenceSummary:
      "The Bus Services Act 2017 came into force, granting mayoral combined authorities (including GMCA, following Andy Burnham's May 2017 election as the first Mayor of Greater Manchester) statutory powers to pursue bus franchising as an alternative to deregulated commercial operation.",
    limitations: "This is the enabling legal framework only; GMCA had not yet decided to use these powers.",
    evidenceLinks: [
      {
        label: "Bus Services Act 2017 (House of Commons Library briefing)",
        description: "Explains the franchising powers the Act grants to mayoral combined authorities.",
        url: "https://commonslibrary.parliament.uk/research-briefings/CBP-7545/",
        evidenceType: "report",
        publicationDate: null,
        publisher: "House of Commons Library",
        sourceTier: "government",
        sourceKey: null,
      },
    ],
    legislation: {
      title: "Bus Services Act 2017",
      billNumber: null,
      status: "enacted",
      dateEnacted: "2017-04-27",
      url: "https://commonslibrary.parliament.uk/research-briefings/CBP-7545/",
      sourceKey: null,
    },
  },
  {
    jurisdictionSlug: "greater-manchester",
    policyAreaSlug: "transit-expansion-program",
    stage: 2,
    dataQuality: "government",
    assessmentDate: "2021-03-30",
    isCurrent: false,
    evidenceSummary:
      "GMCA formally made the Greater Manchester Franchising Scheme for Buses 2021 on 30 March 2021, following a 9-1 AGMA leaders vote on 25 March 2021 and two public consultations (the second re-run to account for COVID-19's impact on the bus market). Two bus operators (Rotala, Stagecoach) filed Judicial Review claims; the High Court dismissed them on 9 March 2022 and the Court of Appeal unanimously upheld that ruling on 25 July 2022 (Rotala Plc v GMCA, [2022] EWCA Civ 1048), after which Rotala took no further action.",
    limitations: "Legal authorization is complete and litigation-tested, but no bus route had yet come under public control at this date.",
    evidenceLinks: [
      {
        label: "Rotala Plc v Greater Manchester Combined Authority [2022] EWCA Civ 1048",
        description: "Court of Appeal judgment unanimously dismissing the operators' legal challenge to the franchising scheme.",
        url: "https://caselaw.nationalarchives.gov.uk/ewca/civ/2022/1048",
        evidenceType: "legislation_text",
        publicationDate: "2022-07-25",
        publisher: "Courts and Tribunals Judiciary (National Archives)",
        sourceTier: "government",
        sourceKey: null,
      },
    ],
    legislation: {
      title: "The Greater Manchester Franchising Scheme for Buses 2021",
      billNumber: null,
      status: "enacted",
      dateEnacted: "2021-03-30",
      url: "https://democracy.greatermanchester-ca.gov.uk/documents/s14258/Final%20franchsing%20scheme%2025.3%20DN.pdf",
      sourceKey: "gmca_bee_network_franchising",
    },
  },
  {
    jurisdictionSlug: "greater-manchester",
    policyAreaSlug: "transit-expansion-program",
    stage: 3,
    dataQuality: "government",
    assessmentDate: "2023-09-24",
    isCurrent: false,
    evidenceSummary:
      "Tranche 1 went live on 24 September 2023 — the first buses under public control in England outside London in roughly 40 years, covering Bolton, Wigan, and parts of Bury and Salford (188 routes). The franchising institution and its tranche-based rollout machinery is now real and operating, though covering only part of the network.",
    limitations: "Only ~188 of the network's routes were under franchise control at this point; the institution is proven but not yet network-wide.",
    evidenceLinks: [
      {
        label: "Greater Manchester bus franchising first tranche goes live",
        description: "Trade-press confirmation of the Tranche 1 launch date, area, and route count.",
        url: "https://www.route-one.net/bus/greater-manchester-bus-franchising-first-tranche-goes-live/",
        evidenceType: "article",
        publicationDate: "2023-09-24",
        publisher: "route-one",
        sourceTier: "alternative",
        sourceKey: null,
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "greater-manchester",
    policyAreaSlug: "transit-expansion-program",
    stage: 4,
    dataQuality: "government",
    assessmentDate: "2025-01-05",
    isCurrent: true,
    evidenceSummary:
      "Tranche 3 (Stockport, Tameside, Trafford, remaining Manchester/Salford, 248 routes) went live on 5 January 2025, completing 100% franchising of the Greater Manchester bus network — the only fully-implemented bus franchising scheme in England, per the National Audit Office's June 2025 review (five other mayoral combined authorities have completed only franchising assessments). TfGM-published data show 58.6 million passenger journeys in Tranche 1's first year, rolling annual patronage above the pre-pandemic peak as of early 2025, and punctuality rising from 66% to 80% (later 82.7%) across the first two tranches. This is real, TfGM-reported operating output, corroborated across multiple independent trade-press and GMCA committee sources — not merely an announcement.",
    limitations:
      "Not scored stage 5: (1) an academic source (Karen Lucas, University of Manchester, writing in The Conversation, ~Jul 2026 — though she discloses DfT/TfGM funding and consulting relationships) finds network benefits concentrated in central Manchester, with peripheral boroughs (Oldham, Rochdale, Wigan) still experiencing transport-related social exclusion; (2) a bus-operator trade body (CPT) claims net annual GM bus spending has risen to £227m/year, and argues punctuality gains came from paying for more contracted vehicles rather than solving underlying congestion — this cost claim is NOT independently verified by any source found; (3) only ~1 year of full-network (all 3 tranches) data exists as of this assessment; (4) driver-shortage and reliability problems were real at both the Tranche 1 and Tranche 2 launches. Separately, rail/Metrolink integration under the same Bee Network brand remains at stage 1-2: physical tram rebranding is a partial, ongoing rollout, and the first actual rail-line integration (Glossop and Stalybridge lines) is a committed but not-yet-occurred date of 13 December 2026 — this composite pipeline score reflects the bus franchising institution specifically, which is a complete and independently-authorized transformation of the dominant transit mode, not a partial sub-project of one unified program (contrast Chicago's transit-expansion-program, where the flagship project itself remains under construction and drags down the whole composite).",
    evidenceLinks: [
      {
        label: "Greater Manchester Becomes First Place in England to Retake Control of Buses After 40 Years of Deregulation",
        description: "GMCA's own press release confirming the 5 Jan 2025 completion of full-network franchising.",
        url: "https://www.greatermanchester-ca.gov.uk/news/greater-manchester-becomes-first-place-in-england-to-retake-control-of-buses-after-40-years-of-deregulation-with-historic-bee-network-launch/",
        evidenceType: "article",
        publicationDate: "2025-01-05",
        publisher: "Greater Manchester Combined Authority",
        sourceTier: "government",
        sourceKey: "gmca_bee_network_tranche3_launch",
      },
      {
        label: "Local Bus Services in England (HC 949)",
        description: "NAO confirmation that GM is the only fully-implemented bus franchising case in England, plus the GMCA-estimated £134.5m transition cost.",
        url: "https://www.nao.org.uk/wp-content/uploads/2025/06/local-bus-services-in-england.pdf",
        evidenceType: "report",
        publicationDate: "2025-06-27",
        publisher: "National Audit Office",
        sourceTier: "government",
        sourceKey: "nao_local_bus_services_2025",
      },
      {
        label: "Yes, Burnham's Bee Network Has Transformed Central Manchester, But That's Not the Whole Picture",
        description: "Academic finding that benefits are concentrated centrally, with peripheral boroughs still underserved; discloses a DfT/TfGM funding relationship.",
        url: "https://theconversation.com/yes-burnhams-bee-network-has-transformed-central-manchester-but-thats-not-the-whole-picture-287437",
        evidenceType: "article",
        publicationDate: "2026-07-17",
        publisher: "The Conversation (Karen Lucas, University of Manchester)",
        sourceTier: "academic",
        sourceKey: "conversation_lucas_gm_transport_2026",
      },
      {
        label: "Beneath the Yellow Paint: How Successful Are Manchester's Bee Network Buses?",
        description: "Bus-operator trade body critique arguing punctuality gains came from added contracted capacity, not solving congestion; cites an unverified £227m/year cost figure.",
        url: "https://www.cpt-uk.org/blogs/beneath-the-yellow-paint-how-successful-are-manchester-s-bee-network-buses/",
        evidenceType: "article",
        publicationDate: null,
        publisher: "Confederation of Passenger Transport (bus-operator trade body — institutional interest against public franchising)",
        sourceTier: "alternative",
        sourceKey: null,
      },
    ],
    legislation: null,
  },

  // ===================== Housing: GM Housing Investment Loans Fund =====================
  {
    jurisdictionSlug: "greater-manchester",
    policyAreaSlug: "affordable-housing-institution",
    stage: 2,
    dataQuality: "government",
    assessmentDate: "2014-11-01",
    isCurrent: false,
    evidenceSummary:
      "The first 'DevoManc' devolution deal (November 2014) formally designated housing investment as a devolved policy area for Greater Manchester, the binding intergovernmental instrument that authorized what became the Housing Investment Loans Fund.",
    limitations: "A policy designation, not yet an operating fund.",
    evidenceLinks: [],
    legislation: {
      title: "Greater Manchester Devolution Agreement (November 2014)",
      billNumber: null,
      status: "enacted",
      dateEnacted: "2014-11-03",
      url: "https://www.greatermanchester-ca.gov.uk/media/4695",
      sourceKey: null,
    },
  },
  {
    jurisdictionSlug: "greater-manchester",
    policyAreaSlug: "affordable-housing-institution",
    stage: 3,
    dataQuality: "government",
    assessmentDate: "2015-07-01",
    isCurrent: false,
    evidenceSummary:
      "The Greater Manchester Housing Investment Loans Fund (GMHILF) opened for business in July 2015 as a government-capitalized (£300m), 10-year revolving loan fund administered directly by GMCA (loans approved by the Chief Executive and Portfolio Lead for Housing; agreements executed by the Treasurer and Monitoring Officer) — a real, structured institution, not a grant program or arm's-length joint venture.",
    limitations: "Institution created and structurally confirmed; no delivery outcomes yet at this date.",
    evidenceLinks: [],
    legislation: null,
  },
  {
    jurisdictionSlug: "greater-manchester",
    policyAreaSlug: "affordable-housing-institution",
    stage: 4,
    dataQuality: "alternative",
    assessmentDate: "2024-08-01",
    isCurrent: true,
    evidenceSummary:
      "By 2024/25, GMCA's own reporting claims the fund has recycled more than 3 times over, cumulative lending of roughly £1bn, '11,000 homes delivered,' and zero loan defaults. A GMCA-commissioned independent evaluation (summer 2024, reported via investigative journalism) found a materially different, more precisely sourced figure: approximately 7,800 homes completed at an 84% completion rate — plus £29m profit to GMCA and £20.9m to central government. This is real, decade-long operating output from a durable institution.",
    limitations:
      "Scored dataQuality 'alternative' rather than 'government' because the load-bearing current-status evidence (the ~7,800-home independent count) reaches Mandate only through investigative journalism describing an evaluation Mandate could not read directly — not a directly-cited primary evaluation document. Two further limitations argue against stage 5: the evaluation was reactive (commissioned only after sustained media and political pressure, not a routine institutionalized review cycle), and the same investigation found funding 'heavily skewed' toward a single developer (Renaker) and Manchester city-centre schemes, with Wigan, Bolton, and Bury receiving minimal allocations — undercutting GMCA's 'across all ten boroughs' framing. GMCA's own '11,000 homes' claim and the independent ~7,800 figure are both preserved here rather than averaged or silently reconciled. Two other real GM housing institutions exist but are not separately modeled under this PolicyArea (see file header): the GM Brownfield Housing Fund (stage 3 — real disbursements, but delivery evidence is almost entirely funding-tranche targets, not confirmed completions) and Places for Everyone (the joint spatial plan, formally adopted 21 Mar 2024 and in real documented planning-decision use through 2025 — arguably stage 4 in its own right, but a genuinely distinct kind of institution that doesn't fit this or any existing PolicyArea cleanly).",
    evidenceLinks: [
      {
        label: "Heavily Skewed: How Burnham's Fund Turned Renaker Into a Giant",
        description: "Investigative journalism on GMHILF's independent evaluation: ~7,800 homes completed (84% completion rate) vs. GMCA's '11,000' claim, plus developer/geographic concentration findings.",
        url: "https://manchestermill.co.uk",
        evidenceType: "article",
        publicationDate: null,
        publisher: "The Mill (Manchester)",
        sourceTier: "alternative",
        sourceKey: "themill_gmhilf_investigation_2024",
      },
    ],
    legislation: null,
  },

  // ===================== Workforce: devolved Adult Education Budget / Adult Skills Fund =====================
  {
    jurisdictionSlug: "greater-manchester",
    policyAreaSlug: "workforce-development-institution",
    stage: 2,
    dataQuality: "government",
    assessmentDate: "2017-11-01",
    isCurrent: false,
    evidenceSummary:
      "The sixth Greater Manchester devolution deal (November 2017) formally added post-16 education and training to GMCA's devolved powers, the binding authorization for what became direct GMCA control of the Adult Education Budget.",
    limitations: "Formal authorization only; the actual budget transfer had not yet occurred.",
    evidenceLinks: [],
    legislation: {
      title: "Greater Manchester Devolution Agreement — Post-16 Education and Training (Deal 6, November 2017)",
      billNumber: null,
      status: "enacted",
      dateEnacted: "2017-11-01",
      url: "https://www.greatermanchester-ca.gov.uk/media/4695",
      sourceKey: null,
    },
  },
  {
    jurisdictionSlug: "greater-manchester",
    policyAreaSlug: "workforce-development-institution",
    stage: 3,
    dataQuality: "government",
    assessmentDate: "2019-08-01",
    isCurrent: false,
    evidenceSummary:
      "GMCA formally assumed control of the Adult Education Budget on 1 August 2019 (the national transfer, originally planned for 2018/19, was delayed a year), taking over roughly £92-96m/year previously administered centrally by the ESFA. GMCA administers it directly as a budget line under its own published Funding and Performance Management Rules, not through a separate legal entity.",
    limitations: "Legal/administrative transfer complete; no real operating-output data existed yet at this date.",
    evidenceLinks: [
      {
        label: "Devolution of the Adult Education Budget (CBP-8596)",
        description: "House of Commons Library briefing confirming the 1 August 2019 transfer date and its national context.",
        url: "https://commonslibrary.parliament.uk/",
        evidenceType: "report",
        publicationDate: null,
        publisher: "House of Commons Library",
        sourceTier: "government",
        sourceKey: "hoc_library_aeb_devolution",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "greater-manchester",
    policyAreaSlug: "workforce-development-institution",
    stage: 4,
    dataQuality: "government",
    assessmentDate: "2023-06-01",
    isCurrent: true,
    evidenceSummary:
      "GMCA has published multiple years of real participation data under its devolved authority: over 51,000 residents accessed skills/training in the budget's first period since devolution (per its March 2021 annual report, which also documents COVID-specific responses — key-worker training, redundancy-risk support, a GM ESOL Advice Service launched with 7 councils — that a centrally-run scheme would not have tailored the same way), and 17,460 national-entitlement enrolments in the 2023/24 academic year (18.8% of all such enrolments nationally). This is real, durable, multi-year operating output under direct GMCA administration.",
    limitations:
      "Deliberately NOT scored stage 5, and this is the single most load-bearing fact in this pipeline's scoring: GMCA's own commissioned, methodologically independent evaluators (Institute for Employment Studies, with Learning and Work Institute and BMG Research, 2023) stated in their own findings that 'currently robust evidence and data on wider outcomes and impact of learning are not available to support policy development in GM.' Any claim that devolution has improved outcomes versus the prior centrally-run system is, by the evaluators' own admission, not yet independently verified — logged here as claimed-but-unverified rather than counted as stage-5 evidence. A reported £9m underspend in 2022 (attributed to falling post-pandemic enrolments) is separately noted as a sign of real operational strain, not fabricated to look smoother than it is. Exact publication month of the IES evaluation could not be independently confirmed beyond '2023' — the assessment date above is a defensible approximation, not a verified exact date.",
    evidenceLinks: [
      {
        label: "More than 51,000 Greater Manchester Residents Benefit From Devolved Adult Education Budget",
        description: "GMCA's first AEB annual report since devolution: participation figures and COVID-era program adaptations.",
        url: "https://www.fenews.co.uk",
        evidenceType: "report",
        publicationDate: "2021-03-19",
        publisher: "Greater Manchester Combined Authority (via FE News)",
        sourceTier: "government",
        sourceKey: "gmca_aeb_annual_report_2021",
      },
      {
        label: "Greater Manchester Adult Skills Programmes Evaluation",
        description: "GMCA's own commissioned independent evaluators stating that robust outcome/impact data does not yet exist for the devolved programme.",
        url: "https://www.employment-studies.co.uk/",
        evidenceType: "report",
        publicationDate: null,
        publisher: "Institute for Employment Studies (with Learning and Work Institute, BMG Research)",
        sourceTier: "academic",
        sourceKey: "ies_gm_adult_skills_evaluation_2023",
      },
    ],
    legislation: null,
  },

  // ===================== Alternative Crisis Response: Right Care, Right Person / MHTAS =====================
  {
    jurisdictionSlug: "greater-manchester",
    policyAreaSlug: "alternative-crisis-response",
    stage: 3,
    dataQuality: "government",
    assessmentDate: "2018-01-01",
    isCurrent: false,
    evidenceSummary:
      "The Mental Health Tactical Advice Service (MHTAS) was established within Greater Manchester Police's Vulnerability Support Unit as a four-way partnership (Greater Manchester Mental Health NHS FT, Pennine Care NHS FT, GMP, and GM integrated care partners) — a real, named, funded institution providing 24/7 real-time clinical phone/video guidance to officers handling mental-health-related calls, and supporting Section 136 detention decisions. GMMH's own reporting states MHTAS has trained over 2,000 GMP officers.",
    limitations:
      "Exact founding month/day could not be independently confirmed beyond '2018' -- the assessment date above is a defensible approximation, not a verified exact date. This is a call-triage/clinical-advice desk supporting officers, not a dedicated field unit dispatched instead of police (contrast US CAHOOTS/STAR/CARE models) -- scored as institution creation (stage 3) on that basis, not as a full alternative-response program yet.",
    evidenceLinks: [
      {
        label: "Mental Health Tactical Advice Service (MHTAS)",
        description: "GMMH's own page describing MHTAS's four-way partnership structure and function within GMP's Vulnerability Support Unit.",
        url: "https://www.gmmh.nhs.uk/mental-health-tactical-advice-service",
        evidenceType: "report",
        publicationDate: null,
        publisher: "Greater Manchester Mental Health NHS Foundation Trust",
        sourceTier: "government",
        sourceKey: "gmmh_mhtas",
      },
      {
        label: "GMMH Tactical Advice Service (MHTAS) Delivers Training to Over 2,000 GMP Officers",
        description: "GMMH news item documenting MHTAS training reach across GMP.",
        url: "https://www.gmmh.nhs.uk/news/gmmh-tactical-advice-service-mhtas-delivers-training-to-over-2000-greater-manchester-police-officers-6667",
        evidenceType: "article",
        publicationDate: null,
        publisher: "Greater Manchester Mental Health NHS Foundation Trust",
        sourceTier: "government",
        sourceKey: "gmmh_mhtas",
      },
    ],
    legislation: {
      title: "GMCA Decision: Mental Health Tactical Advice (A0785)",
      billNumber: null,
      status: "enacted",
      dateEnacted: null,
      url: "https://democracy.greatermanchester-ca.gov.uk/ieDecisionDetails.aspx?Id=1269",
      sourceKey: "gmca_decision_records",
    },
  },
  {
    jurisdictionSlug: "greater-manchester",
    policyAreaSlug: "alternative-crisis-response",
    stage: 3,
    dataQuality: "government",
    assessmentDate: "2024-09-30",
    isCurrent: true,
    evidenceSummary:
      "Greater Manchester Police implemented Right Care, Right Person (RCRP) across all 10 boroughs on 30 September 2024, following the national College of Policing/Home Office partnership framework. RCRP formally redirects 'concern for welfare' calls -- mental health episodes without immediate life risk, physical-health/social-care issues, medical/care-setting walkouts -- from police response toward health and social-care providers, operating through the existing MHTAS/Vulnerability Support Unit structure. This is a real, GM-wide, dated policy change, not an announcement.",
    limitations:
      "Deliberately capped at stage 3, not 4: (1) the only independent national process evaluation of RCRP (GOV.UK, published 3 Dec 2024) explicitly did NOT include Greater Manchester Police among either its 3 pseudo-anonymised process-evaluation forces or its 5 named data-monitoring forces -- there is no independent outcome data for the GM implementation specifically; (2) a Prevention of Future Deaths report (judiciary.uk, ref. 2025-0342, 7 July 2025, concerning Elaine Tarbuck) directly scrutinizes GMP's RCRP-related handling of a March 2025 concern-for-welfare 999 call, raising matters of concern about triage assessment and forced entry under the new model -- a live, unresolved safety controversy, not evidence of improving outcomes; (3) the national evaluation itself found 'capacity and resourcing limitations within health and social care' as the main barrier, and NHS Confederation has publicly warned of risks from forces' 'rushed withdrawal' from mental-health calls nationally. Separately confirmed as NOT applicable to Greater Manchester: Serenity Integrated Mentoring (SIM), a nationally-scrutinized high-intensity-user scheme sometimes confused with GM crisis-response programs -- Health Innovation Manchester's own page states SIM 'is not in place in Greater Manchester and East Cheshire.' A GM Health and Social Care Partnership-funded VCFSE 'crisis spaces' program (an out-of-hours A&E alternative, distinct from a 999-call diversion) was identified as a possible further lead but could not be independently verified this pass (source page returned a bot-verification wall) -- flagged for a future follow-up, not folded into this assessment.",
    evidenceLinks: [
      {
        label: "Right Care, Right Person — Greater Manchester Police",
        description: "GMP's own advice page confirming GM-wide RCRP implementation from 30 September 2024 and its scope (concern-for-welfare calls).",
        url: "https://www.gmp.police.uk/advice/advice-and-information/concern-for-welfare/right-care-right-person",
        evidenceType: "report",
        publicationDate: "2024-09-30",
        publisher: "Greater Manchester Police",
        sourceTier: "government",
        sourceKey: "gmp_rcrp",
      },
      {
        label: "Evaluating the Implementation of Right Care, Right Person",
        description: "National process evaluation explicitly excluding GMP from its process-evaluation and data-monitoring force samples; finds health/social-care capacity as the main implementation barrier nationally.",
        url: "https://www.gov.uk/government/publications/evaluating-the-implementation-of-right-care-right-person",
        evidenceType: "report",
        publicationDate: "2024-12-03",
        publisher: "Home Office / College of Policing",
        sourceTier: "government",
        sourceKey: "govuk_rcrp_evaluation",
      },
      {
        label: "Prevention of Future Deaths Report 2025-0342 (Elaine Tarbuck) — GMP Response",
        description: "Coronial report and GMP's response documenting a live safety controversy in a GM RCRP-related concern-for-welfare case, March 2025.",
        url: "https://www.judiciary.uk/wp-content/uploads/2025/07/2025-0342-Response-from-Greater-Manchester-Police.pdf",
        evidenceType: "report",
        publicationDate: "2025-07-07",
        publisher: "HM Courts & Tribunals Service (Coroners)",
        sourceTier: "government",
        sourceKey: "judiciary_pfd_reports",
      },
      {
        label: "Serenity Integrated Mentoring (SIM) — not in place in Greater Manchester",
        description: "Health Innovation Manchester's own confirmation that SIM, a nationally-scrutinized scheme, is not used in Greater Manchester or East Cheshire -- a researched dead end for this jurisdiction.",
        url: "https://healthinnovationmanchester.com/our-work/serenity-integrated-mentoring-sim/",
        evidenceType: "report",
        publicationDate: null,
        publisher: "Health Innovation Manchester",
        sourceTier: "government",
        sourceKey: null,
      },
    ],
    legislation: {
      title: "Right Care, Right Person — Greater Manchester Police implementation",
      billNumber: null,
      status: "enacted",
      dateEnacted: "2024-09-30",
      url: "https://www.gmp.police.uk/advice/advice-and-information/concern-for-welfare/right-care-right-person",
      sourceKey: "gmp_rcrp",
    },
  },

  // ===================== Public Innovation & Startup Investment: GC Angels / The Enterprise Fund =====================
  {
    jurisdictionSlug: "greater-manchester",
    policyAreaSlug: "public-innovation-investment",
    stage: 3,
    dataQuality: "government",
    assessmentDate: "2018-01-01",
    isCurrent: false,
    evidenceSummary:
      "GC Angels, delivered as a service of The Enterprise Fund Limited (TEF, company no. 04460763, FCA-regulated FRN 727252, a Growth Company subsidiary), began operating its early-stage equity investment programme in Greater Manchester, providing £25,000-£2m deals to digital/creative/technology startups alongside a network of 400+ angel investors.",
    limitations:
      "Exact founding date is genuinely disputed across sources: GC Angels' own 'about us' page cites a ~2015 origin, while multiple secondary sources describe 'over 50 investments since 2018' as the more commonly-cited activity start -- 2018 is used here as the more conservative, corroborated anchor. Scored stage 3 (institution created) at this date on the basis of TEF's formal regulated status and operating history; GMCA's own recurring public-funding relationship (the load-bearing government-tier evidence for this PolicyArea) is not yet established at this early date -- see the 2025 assessment below.",
    evidenceLinks: [
      {
        label: "GC Angels — About Us",
        description: "GC Angels' own description of its founding, structure as a service of The Enterprise Fund Limited, and investment activity.",
        url: "https://gcangels.uk/",
        evidenceType: "report",
        publicationDate: null,
        publisher: "The Enterprise Fund Limited",
        sourceTier: "alternative",
        sourceKey: "gcangels_tef",
      },
    ],
    legislation: null,
  },
  {
    jurisdictionSlug: "greater-manchester",
    policyAreaSlug: "public-innovation-investment",
    stage: 4,
    dataQuality: "government",
    assessmentDate: "2025-03-28",
    isCurrent: true,
    evidenceSummary:
      "GMCA formally awarded £1,000,000 of Retained Business Rates funding to The Enterprise Fund Limited on 28 March 2025 specifically to deliver the GC Angels early-stage innovation funding scheme for FY2025-26 -- confirming a recurring, named public-funding/commissioning relationship (the same governance pattern GMCA uses for its Housing Investment Loans Fund). Independent trade-press and data-aggregator coverage corroborates ongoing operating output beyond GC Angels' own self-reporting: in March 2026, GC Angels led four investments totaling £1.87m; portfolio company counts of 27-49 (varying slightly by tracker) and cumulative follow-on funding of roughly £34m raised by portfolio companies are reported across Tracxn, Crunchbase, and CB Insights.",
    limitations:
      "GMCA is confirmed as a recurring public funder/commissioner, not a board-level governor -- GC Angels does not take board director seats in investee companies (observer seat plus accounts access only), and GMCA holds no seat on TEF/GC Angels itself; funding is awarded via annual committee decisions, not ownership. Portfolio-count and capital-mobilized figures vary meaningfully across independent trackers (27 to 49 companies depending on source and date), so these should be read as an approximate, corroborated range rather than a single precise official count -- no single audited output report was found. Not scored stage 5: no source demonstrates a trend of improving outcomes over time (e.g., year-over-year survival or follow-on-funding-rate improvement against a benchmark) -- only cumulative totals exist. Northern Gritstone, a university-spinout investment fund GMCA made a one-off £1.5m investment in (25 March 2022, among a dozen+ institutional/private backers with no GMCA board seat or governance role), is a confirmed dead end for this PolicyArea and is not the institution scored here.",
    evidenceLinks: [
      {
        label: "GMCA Decision: Funding to The Enterprise Fund (GC Angels)",
        description: "GMCA's formal decision awarding £1m of Retained Business Rates funding to deliver GC Angels for FY2025-26.",
        url: "https://democracy.greatermanchester-ca.gov.uk/",
        evidenceType: "report",
        publicationDate: "2025-03-28",
        publisher: "Greater Manchester Combined Authority",
        sourceTier: "government",
        sourceKey: "gmca_decision_records",
      },
      {
        label: "GC Angels Supports £1.87m of Investment Through Venture Forward Accelerator Programme",
        description: "Independent trade-press corroboration of GC Angels' active investment activity beyond its own self-reporting.",
        url: "https://business-money.com/",
        evidenceType: "article",
        publicationDate: "2026-03-01",
        publisher: "Business Money",
        sourceTier: "alternative",
        sourceKey: "business_money_trade_press",
      },
    ],
    legislation: {
      title: "GMCA Decision: Funding to The Enterprise Fund (GC Angels)",
      billNumber: null,
      status: "enacted",
      dateEnacted: "2025-03-28",
      url: "https://democracy.greatermanchester-ca.gov.uk/",
      sourceKey: "gmca_decision_records",
    },
  },

  // ===================== Progressive Revenue Institution: researched, no clean fit =====================
  {
    jurisdictionSlug: "greater-manchester",
    policyAreaSlug: "progressive-revenue-institution",
    stage: 0,
    dataQuality: "unavailable",
    assessmentDate: "2024-04-01",
    isCurrent: true,
    evidenceSummary:
      "Researched and confirmed: Greater Manchester has no institution matching a US-style 'progressive revenue' framework (a revenue tool that redistributes BETWEEN income groups). GM's one genuine, well-evidenced revenue institution -- 100% Business Rates Retention, piloted from 1 April 2017 under a Secretary of State pilot-pool designation (Schedule 7B, Local Government Finance Act 1988, as inserted 2012), continued via annual MHCLG/DLUHC designations, then made PERMANENT for 10 years from 1 April 2024 under the March 2023 'Trailblazer' deeper devolution deal -- redistributes revenue BETWEEN TIERS of government (central to local), not between income groups. GMCA board papers document real retained income (£16.3m pooled growth share in 2021/22; £18.7m forecast for 2022/23) funding the Good Growth Fund, a near-£2bn investment vehicle. On its own terms this is a real, Stage-4-worthy fiscal-devolution institution -- but it is not what this PolicyArea's 'progressive' framing implies.",
    limitations:
      "This dataQuality: 'unavailable' reflects a deliberate research conclusion ('no clean fit'), not an unresearched gap. Three genuinely redistributive/equity-framed revenue tools GM has considered were also researched and each died before collecting any revenue: the 2008 Transport Innovation Fund congestion charge (£3bn package, rejected 78.8% in a December 2008 referendum across all 10 boroughs); the 2018 Workplace Parking Levy (floated as Clean Air Plan funding, rejected by Manchester City Council leadership as unworkable unless GM-wide); the Greater Manchester Clean Air Zone charging scheme (government-approved, paused Feb 2022 after business/taxi-trade backlash, officially scrapped 30 May 2022 before a single charge was ever collected, replaced by a non-charging grant-funded scheme). Recommend Mandate reconsider this PolicyArea's framing for non-US jurisdictions -- e.g. renaming/reframing as 'Fiscal Devolution Institution' -- which would let GM's Business Rates Retention institution be scored honestly on its own (non-progressive) terms; this is a taxonomy question requiring methodology-lead sign-off, not implemented here. See docs/GREATER_MANCHESTER_CASE_STUDY.md for the full writeup.",
    evidenceLinks: [
      {
        label: "Greater Manchester Combined Authority Trailblazer Deeper Devolution Deal",
        description: "The March 2023 deal converting GM's business rates retention from a renewable pilot into a permanent 10-year settlement effective 1 April 2024.",
        url: "https://assets.publishing.service.gov.uk/media/6411beeee90e07769a6ca4f8/Greater_Manchester_Combined_Authority_Trailblazer_deeper_devolution_deal.pdf",
        evidenceType: "report",
        publicationDate: "2023-03-21",
        publisher: "HM Government / Greater Manchester Combined Authority",
        sourceTier: "government",
        sourceKey: null,
      },
      {
        label: "100% Business Rate Retention Pilots: What Can Be Learnt and at What Cost?",
        description: "Independent IFS evaluation of the 100% retention pilot programme (GM one of five pilot areas), finding ~£870m collective extra funding in 2018-19 and flagging inter-authority divergence risk.",
        url: "https://ifs.org.uk/publications/100-business-rate-retention-pilots-what-can-be-learnt-and-what-cost",
        evidenceType: "report",
        publicationDate: null,
        publisher: "Institute for Fiscal Studies",
        sourceTier: "academic",
        sourceKey: null,
      },
    ],
    legislation: null,
  },
];
