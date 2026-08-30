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
  // report with Adult/Dislocated-Worker/Youth registrant counts. PY2015-2018 predate the organization
  // publishing this report format at all -- a confirmed absence, not just an unsuccessful search.
  { metricSlug: "skills_training_participation", jurisdictionSlug: "chicago", years: [2015, 2016, 2017, 2018] },
  // BLS QCEW suppressed all three component NAICS codes (3254, 5417, 6215) for the Chicago MSA in
  // 2024 (disclosure_code "N" across the board, confirmed via the raw API CSV) -- a wider suppression
  // than 2022's single-code gap. A temporary, not permanent, gap; revisit in a future QCEW revision.
  { metricSlug: "life_sciences_employment", jurisdictionSlug: "chicago", years: [2024] },
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
  // completions series), and neither city publishes an aggregated annual "units completed/CO'd"
  // statistic from its own certificate-of-occupancy process (only permit-level microdata lookups
  // exist, which would require original analysis to aggregate, not citation of an existing
  // government-published number). NYC and Seattle are NOT included here: NYC has a real DCP-sourced
  // series (imported), and Seattle's status is a genuine unresolved source conflict, not a confirmed
  // absence -- see the seattle-housing-completions-citation-conflict research task.
  { metricSlug: "housing_completions", jurisdictionSlug: "minneapolis" },
  { metricSlug: "housing_completions", jurisdictionSlug: "washington-dc" },
  // Second DSA research round (2026-08-30): HUD's PopSub Point-in-Time homelessness reports could
  // not be located for 2016 under any filename convention for either CoC, while every other year
  // 2015/2017-2025 was retrieved successfully from the same file server -- a confirmed archive gap
  // for that one reporting cycle, not an unresearched year.
  { metricSlug: "homelessness_count", jurisdictionSlug: "washington-dc", years: [2016] },
  { metricSlug: "homelessness_count", jurisdictionSlug: "minneapolis", years: [2016] },
  // Minnesota BCA's annual Uniform Crime Report only publishes a combined Part I index-crime rate
  // for individual agencies in 2015 and earlier -- no violent/property split exists at city level
  // for that year (the offense-category-breakdown supplement format only began with 2016 data).
  { metricSlug: "violent_crime_rate", jurisdictionSlug: "minneapolis", years: [2015] },
  { metricSlug: "property_crime_rate", jurisdictionSlug: "minneapolis", years: [2015] },
];
