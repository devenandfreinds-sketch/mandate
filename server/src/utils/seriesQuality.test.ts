import { describe, expect, it } from "vitest";
import { classifySeriesQuality, type SeriesQualityInput } from "@mandate/shared";

/** Builds 11 annual periods (2015-2025), assigning dataQuality by year via `overrides`, defaulting to "placeholder". */
function series(overrides: Record<number, string>): SeriesQualityInput[] {
  const rows: SeriesQualityInput[] = [];
  for (let year = 2015; year <= 2025; year++) {
    rows.push({ periodStart: `${year}-01-01`, dataQuality: overrides[year] ?? "placeholder" });
  }
  return rows;
}

describe("classifySeriesQuality", () => {
  it("classifies a fully real series as fully_measured", () => {
    const rows = series(Object.fromEntries(Array.from({ length: 11 }, (_, i) => [2015 + i, "government"])));
    const result = classifySeriesQuality(rows);
    expect(result.category).toBe("fully_measured");
    expect(result.breakdown).toEqual({ total: 11, real: 11, estimated: 0, unavailable: 0, placeholder: 0 });
  });

  it("classifies an entirely placeholder series as fully_placeholder", () => {
    const result = classifySeriesQuality(series({}));
    expect(result.category).toBe("fully_placeholder");
    expect(result.breakdown.placeholder).toBe(11);
  });

  it("classifies a series that is 10/11 real with the gap in the middle as mostly_measured", () => {
    const overrides: Record<number, string> = {};
    for (let year = 2015; year <= 2025; year++) overrides[year] = "government";
    delete overrides[2020]; // gap is NOT the most recent period
    const result = classifySeriesQuality(series(overrides));
    expect(result.category).toBe("mostly_measured");
    expect(result.latestPeriodHasEvidence).toBe(true);
  });

  it("applies the recency safeguard cumulatively: 10/11 real where the ONE gap is the most recent year downgrades past mostly_measured to partially_measured", () => {
    const overrides: Record<number, string> = {};
    for (let year = 2015; year <= 2024; year++) overrides[year] = "government";
    // 2025 (the most recent period) left as placeholder -- this is a strictly weaker case than a
    // mid-series gap, since Mandate has no idea what the CURRENT state is, only a stale historical one.
    const result = classifySeriesQuality(series(overrides));
    expect(result.latestPeriodHasEvidence).toBe(false);
    expect(result.category).toBe("partially_measured");
  });

  it("classifies a contiguous 5/11 real series as partially_measured", () => {
    const overrides: Record<number, string> = {};
    for (let year = 2019; year <= 2023; year++) overrides[year] = "government";
    const result = classifySeriesQuality(series(overrides));
    expect(result.category).toBe("partially_measured");
  });

  it("classifies a single real year out of 11 as limited_evidence, not partially_measured", () => {
    const result = classifySeriesQuality(series({ 2023: "government" }));
    expect(result.category).toBe("limited_evidence");
  });

  it("classifies three scattered isolated real years as limited_evidence even though the fraction is non-trivial", () => {
    const result = classifySeriesQuality(series({ 2015: "government", 2019: "government", 2023: "government" }));
    expect(result.category).toBe("limited_evidence");
    expect(result.fragmented).toBe(true);
  });

  it("treats estimated values as evidence, contributing to the evidence fraction", () => {
    const overrides: Record<number, string> = {};
    for (let year = 2019; year <= 2023; year++) overrides[year] = "estimated";
    const result = classifySeriesQuality(series(overrides));
    expect(result.category).toBe("partially_measured");
    expect(result.breakdown.estimated).toBe(5);
    expect(result.breakdown.real).toBe(0);
  });

  it("classifies a series dominated by unavailable rows (no evidence at all) as unavailable, not fully_placeholder", () => {
    const overrides: Record<number, string> = {};
    for (let year = 2015; year <= 2025; year++) overrides[year] = "unavailable";
    const result = classifySeriesQuality(series(overrides));
    expect(result.category).toBe("unavailable");
  });

  it("classifies a series with a few unavailable rows and mostly placeholder as fully_placeholder (placeholder dominates)", () => {
    const result = classifySeriesQuality(series({ 2015: "unavailable", 2016: "unavailable" }));
    expect(result.category).toBe("fully_placeholder");
  });

  it("downgrades fully_measured to mostly_measured when the latest period lacks evidence (recency safeguard)", () => {
    // 10 real years + 1 unavailable year (no placeholder at all) clears the fully_measured threshold
    // (evidenceFrac 10/11 >= 0.9, placeholder === 0) on fraction alone, but the most recent year (2025)
    // is the unavailable one -- the series can't fairly be called "nearly complete" when its current
    // state is unknown, so it should be downgraded one level rather than reported as fully_measured.
    const overrides: Record<number, string> = { 2025: "unavailable" };
    for (let year = 2015; year <= 2024; year++) overrides[year] = "government";
    const result = classifySeriesQuality(series(overrides));
    expect(result.latestPeriodHasEvidence).toBe(false);
    expect(result.category).toBe("mostly_measured");
  });

  it("does not downgrade when the latest period does have evidence", () => {
    const overrides: Record<number, string> = {};
    for (let year = 2016; year <= 2025; year++) overrides[year] = "government";
    const result = classifySeriesQuality(series(overrides));
    expect(result.latestPeriodHasEvidence).toBe(true);
    expect(result.category).toBe("mostly_measured"); // 10/11, one placeholder gap (2015) -- not recency-limited
  });

  it("real data concentrated in one contiguous cluster (not scattered) is not flagged as fragmented", () => {
    const overrides: Record<number, string> = {};
    for (let year = 2020; year <= 2024; year++) overrides[year] = "government";
    const result = classifySeriesQuality(series(overrides));
    expect(result.fragmented).toBe(false);
  });

  it("caps very short series at limited_evidence even at 100% real (fiscal-year metric with only 1 recorded period)", () => {
    const result = classifySeriesQuality([{ periodStart: "2023-04-01", dataQuality: "government" }]);
    expect(result.category).toBe("limited_evidence");
    expect(result.breakdown).toEqual({ total: 1, real: 1, estimated: 0, unavailable: 0, placeholder: 0 });
  });

  it("handles uk_fiscal_year-style period labels the same as calendar years (only relative ordering matters)", () => {
    const rows: SeriesQualityInput[] = [
      { periodStart: "2020-04-01", dataQuality: "government" },
      { periodStart: "2021-04-01", dataQuality: "government" },
      { periodStart: "2022-04-01", dataQuality: "government" },
      { periodStart: "2023-04-01", dataQuality: "government" },
      { periodStart: "2024-04-01", dataQuality: "placeholder" },
    ];
    const result = classifySeriesQuality(rows);
    // 4/5 real (evidenceFrac 0.8) would be mostly_measured on fraction alone, but the most recent
    // period (2024-25 fiscal year) is the placeholder one, so the recency safeguard downgrades it.
    expect(result.category).toBe("partially_measured");
    expect(result.latestPeriodHasEvidence).toBe(false);
  });

  it("handles uk_academic_year-style period labels (Aug 1 start) identically via periodStart ordering", () => {
    const rows: SeriesQualityInput[] = [
      { periodStart: "2021-08-01", dataQuality: "academic" },
      { periodStart: "2022-08-01", dataQuality: "academic" },
      { periodStart: "2023-08-01", dataQuality: "academic" },
      { periodStart: "2024-08-01", dataQuality: "academic" },
    ];
    const result = classifySeriesQuality(rows);
    expect(result.category).toBe("fully_measured");
  });

  it("is agnostic to currency/unit -- classification depends only on dataQuality and periodStart, not value or currencyCode", () => {
    // The classifier's input type doesn't even carry a value/currencyCode field, so a GBP-denominated
    // series and a USD-denominated series with the same dataQuality pattern classify identically.
    const overrides: Record<number, string> = {};
    for (let year = 2015; year <= 2025; year++) overrides[year] = "government";
    const result = classifySeriesQuality(series(overrides));
    expect(result.category).toBe("fully_measured");
  });

  it("returns fully_placeholder for an empty series", () => {
    const result = classifySeriesQuality([]);
    expect(result.category).toBe("fully_placeholder");
    expect(result.breakdown.total).toBe(0);
  });
});
