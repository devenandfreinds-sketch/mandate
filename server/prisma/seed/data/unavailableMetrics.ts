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
];
