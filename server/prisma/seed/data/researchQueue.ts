/**
 * Initial Chicago research queue — the ranked Top 10 from docs/CHICAGO_RESEARCH_ROADMAP.md, seeded as
 * `unassigned` starting points for a new research team. This is a starting point, not a source of
 * truth: once a researcher picks up a task and changes its status/assignee/notes, this seed file must
 * never overwrite that progress. See the upsert logic in seed/index.ts step [10c/11] — it creates a row
 * only if `key` doesn't already exist, and never updates status/assignedResearcher/sourceStatus/notes
 * on a row that does.
 *
 * `key` is a stable identifier for upsert purposes only — never shown in the UI.
 */
export interface ResearchQueueSeedItem {
  key: string;
  jurisdictionSlug: string;
  policyAreaSlug?: string;
  metricSlug?: string;
  taskType: "metric" | "pipeline_assessment";
  researchQuestion: string;
  priority: number;
}

export const researchQueueSeed: ResearchQueueSeedItem[] = [
  {
    key: "chicago-alternative-crisis-response-pipeline",
    jurisdictionSlug: "chicago",
    policyAreaSlug: "alternative-crisis-response",
    taskType: "pipeline_assessment",
    researchQuestion:
      "Research and score Chicago's CARE (Crisis Assistance Response and Engagement) program as an institutional pipeline: build the timeline from its Sept 2021 pilot through its 2026 citywide expansion, using both the City's own annual reporting and the independent University of Chicago Urban Labs/Harris School evaluation. Highest-priority task — cleanest new institutional topology (emergent multi-agency pilot) and the first case with a genuinely critical independent evaluation to weigh against self-reporting.",
    priority: 1,
  },
  {
    key: "chicago-crime-rate-metrics",
    jurisdictionSlug: "chicago",
    metricSlug: "violent_crime_rate",
    taskType: "metric",
    researchQuestion:
      "Pull real violent_crime_rate and property_crime_rate values (2015-2025) from the Chicago Data Portal's \"Crimes - 2001 to Present\" dataset (CPD CLEAR system). Classify IUCR codes into violent/property categories and pair with Census population estimates for the per-100k rate. Currently 100% placeholder for both metrics — this is the highest-value metric pull on the roadmap.",
    priority: 2,
  },
  {
    key: "chicago-permitting-modernization-pipeline",
    jurisdictionSlug: "chicago",
    policyAreaSlug: "permitting-modernization",
    taskType: "pipeline_assessment",
    researchQuestion:
      "Research and score the Dept. of Buildings' Express Permit Program (launched Nov 6 2023, expanded Sept 16 2024) as an institutional pipeline. Note: this policy area's card bundles \"Permitting\" (clean single-agency case) with \"Procurement\" (fragmented across Dept. of Procurement Services, individual departments, and City Council) — document this as a scoping question rather than forcing one score across both.",
    priority: 3,
  },
  {
    key: "chicago-permit-approval-days-metric",
    jurisdictionSlug: "chicago",
    metricSlug: "permit_approval_days",
    taskType: "metric",
    researchQuestion:
      "Pull real permit_approval_days values from the Chicago Data Portal's \"Building Permits\" dataset — the same dataset already backing the real planning_approval_days Housing metric, so marginal effort is low. Currently 100% placeholder. Pairs naturally with the Permitting pipeline task above.",
    priority: 4,
  },
  {
    key: "chicago-progressive-revenue-institution-pipeline",
    jurisdictionSlug: "chicago",
    policyAreaSlug: "progressive-revenue-institution",
    taskType: "pipeline_assessment",
    researchQuestion:
      "Research and score \"Bring Chicago Home\" (the real-estate transfer tax restructuring for homelessness funding), defeated at referendum March 19 2024 (53.2%-46.8%). This is the highest-value case for testing the LOW end of the stage scale — an honestly-scored failed institutionalization, not a success story. Do not inflate the score because the campaign was well-organized; score what actually happened institutionally (nothing enacted).",
    priority: 5,
  },
  {
    key: "chicago-transit-ridership-metric",
    jurisdictionSlug: "chicago",
    metricSlug: "transit_ridership",
    taskType: "metric",
    researchQuestion:
      "Pull real transit_ridership values from the Chicago Data Portal's CTA annual boarding totals, supplemented by RTAMS for Metra/Pace. A CTA-only series is easy since CTA dominates; a fully NTD-consistent CTA+Metra+Pace total is harder. Reinforces the already-completed Transit Network Expansion pipeline case with real quantitative backing.",
    priority: 6,
  },
  {
    key: "chicago-affordable-housing-completions-metric",
    jurisdictionSlug: "chicago",
    metricSlug: "affordable_housing_completions",
    taskType: "metric",
    researchQuestion:
      "Complete the affordable_housing_completions series — currently 8 of 11 years (2015-2025) are already \"estimated\" quality from the Dept. of Housing Annual Report, with 3 years still placeholder. Low-effort task (same source as the existing real years) that directly strengthens the flagship Housing pipeline case.",
    priority: 7,
  },
  {
    key: "chicago-workforce-development-institution-pipeline",
    jurisdictionSlug: "chicago",
    policyAreaSlug: "workforce-development-institution",
    taskType: "pipeline_assessment",
    researchQuestion:
      "Research and score the Chicago Cook Workforce Partnership (~$50M+ WIOA/federal/local funding, 10 American Job Centers, founded 2012) as an institutional pipeline. Real institution, but nearly all reporting is regional (joint City of Chicago / Cook County), which is a bi-jurisdictional attribution problem. SPLITTABLE: one researcher can take the City-side WIOA/partnership-formation research while another takes the Cook County co-governance and regional-reporting side, then reconcile into one assessment.",
    priority: 8,
  },
  {
    key: "chicago-unemployment-rate-metric",
    jurisdictionSlug: "chicago",
    metricSlug: "unemployment_rate",
    taskType: "metric",
    researchQuestion:
      "Pull real unemployment_rate values from BLS Local Area Unemployment Statistics (LAUS), Chicago place series. Easy — free, well-documented, no paywall. Currently 100% placeholder. Reinforces the Workforce Development pipeline task above.",
    priority: 9,
  },
  {
    key: "chicago-median-wages-metric",
    jurisdictionSlug: "chicago",
    metricSlug: "median_wages",
    taskType: "metric",
    researchQuestion:
      "Pull real median_wages values from Census ACS 1-year estimates (table S2001/B20002), Chicago median earnings. Easy-moderate — note ACS 1-year estimates were not published for 2020 (COVID data-collection suspension), so the 2015-2025 series will have a documented gap that year. Currently 100% placeholder.",
    priority: 10,
  },

  // ===================== Greater Manchester (see docs/GREATER_MANCHESTER_RESEARCH_ROADMAP.md) =====================
  {
    key: "gm-crime-rate-metrics",
    jurisdictionSlug: "greater-manchester",
    metricSlug: "violent_crime_rate",
    taskType: "metric",
    researchQuestion:
      "Pull real violent_crime_rate and property_crime_rate values (2015-2025) for Greater Manchester Police from the UK Home Office 'Police recorded crime' open data series (police.uk or gov.uk). Map Home Office categories to Mandate's US-style definitions conservatively: 'violent crime' ≈ violence against the person + sexual offences + robbery; 'property crime' ≈ burglary + theft offences + criminal damage + vehicle offences. Document the mapping explicitly in the metric's notes/limitations — UK 'violence against the person' includes lower-severity assault that would not count as 'aggravated' under US UCR definitions, so these are NOT directly comparable to US city figures without that caveat. Currently 100% placeholder for both metrics. Well-suited for a new researcher: official Tier 1 source, clear task boundary, good first exercise in documenting a definitional mismatch rather than hiding it.",
    priority: 1,
  },
  {
    key: "gm-homelessness-metric-methodology",
    jurisdictionSlug: "greater-manchester",
    metricSlug: "homelessness_count",
    taskType: "metric",
    researchQuestion:
      "Resolve a methodology question before importing: Mandate's homelessness_count metric is defined as a 'Point-in-Time Count,' which maps most closely to MHCLG's annual 'Rough Sleeping Snapshot' (a single-night visible count) — NOT the much larger 'statutory homelessness' series (households assessed as owed a prevention/relief duty under the Homelessness Reduction Act 2017), which this research pass deliberately did NOT import despite gathering real, verified statutory-homelessness figures for all 10 GM boroughs 2014-15 through 2024-25 (see docs/GREATER_MANCHESTER_CASE_STUDY.md for the raw data). First, source the real Rough Sleeping Snapshot figures for Greater Manchester boroughs. Second — and this is the part that needs a methodology_lead or admin sign-off, not just a researcher's own call — decide whether statutory homelessness deserves its own new metric definition alongside homelessness_count, since it measures something genuinely different and arguably more policy-relevant (housing-duty caseload, not literal rough sleeping). Do not import the statutory data under the existing homelessness_count slug without that decision being made explicitly.",
    priority: 2,
  },
  {
    key: "gm-places-for-everyone-pipeline",
    jurisdictionSlug: "greater-manchester",
    policyAreaSlug: "permitting-modernization",
    taskType: "pipeline_assessment",
    researchQuestion:
      "Research and (tentatively) score 'Places for Everyone,' the joint spatial development plan covering 9 of Greater Manchester's 10 boroughs (Stockport opted out), formally adopted 21 March 2024 and already in documented use in individual planning decisions through 2025 (see Bolton MBC planning committee reports citing PfE policies). This is a genuinely important GM institution that this research pass deliberately did NOT score under 'Permitting & Procurement Modernization' — that policy area's framing (individual permit/procurement process reform) is a real stretch for what PfE actually is (a joint strategic land-use plan). Part of this task is methodological, not just data-gathering: recommend whether Mandate's PolicyArea taxonomy needs a new category (e.g. 'Regional Spatial Planning') to hold this cleanly, rather than force-fitting it. Adding a new PolicyArea is a global taxonomy change affecting every jurisdiction's coverage stats — that step requires methodology_lead/admin approval before implementation; this task's deliverable is a recommendation with supporting research, not a unilateral schema change.",
    priority: 3,
  },
  {
    key: "gm-business-rate-retention-pipeline",
    jurisdictionSlug: "greater-manchester",
    policyAreaSlug: "progressive-revenue-institution",
    taskType: "pipeline_assessment",
    researchQuestion:
      "Investigate whether Greater Manchester's 100% Business Rates Retention Pilot (2017/18-2019/20, one of the first English devolution deal areas to trial full local retention of business rate revenue instead of the standard national redistribution) represents a genuine institutional pipeline case for the 'Progressive Revenue Institution' policy area — this research pass did not investigate it deeply enough to score responsibly, and left this policy area as an unresearched synthetic placeholder for GM. Determine: was it extended past the pilot period or wound down? Is there real GMCA financial reporting on revenue retained/redirected? Note UK local government has no direct equivalent to a US-style progressive tax institution (no local income tax, council tax is not graduated by income) — this task may conclude 'not a clean fit, here's why' rather than force a score, which is a legitimate and useful research output.",
    priority: 4,
  },
  {
    key: "gm-bee-network-rail-integration-followup",
    jurisdictionSlug: "greater-manchester",
    policyAreaSlug: "transit-expansion-program",
    taskType: "pipeline_assessment",
    researchQuestion:
      "Follow-up check (not urgent until closer to the date): as of this research pass, Bee Network rail integration (Glossop and Stalybridge lines becoming the first rail routes formally inside the Bee Network, with contactless tap-in/tap-out fare capping) has a committed date of 13 December 2026 but had not yet occurred. Once that date passes, verify via TfGM/GMCA/National Rail sources whether it actually happened on schedule, and if so, add a new dated PipelineAssessment row documenting real rail-integration operating evidence — this would be the first evidence justifying raising the rail component above stage 1-2. Do not create this row before the milestone actually occurs; a committed date is not evidence of operation.",
    priority: 5,
  },
];
