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
];
