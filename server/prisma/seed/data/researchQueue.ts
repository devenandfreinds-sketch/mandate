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
];
