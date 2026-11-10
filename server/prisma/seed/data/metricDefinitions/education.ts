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
  {
    slug: "per_pupil_school_spending",
    name: "School Spending per Pupil",
    description:
      "Current (operating) spending per enrolled pupil by the public school district that serves the city, in the district's own currency. US: U.S. Census Bureau Annual Survey of School System Finances, per-pupil current spending (excludes capital outlay, debt service and payments to other school systems such as charter tuition). Fiscal year shown is the year the school year ends.",
    unit: "currency",
    higherIsBetter: true,
    decimalPrecision: 0,
    sortOrder: 1,
    scalesWithPopulation: false,
    baseValue: 0,
    trendPercentPerYear: 0,
    variancePercent: 0,
    realDataOnly: true,
  },
  {
    slug: "naep_score_gap_vs_national",
    name: "NAEP Score Gap vs U.S. Public Schools",
    description:
      "Average gap, in NAEP scale points, between the district's mean score and the U.S. public-school mean, across four tests: grade 4 and grade 8 mathematics and reading. Negative means below the national average. Only districts in NAEP's Trial Urban District Assessment have scores (Chicago, New York City, DC Public Schools; not Seattle).",
    unit: "index",
    higherIsBetter: true,
    decimalPrecision: 1,
    sortOrder: 2,
    scalesWithPopulation: false,
    baseValue: 0,
    trendPercentPerYear: 0,
    variancePercent: 0,
    realDataOnly: true,
  },
  {
    slug: "gcse_attainment8",
    name: "GCSE Attainment 8 Score",
    description:
      "England's main measure of results at the end of secondary school (age 16): a pupil's points across eight GCSE-level subjects, with English and maths double-weighted, averaged over all pupils at state-funded schools. Maximum 90. England only.",
    unit: "index",
    higherIsBetter: true,
    decimalPrecision: 1,
    sortOrder: 3,
    scalesWithPopulation: false,
    baseValue: 0,
    trendPercentPerYear: 0,
    variancePercent: 0,
    realDataOnly: true,
  },
];
