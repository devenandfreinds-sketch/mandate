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
      "Extract exact annual business-application counts for New York, Kings, Queens, Bronx, and Richmond counties for 2023, 2024, and 2025 from Census Bureau Business Formation Statistics. Why it matters: this metric is currently 100% placeholder for NYC; the underlying county-level data exists but requires direct table extraction, not web-search summarization. Already checked: census.gov/econ/bfs landing pages only (not the data tables). Suggested next source: https://www.census.gov/econ/bfs/data/county.html raw CSV/table download, reconciled across the five boroughs. Difficulty: low-medium (data-wrangling, not judgment). Skill set: data analyst comfortable with Census Bureau table structures.",
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
      "Obtain primary-source (MN BCA Uniform Crime Report / MPD dashboard) violent and property crime rates for Minneapolis 2022-2025 — this research pass's figures (e.g., 1,132 per 100,000 violent crime for 2023) came from secondary aggregator sites, not the BCA report directly, and were never imported as real MetricValues for exactly this reason. Why it matters: Minneapolis currently has zero real crime-rate data despite Chicago's precedent showing this metric is high-value and directly obtainable from primary sources. Already checked: secondary aggregators only (city-data.com, safehome.org, legalclarity.org). Suggested next sources: dps.mn.gov BCA Uniform Crime Report PDFs directly, MPD's public crime dashboard/maps. Difficulty: easy (primary documents are public; needs direct retrieval and year-over-year NIBRS-transition methodology notes). Skill set: data/research assistant comfortable with government PDF reports.",
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
      "Obtain the exact FY2024 and FY2025 Housing Production Trust Fund annual-report figures (units financed by AMI tier, dollars disbursed, percent meeting the 50% extremely-low-income statutory requirement). Why it matters: this is the single most load-bearing metric for whether HPTF should remain at stage 4 or could support stage 5 — this research pass found only FY2021-FY2023 figures (18-48% ELI compliance) via secondary DCFPI/NPR reporting. Already checked: DHCD's reports landing page (titles only, no summary data extractable), DCFPI, GGWash, D.C. Policy Center secondary analyses. Suggested next sources: direct PDF pulls from dhcd.dc.gov/page/housing-production-trust-fund-reports, DC Council Committee on Housing oversight hearing testimony. Difficulty: low-medium (PDF retrieval/parsing). Skill set: data/document research analyst.",
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
];
