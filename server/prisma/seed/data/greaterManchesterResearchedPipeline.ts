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
 * The remaining 4 Greater Manchester policy areas ("public-innovation-investment",
 * "permitting-modernization", "alternative-crisis-response", "progressive-revenue-institution")
 * remain the synthetic placeholder generator's output — NOT researched this pass, and continue to be
 * marked isPlaceholder/dataQuality: "placeholder" accordingly. See the case study and roadmap for why
 * (no clear comparable GM institution was identified without further dedicated research, or the
 * available candidate — e.g. the 2017 Business Rate Retention Pilot for fiscal-health — was not
 * investigated deeply enough this pass to score responsibly).
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
];
