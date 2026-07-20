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
];
