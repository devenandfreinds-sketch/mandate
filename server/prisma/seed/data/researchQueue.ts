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
      "RESOLVED: full FY2015-2025 real series imported from BLS LAUS, Chicago place series (series LAUCT171400000000003, city-level, not the metro area), dataQuality government. 2025 is an 11-month average (October excluded due to the federal government shutdown). Left in the queue file as a record of what was done; the live ResearchTask row is marked complete and should not be reassigned.",
    priority: 9,
  },
  {
    key: "chicago-median-wages-metric",
    jurisdictionSlug: "chicago",
    metricSlug: "median_wages",
    taskType: "metric",
    researchQuestion:
      "RESOLVED: real median_wages values imported for 9 of 11 years (2020 and 2025 correctly marked unavailable -- ACS 1-year estimates were not published for 2020 due to COVID data-collection suspension, and 2025 is not yet released as of this pass). See unavailableMetrics.ts. Left in the queue file as a record of what was done; the live ResearchTask row is marked complete and should not be reassigned.",
    priority: 10,
  },
  {
    key: "chicago-graduate-employment-rate-metric",
    jurisdictionSlug: "chicago",
    metricSlug: "graduate_employment_rate",
    taskType: "metric",
    researchQuestion:
      "No recurring, city-wide 'graduate employment rate' figure was found for Chicago this pass — outcomes are tracked per-institution (IBHE College2Career, individual universities), not aggregated regionally. The one concrete reference point is City Colleges of Chicago's one-time 2015 Graduate Employment Follow-Up Study (summer 2013-spring 2014 completers), reporting per-campus rates from 67.1% (Olive-Harvey) to 80.3% (Malcolm X) — non-recurring and sub-city-level, so not usable as-is. Difficulty: hard — would likely require either a custom aggregation across every Chicago-area institution's IBHE/IPEDS outcomes data, or convincing City Colleges of Chicago to repeat/update its 2015 study. Skill set: higher-ed data researcher with IPEDS/IBHE familiarity.",
    priority: 11,
  },

  // ===================== Greater Manchester (see docs/GREATER_MANCHESTER_RESEARCH_ROADMAP.md) =====================
  {
    key: "gm-crime-rate-metrics",
    jurisdictionSlug: "greater-manchester",
    metricSlug: "violent_crime_rate",
    taskType: "metric",
    researchQuestion:
      "RESOLVED (2026-08-14): real violent_crime_rate and property_crime_rate values for FY2015-16 through FY2025-26 were imported from ONS's 'Crime in England and Wales: Police Force Area data tables,' Greater Manchester row (converted from the source's per-1,000-population rate to Mandate's per-100,000 unit). FY2019-20 is deliberately omitted -- ONS itself suppresses GM's row that year due to a GMP IT-migration data gap. See imports/data/public-safety/greater-manchester-crime-2015-2026.csv and docs/GREATER_MANCHESTER_CASE_STUDY.md. Left in the queue file (rather than deleted) as a record of what was done and where; the live ResearchTask row is marked complete and should not be reassigned.",
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

  // --- DSA Research Expansion pass (2026-07): NYC, Seattle, Minneapolis, Washington DC ---

  {
    key: "nyc-nypd-headcount-reconciliation",
    jurisdictionSlug: "new-york-city",
    policyAreaSlug: "alternative-crisis-response",
    taskType: "pipeline_assessment",
    researchQuestion:
      "Reconcile the NYPD headcount / +580-officer FY2027 budget controversy: NYC-DSA publicly objected (June 13, 2026) to a proposed increase from 33,861 to 35,370 officers as running counter to the values of the movement that elected Mayor Mamdani, but this research pass could not confirm the FINAL enacted headcount in the signed FY2027 budget (adopted ~June 30, 2026) versus what was proposed. Why it matters: this is the clearest flashpoint in the DSA-Mamdani relationship and directly affects whether the public-safety campaign promise should be scored as broken, honored, or genuinely contested. Already checked: City & State NY, GV Wire, Patch (all cover the objection, not the resolution). Suggested next sources: NYC Council Finance Division's FY2027 Adopted Budget Message, NYPD's own uniformed-strength reports. Difficulty: medium (primary budget line-item reading). Skill set: municipal budget/public-finance analyst.",
    priority: 1,
  },
  {
    key: "nyc-bheard-response-rate-discrepancy",
    jurisdictionSlug: "new-york-city",
    policyAreaSlug: "alternative-crisis-response",
    taskType: "pipeline_assessment",
    researchQuestion:
      "NYC IBO and NYPD leadership testimony give conflicting B-HEARD response rates (roughly 22% vs. roughly 8%) for the alternative-crisis-response program. Why it matters: this is the largest single data conflict found in NYC's institutional-pipeline research and affects whether the underlying (pre-Mamdani) B-HEARD program should be read as declining or merely inconsistently measured, which in turn affects the ceiling on this policy area's current stage. Already checked: NYC IBO precinct-level PDF, Gothamist, THE CITY, amNewYork, City & State. Suggested next sources: NYC Mayor's Management Report FY2026 mid-year update, NYC Open Data B-HEARD dataset if published, a FOIL request to NYPD/FDNY/DOHMH for current dispatch logs. Difficulty: medium-high. Skill set: public-health/public-safety data analyst with FOIL experience.",
    priority: 2,
  },
  {
    key: "nyc-rgb-rent-freeze-litigation",
    jurisdictionSlug: "new-york-city",
    policyAreaSlug: "affordable-housing-institution",
    taskType: "pipeline_assessment",
    researchQuestion:
      "The Rent Guidelines Board's June 25, 2026 vote for a first-ever two-year 0%/0% rent freeze (effective October 1, 2026) drew landlord-group litigation threats and a board-member resignation alleging a predetermined outcome. Why it matters: if the freeze is stayed or overturned, this marquee DSA-coalition deliverable's 'Enacted' classification would need to revert, changing the affordable-housing-institution assessment. Already checked: City Limits, amNewYork, ABC News, CNN (all cover the vote, not any litigation outcome). Suggested next sources: NYSCEF e-filing search for RGB/rent-freeze litigation, NY Apartment Association/RSA press statements, Housing Court/Appellate Division dockets. Difficulty: medium (legal-docket research). Skill set: legal/court-records researcher.",
    priority: 3,
  },
  {
    key: "nyc-business-formation-county-extraction",
    jurisdictionSlug: "new-york-city",
    metricSlug: "business_formation",
    taskType: "metric",
    researchQuestion:
      "RESOLVED (2026-08-30): full 2015-2025 series imported from Census BFS's county-level Business Applications file (bfs_county_apps_annual.xlsx), summed across NYC's 5 constituent counties, no gaps. See server/prisma/seed/data/sources.ts (census_bfs_county_apps) for the source and methodology notes (BA vs. HBA series, reporting-week-year caveat).",
    priority: 4,
  },

  {
    key: "seattle-city-specific-pit-count",
    jurisdictionSlug: "seattle",
    metricSlug: "homelessness_count",
    taskType: "metric",
    researchQuestion:
      "Obtain a Seattle-city-specific (not King-County-wide) point-in-time homeless count breakdown for 2022/2024/2026. Why it matters: Mandate's homelessness_count values for Seattle currently use KCRHA's county-wide total (39 cities), which overstates the city-specific figure. Already checked: KCRHA's published PIT PDFs, which resisted automated text extraction (scanned/encoded format) in this research pass. Suggested next sources: direct KCRHA data-portal CSV/Excel downloads (not PDF), kcrha.org/community-data, Seattle Human Services Dept homelessness reports. Difficulty: medium (data exists but isn't machine-readable via standard fetch tools). Skill set: data/policy researcher comfortable with PDF table extraction, or direct outreach to KCRHA's data team.",
    priority: 1,
  },
  {
    key: "seattle-mha-annual-report-extraction",
    jurisdictionSlug: "seattle",
    metricSlug: "affordable_housing_completions",
    taskType: "metric",
    researchQuestion:
      "Extract full Mandatory Housing Affordability (MHA) Annual Report data: cumulative affordable units produced 2017-2025 by year, plus total city-wide housing permits/completions (market-rate + affordable) for a Wilson-administration comparison baseline. Why it matters: this research pass found only an '86 affordable homes tied to 2025 permits' figure, which is likely a narrow incentive-zoning subcategory that needs correct context against total annual city production (likely several thousand units/year) before it can be imported as a metric value. Already checked: the 2025 MHA Annual Report PDF, which resisted automated text extraction. Suggested next sources: seattle.gov/housing/data-and-reports, SDCI permit dashboards, data.seattle.gov building-permits Socrata dataset. Difficulty: medium. Skill set: data analyst with SQL/Socrata query experience.",
    priority: 2,
  },
  {
    key: "seattle-care-outcome-evaluation",
    jurisdictionSlug: "seattle",
    policyAreaSlug: "alternative-crisis-response",
    taskType: "pipeline_assessment",
    researchQuestion:
      "Determine whether Seattle's CARE Department has any independently-audited outcome data (response times, use-of-force reduction, cost savings) comparable to Health One's documented 76% 911-utilization / 69% ED-visit reduction figures. Why it matters: this determines whether CARE should move from stage 4 to stage 5 in the alternative-crisis-response assessment. Already checked: seattle.gov/care, Harrell mayor's office press releases, National League of Cities case study (all describe call volume, not independently-audited outcomes). Suggested next sources: Seattle City Auditor's Office (has audited CARE/KCRHA-adjacent programs before), CARE Department performance dashboards on data.seattle.gov if any exist. Difficulty: medium-high (likely requires a records request). Skill set: public-safety policy researcher familiar with municipal auditor reports.",
    priority: 3,
  },
  {
    key: "seattle-wilson-tax-legislation-tracking",
    jurisdictionSlug: "seattle",
    policyAreaSlug: "progressive-revenue-institution",
    taskType: "pipeline_assessment",
    researchQuestion:
      "Track whether Mayor Wilson's proposed local capital-gains tax, land value tax, or vacancy tax has been formally introduced as Council legislation since this research pass's July 2026 cutoff. Why it matters: these are Wilson's central progressive-revenue campaign promises; as of this pass all remain at 'Promised' with no enacted legislation, but the city's $175M shortfall makes near-term legislative action plausible. Already checked: wilsonforseattle.com (campaign-era, not updated post-election), PubliCola, Center Square coverage through July 2026. Suggested next sources: Seattle City Council legislative information center (clerk.seattle.gov), Mayor Wilson's official press releases (wilson.seattle.gov). Difficulty: low, but best as a recurring/scheduled check. Skill set: municipal legislative tracker.",
    priority: 4,
  },

  {
    key: "minneapolis-ocs-leadership-dispute",
    jurisdictionSlug: "minneapolis",
    policyAreaSlug: "alternative-crisis-response",
    taskType: "pipeline_assessment",
    researchQuestion:
      "Determine the outcome of the 2026 City Council-vs-Mayor dispute over Office of Community Safety Commissioner Todd/Toddrick Barnette's reappointment (the Council voted twice, 7-6, against reappointment; the mayor has vowed a veto). Why it matters: OCS is Minneapolis's most-developed DSA-adjacent institution, and this research pass's stage-4 assessment assumed BCR continues operating regardless of the leadership dispute's outcome — that assumption needs confirming once the dispute resolves. Already checked: MinnPost, Axios Twin Cities, MPR News (all 2026, pre-resolution). Suggested next sources: Minneapolis City Council LIMS records on the Barnette reappointment vote, the Council's own restructuring proposal (referenced by Councilmember Wonsley) if formally introduced. Difficulty: medium (fast-moving local political story). Skill set: local-government/municipal-affairs researcher with LIMS fluency.",
    priority: 1,
  },
  {
    key: "minneapolis-2040-plan-causal-effect",
    jurisdictionSlug: "minneapolis",
    policyAreaSlug: "affordable-housing-institution",
    taskType: "pipeline_assessment",
    researchQuestion:
      "Find the best independent (non-city, non-advocacy) causal estimate of the 2040 Comprehensive Plan's actual effect on housing supply and rents — the Minneapolis Fed's own data-tool analysis and a MinnPost advocacy critique reach different conclusions about whether the plan's 'missing middle' zoning change (versus pre-existing corridor upzoning) drove the roughly 18,000 multifamily units added 2018-2022. Why it matters: this determines whether the 2040 Plan should ever be scored as a Mandate institutional-pipeline case (it is currently deliberately excluded from the affordable-housing-institution assessment as a taxonomy-gap land-use reform, not a production institution) and, if so, at what stage. Already checked: Minneapolis Fed data-tool article, MinnPost community-voices critique, Metropolitan Abundance Project analysis. Suggested next sources: the Fed's full data tool/dataset directly, City of Minneapolis permit-level open data. Difficulty: hard (requires housing-economics literacy and causal-inference judgment). Skill set: urban economist or housing-policy researcher.",
    priority: 2,
  },
  {
    key: "minneapolis-crime-primary-source-verification",
    jurisdictionSlug: "minneapolis",
    metricSlug: "violent_crime_rate",
    taskType: "metric",
    researchQuestion:
      "RESOLVED (2026-08-30): this queue entry's own premise ('Minneapolis currently has zero real crime-rate data') was stale -- a separate pass had already imported real 2021-2024 figures via Minneapolis's own NIBRS open-data feed / FBI Crime Data Explorer (never reflected back into this entry's text, exactly the kind of research-queue drift documented in docs/FIVE_YEAR_HANDOFF_TEST.md). This pass filled the remaining gaps only -- 2016-2020 and 2025 -- directly from MN BCA's own agency-level Uniform Crime Report data, without touching the already-real 2021-2024 rows. 2015 confirmed structurally unavailable at the violent/property split level (see unavailableMetrics.ts). One open methodology question for a reviewer: the new BCA-sourced figures and the existing NIBRS-feed/FBI-CDE figures for overlapping years use different aggregation paths and diverge by roughly 5-11% in some years (e.g. 2023 violent: 1,132 BCA-computed here vs. 1,107.7 already in the database from FBI CDE) -- both are legitimate primary computations, not a data-quality problem, but Mandate should decide whether to standardize the whole series on one source for consistency rather than leaving two methodologies side by side.",
    priority: 3,
  },
  {
    key: "minneapolis-transit-primary-source-data",
    jurisdictionSlug: "minneapolis",
    metricSlug: "transit_ridership",
    taskType: "metric",
    researchQuestion:
      "Obtain Metropolitan Council's own official ridership figures (not press citations) for 2023-2025, and the current official cost/schedule status of the Blue Line and Green Line light-rail extensions. Why it matters: transit-expansion-program scoring currently relies on press paraphrase of Metro Council data; primary figures would let Mandate track this metric directly rather than only via the pipeline assessment's qualitative evidence. Already checked: Star Tribune, a 2024-vintage FTA project-profile PDF. Suggested next sources: metrotransit.org performance dashboard, Metropolitan Council board meeting minutes, FTA's most recent (2025-26) project profile updates. Difficulty: medium. Skill set: transit/transportation-policy researcher familiar with FTA New Starts reporting.",
    priority: 4,
  },

  {
    key: "dc-hptf-recent-annual-reports",
    jurisdictionSlug: "washington-dc",
    policyAreaSlug: "affordable-housing-institution",
    taskType: "pipeline_assessment",
    researchQuestion:
      "RESEARCH RESOLVED (2026-08-30), PIPELINE ENTRY STILL NEEDED: DHCD has not published FY2024 or FY2025 HPTF annual reports (confirmed institutional fact via DHCD's own FY2026 Committee-on-Housing pre-hearing testimony: 'the annual report has not been delivered since 2023,' FY24 report ~10 months late, FY25 report still drafting, all FY25 quarterly reports 'Under Review'/unposted). Primary-sourced figures obtained instead: FY2023 annual report (full AMI-tier breakdown, image-based PDF read via page rendering) shows 43% of dollars to <=30% MFI against the 50% statutory ELI minimum (a miss). FY2025 blended figure (DHCD testimony, projects closed FY25+FY26-to-date, excluding the one-time FY2024 Stabilization RFP infusion): 35% to 0-30% MFI -- a WORSENING trend, not an improving one. Combined with the reporting-compliance collapse itself (a second, independent negative signal), primary evidence argues for HOLDING at stage 4, not advancing to stage 5. Full figures and exact source URLs are in this task's research notes. This is a stage-scoring judgment call — enter the confirmed evidence via the Admin Pipeline UI (/admin/pipeline), which handles isCurrent/EvidenceLink correctly, rather than editing seed files directly.",
    priority: 1,
  },
  {
    key: "dc-onse-cvi-evaluation-results",
    jurisdictionSlug: "washington-dc",
    policyAreaSlug: "alternative-crisis-response",
    taskType: "pipeline_assessment",
    researchQuestion:
      "Determine whether the Johns Hopkins Center for Gun Violence Solutions / University of Maryland four-year community-violence-intervention evaluation of ONSE-overseen programs has published interim or final findings. Why it matters: this is the only rigorous, independent outcome evaluation identified for DC's alternative-crisis-response institution; its results would determine whether stage 5 is warranted. Already checked: onse.dc.gov, general web search (study confirmed underway, named academics Daniel Webster and Joseph Richardson Jr., no results located). Suggested next sources: Johns Hopkins Center for Gun Violence Solutions publications page, University of Maryland Richardson lab, DC Council Judiciary & Public Safety Committee oversight hearing records. Difficulty: medium (may require direct academic outreach). Skill set: criminology/public-health researcher familiar with CVI evaluation literature.",
    priority: 2,
  },
  {
    key: "dc-council-dsa-membership-verification",
    jurisdictionSlug: "washington-dc",
    taskType: "pipeline_assessment",
    researchQuestion:
      "Resolve whether Councilmember Zachary Parker (Ward 5) is a formal Metro DC DSA member or only a DSA-endorsed candidate, and whether any other 2026-elected DC Council member is a formal DSA member beyond the confirmed case, Janeese Lewis George (Ward 4). Why it matters: Metro DC DSA's own April 2026 materials describe '1 of 13' Council members as chapter members, but some secondary sources describe Parker as a DSA member — an unresolved discrepancy that affects how confidently Mandate can characterize the scale of DSA's Council presence, distinct from the separate question of Lewis George's now much more consequential status as the 2026 mayoral primary winner. Already checked: Metro DC DSA endorsement pages, Wikipedia, conflicting secondary sources. Suggested next sources: direct contact with Metro DC DSA chapter communications; the councilmembers' own public statements (DSA membership rosters are not public). Difficulty: medium (may be unresolvable to full certainty). Skill set: political reporter/researcher with local DC sourcing relationships.",
    priority: 3,
  },
  {
    key: "dc-post-election-administration-update",
    jurisdictionSlug: "washington-dc",
    taskType: "pipeline_assessment",
    researchQuestion:
      "Once the November 2026 DC general election is certified, update Mandate's Administration record for Washington, D.C. and rewrite the governance-model rationale given a likely DSA-affiliated mayor (Janeese Lewis George, who won the June 2026 Democratic primary outright and faces no Republican opponent) rather than DSA-Council-only influence. Why it matters: the current DB record (Bowser, 'ward-based Democratic coalition') and the governance-model narrative ('DSA influence on Council races amid a long-serving mayoral administration') will both be out of date the moment the general election concludes — this is a structural/methodological update, not just a data refresh. Already checked: PBS, NBC, WJLA, Wikipedia (all pre-general-election). Suggested next sources: DC Board of Elections certified results (Nov/Dec 2026), Lewis George's mayoral transition announcements. Difficulty: low for the factual update (just requires waiting for a known future date); higher for the methodological question of how Mandate's governance-model taxonomy should describe a DSA executive under home rule. Skill set: policy analyst familiar with Mandate's own taxonomy, not just a web researcher.",
    priority: 4,
  },
  {
    key: "gm-clearance-rate-violent-crime-specific",
    jurisdictionSlug: "greater-manchester",
    metricSlug: "clearance_rate",
    taskType: "metric",
    researchQuestion:
      "Recompute clearance_rate as a violent-crime-specific positive-outcome rate, not the all-crime proxy currently imported at 'estimated' quality. Why it matters: Mandate's metric definition is specifically violent-crime clearance, but the 2026-08-14 pull computed an all-offence-type rate from Home Office's row-level outcomes data because no GM-specific violent-crime-only figure was readily available. Already checked: Home Office police-recorded-crime-and-outcomes open data (row-level, filterable by offence group as well as force — a violent-crime-only filter should be achievable with the same methodology). Difficulty: low-medium (same dataset, narrower filter). Skill set: data analyst comfortable with large open-data CSVs.",
    priority: 10,
  },
  {
    key: "gm-business-formation-raw-count",
    jurisdictionSlug: "greater-manchester",
    metricSlug: "business_formation",
    taskType: "metric",
    researchQuestion:
      "Pull a raw GM-level business-formation count (not a rate) from ONS's 'Business demography, UK' reference tables. Why it matters: the 2026-08-14 pull found only birth/survival *rates* via ONS's Explore Local Statistics service, but Mandate's business_formation metric wants a count ('new business applications filed in the year'); importing a rate under a count-shaped metric would misrepresent the unit. Already checked: ONS Explore Local Statistics (rates only). Suggested next source: ONS 'Business demography, UK' annual reference tables, multiplying the published rate by the active-business-stock denominator, or finding a direct count column. Difficulty: medium. Skill set: statistics/data analyst.",
    priority: 11,
  },
  {
    key: "durham-budget-vote-primary-confirmation",
    jurisdictionSlug: "durham-county",
    taskType: "pipeline_assessment",
    researchQuestion:
      "Confirm the actual outcome/vote tally of Durham County Council's 18 February 2026 full-Council budget vote from a primary source. Why it matters: a 3 February 2026 durham.gov.uk press release confirms the vote was scheduled for that date, but no source checked so far (2026-08-14 pass) confirms the vote actually passed or its tally -- the specific cut figures (parking charges, permit fees, ~88 FTE) come from an earlier 19 November 2025 Cabinet-stage report, not a confirmed final Council vote. Already checked: durham.gov.uk press releases (date only), northeastbylines.co.uk (Cabinet-stage detail only). Suggested next source: democracy.durham.gov.uk minutes for the 18 February 2026 Council meeting (unreachable from this pass's research environment -- connection refused). Difficulty: low if the council minutes site is reachable. Skill set: researcher with working access to democracy.durham.gov.uk.",
    priority: 1,
  },
  {
    key: "durham-climate-vote-primary-confirmation",
    jurisdictionSlug: "durham-county",
    taskType: "pipeline_assessment",
    researchQuestion:
      "Confirm the exact for/against/abstain division of Durham County Council's 16 July 2025 vote to rescind its climate emergency declaration, from the primary council minutes. Why it matters: two independent local outlets (Palatinate, North East Bylines) agree on the date and a '62 in favour' headline figure, but the reported against/abstain/absent breakdown does not reconcile cleanly to the council's 126-seat membership across sources -- currently imported at alternative/press-tier evidence pending primary confirmation. Already checked: Palatinate, North East Bylines, BBC (404s on direct fetch). Suggested next source: democracy.durham.gov.uk, likely agenda item ID 70355 (found via search, not fetchable from this pass's research environment). Difficulty: low if the council minutes site is reachable. Skill set: researcher with working access to democracy.durham.gov.uk.",
    priority: 2,
  },
  {
    key: "durham-workforce-institution-attribution-question",
    jurisdictionSlug: "durham-county",
    policyAreaSlug: "workforce-development-institution",
    taskType: "pipeline_assessment",
    researchQuestion:
      "Resolve whether Mandate's Institutional Pipeline should score Durham's workforce-development institution (DurhamWorks, started 2015; DurhamEnable, 2021; DurhamLearn, ~19+ years) as a mature, real, Stage 4-5 jurisdiction institution regardless of which administration built it, or withhold a score because none of it is attributable to Reform's May 2025 takeover (the only genuinely new document, an Apprenticeship Strategy 2025-2028 presented 19 November 2025, is an explicit renewal of a 2022-2025 predecessor, not a new institution). Why it matters: this is the first Mandate jurisdiction where a real, well-evidenced institution sits entirely outside the tracked administration's tenure with no ambiguity about which reading changes the outcome -- see docs/DURHAM_CASE_STUDY.md for full reasoning. This is a methodology-lead decision, not a research task in the usual sense; no further web research is needed to resolve it, only a decision about what the score is meant to represent.",
    priority: 3,
  },
  {
    key: "durham-remaining-metrics-crime-business",
    jurisdictionSlug: "durham-county",
    metricSlug: "violent_crime_rate",
    taskType: "metric",
    researchQuestion:
      "Pull real violent_crime_rate, property_crime_rate, business_survival_rate, and tech_employment values for County Durham. Why it matters: the 2026-08-14 pass imported only fiscal-health and workforce metrics (the categories with the cleanest taxonomy fit); crime and business-economy metrics remain 100% placeholder. Suggested sources: same methodology already proven for Greater Manchester this pass -- ONS/Home Office Police Force Area data (Durham Constabulary force area), ONS Business Demography, Nomis BRES. Difficulty: low-medium, mostly a matter of re-running an already-proven method at a different geography. Skill set: data analyst.",
    priority: 4,
  },
  {
    key: "durham-pension-2025-valuation",
    jurisdictionSlug: "durham-county",
    metricSlug: "pension_funding_ratio",
    taskType: "metric",
    researchQuestion:
      "Confirm the Durham County Council Pension Fund's 31 March 2025 triennial actuarial valuation whole-fund funding percentage from its primary Valuation Report. Why it matters: the Fund's Funding Strategy Statement (5 December 2025) confirms a 2025 valuation exists and has been adopted for contribution-rate-setting, but only a press paraphrase (Local Government Chronicle, claiming 'no change' from 2022's ~98%) was found this pass -- not yet imported pending a primary document. Already checked: durham.gov.uk media library (found the 2022 report and the Funding Strategy Statement, not a distinct '2025 Valuation Report' document). Difficulty: low if the document can be located. Skill set: researcher comfortable searching council document libraries.",
    priority: 5,
  },
  {
    key: "dc-violent-crime-clearance-weighted-average",
    jurisdictionSlug: "washington-dc",
    metricSlug: "clearance_rate",
    taskType: "metric",
    researchQuestion:
      "Compute a defensible incident-count-weighted average violent-crime clearance rate for DC from MPD's own per-offense-type clearance rates (Homicide, Sex Abuse, Assault with a Dangerous Weapon, Robbery). Why it matters: MPD publishes clearance rates per offense type but no single blended violent-crime figure; the 2026-08-17 pass imported MPD's homicide-only closure rate (60%, 2024) as a conservative correctly-scoped-but-narrow proxy rather than force-averaging without the incident-count weights needed to do it defensibly. Already checked: MPD Annual Report 2024 (p.31, per-offense clearance table) and MPD's Quarterly Clearance Rates page (mpdc.dc.gov/page/quarterly-clearance-rates-cy2023-cy2026) -- both give rates but not the underlying incident counts needed to weight them. Suggested next source: MPD's DC Code Index Offense counts by category (same Annual Report, Appendix B) to supply the weights. Difficulty: low-medium (arithmetic once counts are located). Skill set: data analyst.",
    priority: 6,
  },
  {
    key: "seattle-housing-completions-citation-conflict",
    jurisdictionSlug: "seattle",
    metricSlug: "housing_completions",
    taskType: "metric",
    researchQuestion:
      "RESOLVED (2026-08-30): the conflict was two distinct causes, both confirmed. (1) Scope difference: 'Citywide Residential Permit Information' reports gross new units (no demolition offset), 'CRA Growth Report' reports net (New minus Demo) -- reproducing the CRA report's own net figures as New-minus-Demo from the other PDF matched exactly for 2010-2013. (2) The underlying DPD/SDCI Permit Data Warehouse is a live, continuously-revised system, not a fixed historical record -- three different snapshot dates of the same 2014 figure gave three different answers. Full 2015-2024 series imported using NET units from one single consistent live pull (Seattle GIS Open Data's full-history permit layer via its ArcGIS REST API), rather than splicing PDFs of different vintages. See server/prisma/seed/data/sources.ts (seattle_gis_residential_permits_finaled) for the full methodology and remaining ~1-3% precision caveat on pre-2018 years.",
    priority: 7,
  },
  {
    key: "nyc-affordable-housing-completions-series",
    jurisdictionSlug: "new-york-city",
    metricSlug: "affordable_housing_completions",
    taskType: "metric",
    researchQuestion:
      "RESOLVED (2026-08-30): 2015-2023 filled via NYC Open Data's 'Affordable Housing Production by Building' dataset, aggregated by building_completion_date year. This surfaced a genuine unresolved methodology question, filed separately as nyc-affordable-housing-completions-methodology-reconciliation -- see that entry.",
    priority: 8,
  },
  {
    key: "nyc-affordable-housing-completions-methodology-reconciliation",
    jurisdictionSlug: "new-york-city",
    metricSlug: "affordable_housing_completions",
    taskType: "metric",
    researchQuestion:
      "Methodology-lead decision, not a research task: NYC's affordable_housing_completions series now mixes two different date conventions -- 2015-2023 use a completion-date reading (NYC Open Data, building_completion_date), while 2024-2025 use a financing/production-closing date (NYC HPD Affordable Housing Production Reporting), imported in an earlier pass following the same convention as Chicago's DOH Annual Report data. Why it matters: these are genuinely different concepts (a unit can be financed years before its building_completion_date), so the series as it stands is not apples-to-apples across its full range. Decide: (a) leave as-is with the discontinuity documented, (b) recompute 2024-2025 from the same NYC Open Data source for full-series consistency (values would drop materially, e.g. 2024 from 25,266 financed to 22,811 completed), or (c) split into two distinct metrics if Mandate's schema should track financing and completion separately for this policy area. A related, still-unresolved footnote: a previously-cited narrative figure (2024: 36,438 units, from RGB/NYHC reports) could not be reconciled to either completion-date series or to a fiscal-year window of either -- likely a third convention (units started) that would need its own confirmation if pursued further.",
    priority: 6,
  },
  {
    key: "minneapolis-dc-homelessness-count-primary-source",
    jurisdictionSlug: "minneapolis",
    metricSlug: "homelessness_count",
    taskType: "metric",
    researchQuestion:
      "RESOLVED (2026-08-30): both cities' PIT counts confirmed directly from HUD's own per-CoC Homeless Populations and Subpopulations (PopSub) Report PDFs (files.hudexchange.info), for every year 2015/2017-2025 (2016 unavailable from HUD's archive for both CoCs -- see unavailableMetrics.ts). DC-500 = DC city, one-to-one, no scope caveat needed. MN-500 is confirmed, per HUD's own document header, to be 'Minneapolis/Hennepin County' jointly -- county-wide, not city-only, with no separable city figure anywhere in HUD's system; imported at 'estimated' quality with that caveat, consistent with Mandate's existing convention for this CoC. Two numeric discrepancies vs. previously-cited secondary sources were found and flagged in the imported notes rather than silently resolved: DC 2015 (HUD 7,298 vs. press ~7,748) and Minneapolis 2023 (HUD 3,312 vs. Hennepin County's own website 2,687).",
    priority: 9,
  },
  {
    key: "chicago-budget-balance-methodology-conflict-2015-2017",
    jurisdictionSlug: "chicago",
    metricSlug: "budget_balance",
    taskType: "metric",
    researchQuestion:
      "Methodology-lead decision, not a plain research gap: Chicago's budget_balance is real for 2018-2025, sourced from Chicago City Council's Office of Financial Analysis (COFA) 'Overview and Analysis of the ACFR' reports, computed as that year's General Fund revenue variance PLUS expenditure variance -- both measured against the ADOPTED BUDGET, not against the prior year. A 2026-09-02 research pass found a clean, complete alternative for 2015-2017 (and every other year) directly in the ACFR's own Table 6 ('Schedule of Revenues, Expenditures and Changes in Fund Balances, General Fund'): 2015 +$33.5M, 2016 +$209.4M, 2017 +$104.6M, cross-verified against two independently-filed ACFR vintages with no restatement. These were DELIBERATELY NOT IMPORTED because they measure a genuinely different concept -- actual revenues minus actual expenditures for the year, with no reference to what was budgeted -- not the budget-vs-actual variance COFA computes. Splicing them into the same series as 2018-2025 would reintroduce exactly the kind of same-metric-different-methodology inconsistency Mandate just fixed a chart-rendering bug over (see docs/INSTITUTIONAL_HARDENING_SPRINT_2026.md and the timeSeries.ts generator fix). Options: (a) find whether COFA's own 'Overview and Analysis' series extends back to 2015-2017 (COFA is a relatively new office, may not have retrospective coverage that far back -- unconfirmed either way by this pass), (b) switch the ENTIRE 2018-2025 series to the ACFR Table 6 bottom-line figure instead, for full-series consistency on a simpler, always-available methodology (would change several already-real values), or (c) leave 2015-2017 placeholder rather than import either mismatched or all-new-methodology data without sign-off.",
    priority: 5,
  },
  {
    key: "chicago-patent-creation-metro-source",
    jurisdictionSlug: "chicago",
    metricSlug: "patent_creation",
    taskType: "metric",
    researchQuestion:
      "patent_creation is real only for 2015 (3,909, from USPTO's legacy PTMT metro-area report series, which structurally stops at calendar year 2015 -- confirmed by two independent research passes, no successor report exists). 2016-2025 has a concrete, actionable next step, not just a dead end: USPTO's PatentsView platform completed its migration to the new Open Data Portal PatentSearch API on 2026-03-20 (the old search.patentsview.org domain no longer resolves). The new API's 'location' endpoint still exposes location_city/location_state fields, meaning Chicago-level filtering should structurally still be possible -- but the new API requires an API key obtained via a manual request through USPTO's PatentsView support service desk (patentsview-support.atlassian.net), a registration step outside an automated research pass's reach. Next step: file the API key request, then query the location endpoint filtered to Chicago, IL for patents granted 2016-2025. Difficulty: low once the key is issued -- the blocker is administrative access, not data availability. Skill set: whoever holds (or can request) API credentials for USPTO's PatentsView service.",
    priority: 7,
  },
  {
    key: "nyc-procurement-timeline-primary-source",
    jurisdictionSlug: "new-york-city",
    metricSlug: "procurement_timeline_days",
    taskType: "metric",
    researchQuestion:
      "A 2026-09-05 research pass found NYC's Mayor's Office of Contract Services (MOCS) 'Citywide Indicators Report' publishes median cycle times by contract-award phase (Pre-Solicitation Review, Solicitation, Evaluation, Award, Registration), but only FY23-25 figures were read, and only as an END-TO-END total spanning all 5 phases -- broader than this metric's 'RFP issuance to contract award' definition, which maps to just the Solicitation+Evaluation phases. A rough derived approximation for FY23/FY24 (~167/~163 days, summing the two relevant phase medians) was computed but explicitly flagged low-confidence, since medians of sub-phases don't sum precisely to a true combined median -- NOT imported for that reason. MOCS's own site states FY09-24 Executive Summaries and FY11-24 detailed appendices exist as individual PDFs (not yet fetched one by one this pass) -- reading those directly for FY15-22 is the concrete next step, and may also resolve whether a cleaner Solicitation+Evaluation-only figure is stated explicitly rather than needing derivation. Also flagged: the live MOCS webpage shows an internal inconsistency for FY24 CSB figures (328 vs. 357 days in two places on the same continuously-updated dashboard) -- use the most recent figure with a vintage caveat if pursued.",
    priority: 6,
  },
  {
    key: "nyc-capital-budget-execution-rate-methodology",
    jurisdictionSlug: "new-york-city",
    metricSlug: "capital_budget_execution_rate",
    taskType: "metric",
    researchQuestion:
      "A 2026-09-05 research pass found two different NYC Comptroller-published 'capital commitment achievement rate' series, but neither matches this metric's definition ('share of the planned annual capital budget actually SPENT') -- both measure commitments/encumbrances against a registered contract, which the Comptroller's own reports explicitly distinguish from capital expenditure. The two found series also use incompatible denominators (target-commitment basis: FY2024 120.0%, FY2025 114.0%; vs. adopted-first-year-plan basis: FY2017-19 ~54-63%, FY2020 43%, FY2012-22 avg 60.4%) and should not be treated as one series. Concrete next step, not a dead end: NYC Open Data publishes both a 'Capital Commitment Plan' (data.cityofnewyork.us, id 2cmn-uidm) and a 'Capital Commitment Actuals' dataset (id 8u85-k342) -- querying these directly (the same SODA-API-aggregation approach that worked for this metric's agency_vacancy_rate companion and for NYC's business_formation/affordable_housing_completions metrics) could construct a genuine expenditure-vs-budget series from primary data rather than a secondary report's own (differently-scoped) headline number. Difficulty: medium -- requires understanding the two datasets' schemas and confirming which fields represent actual disbursement vs. commitment.",
    priority: 6,
  },
  {
    key: "nyc-permit-approval-days-fy15-18-scope-gap",
    jurisdictionSlug: "new-york-city",
    metricSlug: "permit_approval_days",
    taskType: "metric",
    researchQuestion:
      "permit_approval_days is real for FY2020-2025 (DOB NOW 'filing to approval' average, see sources.ts nyc_mmr_dob_permit_time). FY2015-2018 remain placeholder -- not for lack of searching, but because DOB NOW (the system this metric's real years are sourced from) had not yet rolled out; the MMR chapters for those years instead report a narrower 'first plan review' time only, a genuinely different concept (review-only, not full approval) that should not be spliced into the same series without a clear methodology break noted. If pursued, the pre-DOB-NOW 'first plan review' figures do exist (found by type: new-building/Alteration-I/minor-renovation, by channel) and could be imported as a distinctly-labeled predecessor series rather than forced into continuity with FY2020+.",
    priority: 4,
  },
  {
    key: "minneapolis-capital-budget-execution-rate-lims-blocked",
    jurisdictionSlug: "minneapolis",
    metricSlug: "capital_budget_execution_rate",
    taskType: "metric",
    researchQuestion:
      "A 2026-09-05 research pass could not find a directly-published capital-execution ratio: CLIC reports are confirmed forward-looking only (proposed CIP, not actual-vs-budget), and the ACFR gives actual capital outlay ($147.15M in 2024) without a paired annual capital-budget figure (capital funds use project-length, not annual, GAAP budgetary-comparison schedules). The strongest lead -- Minneapolis's Quarterly Financial Status Reports, which exist for essentially every year back to 2014 and are exactly the kind of document that worked for Chicago's fiscal metrics -- is hosted on lims.minneapolismn.gov, which returned an HTTP 403 Cloudflare bot-challenge to every automated tool tried (WebFetch, curl with browser UA, r.jina.ai proxy, and the Claude Browser tool, which triggered a file-download prompt instead of rendering). This is a TOOLING ACCESS limitation, not a confirmed data absence -- do not mark unavailable. Next step: fetch the Quarterly Financial Status Reports via a real logged-in browser session against lims.minneapolismn.gov.",
    priority: 5,
  },
  {
    key: "minneapolis-procurement-timeline-lims-blocked",
    jurisdictionSlug: "minneapolis",
    metricSlug: "procurement_timeline_days",
    taskType: "metric",
    researchQuestion:
      "A 2026-09-05 research pass found no published procurement cycle-time data on Finance & Property Services' site or in city budget books (a ~2019 modernization plan proposed building a cycle-time dashboard but no evidence it was ever published with actual figures). Two specific, on-topic City Auditor reports were identified but could not be opened -- both hosted on the same Cloudflare-protected lims.minneapolismn.gov domain that blocked capital_budget_execution_rate research this same pass: 'Procure to Pay Process Audit Report' (AU2016-00023) and 'Procurement ABC System Post-Implementation Audit' (AU2020-00005). A tooling access limitation, not a confirmed absence. Next step: fetch both audit PDFs via a real logged-in browser session.",
    priority: 5,
  },
  {
    key: "minneapolis-agency-vacancy-rate-lims-blocked",
    jurisdictionSlug: "minneapolis",
    metricSlug: "agency_vacancy_rate",
    taskType: "metric",
    researchQuestion:
      "A 2026-09-05 research pass found no citywide budgeted-vs-filled position data in the ACFR, Quick Facts page, or budget books (the former HR/Performance-Management dashboards now 301-redirect to a generic 'MinneapolisData' placeholder, consistent with the whole performance-dashboard program being offline). A MPD (police-only) sworn-officer vacancy series was found via secondary press coverage (2020: 24%, 2021: 33%, 2022: 37%, 2023: 38%, all citing primary document RCA-2024-00299) -- DELIBERATELY NOT IMPORTED as agency_vacancy_rate: it is single-department, not citywide, and the underlying secondary sources disagree with each other on actual sworn headcount, so the primary RCA itself needs verification first. RCA-2024-00299 is very likely also lims-hosted and was not reachable this pass. Next step: fetch RCA-2024-00299 via a real logged-in browser session, and separately determine whether any citywide (not police-only) vacancy figure exists in Minneapolis's budget documents.",
    priority: 5,
  },
  {
    key: "minneapolis-permit-approval-days-structural-gap",
    jurisdictionSlug: "minneapolis",
    metricSlug: "permit_approval_days",
    taskType: "metric",
    researchQuestion:
      "A 2026-09-05 research pass checked CPED/Construction Code Services (publishes only a stated SERVICE-STANDARD TARGET of 15 business days for initial plan review, not a measured actual), the ACFR (has permit counts and dollar values, no turnaround-time data), and the city's own open-data permit layer (ArcGIS FeatureServer CCS_Permits has issueDate/completeDate fields but NO application/submission-date field, meaning median approval days cannot be derived from it even with full access) -- none of these are lims-blocked, so this looks like a more genuine dead end than the other 3 government-capacity metrics researched the same pass, though not yet confirmed to the same standard as a metric explicitly marked unavailable elsewhere in this codebase. Left as placeholder rather than unavailable pending one more check of whether Minneapolis's (currently offline) performance-dashboard program ever published this specific figure historically.",
    priority: 3,
  },
  {
    key: "seattle-procurement-timeline-days-dead-end",
    jurisdictionSlug: "seattle",
    metricSlug: "procurement_timeline_days",
    taskType: "metric",
    researchQuestion:
      "A 2026-09-05 research pass confirmed no cycle-time-in-days metric exists for Seattle procurement in any form checked: the Socrata open-data catalog has no contracts/solicitations/RFP dataset at all for Seattle; FAS's 'Seattle Procurement Cookbook' (Sept 2024, with Harvard Kennedy School Government Performance Lab) is qualitative case studies with zero day-figures; a June 2024 'Dashing to Results' announcement confirms FAS built an internal Power BI dashboard but it's not public and no KPI numbers were published; no relevant City Auditor audit exists; the new OpenGov procurement portal (Aug 2024+) has live solicitation listings but no historical bulk data or exposed post-date/award-date pairs to compute a median from. This looks like a genuine structural gap, not a search failure -- no hidden dataset was found the way one was for permit_approval_days.",
    priority: 3,
  },
  {
    key: "seattle-capital-budget-execution-rate-scope-mismatch",
    jurisdictionSlug: "seattle",
    metricSlug: "capital_budget_execution_rate",
    taskType: "metric",
    researchQuestion:
      "A 2026-09-05 research pass confirmed no citywide capital-execution figure exists (Seattle's ACFR budgetary-comparison schedules cover the General Fund only, excluding the utility/enterprise-fund spending -- City Light, SPU, SDOT -- that dominates the actual citywide Capital Improvement Program). A real, government-published execution-rate series DOES exist, but only for SDOT's transportation-levy-funded capital program (~30% of the city's transportation budget, per the levy's own materials, itself just one department): 2021 72.0%/43.2%, 2023 67.2%/55.8%, 2025 43.5% (Levy-only / All-Funds pairs, from SDOT's mandatory annual reports to the Transportation Levy Oversight Committee). DELIBERATELY NOT IMPORTED as capital_budget_execution_rate -- doing so would misrepresent a single-department, levy-specific figure as citywide. 2016/2017/2019/2020/2022/2024 SDOT levy reports likely exist in the same format and were not pulled this pass (time-boxed, not a dead end). No citywide figure is likely obtainable given the ACFR's structural scope limit -- this metric may need a methodology-lead decision on whether a levy-specific proxy is acceptable with a clear scope caveat, similar to how other jurisdictions' county-wide-instead-of-city proxies have been handled.",
    priority: 3,
  },
  {
    key: "seattle-agency-vacancy-rate-partial",
    jurisdictionSlug: "seattle",
    metricSlug: "agency_vacancy_rate",
    taskType: "metric",
    researchQuestion:
      "A 2026-09-05 research pass found no citywide vacancy-rate aggregate in the ACFR, CBO budget books, or City Council Central Staff's 224-page 2019-2024 Budget Review (CBO documents instead discuss a 'vacancy rate ASSUMPTION' -- a budget-planning/savings parameter used to justify cuts, a genuinely different concept from a measured actual rate, not conflated here). One single point-in-time, three-department snapshot was found via Cascade PBS/Crosscut journalism (public-records-sourced, Aug 2022): City Light 15.9%, SPU 11.5%, Parks 13.4% -- NOT imported as agency_vacancy_rate since it is a single date, not a series, not an official city publication, and not citywide. A more promising, unexecuted lead: City Council Central Staff publishes detailed quarterly SPD sworn-staffing briefings (exact fully-trained/deployable counts by quarter since 2020, via Legistar) alongside SPD budget documents stating exact funded sworn FTE by year -- pairing these could yield a defensible SPD-specific vacancy series, though still not citywide. A genuine conceptual trap for whoever picks this up: do not conflate CBO's 'vacancy rate assumption' with an actual measured rate.",
    priority: 3,
  },
  {
    key: "dc-permit-approval-days-wrong-shape",
    jurisdictionSlug: "washington-dc",
    metricSlug: "permit_approval_days",
    taskType: "metric",
    researchQuestion:
      "A 2026-09-05 research pass found DC's Department of Buildings (DOB, split from DCRA in 2020) and predecessor DCRA publish only 'percent of permits completed within N days' threshold KPIs (e.g. '% ProjectDox initial review within 25/30 business days,' '% solar permits within 10 calendar days') in their annual Performance Accountability Reports (PARs, oca.dc.gov) -- never a median-days figure as this metric is defined. Real percent-within-threshold data exists for FY2016, FY2020-2025 (FY2017-2019 not located) but is the WRONG STATISTICAL SHAPE to import as-is -- a percent-within-threshold cannot be cleanly converted to a median. DOB's live Tableau performance dashboard (dob.dc.gov/page/agency-performance-dob) may have more granular data but requires browser automation (JS-rendered) to extract, not yet attempted.",
    priority: 3,
  },
  {
    key: "dc-procurement-timeline-days-unmined-portal",
    jurisdictionSlug: "washington-dc",
    metricSlug: "procurement_timeline_days",
    taskType: "metric",
    researchQuestion:
      "A 2026-09-05 research pass confirmed DC's Office of Contracting and Procurement (OCP) has never published a cycle-time-in-days KPI in any PAR checked (FY2012, FY2020-2025) -- its KPIs cover contract-posting transparency and satisfaction stats only. OCP's own FY2025-26 oversight testimony describes a brand-new internal 'Procurement Administrative Lead Time (PALT) Tracking System' (built with OCTO) explicitly because cycle time has never been publicly quantified -- confirms this is a genuine gap, not a search failure, for 2015-2025. Concrete next step, not a dead end: DC's live Contracts and Procurement Data Transparency Portal (contracts.ocp.dc.gov) has separate Solicitations and Contracts modules with ~6 years of historical data that could in principle be matched (solicitation-post-date to award-date) to compute a real cycle-time metric -- this is a data-extraction/scraping project, not desk research, and was not attempted this pass.",
    priority: 4,
  },
  {
    key: "dc-agency-vacancy-rate-single-agency-only",
    jurisdictionSlug: "washington-dc",
    metricSlug: "agency_vacancy_rate",
    taskType: "metric",
    researchQuestion:
      "A 2026-09-05 research pass found no citywide vacancy aggregate for DC (checked DCHR, DC Auditor, DC Fiscal Policy Institute, news coverage -- a March 2022 DCist article cites '500+ vacant DC government jobs across 20+ agencies' but gives no denominator, so no rate is computable). Two single-agency data points were found and NOT imported (citywide scope mismatch): DCRA FY2016 narrative ('reduced the vacancy rate from 7% to 4%'), and DOB's Q2 FY2025 Schedule A roster (377 budgeted / 57 vacant = 15.1% agency-wide, extracted from DOB's Feb 2025 Council Performance Oversight Pre-Hearing Responses at dccouncil.gov). PAR-level HR/staffing KPIs were dropped from the reporting framework after FY2016, explaining the gap in between. Concrete next step: every DC agency files the same kind of annual 'Schedule A' position-level roster with its Performance Oversight Hearing responses (the same document family that already worked for DC's Housing Production Trust Fund research) -- pulling several more agencies' Schedule A exhibits across more years could eventually support either a multi-agency composite or a documented decision to track agency_vacancy_rate per-agency rather than citywide for DC specifically.",
    priority: 4,
  },
  {
    key: "minneapolis-transit-ridership-scope-conflict",
    jurisdictionSlug: "minneapolis",
    metricSlug: "transit_ridership",
    taskType: "metric",
    researchQuestion:
      "Methodology-lead decision, not a plain research gap: the existing 2024 real value (47.5M) is Metro-Transit-only ridership. A 2026-09-07 research pass found a complete, high-confidence 2015-2024 REGIONAL total series (Metropolitan Council Transportation System Performance Evaluation report, Figure 6.7, NTD-sourced: 2015 98.7M ... 2024 56.6M) that includes Metro Transit plus University of Minnesota, SW Transit/MVTA, Maple Grove Transit, Plymouth Metrolink, vanpool, and dial-a-ride -- a genuinely broader scope than the existing anchor, which is why the two don't reconcile (2024: 56.6M regional vs. 47.5M Metro-Transit-only). DELIBERATELY NOT IMPORTED to avoid splicing two methodologies into one series. Secondary-sourced (not yet primary-verified) Metro-Transit-only leads exist for 2015/2016/2017/2025 (85.8M/82.6M/81.9M/45.15M) if the existing narrower convention is kept instead -- the underlying press-release URLs 404'd this pass. Decide: (a) switch the whole series to the regional NTD total (complete, ready to import) and update 2024, or (b) keep Metro-Transit-only and pursue primary confirmation of the 2015-2017/2025 leads.",
    priority: 6,
  },
  {
    key: "minneapolis-bike-infrastructure-miles-dead-end",
    jurisdictionSlug: "minneapolis",
    metricSlug: "bike_infrastructure_miles",
    taskType: "metric",
    researchQuestion:
      "A 2026-09-07 research pass confirmed a genuine dead end, not a tooling failure: Minneapolis's two relevant open-data GIS layers ('Pedestrian and Bicycle Trails,' 'PW Bike Trails') are both frozen (last updated 2015 and 2018 respectively), and the latter's date field (BIKE_TRAIL_CLINE_CREATED) was directly queried and confirmed to be a one-time GIS-digitization timestamp (all 150 segments cluster in 2009-2010, including trails known to predate 2009 by decades) -- not usable for a by-year construction series. No city report publishes a cumulative by-year total either (the Protected Bikeways Program page is a stale, undated project list). One narrower lead exists: the All Ages & Abilities (AAA) low-stress bikeway sub-network has real tracked mileage for 2024 (30.8mi cumulative) and 2025 (+3.5mi), estimated confidence, secondary-sourced (streets.mn, citing city figures) -- NOT imported since it's scoped to a sub-network, not the full bikeway system this metric's placeholder magnitudes (87-179mi) suggest. A methodology-lead would need to decide whether the AAA sub-network is an acceptable substitute definition before this metric can show any real data for Minneapolis.",
    priority: 3,
  },
  {
    key: "nyc-transit-expansion-miles-methodology-gap",
    jurisdictionSlug: "new-york-city",
    metricSlug: "public_transport_expansion_miles",
    taskType: "metric",
    researchQuestion:
      "public_transport_expansion_miles is now real for 2015, 2017, 2022, 2023 (2024 already real). 2016 and 2018-2021 are a genuine methodology-regime gap, not unresearched: no rail expansion occurred in those years, and NYC's Streets Plan protected-bus-lane reporting (the source for the 2022+ real years) didn't exist yet -- SBS route launches in that window report total corridor length for an existing street converted to SBS service, a different, non-comparable concept to 'protected bus lane miles completed,' so not substituted in. 2025 has only a low-confidence DERIVED figure (~4.9mi, inferred by netting a vague news sentence -- 'about 28 miles of bus lanes by end of 2025' -- against the confirmed 2022-2024 cumulative) that a primary DOT Streets Plan Annual Status Report PDF could not be located to confirm this pass -- deliberately not imported; next step is finding and reading that specific report directly.",
    priority: 4,
  },
  {
    key: "nyc-bike-infrastructure-miles-partial",
    jurisdictionSlug: "new-york-city",
    metricSlug: "bike_infrastructure_miles",
    taskType: "metric",
    researchQuestion:
      "bike_infrastructure_miles is now real for 2015, 2017 (both primary NYC DOT press releases) plus the existing 2024 value. 2016 and 2020 have only year-over-year increment claims ('at least 75 miles added' etc.), no DOT-stated cumulative year-end total. 2018 (~1,217mi) and 2019 (~1,243mi, an explicit mid-year snapshot, not year-end) were found only via secondary reporting the research pass could not directly confirm against a primary DOT source. 2021 (~1,456mi) and 2022 (~1,500-1,525mi) are secondary-sourced and, for 2022, internally inconsistent between two sources (1,500-1,525mi total, 644mi protected, don't fully reconcile) -- likely different snapshot dates within the year. 2023 and 2025 have no usable total-network figure at all (2025's only lead, 'about 95 miles of bike lanes,' is almost certainly a Streets-Plan-era protected-miles-since-2022 subset, not the full-network total comparable to the 1,550mi 2024 baseline). Concrete next step, not yet attempted successfully: NYC Open Data's 'Bicycle Routes' GIS dataset may have an install-date field that could support a from-scratch by-year cumulative reconstruction, the same approach that worked for Chicago and Seattle's bike infrastructure gaps -- a research pass could not confirm within its time budget whether this dataset actually carries a reliable date field.",
    priority: 4,
  },
  {
    key: "dc-transit-ridership-fy15-17-gap",
    jurisdictionSlug: "washington-dc",
    metricSlug: "transit_ridership",
    taskType: "metric",
    researchQuestion:
      "transit_ridership is now real for FY2018-2025 (internal/operational WMATA series, matching the existing anchor's convention). FY2015-2017 could not be found in this same convention -- WMATA's own scorecard/board-pdfs archive doesn't appear to host standalone FY15/16/17 'Metro Performance Report' annual summaries the way it does from FY18 onward. A complete alternative DOES exist for these years (and the whole 2015-2025 range): WMATA's own audited ACFR Statistical Section, Exhibit 21 'Operating Indicators,' sourced to the National Transit Database (NTD) -- FY2015 405.3M, FY2016 379.1M, FY2017 352.5M (cleanly matching the well-documented SafeTrack ridership hit), continuing through FY2025 304.7M. DELIBERATELY NOT IMPORTED, even for just the FY15-17 gap years: this NTD series disagrees substantially with the internal/operational series for every overlapping year (e.g. FY2023: 231.0M NTD vs. 199.7M internal already imported; FY2025: 304.7M NTD vs. 263.7M internal already in the series) -- splicing NTD-sourced FY15-17 values into an otherwise-internal-series would reintroduce a same-metric-different-methodology break. A DC-only (not full tri-jurisdictional WMATA system) ridership figure does not exist as any published aggregate from either source -- only derivable in principle by summing station-level boardings for DC's ~40 Metrorail stations, not attempted this pass.",
    priority: 5,
  },
  {
    key: "dc-transit-reliability-2015-2016-gap",
    jurisdictionSlug: "washington-dc",
    metricSlug: "transit_reliability",
    taskType: "metric",
    researchQuestion:
      "transit_reliability is now real for FY2017-2025 (WMATA's 'Rail Customer On-Time Performance' metric). FY2015 and FY2016 under this same metric could not be located -- the linked FY2015 Annual Vital Signs Report on wmata.com returned a 404 (link appears stale/removed). planitmetro.com (WMATA's old planning/data blog) was not checked this pass and could potentially fill this gap via the Wayback Machine -- a concrete, not-yet-exhausted next step. Do not substitute WMATA's older 'headway adherence' metric (calendar-year, train-spacing based, used pre-~2016) for these years -- it measures something genuinely different from the customer-trip metric this series otherwise uses throughout.",
    priority: 3,
  },
  {
    key: "dc-bike-infrastructure-miles-partial",
    jurisdictionSlug: "washington-dc",
    metricSlug: "bike_infrastructure_miles",
    taskType: "metric",
    researchQuestion:
      "bike_infrastructure_miles is now real for 2015, 2022, 2023 (plus the existing 2026 value) using the 'total bike lane' definition (see sources.ts dc_ddot_bike_lanes for the 3-way definitional tangle DDOT's own reporting has -- total/protected-only/trails). 2016-2021 and 2024-2025 have no confirmed cumulative TOTAL figure -- only protected-lane subsets (which have their own internal inconsistency: ~24mi cited for 2021/early-2022 vs. only 17.4mi in the more rigorous Dec-2023 Council submission, likely reflecting a 'Cycle Track' reclassification out of 'Protected Bike Lane' between reporting vintages) or annual (not cumulative) installation-rate figures from DDOT's FY Performance Accountability Reports, whose own KPI tables did not reconcile between two internal listings found in the same PDFs (a genuine table-extraction ambiguity, not fabricated). Concrete next step: DC's Open Data 'Bicycle Lanes' GIS layer (opendata.dc.gov, DDOT-published, last updated Jan 2023) may have an install-date field for a from-scratch by-year reconstruction (the same approach that worked for Chicago/Seattle) -- its schema is JS-rendered and resisted static WebFetch, needs direct ArcGIS REST API or shapefile-export access to check.",
    priority: 3,
  },
  {
    key: "seattle-transit-ridership-2015-2020-gap",
    jurisdictionSlug: "seattle",
    metricSlug: "transit_ridership",
    taskType: "metric",
    researchQuestion:
      "transit_ridership is now real for 2021-2024 (King County Metro NTD data, see sources.ts ntd_king_county_metro) plus the existing 2025 value (APTA-sourced). 2015-2020 has only a materially higher, non-reconciling King County Metro press-release boardings series (~122-125M pre-pandemic, 2018 itself a dead end -- no clean single-year total found despite several targeted searches) that was deliberately NOT imported for the same methodology-mismatch reason as the NTD/APTA split. Also unresolved: whether APTA (2025's source) and NTD (2021-2024's source) are truly definitionally equivalent was not independently verified this pass -- flagged as a residual uncertainty even for the years already imported.",
    priority: 4,
  },
  {
    key: "seattle-transit-reliability-h1-only",
    jurisdictionSlug: "seattle",
    metricSlug: "transit_reliability",
    taskType: "metric",
    researchQuestion:
      "No real data imported this pass -- everything found was partial-year, not annual. King County Metro's own 'System Evaluation 2023' report (official, PDF-extracted) gives H1 (six-month) on-time performance only: H1 2019 78%, H1 2022 ~79%, H1 2023 79% -- genuinely different from a full-calendar-year figure and not substituted in as one. Weaker secondary fragments also found: ~2013-2018 trailing-12-month 77% (Seattle Times, medium confidence), Sept/Oct 2023 monthly 77% (The Urbanist). Sound Transit's Link light rail on-time performance is a confirmed dead end for this pass -- its 'System Performance Tracker'/'Dependable' pages are JS-rendered dashboards with no extractable historical percentages via WebFetch. Also unresolved: whether this metric should track Metro-only, Sound Transit-only, or a combined figure -- undefined in metricDefinitions/transit.ts.",
    priority: 4,
  },
  {
    key: "seattle-transit-expansion-scope-decision",
    jurisdictionSlug: "seattle",
    metricSlug: "public_transport_expansion_miles",
    taskType: "metric",
    researchQuestion:
      "Methodology-lead decision, not a plain research gap: Sound Transit Link light rail and RapidRide BRT extensions are well-documented with exact opening dates and mileage, but Seattle-city-limits vs. regional-system scope changes the annual figures by roughly 3-4x in several years, and this was deliberately NOT resolved unilaterally. Confirmed events: 2016 University Link (3.15mi, in-Seattle) + First Hill Streetcar (2.5mi, in-Seattle) + Angle Lake Extension (1.6mi, NOT in Seattle); 2021 Northgate Link (4.3mi, in-Seattle); 2023 RapidRide H Line (13mi total route, Seattle-only sub-mileage unresolved); 2024 RapidRide G Line (2.5-2.8mi, in-Seattle) + Lynnwood Link (8.5mi, NOT in Seattle) + East Link South Bellevue-Redmond segment (6.5mi, NOT in Seattle); 2025 Downtown Redmond (3.4mi, NOT in Seattle) + Federal Way (7.8mi, NOT in Seattle). 2015/2017/2018/2019/2020/2022 have no rail/BRT openings found within Seattle specifically, but regional (non-Seattle) openings in those specific years were not fully ruled out, so even these were left unimported pending the scope decision rather than assumed zero.",
    priority: 5,
  },
  {
    key: "seattle-bike-infrastructure-miles-dead-end",
    jurisdictionSlug: "seattle",
    metricSlug: "bike_infrastructure_miles",
    taskType: "metric",
    researchQuestion:
      "No real cumulative-total figure found for any year. Real fragments exist but are all annual INSTALLATION increments (2016 2.4mi built, 2017 4.17mi, 2018 2.34mi 'the least since 2016,' 2020-2021 combined ~10mi, 2025 9.17mi new), not cumulative network totals, and summing increments into a cumulative series risks compounding errors without a confirmed starting baseline -- not attempted. A 2015 voter-approved levy target of 110mi of protected bike lanes + greenways by end of 2024 (only ~57%/~63mi built as of early 2023) is a program-specific subset, not the full network. Concrete next step: SDOT's Bicycle Master Plan progress-report PDFs are the most likely source of an authoritative 'total network miles by year' figure but resisted WebFetch/pdftotext extraction in the time available this pass -- a good target for a follow-up with more robust PDF access, similar in nature to other Seattle PDF-extraction dead-ends already logged in this file.",
    priority: 3,
  },
  {
    key: "minneapolis-vc-investment-scope-gap-years",
    jurisdictionSlug: "minneapolis",
    metricSlug: "vc_investment",
    taskType: "metric",
    researchQuestion:
      "vc_investment is now real for 2019-2021 and 2024-2025 (NVCA's congressional-district CD-05 breakdown, a Minneapolis-specific proxy -- see sources.ts nvca_minnesota_cd_map). 2015-2018, 2022, and 2023 have only Minnesota-STATEWIDE totals (2015 $641.6M ... 2023 $1.2B, various vintages, PitchBook-sourced via NVCA one-pagers and Twin Cities Business/Star Tribune coverage of MN DEED analysis) -- a much larger scope than the city, deliberately not imported. Concrete next step: check whether older NVCA one-pager vintages (recoverable via Wayback Machine, several already used for the years that DID get a CD-05 figure) also break out CD-05 for these specific gap years -- not fully exhausted this pass.",
    priority: 4,
  },
  {
    key: "nyc-business-survival-rate-needs-verification",
    jurisdictionSlug: "new-york-city",
    metricSlug: "business_survival_rate",
    taskType: "metric",
    researchQuestion:
      "NOT IMPORTED, deliberately, despite a seemingly complete 2015-2025 series being found: a 2026-09-08 research pass extracted BLS Business Employment Dynamics Table 7 (New York STATE, not NYC-specific -- the standard proxy this project already uses for this metric) via a secondary summarization tool, because BLS blocked direct curl/bot access to bls.gov/bdm/ny_age_total_table7.txt. The researcher's own report explicitly flagged this as moderate, not high, confidence and recommended 'a follow-up pass with a real browser fetch to confirm exact digits before import' -- a national cross-check produced a similar but not digit-identical series. Values as found (needing verification, not yet trusted): 2015 51.1%, 2016 50.9%, 2017 49.9%, 2018 50.4%, 2019 49.8%, 2020 48.1%, 2021 47.2%, 2022 49.1%, 2023 49.8%, 2024 49.5%, 2025 51.9%. Next step: re-fetch the same table with a real browser session (not curl) and byte-verify these exact figures before importing.",
    priority: 5,
  },
  {
    key: "nyc-vc-investment-remaining-gaps",
    jurisdictionSlug: "new-york-city",
    metricSlug: "vc_investment",
    taskType: "metric",
    researchQuestion:
      "vc_investment is now real for 2021, 2023, and 2024 (NYCEDC 'State of the NYC Economy' reports, NYC-proper scope -- see sources.ts nycedc_state_of_economy). 2015-2020, 2022, and 2025 have no clean single-year NYC-proper figure from a non-paywalled source -- PitchBook's own platform-level regional tables are subscription-gated and NVCA's national Venture Monitor PDFs don't break out this metro. NYCEDC reports do cite some multi-year COMBINED totals covering parts of this range (2017-2019 combined $50.9B; 2021-2023 combined $97.3B) but these cannot be cleanly decomposed into individual years without guessing -- not used. Concrete next step: check whether NYCEDC has published additional single-year annual reports (not just the two vintages already found) covering the gap years directly.",
    priority: 4,
  },
  {
    key: "chicago-business-survival-rate-2024-mislabeled",
    jurisdictionSlug: "chicago",
    metricSlug: "business_survival_rate",
    taskType: "metric",
    researchQuestion:
      "Methodology-lead decision: a 2026-09-08 cross-city research pass discovered that this metric's existing 2024 value (77.9%, 'estimated' quality) is BLS Business Employment Dynamics' 1-YEAR survival rate, not a 5-year rate -- a genuinely different statistic than this metric's own 'after five years' definition calls for. 2015-2020 have since been corrected with the true national 5-year cohort rate from the same BLS BED Table 7 (50.2%...51.4%, see sources.ts bls_bed and the newly-imported rows), matching the convention now used for DC and Minnesota. 2024's value was NOT touched by that correction (there is no valid replacement -- the 2024 cohort's true 5-year mark won't be reachable until 2029) and remains the wrong statistic in the live series. Decide: (a) revert 2024 back to placeholder/unavailable until real 5-year data exists in 2029, or (b) keep the 1-year figure with a clearly different label/definition as an interim leading indicator, explicitly distinguished from the 5-year figures elsewhere in the same series.",
    priority: 6,
  },
  {
    key: "seattle-emergency-response-2023-2025-gap",
    jurisdictionSlug: "seattle",
    metricSlug: "emergency_response_minutes",
    taskType: "metric",
    researchQuestion:
      "emergency_response_minutes is now real for 2015-2022 (SPD's annual Year-End Crime Report, Priority-1 CAD-to-arrival median). SPD discontinued this report format after 2022 -- its 2025 successor ('Year in Review') omits response-time data entirely. Only Q1-specific, precinct-broken-out quarterly SLI staffing reports exist for 2023-2025 (e.g. Q1 2025 citywide P1 median 7.0 min, mean 10.3) -- not a clean full-year citywide figure, and precinct tables were not aggregated since that would require estimation. Concrete next step, not yet attempted: Seattle's open 911/CAD dataset on data.seattle.gov could in principle be queried directly to compute true annual medians for 2023-2025, the same kind of raw-data computation this project has already done successfully elsewhere (e.g. this jurisdiction's own violent_crime_rate/property_crime_rate, mandate-computed from WASPC data). Separately, SFD's own annual reports publish real fire/EMS response data for 2022-2024, but only as percentile-compliance-to-threshold rates (e.g. '76% of first-engine arrivals within 4 minutes'), not mean/median minutes -- structurally incompatible with this metric's unit without an unsupported conversion, confirming this metric is police- not fire/EMS-scoped for Seattle specifically.",
    priority: 3,
  },
  {
    key: "nyc-clearance-rate-2015-2022-methodology-gap",
    jurisdictionSlug: "new-york-city",
    metricSlug: "clearance_rate",
    taskType: "metric",
    researchQuestion:
      "clearance_rate is now real for 2023-2025 (NYPD's own quarterly clearance-report Excel files, combined violent-crime categories, first full years under NYPD's reformed May-2024 methodology). 2015-2016 are a confirmed dead end -- no NYPD clearance files exist for those years at all. 2017(Q4 only)-2022 are a genuine methodology gap, not unresearched: NYPD's older quarterly files for that window give only per-category, per-quarter PERCENTAGES (no raw complaint/clearance counts), computed same-quarter-arrests/same-quarter-complaints -- a documented artifact of the old methodology (e.g. Murder clearance recorded as 102.9% in one 2020 quarter, 200% in one 2022 quarter). Converting these into the 2023-2025 series' volume-weighted combined-violent-crime rate would require fabricating category weights, so it was not attempted. FBI Crime Data Explorer is a confirmed dead end -- NYPD was not submitting data to the FBI's national UCR/NIBRS program as of 2023. NYS DCJS ('Crime in New York State' annual reports) is a genuinely unresolved lead, not ruled out -- worth checking whether its appendices publish a comparable clearance indicator.",
    priority: 4,
  },
  {
    key: "dc-clearance-rate-2015-2021-gap",
    jurisdictionSlug: "washington-dc",
    metricSlug: "clearance_rate",
    taskType: "metric",
    researchQuestion:
      "clearance_rate is now real for 2022-2025 (see sources.ts dc_council_mpd_oversight_testimony). 2018-2021 could not be used despite a candidate MPD-submitted table existing -- its Robbery column is internally impossible (clearances exceeding offenses in at least one year), a genuine data-quality problem in MPD's own submission, confirmed by direct visual inspection of the rendered PDF. 2015-2017 have only unweighted per-offense KPI percentages with no underlying counts, which cannot be blended without fabricating weights. Concrete fallback available for all of 2015-2021 if a narrower proxy is acceptable: MPD's public homicide-only closure-rate page (mpdc.dc.gov/node/208772) gives a clean, continuous series for every year 2010-2025 (2015: 62%, 2016: 70%, 2017: 71%, 2018: 66%, 2019: 68%, 2020: 69%, 2021: 67%) -- the same narrow-proxy approach already used (and now superseded) for 2024.",
    priority: 4,
  },
  {
    key: "dc-emergency-response-remaining-gaps",
    jurisdictionSlug: "washington-dc",
    metricSlug: "emergency_response_minutes",
    taskType: "metric",
    researchQuestion:
      "emergency_response_minutes is now real for 2018-2023 (see sources.ts dc_fems_monthly_ops_reports). FY2024/FY2025 only have percent-within-NFPA-threshold KPIs in FEMS's Performance Accountability Report and DC Council oversight testimony (e.g. '54.9% of higher-priority EMS calls met the arrival benchmark' for FY24) -- a different statistical shape that cannot be cleanly converted to an average-minutes figure, not attempted. 2015-2017 predate FEMS's own Monthly Operating Report series, which itself states it began in FY18 -- nothing earlier was located in any PAR or hearing document. Concrete next step: whether a citywide FY24/FY25 average-minutes figure exists anywhere DC hasn't made public (e.g. via a records request) was not determinable through public web sources this pass.",
    priority: 3,
  },
  {
    key: "minneapolis-clearance-rate-2019-2020-offense-count-conflict",
    jurisdictionSlug: "minneapolis",
    metricSlug: "clearance_rate",
    taskType: "metric",
    researchQuestion:
      "clearance_rate is now real for 2015-2018, 2021-2022, 2024-2025 (FBI Crime Data Explorer, Minneapolis PD agency-level actuals -- see sources.ts, offense counts for 2016-2018 match this project's existing MN-BCA-sourced violent_crime_rate data exactly). 2019 and 2020 are DELIBERATELY NOT IMPORTED: FBI CDE's offense totals for those two years (4,045 and 5,091) do not match this project's existing MN-BCA-sourced offense counts (3,385 and 4,508) for the same crime categories -- a real, unresolved cross-source conflict, verified twice (not a computation error). Likely explanation: FBI's actuals database may hold later-revised MPD submissions for a period with documented MPD data-reporting issues around the 2020 unrest, while the MN BCA figures already in this repo reflect the originally-published UCR numbers. Concrete next step: check MN BCA's own historical clearance table (if one exists) for 2019-2020 to see which source's offense counts it corroborates, rather than picking one of the two conflicting figures arbitrarily.",
    priority: 5,
  },
];
