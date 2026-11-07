import type { MetricSeedSpec } from "../../generators/timeSeries.js";

// Education is real-data-only (see realDataOnly in generators/timeSeries.ts): no synthetic series is
// generated, so a jurisdiction without imported data shows "No data available" instead of fake numbers.
export const educationMetrics: MetricSeedSpec[] = [
  {
    slug: "persistent_absence_rate",
    name: "Persistent / Chronic Absence Rate",
    description:
      "Share of enrolled pupils missing 10% or more of possible school sessions in the year (England: 'persistent absence'; US: 'chronic absenteeism', usually 10%+ of enrolled days). State-funded primary, secondary and special schools.",
    unit: "percent",
    higherIsBetter: false,
    decimalPrecision: 1,
    sortOrder: 0,
    scalesWithPopulation: false,
    baseValue: 0,
    trendPercentPerYear: 0,
    variancePercent: 0,
    realDataOnly: true,
  },
];
