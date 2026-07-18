export interface MetricSourceAssignment {
  metricSlug: string;
  /** Source.key from sources.ts, or null if no consistent official source exists yet. */
  sourceKey: string | null;
  calculationMethod?: string;
  limitations?: string;
}

export const metricSourceAssignments: MetricSourceAssignment[] = [
  // Housing
  {
    metricSlug: "housing_permits_issued",
    sourceKey: "hud_scds",
    calculationMethod: "Total residential building permits issued, summed across all permit types, for the calendar year.",
    limitations: "Greater Manchester has no direct 'permit' equivalent; the closest UK analogue is residential planning permissions granted (MHCLG Live Tables).",
  },
  {
    metricSlug: "housing_starts",
    sourceKey: "hud_scds",
    calculationMethod: "Residential construction projects that broke ground during the calendar year.",
    limitations:
      "No US city publishes a clean city-level 'housing starts' series (Census New Residential Construction is national/regional only); Building Permits Survey data is commonly used as a documented proxy. Greater Manchester has a genuine official starts series via MHCLG Live Tables.",
  },
  {
    metricSlug: "housing_completions",
    sourceKey: "hud_scds",
    calculationMethod: "Residential units issued a certificate of occupancy (or UK equivalent 'completion') during the calendar year.",
    limitations: "US cities vary in how consistently they publish city-level completions; often sourced from local building department data rather than a federal series.",
  },
  {
    metricSlug: "affordable_housing_completions",
    sourceKey: "hud_scds",
    calculationMethod: "Completed units that are deed-restricted or subsidized as below-market-rate housing during the calendar year.",
    limitations: "No standardized federal source; each US city publishes its own affordable-housing production reports. Greater Manchester has a genuine official series via MHCLG 'Affordable housing supply' statistics.",
  },
  {
    metricSlug: "median_rent",
    sourceKey: "us_census_acs",
    calculationMethod: "Median self-reported monthly gross rent (contract rent plus utilities) among renter-occupied units, from ACS Table B25064.",
    limitations: "No ACS 1-year estimate exists for 2020. Greater Manchester uses UK ONS/VOA private rental market statistics, a different survey methodology.",
  },
  {
    metricSlug: "vacancy_rate",
    sourceKey: "us_census_acs",
    calculationMethod: "Rental vacancy rate from ACS Table B25004 (vacant-for-rent units divided by total rental inventory).",
    limitations: "No ACS 1-year estimate exists for 2020. No direct UK equivalent exists; Greater Manchester would need a substituted proxy (e.g. long-term empty homes) with a different definition.",
  },
  {
    metricSlug: "homelessness_count",
    sourceKey: "hud_pit_ahar",
    calculationMethod: "Single-night Point-in-Time count of sheltered and unsheltered individuals experiencing homelessness, as reported by the local Continuum of Care.",
    limitations:
      "Methodology, exact count date, and count-vs-statistical-sample approach vary by Continuum of Care and can change year to year (see Seattle/King County note). Greater Manchester's closest UK equivalent, the MHCLG rough sleeping snapshot, is definitionally narrower (unsheltered only).",
  },
  {
    metricSlug: "planning_approval_days",
    sourceKey: null,
    calculationMethod: "Median calendar days from application submission to planning/zoning approval decision.",
    limitations:
      "No standardized federal source exists for US cities; figures come from individual city building/planning-department open data where published — Chicago's City Data Portal Building Permits dataset now backs this metric for Chicago (median processing_time across all permit types, not new-residential permits specifically). Other US cities still need their own city-specific source identified. Greater Manchester has a genuine official UK series (MHCLG 'Planning applications' statistics), but reported as % of applications decided within 8/13 weeks, not literal days — would require an explicit unit mapping/caveat if used alongside US figures.",
  },

  // Innovation
  {
    metricSlug: "vc_investment",
    sourceKey: "nvca_pitchbook",
    calculationMethod: "Total disclosed venture capital dollars invested in companies headquartered in the jurisdiction during the calendar year.",
  },
  {
    metricSlug: "startup_formation",
    sourceKey: "nvca_pitchbook",
    calculationMethod: "Count of new venture-backable startups (first institutional financing round) formed in the jurisdiction during the calendar year.",
  },
  {
    metricSlug: "business_formation",
    sourceKey: "census_bfs",
    calculationMethod: "Count of new business applications (Employer Identification Number requests with business-formation intent) filed in the metro area during the calendar year.",
  },
  {
    metricSlug: "business_survival_rate",
    sourceKey: "bls_bed",
    calculationMethod: "Share of an establishment birth cohort still operating five years after formation.",
    limitations: "Sub-state/metro survival-rate breakdowns are less granular and less frequently updated than the national BED series.",
  },
  {
    metricSlug: "patent_creation",
    sourceKey: "uspto_ptmt",
    calculationMethod: "Count of utility patents granted where the first-named inventor resides in the metro area, by patent grant year.",
  },
  {
    metricSlug: "university_spinouts",
    sourceKey: "autm_survey",
    calculationMethod: "Count of new companies formed to commercialize university research, aggregated from institution-level technology-transfer office reporting.",
    limitations: "Requires manually aggregating institution-level AUTM survey responses up to a metro area; not published as a ready-made metro-level series.",
  },
  {
    metricSlug: "ai_companies",
    sourceKey: null,
    calculationMethod: "Count of active companies whose primary business is artificial intelligence products or research, headquartered in the jurisdiction.",
    limitations:
      "No standardized official government classification cleanly identifies 'AI companies' — no NAICS code maps to this category. Would require a private data provider (e.g. Crunchbase, PitchBook) or a documented manual classification methodology.",
  },
  {
    metricSlug: "tech_employment",
    sourceKey: "bls_qcew",
    calculationMethod: "Employment in software publishing, IT services, and related NAICS technology industry codes, by metro area.",
  },
  {
    metricSlug: "life_sciences_employment",
    sourceKey: "bls_qcew",
    calculationMethod: "Employment in biotechnology, pharmaceutical, and medical research NAICS industry codes, by metro area.",
  },
  {
    metricSlug: "advanced_manufacturing_employment",
    sourceKey: "bls_qcew",
    calculationMethod: "Employment in technology-intensive manufacturing NAICS industry codes, by metro area.",
  },
  {
    metricSlug: "commercial_rd_investment",
    sourceKey: "census_brds",
    calculationMethod: "Private-sector research and development expenditure attributable to companies headquartered in or operating within the jurisdiction.",
    limitations: "Published primarily at the national and state level; city/metro-level figures require a modeled allocation from company headquarters data, not a direct published series.",
  },

  // Workforce
  {
    metricSlug: "employment",
    sourceKey: "bls_laus",
    calculationMethod: "Total nonfarm employment for the jurisdiction, annual average.",
  },
  {
    metricSlug: "unemployment_rate",
    sourceKey: "bls_laus",
    calculationMethod: "Unemployed share of the labor force, annual average, from Local Area Unemployment Statistics.",
  },
  {
    metricSlug: "labor_force_participation",
    sourceKey: "bls_laus",
    calculationMethod: "Share of the working-age population employed or actively seeking work, annual average.",
  },
  {
    metricSlug: "median_wages",
    sourceKey: "us_census_acs",
    calculationMethod: "Median annual earnings for the civilian employed population 16 years and over, from ACS Table B20002.",
    limitations: "No ACS 1-year estimate exists for 2020.",
  },
  {
    metricSlug: "graduate_employment_rate",
    sourceKey: null,
    calculationMethod: "Share of recent graduates employed within 12 months of completing their program.",
    limitations: "No standardized federal source; typically compiled from state higher-education outcome dashboards or individual institution gainful-employment reporting, which vary widely in coverage and definition.",
  },
  {
    metricSlug: "apprenticeships",
    sourceKey: "dol_apprenticeship",
    calculationMethod: "Count of active registered apprentices in the area, from DOL's RAPIDS system.",
  },
  {
    metricSlug: "skills_training_participation",
    sourceKey: "dol_wioa",
    calculationMethod: "Count of residents enrolled in WIOA-funded workforce skills training programs administered by the local workforce development board.",
    limitations: "Local workforce board boundaries do not always align cleanly with city/metro boundaries.",
  },

  // Government Capacity
  {
    metricSlug: "permit_approval_days",
    sourceKey: "muni_open_data",
    calculationMethod: "Median calendar days to approve a standard building or business permit.",
    limitations: "No standardized federal source; each jurisdiction publishes (or does not publish) this via its own open data portal or department dashboard.",
  },
  {
    metricSlug: "procurement_timeline_days",
    sourceKey: "muni_open_data",
    calculationMethod: "Median calendar days from RFP issuance to contract award.",
    limitations: "No standardized federal source; typically only available where a jurisdiction publishes its own procurement performance data.",
  },
  {
    metricSlug: "capital_budget_execution_rate",
    sourceKey: "municipal_cafr",
    calculationMethod: "Share of the planned annual capital budget actually spent, from the jurisdiction's annual financial or capital plan report.",
  },
  {
    metricSlug: "agency_vacancy_rate",
    sourceKey: "muni_open_data",
    calculationMethod: "Share of budgeted municipal government positions that are unfilled, from the jurisdiction's own workforce reporting.",
    limitations: "No standardized federal source; publication varies widely by jurisdiction.",
  },
  {
    metricSlug: "digital_government_adoption",
    sourceKey: "muni_open_data",
    calculationMethod: "Composite index (0-100) of online service availability and usage, methodology defined per jurisdiction or by a third-party benchmarking study if used.",
    limitations: "No standardized federal source or index; any cross-city comparison must document its own scoring methodology.",
  },
  {
    metricSlug: "major_infrastructure_delivery_rate",
    sourceKey: "muni_open_data",
    calculationMethod: "Share of major capital infrastructure projects delivered on schedule, from the jurisdiction's own capital program reporting.",
  },
  {
    metricSlug: "planning_efficiency_index",
    sourceKey: "muni_open_data",
    calculationMethod: "Composite index (0-100) of planning department throughput relative to caseload, methodology defined per jurisdiction if used.",
    limitations: "No standardized federal source or index.",
  },

  // Transit
  {
    metricSlug: "transit_ridership",
    sourceKey: "fta_ntd",
    calculationMethod: "Total annual unlinked passenger trips reported to the National Transit Database by transit agencies serving the jurisdiction.",
    limitations: "A single city can be served by multiple transit agencies; totals require aggregating agency-level NTD filings to the jurisdiction.",
  },
  {
    metricSlug: "transit_reliability",
    sourceKey: "fta_ntd",
    calculationMethod: "Share of scheduled transit trips arriving within the agency-defined on-time performance window, from NTD or agency reporting.",
  },
  {
    metricSlug: "average_commute_minutes",
    sourceKey: "us_census_acs",
    calculationMethod: "Mean travel time to work for workers 16 and over, from ACS Table B08303.",
    limitations: "No ACS 1-year estimate exists for 2020.",
  },
  {
    metricSlug: "bike_infrastructure_miles",
    sourceKey: "muni_open_data",
    calculationMethod: "Miles of protected or dedicated bike lanes and trails, from the jurisdiction's own transportation department GIS/open data.",
    limitations: "No standardized federal source; definitions of 'protected' vary by jurisdiction.",
  },
  {
    metricSlug: "public_transport_expansion_miles",
    sourceKey: "fta_ntd",
    calculationMethod: "Miles of new rail line or dedicated bus rapid transit corridor opened during the year, from agency/NTD reporting or transit authority press releases.",
  },
  {
    metricSlug: "active_transportation_mode_share",
    sourceKey: "us_census_acs",
    calculationMethod: "Share of commute trips made by walking or bicycling, from ACS Table B08301 (Means of Transportation to Work).",
    limitations: "No ACS 1-year estimate exists for 2020; ACS only captures commute trips, not all trip purposes.",
  },

  // Public Safety
  {
    metricSlug: "violent_crime_rate",
    sourceKey: "fbi_ucr",
    calculationMethod: "Reported violent crime offenses (murder, rape, robbery, aggravated assault) per 100,000 residents, from FBI UCR/NIBRS agency submissions.",
  },
  {
    metricSlug: "property_crime_rate",
    sourceKey: "fbi_ucr",
    calculationMethod: "Reported property crime offenses (burglary, larceny-theft, motor vehicle theft) per 100,000 residents, from FBI UCR/NIBRS agency submissions.",
  },
  {
    metricSlug: "clearance_rate",
    sourceKey: "fbi_ucr",
    calculationMethod: "Share of reported violent crime offenses cleared by arrest or exceptional means, from FBI UCR/NIBRS agency submissions.",
  },
  {
    metricSlug: "emergency_response_minutes",
    sourceKey: "muni_open_data",
    calculationMethod: "Median response time for priority-one emergency calls, from the jurisdiction's own fire/EMS/police dispatch reporting.",
    limitations: "No standardized federal source; definitions of 'priority-one' and measurement start/stop points vary by department.",
  },

  // Fiscal Health
  {
    metricSlug: "budget_balance",
    sourceKey: "municipal_cafr",
    calculationMethod: "General fund revenues minus expenditures for the fiscal year, from the jurisdiction's Annual Comprehensive Financial Report.",
  },
  {
    metricSlug: "debt_per_capita",
    sourceKey: "municipal_cafr",
    calculationMethod: "Total outstanding tax-supported debt divided by population, from the jurisdiction's ACFR and population estimates.",
  },
  {
    metricSlug: "pension_funding_ratio",
    sourceKey: "municipal_cafr",
    calculationMethod: "Pension plan fiduciary net position as a share of the total pension liability, from the jurisdiction's actuarial valuation report (typically included in or alongside the ACFR).",
  },
  {
    metricSlug: "bond_rating_index",
    sourceKey: "credit_rating_agencies",
    calculationMethod: "General obligation bond rating from Moody's, S&P Global, and/or Fitch, mapped onto a 1 (lowest) to 10 (highest, AAA) numeric scale for comparability.",
    limitations: "Rating scales differ slightly across the three agencies; the 1-10 mapping used here is Mandate's own normalization, not an agency-published index.",
  },
  {
    metricSlug: "capital_investment",
    sourceKey: "municipal_cafr",
    calculationMethod: "Total capital expenditure on infrastructure and public assets for the fiscal year, from the jurisdiction's ACFR or capital budget report.",
  },
];
