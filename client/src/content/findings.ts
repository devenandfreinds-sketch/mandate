export interface FindingSource {
  label: string;
  url: string;
}

export interface FindingSection {
  heading: string;
  paragraphs: string[];
  /** A short, visually distinct aside within the section — used for flagged uncertainty, not a footnote. */
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
    dek: "Washington DC's pension system is 104% funded. Chicago's is 28%. Same year, same accounting rules — but not the same story.",
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
          "Chicago has four city pension funds: general employees, laborers, police, and fire. As of FY2025, they're funded at 28%, 44%, 26%, and 25%. Add them together and you get 28.1% — the number usually quoted, but it hides the fact that laborers are funded almost twice as well as everyone else.",
          "DC's retirement system — which covers teachers, police, and fire — is 104.2% funded. Fully funded and then some.",
          "Same fiscal year. Same accounting standard. A 76-point gap.",
        ],
      },
      {
        heading: "Controls",
        paragraphs: [
          "A few things that could explain this away, checked and ruled out.",
          "Is DC just assuming a rosier investment return, making its math look easier? No — DC actually assumes a more conservative return (6.25%) than Chicago does (6.65–6.75%). If anything this understates the gap, not the reverse.",
          "Are they even measuring the same group of workers? Not quite. Chicago's number includes general city employees and laborers — regular municipal workers. DC doesn't have a pension fund for those workers at all; they get a 401(k)-style account instead, which can't rack up unfunded debt the way a pension can. So part of Chicago's low number comes from including a category of worker that DC simply doesn't pension in the traditional sense. That's a real difference, but it's not the biggest one.",
        ],
      },
      {
        heading: "The complication",
        paragraphs: [
          "In 1997, Congress did something for DC it has never done for Chicago: it took DC's oldest pension debt — everything police, fire, and teachers had earned before mid-1997 — and moved it onto the federal government's books. The U.S. Treasury pays those benefits now, not DC.",
          "DC's pension system today only has to cover what's been earned since that reset. It's not an old, decades-deep hole. It's a plan that's basically been running clean for under 30 years, with the federal government quietly holding the bag on everything older.",
          "Chicago never got a reset like that. Every dollar its four funds owe, going back decades, is still sitting on the city's own books. Nobody stepped in.",
          "So DC's 104% isn't proof DC out-managed Chicago. It's proof DC had its debt forgiven and then behaved responsibly with what was left.",
        ],
        note: "One thing not fully confirmed: whether judges were part of that same 1997 deal. They're handled by a similar federal program, but the wording connecting them to it wasn't something we could pin down from the source we had.",
      },
      {
        heading: "What this means",
        paragraphs: [
          "The honest version of this finding isn't \"fund your pensions like DC does.\" It's: once a pension hole gets deep enough, a city may not be able to grow or budget its way out of it alone — it needs someone else to write some of it off. DC got that. Chicago hasn't, and has no path to ask for it.",
        ],
      },
      {
        heading: "What this doesn't show",
        paragraphs: [
          "This doesn't mean Chicago is doing a good job — no comparison was run against a version of Chicago that got debt relief, because that hasn't happened. It also doesn't give a clean police-vs-police, fire-vs-fire comparison, since DC lumps teachers in with police and fire in one combined number. And it says nothing about Chicago's teachers, who are on an entirely separate pension fund not covered here.",
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
