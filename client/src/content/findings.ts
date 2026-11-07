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
  /** Byline. Omit for Mandate's own staff-researched findings (the default, unattributed). */
  author?: string;
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
  {
    slug: "fc-barcelona-vs-citadel-miami",
    title: "FC Barcelona vs. Citadel",
    dek: "What does this say about Miami's governance strategy?",
    publishedDate: "2026-09-27",
    category: "Economic Development",
    author: "Deven Mishra",
    sections: [
      {
        heading: "What does this say about Miami's governance strategy?",
        paragraphs: [
          "In recent years, many companies have moved down to more \"lifestyle\" cities. Few cities have been affected by this boom quite as much as Miami. It has seen major moves down south, particularly from the North.",
          "Some of the most prominent moves have been FC Barcelona's North American commercial operations from NYC to Miami and Citadel from Chicago to Miami. These two moves tell us quite a bit about Miami's governance strategy.",
          "FC Barcelona was courted by Miami's business development institutions and supported by the government to move its commercial operations down to the city. FC Barcelona was given a business grant to move its commercial operations to Miami. FC Barcelona still has a soccer academy based in NYC.",
          "Citadel has been studied quite extensively, but essentially, it boils down to this: Ken Griffin, CEO of Citadel, has stated that there were two reasons that pushed the firm away from Chicago. While Miami's lifestyle and tax benefits are often discussed, Griffin stated that taxes were not a factor in his decision. His concerns instead centered on Chicago's business environment and public safety.",
        ],
      },
      {
        heading: "FC Barcelona",
        paragraphs: [
          "FC Barcelona conveys a cohesive strategy of appealing to international business very directly through sports branding and commercial partnerships.",
          "However, it is evident that, in terms of fostering and attracting talent itself, Miami is still not on the same level as its Northern counterparts.",
          "Though FC Barcelona has moved its North American commercial operations to Miami, its football club remains in Barcelona, and its academy network continues to operate in other cities, including New York.",
          "The broader question is whether Miami can translate its success in attracting international businesses into a more developed talent ecosystem.",
        ],
      },
    ],
    sources: [],
  },
  {
    slug: "durham-lowest-tax-rise-with-a-catch",
    title: "Durham's Lowest Tax Rise in 15 Years Came With a Catch",
    dek: "Reform UK's first budget for Durham County Council set council tax at 1.99%, the smallest increase in 15 years. Weeks earlier, the same administration cut rebates for roughly 26,000 of the county's lowest-income households.",
    publishedDate: "2026-09-28",
    category: "Fiscal Health",
    sections: [
      {
        heading: "The question",
        paragraphs: [
          "Reform UK campaigned on lower taxes. Its first full budget for Durham County Council delivered the smallest council tax increase in 15 years. Did every resident get the same deal?",
        ],
      },
      {
        heading: "What the data shows",
        paragraphs: [
          "On 11 February 2026, Durham County Council set its 2026/27 council tax increase at 1.99%, entirely from the adult social care precept, with 0% on the core rate. Full Fact independently verified this as the lowest increase in 15 years and found that no Reform-controlled upper-tier council in England had cut council tax in cash terms.",
          "Three months earlier, on 19 November 2025, the same Reform cabinet voted to cut the cap on the Council Tax Reduction Scheme for working-age claimants from 100% to 90%, effective 1 April 2026. The change is expected to raise about £2.161 million a year by requiring council tax support recipients to pay at least 10% of their bill themselves, pulling an estimated 26,000 low-income working-age residents into paying council tax for the first time and reducing the rebate for roughly 2,400 more.",
          "Both decisions fall in the same budget cycle and the same financial year.",
        ],
      },
      {
        heading: "Controls",
        paragraphs: [
          "The 4.99% rise for 2025/26, the year before this one, is sometimes cited as evidence of how far Reform brought the rate down. That figure was set by the outgoing Liberal Democrat-led coalition in February 2025, three months before Reform took control, not by the administration it's being compared against.",
          "Council tax support schemes have been under pressure nationally since local welfare funding was devolved to councils in 2013, and caps get tightened under councils of every party facing budget shortfalls. Whether Durham's cut is a distinctively Reform choice, or the kind of tightening most financially stretched English councils are making regardless of who runs them, isn't something this piece can settle without a wider survey of other councils' 2025/26 and 2026/27 decisions on the same scheme.",
        ],
      },
      {
        heading: "The complication",
        paragraphs: [
          "A 1.99% headline increase describes what happens to a bill that was already being paid in full. For the roughly 26,000 residents newly required to cover 10% of a bill they weren't paying at all, the relevant comparison isn't 1.99%. It's the size of a bill that didn't exist for them the year before.",
          "The council's own justification for the two decisions differs. The LCTRS cut was argued on budgetary grounds, closing part of a projected four-year deficit. The 1.99% rate was framed as tax restraint. They were debated separately, even though they land on some of the same households' finances in the same year.",
        ],
      },
      {
        heading: "What this means",
        paragraphs: [
          "A single headline tax-rate figure can describe very different experiences depending on who's asked. Durham's 2026/27 budget held the general rate about as low as an English county council can while still funding adult social care, and it did that partly by asking its lowest-income residents to start covering more of their own bill.",
        ],
      },
      {
        heading: "What this doesn't show",
        paragraphs: [
          "This isn't evidence that Reform UK's low-tax platform is insincere, or that the Council Tax Reduction Scheme cut was avoidable given the council's finances. It also doesn't establish how Durham's approach compares to other councils managing similar shortfalls, Reform-led or otherwise, which would need a broader look at English council budgets for the same two years.",
        ],
      },
    ],
    sources: [
      { label: "Durham County Council, \"Council tax increase revised to 1.99 per cent,\" 11 February 2026", url: "https://www.durham.gov.uk/article/34796/News-Council-tax-increase-revised-to-1-99-per-cent" },
      { label: "Full Fact, \"Did Reform UK break its promises on council tax?,\" 9 April 2026 (updated 6 May 2026)", url: "https://fullfact.org/politics/reform-council-tax-record/" },
      { label: "Durham County Council, \"Consultation proposed on changes to council tax support\"", url: "https://www.durham.gov.uk/article/33290/News-Consultation-proposed-on-changes-to-council-tax-support" },
      { label: "Durham County Council, \"Residents invited to take part in consultation on proposed changes to Council Tax Reduction scheme\"", url: "https://www.durham.gov.uk/article/33412/News-Residents-invited-to-take-part-in-consultation-on-proposed-changes-to-Council-Tax-Reduction-scheme" },
      { label: "North East Bylines, \"Council tax shock for thousands of Durham's poorest – thanks to Reform UK,\" 22 November 2025", url: "https://northeastbylines.co.uk/news/politics/council-tax-shock-for-thousands-of-durhams-poorest-thanks-to-reform-uk/" },
      { label: "Durham County Council, \"Councillors to agree budget for next four years,\" February 2025", url: "https://www.durham.gov.uk/article/32465/News-Councillors-to-agree-budget-for-next-four-years" },
    ],
  },
  {
    slug: "greater-manchester-schools-who-runs-what",
    title: "Greater Manchester's Schools: The Mayor Doesn't Run Them, and Absence Has Fallen Back to England's Level",
    dek: "Greater Manchester's mayor has no power over schools, so Andy Burnham's education bet was a technical-education track, the MBacc. Meanwhile persistent absence across the ten boroughs nearly doubled after COVID and is only now coming down.",
    publishedDate: "2026-11-07",
    category: "Education",
    sections: [
      {
        heading: "Who runs what",
        paragraphs: [
          "The Greater Manchester Combined Authority and its mayor don't run schools. The ten borough councils still handle admissions, attendance enforcement and support for children with special educational needs. A growing share of schools are academies run by trusts that answer to the Department for Education in London, and the DfE's regional office approves academy changes.",
          "The mayor's real lever is skills and technical education. Greater Manchester has controlled its adult skills budget since 2019, and later devolution deals gave the combined authority more say over post-16 technical education.",
          "That's the sharpest contrast with Chicago, where Chicago Public Schools and its board run schools directly and the mayor's appointees have historically controlled that board. A Greater Manchester mayor can't be judged on school attendance or test scores the way a Chicago mayor can.",
        ],
      },
      {
        heading: "The flagship policy: the MBacc",
        paragraphs: [
          "The Greater Manchester Baccalaureate (MBacc), launched under Andy Burnham, is the combined authority's technical counterpart to the national EBacc, the set of GCSE subjects (English, maths, sciences, a language, history or geography) that the government uses to measure academic breadth. Each MBacc 'gateway' points 14-year-olds toward the GCSEs, then the T Levels and apprenticeships, that the city-region's main employers say they need.",
          "The combined authority's case is that the EBacc fits only a minority: by its count, around 40% of Greater Manchester pupils study for it and about a quarter pass every subject. It describes the MBacc as a route for the other two-thirds who won't go to university.",
          "Employer buy-in is the measurable part so far. The combined authority reported more than 700 new T Level placements pledged in the MBacc's first year, and more than 1,000 from over 350 employers by late 2025.",
          "Critics argue that a separate track sorts 14-year-olds early and could harden into a two-tier system that narrows options rather than widening them.",
        ],
        note: "Placement figures are the combined authority's own pledge counts, not placements actually completed. No independent evaluation of MBacc outcomes exists yet.",
      },
      {
        heading: "Persistent absence: what the data shows",
        paragraphs: [
          "England counts a pupil as 'persistently absent' if they miss 10% or more of possible school sessions, roughly one day a fortnight. That's close to the US definition of chronic absenteeism (10% or more of enrolled days), so the two can be compared, with care.",
          "Across Greater Manchester's ten boroughs, persistent absence was about 11% before the pandemic (10.5% in 2015/16, 11.6% in 2017/18). It jumped to 21.9% in 2021/22, more than one in five pupils, and has fallen each year since: 20.8%, 19.9%, and 18.1% in 2024/25. England followed almost the same path, from 10.5% in 2015/16 to 22.5% in 2021/22 and 18.1% in 2024/25.",
          "Secondary schools are the problem. In 2024/25, 22.7% of Greater Manchester secondary pupils were persistently absent, against 13.4% in primary schools.",
          "The spread between boroughs is wide. Salford was highest in 2021/22 at 26.0% and still is in 2024/25 at 20.6%, even though it has also fallen the most since the peak (5.5 points). Trafford, the most affluent borough, is lowest at 12.6%.",
        ],
        note: "Greater Manchester's figure is total persistent absentees divided by total enrolments across the ten boroughs, not an average of borough percentages. There is no 2019/20 data, and 2020/21 (12.9%) excludes lockdown closures, so it isn't comparable with other years.",
      },
      {
        heading: "Corrections to figures in circulation",
        paragraphs: [
          "Some widely shared numbers on this topic don't match the DfE's full-year statistics. Nationally, persistent absence rose from 10.5% (2015/16) to 22.5% (2021/22), not 10.1% to 20.5%. For Manchester city, the DfE's full-year figure for 2021/22 is 21.7%. The 23.5% figure in a council committee report probably comes from a different collection period.",
          "A claim that Oldham had the worst child poverty in Greater Manchester but one of the smallest absence increases also doesn't hold up on the full-year data. Oldham's rate doubled between 2015/16 and 2021/22, from 12.0% to 24.1%, which is roughly in the middle of the ten boroughs.",
        ],
      },
      {
        heading: "Other pressures",
        paragraphs: [
          "Greater Manchester has more 16- to 19-year-olds than it has college and sixth-form places, a result of a population bulge moving through the system. The government gave Greater Manchester and Leeds GBP10 million each in capital funding to add places.",
          "Families of children with special educational needs describe a postcode lottery between boroughs, with some councils missing the 20-week legal deadline for issuing education, health and care plans.",
        ],
      },
      {
        heading: "What this doesn't show",
        paragraphs: [
          "Absence trends in Greater Manchester say little about the mayor, who has no power over schools. They reflect borough councils, academy trusts and national DfE policy. That's why Mandate shows this as context for Greater Manchester rather than as part of a mayoral scorecard.",
          "It also isn't yet a like-for-like comparison with Chicago. CPS publishes attendance rates and a 'chronic truancy' measure that counts only unexcused absences. The comparable chronic absenteeism figure comes from the Illinois Report Card, which Mandate hasn't added yet.",
        ],
      },
    ],
    sources: [
      { label: "Department for Education, \"Pupil absence in schools in England\" (Explore Education Statistics), 2015/16 to 2024/25, data set \"Absence for persistent and severe absentees\"", url: "https://explore-education-statistics.service.gov.uk/find-statistics/pupil-absence-in-schools-in-england" },
      { label: "Mandate borough-level breakdown (CSV, from the DfE data above)", url: "https://github.com/devenandfreinds-sketch/mandate/blob/main/imports/research/gm-persistent-absence-by-borough-2015-2025.csv" },
      { label: "GMCA, \"Andy Burnham unveils plan to turbocharge growth in Greater Manchester with new technical education route: the Greater Manchester Baccalaureate\"", url: "https://www.greatermanchester-ca.gov.uk/news/andy-burnham-unveils-plan-to-turbocharge-growth-in-greater-manchester-with-new-technical-education-route-the-greater-manchester-baccalaureate/" },
      { label: "GMCA, \"Mayor joins students celebrating exam results as Greater Manchester marks one year delivering the UK's first integrated technical education system\"", url: "https://greatermanchester-ca.gov.uk/news/mayor-joins-students-celebrating-exam-results-as-greater-manchester-marks-one-year-delivering-the-uk-s-first-integrated-technical-education-system" },
      { label: "GMCA, \"Landmark moment for technical education in Greater Manchester as employers pledge 1000 new industry placements\"", url: "https://www.greatermanchester-ca.gov.uk/news/landmark-moment-for-technical-education-in-greater-manchester-as-employers-pledge-1000-new-industry-placements/" },
      { label: "GMCA, MBacc introduction for educators", url: "https://www.greatermanchester-ca.gov.uk/media/5kuj4j0i/mbacc-introductionforeducators-notes-plaintext-1.pdf" },
      { label: "Oldham Chronicle, \"The new route for the two-thirds of young people who don't go to university\"", url: "https://www.oldham-chronicle.co.uk/news-features/139/main-news/151830/the-new-route-for-the-twothirds-of-young-people-who-don%E2%80%99t-go-to-university" },
      { label: "Mancunian Matters, poverty and school absence in Greater Manchester", url: "https://www.mancunianmatters.co.uk/?p=142980" },
      { label: "Manchester City Council, \"School Attendance in Manchester\"", url: "https://democracy.manchester.gov.uk/documents/s35470/School%20Attendance%20in%20Manchester.pdf" },
      { label: "FE Week, 16-19 population bulge capital funding", url: "https://feweek.co.uk/?p=145485" },
      { label: "Local Government Lawyer, \"Manchester region wins greater devolved powers\"", url: "https://localgovernmentlawyer.co.uk/governance/314-governance-a-risk-articles/655-manchester-region-wins-greater-devolved-powers" },
    ],
  },
];

export function getFindingBySlug(slug: string): Finding | undefined {
  return findings.find((f) => f.slug === slug);
}
