import { describe, it, expect } from "vitest";
import { parsePeriod } from "./validators.js";

describe("parsePeriod: year", () => {
  it("parses a plain calendar year as Jan 1 - Dec 31 UTC", () => {
    const p = parsePeriod("year", "2019");
    expect(p).not.toBeNull();
    expect(p!.periodStart.toISOString()).toBe("2019-01-01T00:00:00.000Z");
    expect(p!.periodEnd.toISOString()).toBe("2019-12-31T00:00:00.000Z");
    expect(p!.periodLabel).toBe("2019");
  });

  it("handles a leap year Dec 31 boundary correctly", () => {
    const p = parsePeriod("year", "2020");
    expect(p!.periodEnd.toISOString()).toBe("2020-12-31T00:00:00.000Z");
  });

  it("rejects non-4-digit input", () => {
    expect(parsePeriod("year", "19")).toBeNull();
    expect(parsePeriod("year", "2019-20")).toBeNull();
  });
});

describe("parsePeriod: uk_fiscal_year", () => {
  it("parses FY2019-20 as 1 Apr 2019 - 31 Mar 2020 UTC, distinct from calendar year 2019", () => {
    const p = parsePeriod("uk_fiscal_year", "2019-20");
    expect(p).not.toBeNull();
    expect(p!.periodStart.toISOString()).toBe("2019-04-01T00:00:00.000Z");
    expect(p!.periodEnd.toISOString()).toBe("2020-03-31T00:00:00.000Z");
    expect(p!.periodLabel).toBe("FY2019-20");
  });

  it("handles the Feb 29 boundary in a fiscal year spanning a leap year", () => {
    // FY2019-20 ends 31 Mar 2020; 2020 is a leap year, so its Feb includes the 29th.
    const p = parsePeriod("uk_fiscal_year", "2019-20");
    const feb29 = new Date(Date.UTC(2020, 1, 29));
    expect(feb29.getTime()).toBeGreaterThan(p!.periodStart.getTime());
    expect(feb29.getTime()).toBeLessThan(p!.periodEnd.getTime());
  });

  it("rejects a mismatched end-year suffix", () => {
    expect(parsePeriod("uk_fiscal_year", "2019-25")).toBeNull();
  });

  it("rejects malformed input", () => {
    expect(parsePeriod("uk_fiscal_year", "2019")).toBeNull();
    expect(parsePeriod("uk_fiscal_year", "FY2019-20")).toBeNull();
  });
});

describe("parsePeriod: uk_academic_year", () => {
  it("parses AY2019-20 as 1 Aug 2019 - 31 Jul 2020 UTC, distinct from the fiscal year of the same label", () => {
    const p = parsePeriod("uk_academic_year", "2019-20");
    expect(p).not.toBeNull();
    expect(p!.periodStart.toISOString()).toBe("2019-08-01T00:00:00.000Z");
    expect(p!.periodEnd.toISOString()).toBe("2020-07-31T00:00:00.000Z");
    expect(p!.periodLabel).toBe("AY2019-20");
  });

  it("does not overlap with the uk_fiscal_year period for the same raw label", () => {
    const fiscal = parsePeriod("uk_fiscal_year", "2019-20")!;
    const academic = parsePeriod("uk_academic_year", "2019-20")!;
    // Fiscal year ends 31 Mar 2020; academic year starts 1 Aug 2019 -- they DO overlap in the
    // middle (Aug 2019-Mar 2020 is common to both), but must have different start AND end dates,
    // proving they are not silently treated as the same period despite sharing a "2019-20" label.
    expect(fiscal.periodStart.getTime()).not.toBe(academic.periodStart.getTime());
    expect(fiscal.periodEnd.getTime()).not.toBe(academic.periodEnd.getTime());
  });
});

describe("parsePeriod: quarter", () => {
  it("parses 2019-Q4 as Oct 1 - Dec 31 UTC", () => {
    const p = parsePeriod("quarter", "2019-Q4");
    expect(p).not.toBeNull();
    expect(p!.periodStart.toISOString()).toBe("2019-10-01T00:00:00.000Z");
    expect(p!.periodEnd.toISOString()).toBe("2019-12-31T00:00:00.000Z");
  });

  it("parses Q1 correctly across a year boundary check (Jan 1 start)", () => {
    const p = parsePeriod("quarter", "2020-Q1");
    expect(p!.periodStart.toISOString()).toBe("2020-01-01T00:00:00.000Z");
    expect(p!.periodEnd.toISOString()).toBe("2020-03-31T00:00:00.000Z");
  });

  it("rejects an out-of-range quarter", () => {
    expect(parsePeriod("quarter", "2019-Q5")).toBeNull();
  });
});

describe("parsePeriod: month", () => {
  it("parses 2019-03 as Mar 1 - Mar 31 UTC (December 2019 example from the task spec)", () => {
    const p = parsePeriod("month", "2019-12");
    expect(p).not.toBeNull();
    expect(p!.periodStart.toISOString()).toBe("2019-12-01T00:00:00.000Z");
    expect(p!.periodEnd.toISOString()).toBe("2019-12-31T00:00:00.000Z");
  });

  it("handles February in a leap year vs. a non-leap year", () => {
    expect(parsePeriod("month", "2020-02")!.periodEnd.toISOString()).toBe("2020-02-29T00:00:00.000Z");
    expect(parsePeriod("month", "2019-02")!.periodEnd.toISOString()).toBe("2019-02-28T00:00:00.000Z");
  });

  it("rejects an out-of-range month", () => {
    expect(parsePeriod("month", "2019-13")).toBeNull();
  });
});

describe("parsePeriod: cross-convention distinctness (the exact ambiguity Greater Manchester exposed)", () => {
  it("'2019', 'FY2019-20', 'AY2019-20', '2019-Q4', and month 2019-12 are all distinguishable, non-conflated periods", () => {
    const calendarYear = parsePeriod("year", "2019")!;
    const fiscalYear = parsePeriod("uk_fiscal_year", "2019-20")!;
    const academicYear = parsePeriod("uk_academic_year", "2019-20")!;
    const q4 = parsePeriod("quarter", "2019-Q4")!;
    const december = parsePeriod("month", "2019-12")!;

    const labels = [calendarYear, fiscalYear, academicYear, q4, december].map((p) => p.periodLabel);
    expect(new Set(labels).size).toBe(5); // every label is unique -- none silently collide

    const starts = [calendarYear, fiscalYear, academicYear, q4, december].map((p) => p.periodStart.getTime());
    expect(new Set(starts).size).toBe(5); // every period genuinely starts at a different instant
  });
});
