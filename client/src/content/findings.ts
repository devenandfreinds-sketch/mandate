export interface FindingSource {
  label: string;
  url: string;
}

export interface FindingSection {
  heading: string;
  paragraphs: string[];
  /** A short, visually distinct aside within the section: used for flagged uncertainty, not a footnote. */
  note?: string;
}

export interface Finding {
  slug: string;
  title: string;
  dek: string;
  publishedDate: string;
  category: string;
  sections: FindingSection[];
  sources: FindingSource[];
}

export const findings: Finding[] = [
  {
    slug: "chicago-dc-pension-gap",
    title: "Chicago vs. DC: The 76-Point Pension Gap",
    dek: "Washington DC's pension system is 104% funded. Chicago's is 28%. They're reported the same way, in the same year, and the gap isn't quite what it looks like.",
    publishedDate: "2026-09-13",
    category: "Fiscal Health",
    sections: [
      {
        heading: "The question",
        paragraphs: ["Is DC's pension system actually better run than Chicago's, or is something else going on?"],
      },
      {
        heading: "What the data shows",
        paragraphs: [
          "Chicago has four city pension funds: general employees, laborers, police, and fire. As of FY2025 they're funded at 28%, 44%, 26%, and 25%. Combined, that's 28.1%, the number usually quoted, though it papers over the fact that the laborers' fund is funded almost twice as well as the other three.",
          "DC's retirement system, which covers teachers, police, and fire, is 104.2% funded. It holds more assets than liabilities.",
          "Both figures come from the same fiscal year and the same accounting standard. The gap between them is 76 percentage points.",
        ],
      },
      {
        heading: "Controls",
        paragraphs: [
          "A couple of things worth checking before taking that gap at face value.",
          "One is the investment-return assumption each city uses to value its liabilities. A rosier assumption makes the math easier, and that's not what's happening here: DC actually assumes a more conservative return (6.25%) than Chicago does (6.65–6.75%). If anything, matching assumptions would widen the gap, not close it.",
          "The other question is whether the two numbers even cover the same workers. Not quite. Chicago's figure includes general city employees and laborers, ordinary municipal staff. DC doesn't run a pension fund for that group at all; they're on a 401(k)-style account instead, which can't accumulate unfunded liability the way a pension can. That explains some of the gap. It's not most of it.",
        ],
      },
      {
        heading: "The complication",
        paragraphs: [
          "In 1997, Congress did something for DC that it has never done for Chicago. It took on DC's oldest pension debt directly, everything police officers, firefighters, and teachers had earned before mid-1997, and shifted responsibility for paying it to the U.S. Treasury.",
          "That left DC's pension system covering only benefits earned after that date. Instead of a decades-deep shortfall, it's had a clean run of under 30 years, with the older debt sitting on the federal government's books instead of the District's.",
          "Chicago got no equivalent deal. The full liability its four funds have built up since they were created is still on the city's own books. No other level of government has taken any of it off Chicago's hands.",
          "Given that, DC's 104% says less about superior management than about which decades of debt DC was still on the hook for in the first place.",
        ],
        note: "One thing not fully confirmed: whether judges were part of that same 1997 arrangement. They're handled through a similar federal program, but the specific language tying them to it wasn't something we could pin down from the source we had.",
      },
      {
        heading: "What this means",
        paragraphs: [
          "The takeaway probably isn't \"fund your pensions the way DC does.\" It's closer to this: past a certain depth, a city may not be able to grow or budget its way out of a pension shortfall on its own. It needs another government to absorb part of the debt. DC had that happen in 1997. Chicago hasn't, and there's no existing process for it to ask.",
        ],
      },
      {
        heading: "What this doesn't show",
        paragraphs: [
          "None of this means Chicago is managing its pensions well; there's no version of Chicago that got debt relief to compare against, because that hasn't happened. It also isn't a clean police-to-police or fire-to-fire comparison, since DC reports teachers, police, and fire as one combined figure. And it doesn't touch Chicago's teachers, who have their own separate pension fund outside the four covered here.",
        ],
      },
    ],
    sources: [
      { label: "City of Chicago, FY2025 Annual Comprehensive Financial Report (pension fund schedule)", url: "https://www.chicago.gov/content/dam/city/depts/fin/supp_info/CAFR/2025CAFR/2025%20ANNUAL%20COMPREHENSIVE%20FINANCIAL%20REPORT__v2.pdf" },
      { label: "DC Retirement Board, Actuarial Valuations as of October 1, 2025", url: "https://dcrb.dc.gov/sites/default/files/dc/sites/dcrb/DCRB%202025%20Valuation.pdf" },
      { label: "DC 401(a) Retirement Plan Summary", url: "https://dchr.dc.gov/sites/default/files/dc/sites/dchr/page_content/attachments/DC401PlanBrochure.pdf" },
      { label: "Code of the District of Columbia § 1-901.01 (the 1997 pension transfer, in DC's own words)", url: "https://code.dccouncil.gov/us/dc/council/code/sections/1-901.01" },
      { label: "GAO, \"D.C. Pensions: Plans Consuming Growing Share of District Budget,\" 1994", url: "https://www.gao.gov/products/t-hehs-94-192" },
    ],
  },
];

export function getFindingBySlug(slug: string): Finding | undefined {
  return findings.find((f) => f.slug === slug);
}
