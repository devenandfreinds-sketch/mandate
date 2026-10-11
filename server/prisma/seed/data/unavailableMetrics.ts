export interface UnavailableMetricSpec {
  metricSlug: string;
  jurisdictionSlug: string;
  /** Specific calendar years to mark unavailable. Omit to mark every placeholder-generated year for this metric+jurisdiction. */
  years?: number[];
}

/**
 * Metric+jurisdiction (optionally +year) combinations where no responsibly sourceable dataset
 * exists after checking government and academic sources. These still get a synthetic value from
 * the placeholder generator (so charts render), but are stamped dataQuality: "unavailable" instead
 * of "placeholder" so the UI can distinguish "confirmed no source exists" from "not yet researched."
 */
export const unavailableMetrics: UnavailableMetricSpec[] = [
  { metricSlug: "housing_starts", jurisdictionSlug: "chicago" },
  { metricSlug: "housing_completions", jurisdictionSlug: "chicago" },
  // ACS published no 1-year estimate for 2020 anywhere (COVID data collection disruption) — a
  // permanent gap, unlike other still-placeholder years which just haven't been imported yet.
  { metricSlug: "median_rent", jurisdictionSlug: "chicago", years: [2020] },
  { metricSlug: "vacancy_rate", jurisdictionSlug: "chicago", years: [2020] },
  // Same ACS 1-year 2020 gap as above. 2025 is not yet released as of this research pass (ACS
  // 1-year estimates lag ~9 months after the survey year ends) — a temporary, not permanent, gap;
  // revisit after the ~September 2026 release.
  { metricSlug: "median_wages", jurisdictionSlug: "chicago", years: [2020, 2025] },
  // Active Transportation Alliance's 2020 mode-share report covers 2015-2018; ACS itself was
  // pulled directly for 2024. 2019/2021-2023 could not be independently verified (Census API
  // access requires a key not available in this research pass; data.census.gov's UI could not be
  // reliably scraped for historical vintages), and 2020/2025 are the same permanent/temporary ACS
  // gaps as above. Revisit 2019/2021-2023 with a Census API key.
  { metricSlug: "active_transportation_mode_share", jurisdictionSlug: "chicago", years: [2019, 2020, 2021, 2022, 2023, 2025] },
  // Center for Digital Government's "Digital Cities Survey" (govtech.com, annual) is the only
  // instrument that evaluates Chicago's digital-government maturity, and across every year
  // checked 2015-2025 it publishes ordinal ranks only (Chicago placed 9th in 2018, 8th in 2020,
  // large-cities tier; absent from the published top 10 every other year) -- no city ever gets a
  // 0-100 numeric score, and CDG does not release the underlying survey data. No substitute index
  // (UN LOSI only covers each country's single largest city -- NYC, not Chicago; OECD's Digital
  // Government Index is national-only) was found. Revisit only if CDG changes its methodology.
  { metricSlug: "digital_government_adoption", jurisdictionSlug: "chicago" },
  // Chicago's own Office of Inspector General has audited CFD/EMS response-time measurement four
  // times (2013, 2015, 2021, and a Oct 2025 follow-up) and each time found the department still
  // does not compute response times by median/percentile and has major data gaps (~25% of records
  // unusable in the 2021 audit). A separate 2023 OIG audit of CPD's 911 dispatch data found
  // arrival timestamps were recorded only 49% of the time overall, making a reliable median
  // impossible. "Priority-one" is also ambiguous between police and fire/EMS in Chicago, and
  // neither publishes a clean series. This is a confirmed measurement gap, not an unresearched one.
  { metricSlug: "emergency_response_minutes", jurisdictionSlug: "chicago" },
  // Chicago OBM's budget/CIP documents and the ACFR do not publish a "planned vs. actual capital
  // spending" execution percentage; the closest adjacent figure (FY2025 grant-funding realization,
  // ~81%) is grant revenue, not capital expenditure, and would misrepresent this metric if
  // substituted. OIG's Dec 2020 CIP audit separately found the City's four largest capital-
  // spending departments do not consistently track goal-achievement performance measures at all.
  { metricSlug: "capital_budget_execution_rate", jurisdictionSlug: "chicago" },
  // No Chicago agency, OIG audit, or watchdog (CMAP, BGA, Illinois Answers) publishes an
  // on-schedule delivery percentage for major infrastructure projects. CTA's published "service
  // reliability" figures (~98% scheduled bus service delivered) measure day-to-day transit
  // operations, not capital-project schedule adherence, and would misrepresent this metric.
  { metricSlug: "major_infrastructure_delivery_rate", jurisdictionSlug: "chicago" },
  // BLS Business Employment Dynamics publishes 5-year establishment-survival tables only at the
  // national and state level (no MSA/metro product); Census Bureau Business Dynamics Statistics'
  // metro file (MSA 16980) only has coarse age buckets (0, 1-5, 6-10, 11+), from which a clean
  // "5-year survival rate" can't be derived without interpolation. The one existing estimated-tier
  // year (2024, BLS QCEW establishment count as a rough proxy) stays as-is; remaining years unavailable.
  { metricSlug: "business_survival_rate", jurisdictionSlug: "chicago" },
  // DOL's Apprentices by State Dashboard, Illinois DCEO's statutory Apprenticeship Tax Credit
  // annual report, the Chicago Cook Workforce Partnership's annual reports, and the Chicago
  // Apprentice Network all publish apprenticeship figures, but none at the City of Chicago level:
  // DOL/DCEO data is Illinois-statewide, and the workforce-board/nonprofit figures are small,
  // program-specific, and often cumulative-since-founding rather than an annual active-enrollment
  // count. Using the statewide figure would overstate a city metric by roughly 4x (Illinois pop.
  // vs. Chicago pop.), so it is not substituted. Revisit if DOL's dashboard's claimed county-level
  // drill-down (unverifiable via static fetch this pass) turns out to cover Cook County cleanly.
  { metricSlug: "apprenticeships", jurisdictionSlug: "chicago" },
  // Same ACS 1-year gaps as median_rent/vacancy_rate/median_wages above: no 2020 estimate exists
  // anywhere (COVID suspension, permanent gap), and 2025 has not been released yet as of this pass
  // (temporary gap; revisit after the ~September 2026 release).
  { metricSlug: "labor_force_participation", jurisdictionSlug: "chicago", years: [2020, 2025] },
  { metricSlug: "average_commute_minutes", jurisdictionSlug: "chicago", years: [2020, 2025] },
  // Chicago Department of Housing's Annual Report (source for the existing 2015-2022 estimated
  // values) has no 2023, 2024, or 2025 edition as of this research pass -- confirmed via DOH's own
  // "Data, Plans and Reports" page, which still only links the 2022 edition. A temporary, not
  // permanent, gap; revisit when DOH publishes a newer edition with a comparable
  // units-produced-by-AMI chart.
  { metricSlug: "affordable_housing_completions", jurisdictionSlug: "chicago", years: [2023, 2024, 2025] },
  // NSF's Business Enterprise R&D (BERD) survey and its predecessor BRDIS publish state-level
  // breakdowns at finest -- no US metro or city ever gets a commercial R&D spending figure from any
  // federal source. The only sub-national data found (Illinois Science & Technology Coalition's "R&D
  // Index," ~$12-14B/year) is Illinois-statewide, a materially different geography than Chicago, and
  // was not substituted. This is a confirmed dead end at the metro level for any US city, not just Chicago.
  { metricSlug: "commercial_rd_investment", jurisdictionSlug: "chicago" },
  // No composite "planning efficiency index" exists from Chicago's Department of Planning and
  // Development, the Lincoln Institute of Land Policy, the American Planning Association, or any
  // generalized version applied to any city. Chicago's real permit/plan-review timing data (which
  // would be the natural input to such an index) already fully backs the separate
  // planning_approval_days metric -- this metric would either require fabricating a composite or
  // simply re-deriving from data already captured elsewhere.
  { metricSlug: "planning_efficiency_index", jurisdictionSlug: "chicago" },
  // Chicago Cook Workforce Partnership's chicookworks.org domain has no Wayback Machine snapshot
  // before Sept 2019, and its predecessor site (workforceboard.org, confirmed via Wayback CDX back to
  // 2013) only ever published quarterly "Where Are the Jobs?" labor-market bulletins, never an annual
  // report with Adult/Dislocated-Worker/Youth registrant counts. PY2015-2019 predate the organization
  // publishing this report format at all -- a confirmed absence, not just an unsuccessful search.
  // (2019 added 2026-09-02: re-confirmed independently via direct Wayback CDX API query against the
  // exact annual-report-2020 URL -- zero snapshots ever, versus dozens starting for annual-report-2021.
  // PY2022's report DOES exist but only as a rounded aggregate ("more than 9,300 customers") with no
  // Adult/Dislocated-Worker/Youth breakdown -- not methodologically comparable to the other real years,
  // left as placeholder rather than unavailable since a number does technically exist, just not in a
  // usable shape. PY2025's report is not a gap at all, just not yet published -- CCWP's two most recent
  // reports both lagged ~8-9 months after their program year ended, so expect it around Feb-Mar 2027.)
  { metricSlug: "skills_training_participation", jurisdictionSlug: "chicago", years: [2015, 2016, 2017, 2018, 2019] },
  // BLS QCEW suppressed all three component NAICS codes (3254, 5417, 6215) for the Chicago MSA in
  // 2024 (disclosure_code "N" across the board, confirmed via the raw API CSV) -- a wider suppression
  // than 2022's single-code gap. A temporary, not permanent, gap; revisit in a future QCEW revision.
  // 2022 added 2026-09-02: BLS QCEW suppresses NAICS 5417 (Scientific R&D) alone that year, blocking
  // the 3-code sum this metric requires -- independently re-verified against the live QCEW API.
  { metricSlug: "life_sciences_employment", jurisdictionSlug: "chicago", years: [2022, 2024] },
  // DSA clean-out workforce pass (2026-08-14): apprenticeships confirmed unavailable at
  // city-scope for all four cities checked. NY State does not use the federal RAPIDS system and
  // publishes only statewide apprentice counts (no NYC breakout). Minnesota's Apprenticeship
  // Minnesota program (MN DLI) likewise publishes only statewide figures, no Minneapolis/Hennepin
  // county aggregate. Washington's WSATC/L&I publishes only statewide figures and per-sponsor
  // program applications (not an aggregate enrollment count by city/county). DC's DOES publishes
  // only vague press-release language ("over 850 residents," no exact dated enrollment count) --
  // not a discrete number suitable for a time series. This is a confirmed structural absence
  // (federal/state apprenticeship data infrastructure doesn't break down to city level), not an
  // unresearched gap -- revisit only if a state agency starts publishing city/county aggregates.
  { metricSlug: "apprenticeships", jurisdictionSlug: "new-york-city" },
  { metricSlug: "apprenticeships", jurisdictionSlug: "minneapolis" },
  { metricSlug: "apprenticeships", jurisdictionSlug: "seattle" },
  { metricSlug: "apprenticeships", jurisdictionSlug: "washington-dc" },
  // DSA clean-out housing pass (2026-08-14): housing_starts confirmed structurally unavailable at
  // city level for all four cities checked, independently, by four separate research passes. The
  // Census Bureau's Survey of Construction (SOC) -- the actual primary source for a genuine
  // construction-"starts" statistic, as distinct from a permit-issuance statistic -- has
  // insufficient sample size for anything below the national/4-region level and is never published
  // at state, metro, county, or place level. No city agency in any of the four cities publishes a
  // comprehensive, all-housing "units started" aggregate either (some track individual subsidized
  // projects' groundbreakings, which is a narrower, non-comparable concept). This mirrors the same
  // kind of structural (not researched-and-absent) gap already documented for bond_rating_index in
  // UK jurisdictions -- the statistic simply does not exist at this geography, for any US city.
  { metricSlug: "housing_starts", jurisdictionSlug: "new-york-city" },
  { metricSlug: "housing_starts", jurisdictionSlug: "minneapolis" },
  { metricSlug: "housing_starts", jurisdictionSlug: "seattle" },
  { metricSlug: "housing_starts", jurisdictionSlug: "washington-dc" },
  // Same pass: housing_completions confirmed unavailable for Minneapolis and DC specifically --
  // HUD SOCDS explicitly states only its Building Permits database is actively maintained (no
  // completions series), and DC does not publish an aggregated annual "units completed/CO'd"
  // statistic from its own certificate-of-occupancy process (only permit-level microdata lookups
  // exist, which would require original analysis to aggregate, not citation of an existing
  // government-published number). NYC and Seattle are NOT included here: NYC has a real DCP-sourced
  // series (imported), and Seattle's status is a genuine unresolved source conflict, not a confirmed
  // absence -- see the seattle-housing-completions-citation-conflict research task. Minneapolis was
  // originally listed here too, but a later housing research pass (2026-09-10) found a genuine
  // completions series after all -- see the City's own Construction Code Services (CCS) Permits
  // open-data feed (completeDate field), now imported for 2017-2025.
  { metricSlug: "housing_completions", jurisdictionSlug: "washington-dc" },
  // Minneapolis's CCS Permits open-data feed's earliest usable records begin around late 2016 --
  // 2015-2016 predate the dataset's coverage, a genuine gap distinct from the years now imported.
  { metricSlug: "housing_completions", jurisdictionSlug: "minneapolis", years: [2015, 2016] },
  // Second DSA research round (2026-08-30): HUD's PopSub Point-in-Time homelessness reports could
  // not be located for 2016 under any filename convention for either CoC, while every other year
  // 2015/2017-2025 was retrieved successfully from the same file server -- a confirmed archive gap
  // for that one reporting cycle, not an unresearched year. A later housing research pass
  // (2026-09-10) found 2016 data for both cities after all via different documents (DC: a mayoral
  // press release citing the same official PIT count; Minneapolis: HUD's own consolidated
  // "2007-2025 Point-in-Time Estimates by CoC" file, not the individual per-year PopSub PDF) -- now
  // imported for both, so these entries are removed rather than left stale.
  // Minnesota BCA's annual Uniform Crime Report only publishes a combined Part I index-crime rate
  // for individual agencies in 2015 and earlier -- no violent/property split exists at city level
  // for that year (the offense-category-breakdown supplement format only began with 2016 data).
  { metricSlug: "violent_crime_rate", jurisdictionSlug: "minneapolis", years: [2015] },
  { metricSlug: "property_crime_rate", jurisdictionSlug: "minneapolis", years: [2015] },
  // Chicago research pass (2026-09-02): the City's OBM did not publish any citywide workforce
  // vacancy-rate reporting series before 2025's first-ever Mid-Year Budget Report, whose own
  // retrospective trend table only reaches back to a Jan 1, 2023 snapshot -- confirmed absent, not
  // merely unresearched, for 2015-2022.
  {
    metricSlug: "agency_vacancy_rate",
    jurisdictionSlug: "chicago",
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
  },
  // Chicago Police Department published no Annual Report for 2015 (a 2011-2016 publication hiatus),
  // and Chicago did not submit clearance data to the FBI UCR/NIBRS system for any year from 1994
  // through 2020 -- a confirmed structural gap for clearance_rate 2015 specifically, not unresearched.
  { metricSlug: "clearance_rate", jurisdictionSlug: "chicago", years: [2015] },
  // Chicago innovation-cluster research pass (2026-09-02), independently re-verified against live
  // BLS QCEW/Census APIs rather than trusting prior write-ups:
  // - tech_employment: BLS QCEW suppresses NAICS 5415 for the Chicago MSA in 2015, 2020, 2023, and
  //   2024 (disclosure_code "N", confirmed via the raw API). 2025 stays placeholder -- BLS hasn't
  //   published industry-level detail for 2025 at all yet, a temporary lag, not a permanent gap.
  { metricSlug: "tech_employment", jurisdictionSlug: "chicago", years: [2015, 2020, 2023, 2024] },
  // - life_sciences_employment 2022: see the merged entry earlier in this file (kept together since
  //   unavailableMetrics.find() only matches the FIRST entry per metric+jurisdiction pair).
  // - ai_companies: no source of any kind (Built In Chicago, World Business Chicago, P33, Crunchbase)
  //   publishes a historical point-in-time AI-company census for Chicago before mid-2024 -- a
  //   confirmed absence, not an unsuccessful search. 2024/2025 are real (World Business Chicago);
  //   2026 was already real (Built In Chicago) before this pass.
  {
    metricSlug: "ai_companies",
    jurisdictionSlug: "chicago",
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
  },
  // DC government-capacity research pass (2026-09-05): DC's capital budget is not annually
  // appropriated -- it's authorized as multi-year "lifetime budget authority" per project (OCFO's
  // own Capital Financial Status Report explicitly states agencies may obligate up to a project's
  // full lifetime authority, with encumbrances "planned for future years"). Confirmed directly in
  // the FY2024 ACFR: there is no budgetary comparison schedule for the Capital Projects Fund at all
  // (GASB only requires one where an annual budget is legally adopted), only for the General Fund
  // and Federal/Private Resources. A genuine legal/structural absence, not unresearched.
  { metricSlug: "capital_budget_execution_rate", jurisdictionSlug: "washington-dc" },
  // DC innovation research pass (2026-09-08): BLS QCEW suppresses these NAICS-code/DC-area cells for
  // these specific years (disclosure_code "N", confirmed via the raw API) -- a current-vintage
  // suppression, consistent with how other cities' QCEW suppressions are already marked in this file.
  { metricSlug: "tech_employment", jurisdictionSlug: "washington-dc", years: [2025] },
  {
    metricSlug: "advanced_manufacturing_employment",
    jurisdictionSlug: "washington-dc",
    years: [2020, 2021, 2024, 2025],
  },
  // Housing research pass (2026-09-10): King County Regional Homelessness Authority confirmed no
  // Point-in-Time count was conducted in 2021 (HUD granted a COVID-19 waiver, no count held), 2023
  // (KCRHA moved to a biennial even-year full-count schedule after taking over from All Home in
  // 2022), or 2025 (next full count after 2024 was January 2026, outside this project's window).
  // A confirmed structural absence, not an unresearched gap.
  { metricSlug: "homelessness_count", jurisdictionSlug: "seattle", years: [2021, 2023, 2025] },
  // Durham workforce research pass (2026-09-17): confirmed no UK source publishes graduate
  // employment/outcome rates broken down by local authority of domicile. HESA's Graduate Outcomes
  // survey reports only at provider/subject/national-region level; HESA's local-authority tables
  // cover student domicile (where they enrolled from) and, separately, a graduate-mobility marker
  // (migration flows), neither of which is an employment-outcome rate; DfE/ONS LEO Graduate and
  // Postgraduate Outcomes is regional-level only. Confirmed absent, not merely unresearched --
  // Mandate's Greater Manchester research reached the same conclusion but did not fully rule out
  // the newer HESA mobility-marker release, which this pass checked and also ruled out.
  { metricSlug: "graduate_employment_rate", jurisdictionSlug: "durham-county" },
  // Durham fiscal-health research pass (2026-09-22): confirmed English shire/unitary councils
  // (including Durham) carry no public credit rating from Moody's/S&P/Fitch -- they borrow via the
  // Public Works Loan Board and money markets, not rated public bond issuance, so ratings mentioned
  // in their own Statement of Accounts refer only to counterparty-risk criteria for where the
  // council deposits cash, never a rating of the council itself. Same conclusion as Greater
  // Manchester Combined Authority's still-placeholder bond_rating_index; genuinely rated UK bodies
  // are rare and tend to be London-mayoralty-linked (e.g. Transport for London) or, in at least one
  // case (Warrington BC), a council that took on unusually large commercial-investment debt and had
  // its rating withdrawn in 2024 over unaudited accounts -- confirmed absent, not unresearched.
  { metricSlug: "bond_rating_index", jurisdictionSlug: "durham-county" },
  // Durham Pension Fund (LGPS) actuarial valuations are triennial (2016, 2019, 2022, 2025) --
  // non-valuation years structurally have no funded-percentage figure to report, not merely an
  // unresearched gap.
  {
    metricSlug: "pension_funding_ratio",
    jurisdictionSlug: "durham-county",
    years: [2015, 2017, 2018, 2020, 2021, 2023, 2024],
  },
  // Durham innovation research pass (2026-09-24): confirmed after a genuine search, not assumed.
  // patent_creation -- UK IPO's regular "Facts and Figures" statistics only break down to English
  // region level; the IPO's one-off geocoded patent dataset is a static 2018 snapshot (~30%
  // postcode completeness), not a maintained annual series suitable for import.
  { metricSlug: "patent_creation", jurisdictionSlug: "durham-county" },
  // ai_companies -- DCMS/DSIT's UK AI Sector Study breaks companies down only to English region
  // level; no local-authority-level source found from Beauhurst or any other checked source.
  { metricSlug: "ai_companies", jurisdictionSlug: "durham-county" },
  // commercial_rd_investment -- ONS Business Enterprise R&D (BERD) publishes no local-authority figures.
  // Its ITL2 tables (from 2022) place County Durham inside larger areas ("Tees Valley and Durham",
  // "Northumberland, Durham and Tyne and Wear"), so no County Durham figure exists. (Greater Manchester
  // is its own ITL2 area, which is why GM has this metric and Durham does not.)
  { metricSlug: "commercial_rd_investment", jurisdictionSlug: "durham-county" },
  // vc_investment -- British Business Bank's Nations and Regions Tracker publishes equity-deal
  // data only at North East region level. The Finance Durham Fund (GBP17.29m deployed since 2017)
  // is a public co-investment vehicle, not a market-wide private VC activity measure, and would
  // misrepresent this metric if substituted in -- not imported under this metric for that reason.
  { metricSlug: "vc_investment", jurisdictionSlug: "durham-county" },
  // startup_formation -- Companies House's live search has no county/local-authority filter, and
  // its bulk incorporation data would require a bespoke postcode-to-LA geocoding exercise beyond a
  // standard data pull. The only county-level figure found (Inform Direct, a secondary aggregator)
  // did not reconcile cleanly to the E06000047 unitary-authority boundary -- not imported. No
  // verified primary source distinguishes this from business_formation, which is imported instead.
  { metricSlug: "startup_formation", jurisdictionSlug: "durham-county" },
  // ONS BRES and Business Demography had not yet published a 2025 edition as of this research
  // pass (Sept 2026) -- a temporary, not permanent, gap; revisit once that edition is released.
  { metricSlug: "tech_employment", jurisdictionSlug: "durham-county", years: [2025] },
  { metricSlug: "life_sciences_employment", jurisdictionSlug: "durham-county", years: [2025] },
  { metricSlug: "advanced_manufacturing_employment", jurisdictionSlug: "durham-county", years: [2025] },
  { metricSlug: "business_formation", jurisdictionSlug: "durham-county", years: [2025] },
  // business_survival_rate is a 3-year survival rate measured 3 years after a cohort's birth year;
  // the 2022 cohort only has a published 2-year rate so far, 2023 only a 1-year rate, and 2024/2025
  // cohorts are too recent for any rate yet -- all four years are a temporary, not permanent, gap.
  {
    metricSlug: "business_survival_rate",
    jurisdictionSlug: "durham-county",
    years: [2022, 2023, 2024, 2025],
  },
  // Durham research sweep (2026-10-08): every entry below was confirmed by an independent verifier;
  // full evidence in imports/research/durham-sweep-2026-10.json.
  // bike_infrastructure_miles -- the council's Cycling and Walking Delivery Plan 2019-2029 commits to
  // auditing the network but reports no length; its 'Where to cycle' page gives bridleways, byways and
  // 'over 150km of railway paths', which are shared rights of way, not dedicated bike infrastructure.
  { metricSlug: "bike_infrastructure_miles", jurisdictionSlug: "durham-county" },
  // agency_vacancy_rate -- no council-wide vacancy rate is published. Workforce strategies report
  // sickness and turnover (different measures); the only vacancy figure found is children's social
  // workers (10.8%, March 2025), one professional group, not the whole establishment.
  { metricSlug: "agency_vacancy_rate", jurisdictionSlug: "durham-county" },
  // digital_government_adoption -- no 0-100 benchmark scores Durham. Socitm Better Connected used star
  // ratings; the council reports only a contact-channel share (58% non-digital, vs 77% pre-pandemic),
  // and building a composite from it would mean inventing a methodology. Same outcome as Chicago.
  { metricSlug: "digital_government_adoption", jurisdictionSlug: "durham-county" },
  // major_infrastructure_delivery_rate -- capital outturn reports give spend and reprofiling in GBP, not
  // a count or share of projects delivered on schedule; no RAG or on-time measure in ten years of reports.
  { metricSlug: "major_infrastructure_delivery_rate", jurisdictionSlug: "durham-county" },
  // permit_approval_days -- Durham Building Control publishes service targets, not results; the
  // Building Safety Regulator KPIs have no decision-time median; and English building control is
  // partly run by private approvers, so council data would not cover all permits anyway.
  { metricSlug: "permit_approval_days", jurisdictionSlug: "durham-county" },
  // planning_efficiency_index -- no 0-100 composite exists for any English planning authority. MHCLG
  // P151/P153 publish % of decisions within 13/8 weeks or agreed time, which is reproducible for
  // Durham and GM if Mandate ever defines a percent-on-time metric, but is not this index.
  { metricSlug: "planning_efficiency_index", jurisdictionSlug: "durham-county" },
  // procurement_timeline_days -- no published median; the Contracts Register has no tender-issue or
  // award dates. Derivable in principle from Find a Tender / Contracts Finder notices, but that means
  // building a bespoke dataset from individual notices: revisit as its own project, not a data pull.
  { metricSlug: "procurement_timeline_days", jurisdictionSlug: "durham-county" },
  // vacancy_rate (re-checked; previously left placeholder) -- the metric is RENTAL vacancy. MHCLG Live
  // Table 615 gives whole-stock and social-landlord vacancy only; nothing isolates private-rented
  // vacancy or uses a rental-inventory denominator. Whole-stock vacancy must not be substituted.
  { metricSlug: "vacancy_rate", jurisdictionSlug: "durham-county" },
  // planning_approval_days (re-checked) -- MHCLG publishes only % decided within statutory time, no
  // average or median; planning.data.gov.uk holds 0 Durham applications; the 2025 FOI coverage gives
  // only ranges of averages by category, not a median.
  { metricSlug: "planning_approval_days", jurisdictionSlug: "durham-county" },
  // homelessness_count (re-checked, then verified again) -- the metric is a single-night point-in-time
  // count of sheltered AND unsheltered individuals. MHCLG publishes household duty flows and an
  // unsheltered-only autumn rough-sleeping snapshot. Shelter's annual 'Homelessness in England' local
  // estimates are the closest proxy but are rejected: a modelled composite from different nights, not
  // a consistent series (reference dates move, no 2020, a 2019 recording artefact), the Dec 2023
  // edition used autumn-2019 rough-sleeping figures for every council, and Shelter's terms forbid
  // commercial reuse. A proxy, if ever wanted, should be computed from the OGL government tables.
  { metricSlug: "homelessness_count", jurisdictionSlug: "durham-county" },
  // active_transportation_mode_share -- only the decennial Census measures this at local-authority
  // level (2011 and 2021 imported); intervening years have no figure, like the triennial pension valuations.
  {
    metricSlug: "active_transportation_mode_share",
    jurisdictionSlug: "durham-county",
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2022, 2023, 2024, 2025],
  },
  // average_commute_minutes -- ONS ad hoc 008005 gives County Durham only for 2015 and 2016 (imported);
  // later ONS ad hocs use pre-2009 district geography with no weights, and no later LA series exists.
  {
    metricSlug: "average_commute_minutes",
    jurisdictionSlug: "durham-county",
    years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
  },
  // Greater Manchester research sweep (2026-10-11): each confirmed by an independent verifier;
  // evidence in imports/research/gm-sweep-2026-10.json. GM = the GMCA area (10 boroughs).
  // bike_infrastructure_miles -- TfGM's cycle-routes open data is mixed-quality council map data: ~40%
  // of its 'traffic-free' length is mountain-bike-only surface, segregated tracks are mixed with shared
  // footways, and status coding changes between editions. No measured dedicated length. Same as Durham.
  { metricSlug: "bike_infrastructure_miles", jurisdictionSlug: "greater-manchester" },
  // housing_permits_issued -- MHCLG/Glenigan 'housing units granted planning permission' is England-only;
  // PS1/PS2 count applications, not units; Places for Everyone covers 9 boroughs (not Stockport) and
  // reports no units-permitted flow; borough AMRs define it differently and can't be summed cleanly.
  { metricSlug: "housing_permits_issued", jurisdictionSlug: "greater-manchester" },
  // homelessness_count, planning_approval_days, vacancy_rate -- Durham's reasoning holds for GM: no
  // sheltered+unsheltered point-in-time count (A Bed Every Night is a scheme caseload); no median
  // decision days in England; no rental-specific vacancy series (Table 615 is whole-stock).
  { metricSlug: "homelessness_count", jurisdictionSlug: "greater-manchester" },
  { metricSlug: "planning_approval_days", jurisdictionSlug: "greater-manchester" },
  { metricSlug: "vacancy_rate", jurisdictionSlug: "greater-manchester" },
  // vc_investment -- the British Business Bank tracker does publish a GM figure (84 deals, GBP354m in
  // 2024), but it is BBB analysis of Beauhurst data and BBB's terms (clause 5.5) bar commercial reuse,
  // so it cannot be served through Mandate's paid API. Unavailable pending a licence.
  { metricSlug: "vc_investment", jurisdictionSlug: "greater-manchester" },
  // startup_formation, ai_companies, patent_creation -- as for Durham: no official GM-level source
  // distinct from business births; DSIT's AI sector study is region-level; UK IPO counts are region-level.
  { metricSlug: "startup_formation", jurisdictionSlug: "greater-manchester" },
  { metricSlug: "ai_companies", jurisdictionSlug: "greater-manchester" },
  { metricSlug: "patent_creation", jurisdictionSlug: "greater-manchester" },
  // bond_rating_index -- GMCA has no public credit rating; its 2023/24 accounts show PWLB, EIB and market
  // loans but no bond issuance (rating-agency mentions are treasury counterparty criteria). Same as Durham.
  { metricSlug: "bond_rating_index", jurisdictionSlug: "greater-manchester" },
  // Government capacity -- GMCA publishes no establishment vacancy rate, no 0-100 digital index (UN LOSI's
  // UK pilot sampled only Wigan), no on-schedule project share (capital reports are financial), no permit
  // decision times (building control sits with boroughs and private approvers), no planning composite
  // (boroughs decide applications; MHCLG P151/P153 are %-on-time), and no procurement-cycle KPI.
  { metricSlug: "agency_vacancy_rate", jurisdictionSlug: "greater-manchester" },
  { metricSlug: "digital_government_adoption", jurisdictionSlug: "greater-manchester" },
  { metricSlug: "major_infrastructure_delivery_rate", jurisdictionSlug: "greater-manchester" },
  { metricSlug: "permit_approval_days", jurisdictionSlug: "greater-manchester" },
  { metricSlug: "planning_efficiency_index", jurisdictionSlug: "greater-manchester" },
  { metricSlug: "procurement_timeline_days", jurisdictionSlug: "greater-manchester" },
  // graduate_employment_rate -- HESA Graduate Outcomes is by provider; DfE LEO graduate outcomes are
  // national or regional only. Same as Durham.
  { metricSlug: "graduate_employment_rate", jurisdictionSlug: "greater-manchester" },
  // average_commute_minutes -- ONS published a GM-level mean only for 2014 (imported). Later ad hocs give
  // borough means only, and weighting them would mean imputing suppressed cells.
  {
    metricSlug: "average_commute_minutes",
    jurisdictionSlug: "greater-manchester",
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
  },
  // commercial_rd_investment -- ONS BERD ITL2 tables start with 2022 (imported 2022-2024); earlier years
  // were never published at this geography. 2025 not yet released.
  {
    metricSlug: "commercial_rd_investment",
    jurisdictionSlug: "greater-manchester",
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2025],
  },
  // active_transportation_mode_share -- decennial Census only (2011, 2021 imported), as for Durham.
  {
    metricSlug: "active_transportation_mode_share",
    jurisdictionSlug: "greater-manchester",
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2022, 2023, 2024, 2025],
  },
  // business_formation 2025 -- ONS had not published the 2025 edition as of this pass (temporary gap).
  { metricSlug: "business_formation", jurisdictionSlug: "greater-manchester", years: [2025] },
];
