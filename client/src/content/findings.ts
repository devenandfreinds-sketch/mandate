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
  {
    slug: "us-farm-tariff-aid-30-percent-of-income",
    title: "Federal Aid Is Now 30% of U.S. Farm Income, and Farm Bankruptcies Are Still Rising",
    dek: "Washington's $12 billion 'bridge' payment for tariff-hit farmers is only part of a record year of federal farm payments. They hold average farm income steady, but market income is falling, debt is at a record, and Chapter 12 filings keep climbing.",
    publishedDate: "2026-11-10",
    category: "Trade & Agriculture",
    sections: [
      {
        heading: "The question",
        paragraphs: [
          "How are American farmers coping with the tariff fight, and with the aid that was meant to bridge it? This is a national question rather than a city one: none of the six cities Mandate tracks is a farm economy.",
        ],
      },
      {
        heading: "What the aid is",
        paragraphs: [
          "The Farmer Bridge Assistance program, announced in December 2025, is a $12 billion package. $11 billion goes to row crops as a one-time payment per acre planted in 2025; the rest goes to specialty crops through a separate program. Payments were capped at $155,000 per person or entity, farmers with average adjusted gross income over $900,000 were excluded, and the money was due out by February 28, 2026.",
          "It isn't a rebate. Farmers don't get back the tariffs they paid; they get a flat payment per acre, set crop by crop.",
          "The rates are very uneven. Rice gets $132.89 an acre and cotton $117.35. Corn gets $44.36, wheat $39.35, and soybeans $30.88, even though soybeans are the crop most exposed to lost Chinese demand. Flax is lowest, at $8.05.",
        ],
      },
      {
        heading: "What the data shows",
        paragraphs: [
          "USDA's Economic Research Service forecasts $47.4 billion in direct government payments to farms in 2026, up $19.5 billion (about 70%) in a year and the highest in its 2019–2026 series. That's 29.9% of the $158.4 billion forecast net farm income. In 2024 the share was 7.9%.",
          "Even with that money, net farm income is forecast to fall 2.6% in 2026, or 5.5% after inflation. Strip out government payments and net crop-insurance payments and ERS has farm income falling $34 billion, or 26%, to its lowest level since 2020.",
          "Costs and debt are both up. Total farm expenses are forecast at $492.8 billion (+4.5%) and farm debt at a record $605.1 billion (+4.6%).",
          "Chapter 12, the bankruptcy chapter for family farms, tells the same story. Filings rose from 216 in 2024 to 315 in 2025, up 46%. In the first nine months of 2026 there were 292, against 246 in the same period of 2025, up 19%.",
        ],
      },
      {
        heading: "The complication",
        paragraphs: [
          "Most of this year's jump in federal payments isn't tariff aid. ERS expects about $15 billion in 2026 from the Farm Bill's Agricultural Risk Coverage and Price Loss Coverage programs, which pay out automatically when crop prices or revenues fall. That's more than the forecast rise in the bridge payments and other ad hoc aid combined.",
          "So the headline \"30% of farm income\" is mostly a price story with tariff aid on top, not tariff aid alone.",
        ],
      },
      {
        heading: "What this means",
        paragraphs: [
          "The aid has kept average farm finances close to break-even. ERS forecasts median farm-household income at $108,460, up about 5%. But the share of farm income that now comes from Washington is back to pandemic-era levels, and debt and bankruptcies are rising underneath it. The farms most exposed are the ones that rely most on markets the trade fight has hit, soybeans above all.",
        ],
      },
      {
        heading: "What this doesn't show",
        paragraphs: [
          "Chapter 12 only covers farmers who make most of their income from farming, so it understates distress among part-time and smaller farms. ERS's 2026 figures are forecasts, not final numbers. And the per-acre rates say nothing about whether each crop's payment matches what that crop actually lost; USDA didn't publish a loss-by-crop calculation alongside the rates.",
        ],
        note: "The per-acre rates come from farmdoc daily's tabulation of USDA's December 31, 2025 announcement, because the USDA page refused automated access. The bankruptcy counts are U.S. Courts data as compiled by the American Farm Bureau Federation and the National Agricultural Law Center. Both should be checked against the primary documents.",
      },
    ],
    sources: [
      { label: "USDA Economic Research Service, U.S. farm sector financial indicators 2019–2026F (September 3, 2026 forecast)", url: "https://www.ers.usda.gov/data-products/farm-income-and-wealth-statistics/data-files-us-and-state-level-farm-income-and-wealth-statistics" },
      { label: "USDA Economic Research Service, farm income forecast webinar transcript, September 3, 2026", url: "https://www.ers.usda.gov/sites/default/files/2026_09_03%20Webinar%20Transcript_Farm%20Income.pdf" },
      { label: "USDA, \"USDA Announces Commodity Payment Rates for Farmer Bridge Assistance Program\" (December 31, 2025)", url: "https://www.usda.gov/about-usda/news/press-releases/2025/12/31/usda-announces-commodity-payment-rates-farmer-bridge-assistance-program" },
      { label: "farmdoc daily (University of Illinois), \"Farmer Bridge Assistance Program Payment Rates\" (January 6, 2026)", url: "https://farmdocdaily.illinois.edu/2026/01/farmer-bridge-assistance-program-payment-rates.html" },
      { label: "Federal Register, Farmer Bridge Assistance (FBA) Program notice (February 23, 2026)", url: "https://www.federalregister.gov/documents/2026/02/23/2026-03456/farmer-bridge-assistance-fba-program" },
      { label: "University of Arkansas System Division of Agriculture / National Agricultural Law Center, Q3 2026 Chapter 12 filings (October 22, 2026)", url: "https://www.uaex.uada.edu/media-resources/news/2026/october/10-22-2026-ark-nalc-q3-bankruptcies.aspx" },
      { label: "Investigate Midwest, \"Farm bankruptcies jumped 46% in 2025\" (AFBF analysis of U.S. Courts data)", url: "https://investigatemidwest.org/2026/02/25/farm-bankruptcies-jumped-46-in-2025-as-debt-loads-and-costs-rise/" },
      { label: "Mandate research brief with charts and CSVs (six-city social brief, November 2026)", url: "https://github.com/devenandfreinds-sketch/mandate/blob/main/imports/research/six-city-social-brief-2026-11/README.md" },
    ],
  },
  {
    slug: "addiction-follows-poverty-inside-cities",
    title: "Addiction Follows Poverty Inside Cities, but Less So Between Them",
    dek: "In New York, Greater Manchester and Dublin, the poorer the neighbourhood, the worse the addiction harm. Across cities the pattern weakens: Seattle has the lowest poverty of the four U.S. cities but one of the highest overdose death rates.",
    publishedDate: "2026-11-10",
    category: "Public Health",
    sections: [
      {
        heading: "The question",
        paragraphs: [
          "How common is addiction in New York, Chicago, Seattle, Washington DC, Greater Manchester and Dublin, and how closely does it track poverty?",
        ],
      },
      {
        heading: "What can be measured",
        paragraphs: [
          "No government publishes a count of people with addiction for any of these cities. There are three official stand-ins, and they measure different things. The U.S. survey on drug use (SAMHSA's NSDUH) estimates the share of people with a substance use disorder, but only by state. Overdose deaths, from the CDC, and drug-misuse deaths, from ONS in England, capture the most severe harm. Ireland's Health Research Board counts treatment episodes, which reflect access to treatment as well as need.",
          "Because the definitions differ, the U.S., English and Irish figures below shouldn't be compared with each other directly.",
        ],
      },
      {
        heading: "How common it is",
        paragraphs: [
          "About one in six Americans aged 12 and over (16.9%) met the clinical criteria for a substance use disorder in 2023–2024. Washington DC is far above that, at 23.9%, nearly one in four. Illinois is at 18.3%, New York 17.3% and Washington State 16.6%.",
          "Overdose deaths have fallen sharply everywhere since 2023. In 2025, per 100,000 residents: Washington DC 39.2, Seattle's King County 36.2, New York City 20.8, Chicago's Cook County 18.6, against a U.S. rate of 20.7. Cook County's rate is down 55% from its 2022 peak.",
          "In Greater Manchester, drug-misuse deaths registered in 2023–2025 ran at 11.2 per 100,000 in Manchester itself, nearly double England's 6.0. The other nine boroughs ranged from 5.1 (Wigan) to 8.6 (Tameside).",
        ],
      },
      {
        heading: "The link to poverty",
        paragraphs: [
          "Inside New York City the relationship is strong. Across the five boroughs, the poverty rate and the overdose death rate correlate at 0.90. The Bronx, at 28.7% poverty, had 42.3 overdose deaths per 100,000 in 2025; Queens, at 13.4%, had 12.6.",
          "In Greater Manchester, Manchester is both the most deprived borough (4th most deprived of 296 English districts) and the one with the most drug deaths. Across all ten boroughs the correlation is 0.55, but most of that comes from Manchester. Oldham and Rochdale are among the most deprived boroughs yet sit below England's average death rate.",
          "Ireland shows the cleanest gradient. Addiction treatment rates rise with every step of neighbourhood deprivation: 148.3 episodes per 10,000 people in the most deprived areas against 11.5 in the most affluent, a 13-fold gap. For heroin the gap is 41-fold. County Dublin has 28% of Ireland's population but 52% of its cocaine treatment cases. Of everyone treated for drugs in Ireland in 2025, 59% were unemployed and 12% were homeless.",
        ],
      },
      {
        heading: "The complication",
        paragraphs: [
          "Between cities, poverty explains much less. Across the five NYC boroughs plus Cook County, King County and DC, the correlation falls to 0.41. Seattle is the clearest exception: King County has the lowest poverty rate of the eight (8.8%) but the third-highest overdose death rate. Fentanyl reached the West Coast later than the East, and King County's deaths peaked in 2023, after most East Coast cities had peaked. The drug supply and when it changed matter alongside poverty.",
        ],
      },
      {
        heading: "What this doesn't show",
        paragraphs: [
          "These are correlations across five to ten places each, not proof that poverty causes addiction. The relationship runs both ways: addiction also pushes people into poverty, unemployment and homelessness. U.S. survey data is only available by state, so the city figures rely on deaths rather than on how many people are living with addiction. 2025 U.S. overdose counts are still provisional; up to 40% of Bronx records were pending.",
        ],
        note: "U.S. overdose rates are Mandate's calculation: CDC provisional county deaths divided by Census Vintage 2025 population. NYC's own health department publishes overdose rates by neighbourhood poverty level, which would sharpen the within-city picture, but its site refused automated access for this pull.",
      },
    ],
    sources: [
      { label: "SAMHSA, 2023–2024 National Survey on Drug Use and Health state prevalence estimates (Tables 24, 25, 27, 29)", url: "https://www.samhsa.gov/data/report/2023-2024-nsduh-state-prevalence-estimates" },
      { label: "CDC NCHS, provisional county-level drug overdose death counts (data as of October 4, 2026)", url: "https://data.cdc.gov/resource/gb4e-yj24.json" },
      { label: "CDC NCHS, provisional national drug overdose death counts", url: "https://data.cdc.gov/resource/xkb8-kh2a.json" },
      { label: "U.S. Census Bureau, Small Area Income and Poverty Estimates 2024", url: "https://www2.census.gov/programs-surveys/saipe/datasets/2024/2024-state-and-county/est24all.txt" },
      { label: "U.S. Census Bureau, Vintage 2025 county population estimates", url: "https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/counties/totals/co-est2025-alldata.csv" },
      { label: "ONS, Deaths related to drug poisoning by local authority, England and Wales, 1993–2025 (November 4, 2026)", url: "https://www.ons.gov.uk/peoplepopulationandcommunity/birthsdeathsandmarriages/deaths/datasets/drugmisusedeathsbylocalauthority" },
      { label: "MHCLG, English Indices of Deprivation 2025", url: "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025" },
      { label: "Health Research Board & Pobal, \"An exploration of the relationship between addiction treatment and geographic deprivation\" (May 2026)", url: "https://www.drugsandalcohol.ie/45587/" },
      { label: "Health Research Board, National Drug Treatment Reporting System 2025", url: "https://www.drugsandalcohol.ie/45416/" },
      { label: "Mandate research brief with charts and CSVs (six-city social brief, November 2026)", url: "https://github.com/devenandfreinds-sketch/mandate/blob/main/imports/research/six-city-social-brief-2026-11/README.md" },
    ],
  },
  {
    slug: "losing-public-aid-six-cities",
    title: "SNAP Rolls Down 13% in a Year: Who's Losing Public Aid Across Six Cities",
    dek: "Food aid has fallen fastest in Illinois, down 21.6% in a year. Medicaid enrollment is down 16–23% since 2023 in all four U.S. states Mandate tracks. In Britain about 5% of claimants with work conditions are under a sanction, and in Dublin homelessness is at a record.",
    publishedDate: "2026-11-10",
    category: "Social Safety Net",
    sections: [
      {
        heading: "The question",
        paragraphs: [
          "What share of people in New York, Chicago, Seattle, Washington DC, Greater Manchester and Dublin have been cut off from public services and aid?",
        ],
      },
      {
        heading: "What can be measured",
        paragraphs: [
          "No government publishes a \"percent cut off\" figure for any of these cities. The closest official measures are program caseloads (SNAP food aid and Medicaid in the U.S.), benefit sanctions in the UK, and homelessness in Dublin. U.S. caseloads are reported by state, not city.",
        ],
        note: "Not everyone who leaves a program was cut off. Some leave because their income rose or they found other coverage, and administrative data doesn't record the reason.",
      },
      {
        heading: "What the data shows: U.S.",
        paragraphs: [
          "SNAP fell 13.3% nationally between July 2025 and July 2026, from 41.6 million people to 36.1 million: 5.5 million fewer. Illinois fell furthest, down 21.6% (407,079 people, or 3.2% of all Illinoisans). New York fell 9.3% (272,988 people), Washington State 7.6% (68,549) and DC 6.9% (9,665). The Illinois decline is steady month after month from late 2025, not a one-month reporting blip.",
          "Medicaid and CHIP enrollment is down sharply from its pandemic-era peak in March 2023: Illinois 23.4% (894,219 fewer people), DC 20.0% (59,229), Washington State 18.9% (414,366) and New York 15.8% (1,189,681). In DC that's equivalent to 8.5% of all residents.",
        ],
      },
      {
        heading: "Why the U.S. numbers are moving",
        paragraphs: [
          "For SNAP, the 2025 budget reconciliation law (H.R. 1, signed July 4, 2025) extended work requirements to adults aged 55 to 64 and to parents of children 14 and over, removed exemptions for veterans, homeless people and former foster youth, and shifted more of the program's costs to states. States began applying the new rules from late 2025. In November 2025 the federal shutdown also disrupted benefits while courts fought over whether USDA had to pay them. SNAP participation has fallen every month since. USDA itself says participation fluctuates and that no single policy explains the drop.",
          "For Medicaid, most of the fall since 2023 is the 'unwinding' of pandemic-era continuous coverage. By a KFF count of CMS data, 25.2 million people were disenrolled nationally, and 69% of them lost coverage for procedural reasons, such as missing paperwork, rather than being found ineligible. Enrollment kept falling, about 7% nationally from July 2025 to July 2026. H.R. 1's Medicaid work requirements begin by January 1, 2027, though states can seek extensions.",
        ],
      },
      {
        heading: "What the data shows: Greater Manchester and Dublin",
        paragraphs: [
          "In Britain, the nearest equivalent to being cut off is a Universal Credit sanction, which reduces or stops a claimant's payment for a set period. In May 2026, 5.2% of claimants subject to work conditions were under a sanction, 106,589 people across Great Britain. The rate has stayed between about 5% and 7% since 2023. The Greater Manchester Jobcentre district issued roughly 3,400 new sanction decisions in April 2026, up from about 2,300 in April 2023.",
          "In Dublin, 12,429 people were living in homeless emergency accommodation in August 2026, including 4,158 children. That's 0.85% of the county's residents, up 5.5% in a year. Nationally, 12.6% of people in Ireland are at risk of poverty and 4.7% live in consistent poverty; the region that includes Dublin is lower, at 9.6% and 3.4%.",
        ],
        note: "The Greater Manchester sanction counts are a Mandate estimate. DWP publishes the district figure only for claimants who declared an ethnicity (74.9% in April 2026), and we scaled that count up by the response rate. DWP doesn't publish a borough-level sanction rate in its tables; that requires Stat-Xplore.",
      },
      {
        heading: "What this doesn't show",
        paragraphs: [
          "State figures blur the cities inside them: NYC is about 43% of New York State, Cook County about 41% of Illinois and King County about 29% of Washington State. July 2026 SNAP and Medicaid figures are preliminary and will be revised. And the measures aren't the same across countries: a SNAP exit, a Medicaid disenrollment, a UK sanction and a night in Dublin emergency accommodation are different experiences, so this is a side-by-side, not a league table.",
        ],
      },
    ],
    sources: [
      { label: "USDA Food and Nutrition Service, SNAP data tables and National Data Bank state monthly files (data as of October 9, 2026)", url: "https://www.fns.usda.gov/pd/supplemental-nutrition-assistance-program-snap" },
      { label: "CMS, data.medicaid.gov, State Medicaid and CHIP Applications, Eligibility Determinations, and Enrollment Data", url: "https://data.medicaid.gov/" },
      { label: "KFF, Medicaid Enrollment and Unwinding Tracker (compiling CMS data)", url: "https://www.kff.org/medicaid/medicaid-enrollment-and-unwinding-tracker/" },
      { label: "U.S. Census Bureau, Vintage 2025 state and county population estimates", url: "https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/counties/totals/co-est2025-alldata.csv" },
      { label: "DWP, Benefit sanctions statistics to May 2026 (Tables 2.1 and 7.4.3)", url: "https://www.gov.uk/government/statistics/benefit-sanctions-statistics-to-may-2026" },
      { label: "Dublin Region Homeless Executive, monthly report on homelessness, August 2026", url: "https://www.homelessdublin.ie/info/figures" },
      { label: "CSO, Survey on Income and Living Conditions (SILC) 2025", url: "https://www.cso.ie/en/releasesandpublications/ep/p-silc/surveyonincomeandlivingconditionssilc2025/" },
      { label: "Mandate research brief with charts and CSVs (six-city social brief, November 2026)", url: "https://github.com/devenandfreinds-sketch/mandate/blob/main/imports/research/six-city-social-brief-2026-11/README.md" },
    ],
  },
  {
    slug: "who-pays-what-tax-by-income",
    title: "Who Pays What: The Top 1% Pay 7× the Bottom Half's Income Tax Rate, Until the Very Top",
    dek: "In the U.S., federal income tax rises with income until the top 0.1%, then falls. In the UK, the poorest fifth pay as large a share of their income in tax as the richest. In Ireland, the top 10% pay almost two-thirds of income tax and USC.",
    publishedDate: "2026-11-10",
    category: "Fiscal Health",
    sections: [
      {
        heading: "The question",
        paragraphs: [
          "What share of their income do the wealthiest pay in tax, compared with middle- and lower-income people, in the three countries Mandate's six cities sit in?",
        ],
      },
      {
        heading: "United States: federal income tax",
        paragraphs: [
          "IRS data for tax year 2023 shows the bottom half of taxpayers paid 3.7% of their income in federal income tax. The 50th to 90th percentile, roughly the middle class, paid 9.2%; the 90th to 99th percentile 16.8%; and the top 1% 26.3%, about seven times the bottom half's rate.",
          "The top 1% earned 20.6% of all income and paid 38.4% of all federal income tax. The bottom half earned 12.3% of income and paid 3.3% of the tax.",
          "The rate stops rising at the very top. The top 0.1% paid 26.7%, the top 0.01% 25.2%, and the top 0.001% (about 1,500 returns) 23.6%. More of their income is long-term capital gains and dividends, which are taxed at no more than 20% plus a 3.8% investment tax, against a 37% top rate on wages.",
        ],
        note: "The IRS rates for the bottom 50%, 50th–90th and 90th–99th percentiles are Mandate calculations from the IRS's published income and tax shares.",
      },
      {
        heading: "The complication",
        paragraphs: [
          "Income tax isn't the whole picture. Wage earners also pay 7.65% in Social Security and Medicare tax, and the Social Security part stops at an annual wage cap. Counting all federal taxes, CBO puts the 2022 average rate at 1.4% for the lowest fifth, 23.2% for the highest fifth and 31.5% for the top 1%.",
          "The IRS measure also misses income that is never taxed. Gains on assets that are never sold don't count as income. A 2021 White House study that counted them found the 400 wealthiest families paid an average federal income tax rate of 8.2% over 2010–2018, with a range of 6% to 12%.",
        ],
        note: "The CBO figures are as reported by the Tax Foundation, because cbo.gov blocks automated access. Verify them against CBO's \"The Distribution of Household Income, 2022\" before citing.",
      },
      {
        heading: "United Kingdom and Ireland",
        paragraphs: [
          "Counting all taxes, the UK's burden is U-shaped. In 2023/24 the poorest fifth of households paid 36.7% of their gross income in tax, the middle fifth 30.2% and the richest fifth 36.2%. The poorest pay mostly through VAT, duties and council tax (21.0% of income in indirect taxes alone); the richest pay mostly through income tax.",
          "In Ireland, the top 1% of taxpayer units, with income over €290,000, were projected to pay about 24% of all income tax and Universal Social Charge in 2024. The top 10%, earning over €102,000, were projected to pay about 63%.",
        ],
      },
      {
        heading: "What this doesn't show",
        paragraphs: [
          "None of these figures include state and local taxes in the U.S., which take a bigger share of income from lower earners; no federal agency publishes that for these four cities. The three countries measure different things (income tax rates, all taxes, shares of tax paid), so they shouldn't be ranked against each other. And Ireland's effective tax rates by income band are only published in interactive tools that couldn't be extracted.",
        ],
      },
    ],
    sources: [
      { label: "IRS Statistics of Income, Table 4.1: shares of AGI and income tax, and average tax rates by percentile, tax years 2001–2023", url: "https://www.irs.gov/statistics/soi-tax-stats-individual-statistical-tables-by-tax-rate-and-income-percentile" },
      { label: "White House CEA & OMB, \"What Is the Average Federal Individual Income Tax Rate on the Wealthiest Americans?\" (2021, archived)", url: "https://bidenwhitehouse.archives.gov/cea/written-materials/2021/09/23/what-is-the-average-federal-individual-income-tax-rate-on-the-wealthiest-americans/" },
      { label: "CBO, The Distribution of Household Income, 2022 (January 2026)", url: "https://www.cbo.gov/publication/61911" },
      { label: "Tax Foundation, summary of CBO's 2022 household income report", url: "https://taxfoundation.org/data/all/federal/us-income-growth-progressive-tax-code-2022/" },
      { label: "ONS, Effects of taxes and benefits on household income, FYE 2024, reference tables (Table 8)", url: "https://www.ons.gov.uk/peoplepopulationandcommunity/personalandhouseholdfinances/incomeandwealth/datasets/theeffectsoftaxesandbenefitsonhouseholdincomefinancialyearending2014" },
      { label: "Houses of the Oireachtas, parliamentary question on income tax and USC paid by top earners (May 21, 2024)", url: "https://www.oireachtas.ie/en/debates/question/2024-05-21/109/" },
      { label: "Irish Times, \"Top 10% of Irish earners now paying almost two-thirds of income tax and USC\" (Tax Strategy Group figures)", url: "https://irishtimes.com/business/2024/07/23/top-10-of-irish-earners-now-paying-almost-two-thirds-of-income-tax-and-usc" },
      { label: "Mandate research brief with charts and CSVs (taxes, jobs and the 2025 budget law, November 2026)", url: "https://github.com/devenandfreinds-sketch/mandate/blob/main/imports/research/tax-jobs-obbba-brief-2026-11/README.md" },
    ],
  },
  {
    slug: "twenty-years-of-jobs-six-cities",
    title: "Twenty Years of Jobs in Six Cities: Two Shocks, a Long Recovery, and Trouble in DC",
    dek: "Every city went through the 2009–12 crash and the 2020 pandemic, and every one recovered. Since 2005, Dublin and Seattle have added work fastest and Chicago slowest. Now DC is the only one of the four U.S. metros losing jobs.",
    publishedDate: "2026-11-10",
    category: "Workforce",
    sections: [
      {
        heading: "The question",
        paragraphs: [
          "What have employment and unemployment looked like in New York, Chicago, Seattle, Washington DC, Greater Manchester and Dublin over the past 20 years?",
        ],
      },
      {
        heading: "What the data shows",
        paragraphs: [
          "Unemployment peaked in the financial-crisis years in most cities: 10.5% in metro Chicago (2010), 10.3% in metro Seattle (2010), 10.1% in DC (2011), 9.8% in Greater Manchester (2009) and 12.8% in the Dublin region (2011). Ireland was hit hardest: national unemployment more than tripled, from 4.4% in 2005 to 15.4% in 2012. New York's peak came in the pandemic instead, at 10.4% in 2020.",
          "By 2025 all six were back to between 4.6% and 6.3% unemployment. All four U.S. cities are above their 2019 lows, though. Seattle has risen from 3.0% in 2019 to 5.1% in the first nine months of 2026.",
          "Job growth since 2005 has been uneven. Metro Seattle's payroll jobs grew 29%, New York's 19% and Washington DC's 16%; Chicago's grew 8%. The number of Dublin residents in work grew 45%.",
        ],
        note: "Dublin's figure counts residents in work, not payroll jobs, and spans a CSO series change in 2012, so it isn't strictly comparable with the U.S. metros.",
      },
      {
        heading: "The complication: DC and Greater Manchester",
        paragraphs: [
          "Washington DC is the outlier right now. In January–September 2026, metro DC had 2.5% fewer payroll jobs than in the same months of 2025, about 86,000 fewer. It is the only one of the four U.S. metros to shrink. Unemployment in the District itself rose from 4.7% in 2022 to 6.3% in 2025. That coincides with the 2025 reductions in the federal workforce, which is an unusually large employer in DC.",
          "Greater Manchester's problem is different. Its unemployment rate is now about the same as England's, but its employment rate for people aged 16–64 has been 3 to 5 points below England's every year since 2005: 72.3% against 75.8% in 2025. More working-age people there are outside the labour market altogether, rather than looking for work.",
        ],
      },
      {
        heading: "What this doesn't show",
        paragraphs: [
          "The three countries measure unemployment with different surveys, so each city should be compared with its own national line rather than with cities abroad. New York, Chicago and Seattle are metro-area figures, while DC unemployment covers the District itself. U.S. averages for 2025 leave out October, which BLS did not collect during the federal shutdown. And Ireland's standard 2020–21 rates understate pandemic joblessness, because many people on the Pandemic Unemployment Payment weren't counted as unemployed.",
        ],
      },
    ],
    sources: [
      { label: "BLS Local Area Unemployment Statistics and Current Employment Statistics, via FRED (St. Louis Fed): NEWY636URN, CHIC917URN, SEAT653URN, WASH911URN, DCUR, UNRATE and matching nonfarm jobs series", url: "https://fred.stlouisfed.org/" },
      { label: "ONS Annual Population Survey via Nomis (dataset NM_17_5): employment and unemployment rates, Greater Manchester and England", url: "https://www.nomisweb.co.uk/" },
      { label: "CSO Labour Force Survey, tables QNQ22 (to 2016) and QLF08 (2012 on), Dublin region and State", url: "https://data.cso.ie/" },
      { label: "Mandate research brief with charts and CSVs (taxes, jobs and the 2025 budget law, November 2026)", url: "https://github.com/devenandfreinds-sketch/mandate/blob/main/imports/research/tax-jobs-obbba-brief-2026-11/README.md" },
    ],
  },
  {
    slug: "what-the-2025-budget-law-did",
    title: "What the 2025 Budget Law Did to the Average American: Under 1% for the Middle, −3% at the Bottom",
    dek: "CBO estimates middle-income households gain $800 to $1,200 a year from the \"One Big Beautiful Bill Act\", mostly because the 2017 tax cuts didn't expire. The poorest 10% lose about $1,200 a year and the richest 10% gain $13,600. The biggest Medicaid changes haven't started yet.",
    publishedDate: "2026-11-10",
    category: "Fiscal Health",
    sections: [
      {
        heading: "The question",
        paragraphs: [
          "What has the 2025 reconciliation law (P.L. 119-21, the \"One Big Beautiful Bill Act\") actually done to the average American?",
        ],
      },
      {
        heading: "What it changed",
        paragraphs: [
          "On taxes, it made the 2017 tax law's income tax brackets (10% to 37%) permanent. It also raised the child tax credit to $2,200 per child and the standard deduction to $15,750 for single filers and $31,500 for joint filers in 2025.",
          "It added four temporary deductions that run from 2025 through 2028: up to $25,000 of tips, up to $12,500 of overtime pay ($25,000 for joint filers), an extra $6,000 for each person aged 65 or older, and up to $10,000 of interest on loans for U.S.-assembled cars. It also raised the cap on state and local tax deductions to $40,000 until 2030, and the estate tax exemption to $15 million per person.",
          "On the safety net, it extended SNAP work requirements to adults aged 18–64 and to parents of children 14 and over, and from fiscal 2027–28 shifts more SNAP costs to states. Medicaid expansion adults aged 19–64 will need 80 hours a month of work, study or service from December 31, 2026, and eligibility checks every six months from January 1, 2027.",
        ],
      },
      {
        heading: "What the data shows",
        paragraphs: [
          "CBO's distributional analysis puts the average change in household resources over 2026–2034 at −$1,200 a year (−3.1% of income) for the lowest 10%, +$800 to +$1,200 a year (under 1%) for the middle, and +$13,600 a year (+2.7%) for the highest 10%.",
          "CBO and JCT estimate the law adds $3.4 trillion to deficits over 2025–2034. It cuts federal Medicaid spending by $989.7 billion, $325.6 billion of it from the work requirement, and federal SNAP spending by $186.7 billion. CBO projects 10.0 million more people uninsured in 2034, and 2.4 million fewer people on SNAP in an average month from the work-requirement changes alone.",
          "Some effects are already visible. In the 2026 filing season, the first under the new law, the average tax refund was $3,276, up 11.5% from $2,939, and total refunds rose 18.1% to $325 billion.",
        ],
        note: "CBO's figures are quoted through the Congressional Research Service and named news reports, because cbo.gov blocks automated access. The middle-decile gain was reported only as a range. CBO's analysis excludes tariffs, the cost of servicing the added debt, and economic feedback.",
      },
      {
        heading: "What this means",
        paragraphs: [
          "For most middle-income households, the main effect is a tax increase that didn't happen: CBO measures against a baseline in which the 2017 tax cuts expired after 2025. The new deductions help the people who qualify, but they end after 2028.",
          "For the lowest-income households it is a net loss, driven by SNAP and Medicaid. Most of the Medicaid effect is still ahead, because the work requirement and six-month eligibility checks start at the turn of 2027.",
          "In dollars, the top 10% gain more than 10 times what middle households gain. As a share of income, the top 10% gain about as much as the bottom 10% lose.",
        ],
      },
      {
        heading: "What this doesn't show",
        paragraphs: [
          "Bigger refunds also reflect how much tax was withheld during the year, so not all of the rise is the new law. And not all of the fall in SNAP and Medicaid enrollment since mid-2025 is due to the law either; administrative data doesn't record why people leave. The full ten-decile CBO table is in a PDF that couldn't be downloaded, so only the bottom, middle and top groups are shown here.",
        ],
      },
    ],
    sources: [
      { label: "CRS R48611, Tax Provisions in P.L. 119-21, the FY2025 Reconciliation Law (July 29, 2025)", url: "https://www.everycrsreport.com/reports/R48611.html" },
      { label: "CRS R48633, Health Provisions in P.L. 119-21 (August 18, 2025), citing CBO", url: "https://www.everycrsreport.com/reports/R48633.html" },
      { label: "CRS R48552, SNAP and Related Nutrition Programs in P.L. 119-21 (August 15, 2025), citing CBO", url: "https://www.everycrsreport.com/reports/R48552.html" },
      { label: "CBO, Distributional Effects of Public Law 119-21 (August 11, 2025)", url: "https://www.cbo.gov/publication/61367" },
      { label: "Thomson Reuters Checkpoint, \"CBO Analyzes Distributional Effects of Budget Act\" (August 13, 2025)", url: "https://tax.thomsonreuters.com/news/cbo-analyzes-distributional-effects-of-budget-act/" },
      { label: "NM Political Report, CBO distributional figures (August 15, 2025)", url: "https://nmpoliticalreport.com/2025/08/15/report-shows-reconciliation-law-will-cost-poorest-americans-1200-annually-while-wealthy-gain-13600/" },
      { label: "IRS, Filing season statistics for week ending May 8, 2026", url: "https://www.irs.gov/newsroom/filing-season-statistics-for-week-ending-may-8-2026" },
      { label: "IRS, Working Families Tax Cuts: individuals and workers", url: "https://www.irs.gov/newsroom/working-families-tax-cuts-individuals-and-workers" },
      { label: "Mandate research brief with charts and CSVs (taxes, jobs and the 2025 budget law, November 2026)", url: "https://github.com/devenandfreinds-sketch/mandate/blob/main/imports/research/tax-jobs-obbba-brief-2026-11/README.md" },
    ],
  },
  {
    slug: "school-spending-vs-test-scores-six-cities",
    title: "More School Money Doesn't Predict Higher Test Scores in Big Cities. Poverty Does.",
    dek: "Across 26 large US school districts, per-pupil spending has almost no link to NAEP scores, while child poverty explains most of the gap. Washington State and Greater Manchester show the same pattern. New York and DC beat what their poverty predicts; Chicago lands right on it.",
    publishedDate: "2026-11-10",
    category: "Education",
    sections: [
      {
        heading: "The question",
        paragraphs: [
          "Do cities that spend more per pupil get better test scores? We checked Chicago, New York City, Washington DC, Seattle and Greater Manchester against their peers, using only government data. Dublin can't be checked: Ireland doesn't publish test results by area.",
        ],
      },
      {
        heading: "What the data shows",
        paragraphs: [
          "NAEP, the national test given the same way in every US city, is the only fair way to compare Chicago, New York and DC. Across the 26 big-city districts NAEP tested in 2024, per-pupil spending and average scores are essentially unrelated (r = -0.15). Child poverty is strongly related (r = -0.82): poorer districts score lower almost without exception.",
          "New York spends $35,796 per pupil (fiscal 2024), DC Public Schools $31,529 and Chicago $24,330. On NAEP, New York averages 5.0 points below the national public-school mean across 4th and 8th grade reading and math, DC 4.7 below and Chicago 8.5 below.",
          "Seattle isn't in NAEP's city sample, so we compared it with Washington's 31 other districts over 10,000 students on the state test. Same result: spending and scores are unrelated (r = -0.15), and the share of low-income students predicts scores almost perfectly (r = -0.94). Seattle spends $22,564 per pupil and 63% of its students meet the state standard.",
          "In Greater Manchester, the boroughs that get the most school funding per pupil have the lowest GCSE scores (r = -0.56 across the ten boroughs), because England's funding formula sends more money where there is more disadvantage. Trafford gets the least (about GBP 5,900 per pupil) and scores highest, helped by its selective grammar schools.",
        ],
      },
      {
        heading: "Controls",
        paragraphs: [
          "Because funding formulas give poorer districts more money, a raw comparison makes money look useless or even harmful. Holding poverty constant, extra spending shows a small positive association with scores in all three places (partial r = +0.19 across US cities, +0.07 in Washington, +0.11 in Greater Manchester), but none is statistically significant.",
          "Against a model using both spending and poverty, New York scores about 5 points better than expected and DC about 7 better. Chicago scores almost exactly as expected.",
        ],
        note: "These are district-level correlations. They can't show whether a given dollar raises scores, and they say nothing about how money is spent inside a district. Spending isn't adjusted for local wage costs, which are much higher in New York and Seattle.",
      },
      {
        heading: "Dublin",
        paragraphs: [
          "Ireland funds schools centrally at national per-pupil rates, with extra money for disadvantaged schools under DEIS, and publishes no test results by school or county. The Educational Research Centre's 2021 national assessment found pupils in the most disadvantaged urban schools still score about 30 points below other urban pupils, the same gap as in 2014.",
        ],
      },
    ],
    sources: [
      { label: "U.S. Census Bureau, Annual Survey of School System Finances, FY2024 (Table 18 and individual unit file)", url: "https://www.census.gov/data/tables/2024/econ/school-finances/secondary-education-finance.html" },
      { label: "NCES, The Nation's Report Card: NAEP 2024 Trial Urban District Assessment (Data Service)", url: "https://www.nationsreportcard.gov/" },
      { label: "U.S. Census Bureau, Small Area Income and Poverty Estimates, school districts 2024", url: "https://www.census.gov/programs-surveys/saipe.html" },
      { label: "Washington OSPI Report Card data (assessment, per-pupil expenditure, enrollment), data.wa.gov", url: "https://data.wa.gov/" },
      { label: "Department for Education, Key stage 4 performance 2024/25 (Explore Education Statistics)", url: "https://explore-education-statistics.service.gov.uk/find-statistics/key-stage-4-performance" },
      { label: "Department for Education, National funding formula tables for schools and high needs: 2025 to 2026", url: "https://www.gov.uk/government/publications/national-funding-formula-tables-for-schools-and-high-needs-2025-to-2026" },
      { label: "Educational Research Centre, NAMER 2021 DEIS report", url: "https://www.erc.ie/wp-content/uploads/2025/12/B23572-NAMER-DEIS-report-Online.pdf" },
      { label: "Mandate research files (CSV and method notes)", url: "https://github.com/devenandfreinds-sketch/mandate/blob/main/imports/research/six-city-civic-brief-2026-11.md" },
    ],
  },
  {
    slug: "flock-cameras-six-cities",
    title: "Of Six Cities, Only DC's Police Run Flock Cameras",
    dek: "Washington DC's police contract for 67 Flock licence-plate cameras, about 10 per 100,000 residents. New York and Seattle say they use none. Chicago has no contract, but its police pay for access to privately owned Flock cameras and searched them more than 23,000 times in three months.",
    publishedDate: "2026-11-10",
    category: "Public Safety",
    sections: [
      {
        heading: "What the data shows",
        paragraphs: [
          "Flock Safety sells cameras that read licence plates and log where and when each car passed. Washington DC's Metropolitan Police Department signed a $336,000 one-year contract for 67 Flock cameras in December 2024 and extended it through 2026 for another $201,000. That is 9.7 cameras per 100,000 residents.",
          "New York City's police department, transport department and the MTA all say they have no Flock contract. Seattle's City Council says the same. Seattle police instead fitted their whole vehicle fleet with plate readers from another vendor, then switched them off in March 2026 to comply with a new Washington state law.",
          "Chicago has no Flock contract either, but that understates its use. The city pays a reseller for access to Flock's network of privately owned cameras, and audit logs obtained by FOX 32 show Chicago police ran more than 23,000 Flock searches from May to July 2026, without local rules governing that access.",
          "We found no record of Flock use by police in Greater Manchester or Dublin. UK police use a national plate-reader network run through the Home Office; Ireland's Garda use mainly vehicle-mounted readers.",
        ],
        note: "No government publishes Flock camera counts. DC's figure comes from news reporting of the MPD contract, and it excludes Flock cameras run by federal agencies on federal land in DC.",
      },
    ],
    sources: [
      { label: "Washington Sun / NOTUS, \"D.C. Won't Say How It's Using Its Flock Cameras\", 28 August 2026", url: "https://www.notus.org/metro/dc-flock-cameras" },
      { label: "FOX 32 Chicago, Chicago police Flock searches and audit logs, 7 October 2026", url: "https://www.fox32chicago.com/news/chicago-police-flock-searches-audit-logs" },
      { label: "Chicago Sun-Times, Flock licence-plate readers in Chicago suburbs, 27 August 2026", url: "https://chicago.suntimes.com/crime/2026/08/27/flock-license-plate-reader-alpr-chicago-suburb" },
      { label: "West Side Rag, \"An Upper West Side Flock Camera Map Misunderstanding\", 13 August 2026", url: "https://www.westsiderag.com/2026/08/13/an-upper-west-side-flock-camera-map-misunderstanding" },
      { label: "Seattle City Council, Public Safety Chair statement on SPD technology, 24 February 2026", url: "https://council.seattle.gov/2026/02/24/public-safety-chair-kettle-setting-the-record-straight-on-misconceptions-about-technology-used-by-seattle-police-department-for-crime-prevention/" },
      { label: "KUOW, Police pause licence plate readers under new Washington restrictions, 3 April 2026", url: "https://www.kuow.org/stories/police-pause-license-plate-readers-to-comply-with-new-wa-state-restrictions" },
      { label: "U.S. Census Bureau, city population estimates, Vintage 2025", url: "https://www.census.gov/data/tables/time-series/demo/popest/2020s-total-cities-and-towns.html" },
    ],
  },
  {
    slug: "over-assessed-homes-six-cities",
    title: "New York Over-Values Its Cheapest Homes. Chicago, Seattle and DC Pass the Fairness Test.",
    dek: "Comparing assessed values with actual sale prices, New York's cheapest one-to-three-family homes are valued at 130% of what they sold for and its most expensive at 88%, failing the assessors' own fairness standard. Chicago, Seattle and DC pass for homes, though DC fails for commercial property.",
    publishedDate: "2026-11-10",
    category: "Government Capacity",
    sections: [
      {
        heading: "How over-assessment is measured",
        paragraphs: [
          "Assessors check their own work with a ratio study: divide each home's assessed value by the price it actually sold for. The International Association of Assessing Officers (IAAO) sets a fairness test called the price-related differential (PRD). A PRD between 0.98 and 1.03 passes. Above 1.03 means cheaper homes are assessed at a higher share of their value than expensive ones, so their owners pay more than their share.",
        ],
      },
      {
        heading: "What the data shows",
        paragraphs: [
          "New York City fails. For one-to-three-family homes, the Department of Finance's fiscal 2027 market values have a PRD of 1.045. In the cheapest tenth of 2025 sales, values were 130% of sale prices; in the most expensive tenth, 88%. Taxable value, after New York's assessment caps, was 5.2% of sale price for the cheapest homes and 2.2% for the most expensive.",
          "Chicago passes overall (PRD 1.009) after its 2024 reassessment, but the cheapest tenth of homes, those selling under $137,000, were assessed at 109% of sale price against about 93% for mid-priced homes. Appeals then cut values on 26% of homes and 45% of commercial properties, removing 23% of commercial assessed value.",
          "Seattle passes (PRD 1.012), with only a mild tilt: 96% of sale price for the cheapest homes, 88% for the most expensive. DC's own study shows homes passing (PRD 1.00) but commercial property failing (PRD 1.05), which favours the most valuable buildings.",
          "Appeals rarely fix the problem for homeowners. New York's Tax Commission accepted reductions on 12% of 2025 applications, but only 3% of the few homeowner (Class 1) applications. In DC, 6% of residential appeals to the appeals commission won a reduction in tax year 2024.",
        ],
        note: "Chicago, New York and Seattle figures are Mandate's own ratio studies from assessor open data, following IAAO methods; DC's are the Office of Tax and Revenue's published figures. The cheapest sales can include distressed sales that slip through filters and inflate low-end ratios.",
      },
      {
        heading: "Greater Manchester and Dublin",
        paragraphs: [
          "England's council tax uses bands fixed by each home's value in April 1991, so there is no current assessment to test. Of 2,940 band challenges the Valuation Office Agency resolved for Greater Manchester in 2025-26, 380 (13%) lowered a band.",
          "Ireland's Local Property Tax is self-assessed. For 2021, Revenue reports 13% of owners nationally chose a higher band than its guidance, 22% a lower one and 65% the same. It publishes no Dublin-only figures.",
        ],
      },
    ],
    sources: [
      { label: "Cook County Assessor's Office, open data: Assessed Values and Parcel Sales", url: "https://datacatalog.cookcountyil.gov/" },
      { label: "NYC Department of Finance, Property Valuation and Assessment Data (NYC Open Data)", url: "https://data.cityofnewyork.us/City-Government/Property-Valuation-and-Assessment-Data-Tax-Classes/8y4t-faws" },
      { label: "NYC Tax Commission, 2025 Annual Report", url: "https://www.nyc.gov/site/taxcommission/reports/annual-report.page" },
      { label: "King County Department of Assessments, data downloads", url: "https://info.kingcounty.gov/assessor/DataDownload/default.aspx" },
      { label: "DC Office of Tax and Revenue, FY2025 Assessment Ratio Report", url: "https://otr.cfo.dc.gov/page/assessment-materials-and-reports" },
      { label: "DC Real Property Tax Appeals Commission, Tax Year 2024 Annual Report", url: "https://rptac.dc.gov/publications" },
      { label: "Valuation Office Agency, Council Tax: challenges and changes, March 2026", url: "https://www.gov.uk/government/statistics/council-tax-challenges-and-changes-in-england-and-wales-march-2026" },
      { label: "Revenue, Local Property Tax Valuation for 2026 to 2030: Technical Paper", url: "https://www.revenue.ie/en/corporate/documents/research/property-valuation-technical-paper-2026.pdf" },
    ],
  },
];

export function getFindingBySlug(slug: string): Finding | undefined {
  return findings.find((f) => f.slug === slug);
}
