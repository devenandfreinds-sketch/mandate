# Reform UK Pilot Study — Methodology Generalization Stress Test

**Purpose of this document.** Mandate's methodology (the source hierarchy, the 6-level data-quality
vocabulary, the 0-5 Institutional Pipeline Index) was built on Chicago and tested for international
generalization on Greater Manchester — both left-of-center governing environments. This document records
a deliberate stress test in the opposite political direction: pointing the same methodology at a Reform
UK-governed local authority in England, to find out whether the architecture, the metric definitions, and
the evidence standards remain valid when applied to a fundamentally different governing movement. The
goal is not to evaluate whether Reform UK governs well or badly — it is to evaluate whether *Mandate* can
measure it honestly, using the same rules it uses everywhere else.

This is research-only. No schema changes, no frontend work, no production deployment, no synthetic data,
no fabricated pipeline history. Nothing in this document has been imported into the database.

**Update, 2026-08-14:** the Phase 6 recommendation below (Durham County Council) has since been
implemented — see `docs/DURHAM_CASE_STUDY.md` for what was actually added (jurisdiction, governance
model, a first batch of real metrics) and, importantly, why no Institutional Pipeline assessment has
been created yet even for the three pipeline events this document identified. The research below remains
the reasoning of record for the jurisdiction choice; it is not otherwise updated.

---

## Phase 1 — Governance Audit: Is Clacton-on-Sea the right unit of analysis?

**No.** This was the single most important finding of the whole pass, and it changes the scope of
everything downstream.

### What Clacton-on-Sea actually is, governmentally

Clacton-on-Sea is a town, not a local authority — it has no parish/town council of its own (one of a
handful of unparished areas in England; a 2025 Community Governance Review found 74% local support for
creating one, but none exists yet as of mid-2026). It sits under England's ordinary two-tier system:
**Tendring District Council** (lower tier: planning applications, waste collection, housing allocations,
licensing, council tax billing) and **Essex County Council** (upper tier: education, adult/children's
social care, highways, libraries; fire and rescue sits with a separate directly-elected Police, Fire and
Crime Commissioner, not the county). Nigel Farage is the constituency's Member of Parliament (since July
2024) — a national legislative role with **no local executive authority whatsoever**. Farage's seat is
frequently shorthand for "Reform's strongest local foothold," and that framing is doing a lot of load-bearing
work that doesn't survive contact with how English local government actually splits power.

### Tendring District Council: Reform does not control it

Tendring is elected in full every four years (not by thirds); the last full election was **May 2023**,
before Reform UK existed as a serious electoral force in England, and Reform won **zero** seats that year.
Since 2023 the council has been run by a coalition of Independents, Labour, and Liberal Democrats (Leader:
Cllr Mark Stephenson, Independent), following 14 years of Conservative control. Reform's presence today —
roughly 7-8 of 48 seats as of early 2026 — comes entirely from post-election defections and by-election
wins (two by-election gains in 2025, plus four Tendring Residents Alliance councillors, including Peter
Harris, defecting to Reform). Reform is the largest single **opposition** group. It does not run the
council, sit in the cabinet, or set the budget. A "Clacton pilot" built on Tendring District Council would
not actually be measuring Reform UK governance — it would be measuring an Independent-Labour-Lib Dem
coalition's governance, with Reform as a vocal minority.

### Essex County Council: this is where Reform actually governs — but it isn't "Clacton"

Essex CC's elections were delayed a year (from the normal May 2025 cycle to **7 May 2026**, pending
national local-government-reorganisation planning), and when they were finally held, **Reform UK won an
outright majority** — roughly 52 of 78 seats, ending unbroken Conservative control since 2001. The Leader
of Essex CC since 12 May 2026 is **Peter Harris (Reform)** — the same Peter Harris who sits on Tendring's
council as a defected Reform member, which is a real, verifiable link between the two tiers, but not the
same thing as Reform controlling Tendring.

Essex CC is where the substantive local-government powers actually sit (education, social care, highways)
— but Essex CC governs the whole of Essex, a county of roughly 1.5 million people across 12 district
areas, not Clacton specifically. Treating "Essex CC" as a stand-in for "the Clacton pilot" would be its
own category error in the other direction: it would attribute county-wide governance outcomes to a single
seaside town 25 miles from county hall in Chelmsford.

### A further complication: both tiers have an expiration date

On 25 March 2026, the government confirmed a five-unitary-authority restructuring for Greater Essex,
abolishing all 15 existing district/borough/county councils. Tendring will be merged with Colchester and
Braintree into a new unitary authority (working title "North East Essex Council"); legislation is expected
autumn 2026, shadow elections May 2027, and the new authorities go fully live by April 2028. **Tendring
District Council, as an institution, will not exist past that point.** Any case study built on it today
has an 18-24 month shelf life before its unit of analysis is legally dissolved — a poor foundation for a
platform whose value proposition is longitudinal institutional tracking.

### Conclusion: Clacton-on-Sea is not an appropriate unit of analysis

Not because Reform lacks a real governing foothold nearby (it does, at Essex CC), but because "Clacton" as
commonly invoked conflates three different things — a parliamentary seat with no executive power, a
district council Reform doesn't control, and a county council Reform does control but which isn't Clacton
— and because the one body that would need to be measured (Tendring DC) is scheduled for abolition within
the likely life of a pilot case study.

### What the national survey found instead

A parallel survey of every English local authority Reform UK actually controls found ten councils won
outright in the May 2025 elections, plus two new directly-elected Combined Authority mayoralties (Greater
Lincolnshire: Andrea Jenkyns; Hull and East Yorkshire: Luke Campbell). Authority type turned out to be the
decisive variable:

| Council | Type | Reform control since | Fit for a clean case study |
|---|---|---|---|
| **Durham County Council** | Unitary (single-tier, full powers) | May 2025 | **Best** — full service scope in one body, over a year in office by mid-2026, strong public data (active budget consultation portal, regional press) |
| Nottinghamshire County Council | County (two-tier — no planning/housing/waste-collection) | May 2025 | Good runner-up; well-documented DEI-cuts/DOGE-style record, but narrower functional scope |
| Kent County Council | County (two-tier) | May 2025 | Large, well-covered, but a genuinely chaotic budget story ("fantasy economics," savings claims later admitted to have failed) that would need very careful, skeptical sourcing |
| City of Doncaster Council | Metropolitan borough (unitary) | May 2025 | **Avoid** — Reform won the council chamber, but the directly-elected City Mayor (Labour's Ros Jones, re-elected the same day) holds ~95% of executive power; Reform's actual governing authority is ambiguous |
| Essex County Council | County (two-tier) | May 2026 | Real Reform control, but county-wide, not Clacton-specific, and only ~2 months into office as of this research pass — too early for institutional evidence beyond promises |
| Greater Lincolnshire / Hull & East Yorkshire mayoralties | Combined-authority mayor (narrow devolved remit) | May 2025 | Structurally closer to Greater Manchester's model (transport/skills/planning-investment layered over existing councils) than to a full municipal government — a good future comparison for "does the mayoral model transfer," not for "does Reform's core governing style transfer" |

**Decision: this pilot proceeds with Durham County Council**, not Clacton-on-Sea. Durham is a true
single-tier unitary authority — the English structure closest in kind to how Mandate already profiles a
US city (one body, full service responsibility) — under continuous, uncontested Reform control since May
2025, with over a year of governing record by the time of this research pass (mid-2026) and genuinely
strong public data availability. This satisfies the brief's own instruction: identify whether another
Reform-controlled council provides a better methodological comparison, and explain why, before making any
changes. No changes have been made to the database; this is the recommendation carried into Phases 2-6
below.

---

## Phase 2 — Policy Mapping: does Reform's Durham agenda fit Mandate's 7 categories?

Durham CC's own **Council Plan 2025-2030** organizes its priorities into five ambitions ("Reforming the
council," "Supercharging our economy," "Building better communities," "Caring for our people," "A
practical environmental stewardship") — a framework that only loosely overlaps with Mandate's seven
categories. Mapping each:

| Category | Fit | Why |
|---|---|---|
| **Affordable Housing** | Partially fits | Durham CC transferred all ~19,000 council homes to an ALMO/housing associations in 2015 and holds only a strategic/enabling role (the County Durham Housing Strategy, adopted Jan 2025). The real political energy here isn't housing production — it's **resisting Home Office asylum-seeker accommodation** (Durham pressured contractor Mears to pause 100-150 new bedspaces). That fight doesn't sit naturally inside "Affordable Housing" at all. |
| **Transit** | Partially fits | Highways/roads genuinely sit with Durham CC and are a stated priority (129,838 pothole repairs since 2022, an AI-assisted preventative programme). But bus routes, fares, and franchising are devolved to the **North East Combined Authority** under a directly-elected Labour Mayor (Kim McGuinness) — a different governing body entirely. Reform's own budget actually *cut* bus subsidies. The category conflates two governance tiers controlled by different parties. |
| **Workforce** | Fits well | Clean fit: an Inclusive Economic Strategy, DurhamWorks/DurhamEnable/Employability Durham/DurhamLearn programmes, and a new Apprenticeship Strategy 2025-2028 (adopted Nov 2025; 951 apprentices recruited since 2019). |
| **Public Safety** | Does not fit (structural) | Policing in County Durham is run by a **separately elected Police and Crime Commissioner** (Joy Allen, Labour) — Durham CC holds no policing power at all. Its only role is as a statutory partner in the Safe Durham Partnership (community safety, trading standards). Reform even renamed a cabinet portfolio to add "Police Relations" despite holding no policing authority. This is the cleanest confirmation that Mandate's taxonomy assumes a US-style municipal government where the city runs its own police — that assumption breaks under English two-tier policing governance, and this is a structural fact about English local government, not a political bias. |
| **Innovation** | Partially fits | Real activity exists (Durham Innovation District at Aykley Heads with Durham University; a government-designated AI Growth Zone at NetPark) but overlaps heavily with Workforce/economic development rather than standing as its own pillar. |
| **Fiscal Health** | Fits well | The richest, most unambiguous category. A £25.6m 2025/26 savings requirement, a formally declared "Care Emergency" (July 2025), a deficit that grew from £71m to £82m by November 2025, a Reform cabinet-approved £10m cuts package, and a claimed (but not independently verified) "£20m freed in first 100 days." |
| **Government Capacity** | Fits well, with a poor-fit residue | Genuine organizational-efficiency work exists (a single project-management framework, review of management layers, an Assets and Commercial Review). But Reform's *highest-profile* actions — removing Pride/Ukraine flags, rescinding the 2019 climate emergency declaration, renaming departments to strip "climate change"/"equality and inclusion" language, councillors publicly refusing DEI/climate training — are organizational in *form* but symbolic/ideological in *substance*. Filing these under "Government Capacity" (meant to capture administrative competence) undersells what they actually are. |

**Two gaps in the taxonomy, proposed as future additions (not implemented):**
1. **Immigration/asylum accommodation policy** — the single most politically energized fight Reform has picked at Durham, with no natural home in any existing category.
2. **Cultural/symbolic governance** (or "DEI/ESG rollback") — flag policy, training refusals, and climate-declaration rescissions are governance-of-*meaning* actions, distinct from governance-of-*machinery* efficiency reform, and conflating them under Government Capacity would misrepresent both.

---

## Phase 3 — Institutional Pipeline Research: conservative scoring

Scored against Mandate's existing 0-5 scale (0 Campaign Promise → 5 Measurable Outputs Demonstrating
Improvement), applying the same conservatism used for every other jurisdiction — no credit for
rhetoric or press announcements alone, and no credit to Reform for anything that predates their May 2025
takeover.

| Initiative | Evidence | Stage | Reasoning |
|---|---|---|---|
| Cabinet portfolio renaming | Real, implemented reorganization of cabinet briefs (e.g. "Stronger Communities and Belonging" → "Communities and Civic Resilience," stripping climate/equality language) | **3** | A genuine organizational change was carried out, not just proposed — but no evidence yet of measurably different operating outputs from the reorganization itself. |
| 2026/27 budget (parking charges, permit fees, school-crossing-patrol cuts, ~88 FTE reduction) | Cabinet consultation Nov 2025 → **formally approved by full Council 18 Feb 2026** | **2-3** | A legally enacted budget vote (Stage 2), with fee/charge changes self-executing on implementation (Stage 3 for those line items). Too recent for outcome evidence (no Stage 4/5). |
| Climate emergency declaration rescinded | Formal full-council vote, 62-76, 16 July 2025 | **2-3** | A genuine, documented legislative reversal — not just an announcement. |
| "DOGE" efficiency taskforce | Announced to audit contracts/consultants/reserves; as of Sept 2025 had "no established timeframe" and had not launched | **0-1** | Remains a press announcement with no terms of reference, staffing, or launch confirmed. |
| DEI-role eliminations | A Guardian/Left Foot Forward investigation found only 4.56 FTE diversity-related roles existed across **all 10** Reform-run English councils combined; no confirmed Durham-specific terminations found, only department renaming | **0-1** | Mostly symbolic relabeling, not verified headcount reductions — do not conflate the rename (Stage 3, see above) with an actual personnel action (unconfirmed). |
| Flag policy (Pride/Ukraine flags removed) | Ad-hoc executive action, ~May 2025; later reframed by the council (Aug 2025) as a "risk-based" public-safety justification, not a documented council-voted policy | **0-1** | No confirmed Durham-specific council vote establishing this as formal policy (unlike at least one other Reform council, Lancashire, which did formally vote its version through). |
| Procurement Strategy 2026-2030 | Adopted, but aligns with the national Procurement Act 2023 applicable to all English councils | **2** (not attributable to Reform specifically) | Statutory compliance work, not a distinctly Reform political initiative. |
| County Durham Plan review | Scoping consultation only, driven by the Levelling Up and Regeneration Act 2023's mandated review cycle | **1** | Nationally mandated timeline, not a Reform-initiated planning departure. |
| "Let's Talk County Durham" consultation platform | Genuinely operating (2,500+ registered users, 15,000+ completed surveys) | **N/A — not Reform's** | **Launched January 2025, before Reform took control in May 2025.** Crediting this to Reform's institutional pipeline would be a real misattribution error — flagged explicitly so it is never scored as a Reform achievement. |
| New standing committees/partnerships | None found | **0** | No evidence located. |

**Bottom line**: nothing found clears Stage 4 (operating with observable outputs demonstrating
improvement) — the highest defensible scores are Stage 2-3, and only for the budget vote, the cabinet
reorganization, and the climate-declaration rescission. Everything associated with Reform's most visible
national messaging (DOGE, DEI cuts, flags) is Stage 0-1: announced, not institutionalized, as of mid-2026.
This is not a criticism of Reform — an administration 14 months into its first term looking mostly like
promises-and-first-budget is exactly what conservative scoring should show for *any* party at this stage,
and matches how Mandate scored other newly-installed administrations elsewhere.

---

## Phase 4 — Metrics Audit: what could actually be populated

Full detail researched against Durham County Council's actual geography (ONS code E06000047, unitary
authority, pop. ~530,000). Summary across all 45 metrics:

- **~27 of 45 metrics have a solid, named UK official source** at County Durham geography — concentrated in Housing (DLUHC/ONS/VOA statistics), Public Safety except response times (Home Office recorded crime), Transit except cycling infrastructure (DfT bus/travel-to-work statistics), Workforce (ONS APS/ASHE/Nomis, DfE apprenticeship data), and core Fiscal Health (Durham CC's own budget documents, MHCLG finance statistics, the LGPS pension fund actuarial valuation).
- **~10 metrics fail due to genuine UK data-infrastructure gaps** — this is *not* a Durham-specific or size-specific problem; no UK jurisdiction of any size publishes these the way the metric expects: rental vacancy rate, patent creation below regional level, `ai_companies`, emergency response minutes by local authority, bike infrastructure mileage, procurement timeline days, `digital_government_adoption`, `major_infrastructure_delivery_rate`, graduate employment rate by residence, `public_transport_expansion_miles`.
- **`bond_rating_index` fails on a structural/fundamental basis**, not an infrastructure gap: most UK local authorities, Durham included, borrow through the Public Works Loan Board rather than public bond markets and are not credit-rated the way US municipalities are. This needs a genuinely different UK-appropriate substitute — PWLB borrowing levels / capital financing requirement, external auditor opinion, and Section 114-notice status (England's formal fiscal-distress signal) — not just a renamed data source.
- **A handful of metrics are technically publishable but will show near-zero, statistically thin signal purely because of Durham's size** — `vc_investment`, `commercial_rd_investment`, `life_sciences_employment` — since Durham has no meaningful VC/tech/life-sciences cluster. This is a distinct problem from the true infrastructure gaps above and should be labeled as such (data exists, but the underlying real-world activity is genuinely small) rather than conflated with "no source exists."

---

## Phase 5 — Methodology Stress Test: does Mandate remain politically neutral when measuring Reform UK?

**Overall answer: the *scoring discipline* held up well; the *taxonomy* (what counts as a policy area,
and the Institutional Pipeline's implicit growth orientation) shows real, specific bias — but it is a
bias toward a certain *style* of governing (expansive, program-building), not toward a specific *party*
or ideology.**

### Does the methodology bias toward progressive governance?

Yes, in one precise and demonstrable way: the seven policy areas were chosen around what is typically
salient to municipal governance discourse in general — housing production, transit expansion, a
business/innovation ecosystem, workforce development — and every one of those has a natural home in the
existing taxonomy. But the two things most central to Reform's *actual* political identity at Durham —
resisting asylum-seeker accommodation, and rolling back DEI/climate symbolism — have **no natural home**
anywhere in the seven categories (Phase 2). This is not a bias in how any individual metric is defined or
scored; it's a bias in what gets a dedicated category to begin with. A taxonomy built by asking "what does
a city government typically do" will systematically under-represent a governing movement whose signature
moves are cultural and restrictive rather than developmental.

A second, more structural version of the same bias sits inside the **Institutional Pipeline Index
itself**. The 0-5 scale is built around a growth narrative — promise → proposal → law → institution →
operation → measurable improvement — which naturally rewards administrations that *build* things. Reform's
actual governing record at Durham so far is substantially *subtractive*: cutting bus subsidies, cutting
grass-cutting and litter-picking, reducing school-crossing patrols, eliminating posts, rescinding a
declaration. A budget cut, fully enacted and legally binding, is arguably just as institutionally
significant as a budget expansion — but the pipeline's stage labels ("Institution or Program Created,"
"Operating with Observable Outputs") read awkwardly when applied to something that was un-created or
stopped rather than built. This pass scored cuts at Stage 2-3 by treating the enacting vote as the
"legislation" stage and the resulting operational change as "institutionalized" — a workable
interpretation, but one this pass had to improvise, because the stage *labels themselves* assume
institution-building is the thing worth tracking. This is worth fixing in a future architecture pass (see
Deferred Architecture, below) rather than papering over now.

### Does it unintentionally reward large cities?

Yes, demonstrably, via the Innovation category specifically (Phase 4). Metrics like `vc_investment`,
`commercial_rd_investment`, `patent_creation`, and `life_sciences_employment` require the kind of dense
tech/research economic base that only large metros have. Durham (pop. ~530,000, no major VC/tech cluster)
will show thin-to-nonexistent real signal on several of these — not because Durham is badly governed or
poorly documented, but because of economic geography it has no control over. If Mandate ever computes a
simple "percentage of metrics with real data" coverage score per jurisdiction without accounting for this,
smaller and less economically dense jurisdictions will systematically read as less "measured" or less
successful than large cities, independent of governance quality. Chicago and Greater Manchester (both
large, dense, tech-adjacent economies) never surfaced this problem clearly; Durham does.

### Does it unintentionally penalize small councils?

Same mechanism, different angle: beyond the size-driven Innovation gap, Durham's fragmented governance
(no direct control over policing, only partial control over transit, no direct control over its own
housing stock) means several categories that a large single-tier US city could populate cleanly are only
partially answerable for an English county — not because Durham the institution is under-performing, but
because power in England's two-tier and combined-authority system is *structurally* split across more
bodies than in a US mayor-council city. A small council in a fragmented system will read as having "less
coverage" for reasons that have nothing to do with the quality of its governance.

### Which assumptions break down?

- **"One government body holds one coherent set of powers"** — already strained by Greater Manchester's
  combined-authority model, this breaks down further and more starkly for Durham: policing sits with a
  separately-elected PCC (not a Mandate-modeled body at all), transit sits with a different party's
  directly-elected mayor, and housing stock sits with third-party housing associations. Durham CC's own
  powers are narrower relative to "everything a city does" than either Chicago's or Manchester's.
- **The US municipal bond-rating assumption** — collapses completely for the UK's PWLB-financed local
  government system, confirming what Greater Manchester's pass already suspected but didn't fully test
  (Manchester's pass didn't populate `bond_rating_index` either, but didn't investigate *why* as deeply).
- **The Institutional Pipeline's growth orientation** — as above, strains when applied to a governing style
  whose central acts are retrenchment rather than construction.

### Which assumptions remain surprisingly robust?

- **The 6-level row-level data-quality vocabulary** (government/academic/alternative/estimated/unavailable/placeholder)
  needed zero changes and worked cleanly — it is a claim about evidence, not about politics, and evidence
  quality is exactly as assessable for a Reform-run council as for a DSA-aligned one.
- **The requirement for conservative, source-tiered scoring caught real risks in both directions.** This
  pass could easily have over-credited Reform (scoring the pre-existing "Let's Talk County Durham"
  platform as a Reform achievement, or scoring the DOGE unit and flag policy at face value from press
  coverage) or under-credited them (dismissing the budget vote as "just cuts, not real policy"). The
  discipline of requiring an actual vote/document/date before advancing past Stage 1, and explicitly
  checking whether a mechanism predated the party in power, worked exactly as designed and caught both
  failure modes. This is the strongest evidence that Mandate's *research discipline*, as distinct from its
  *taxonomy*, is politically neutral.
- **Universal local-government functions transferred cleanly.** Fiscal Health and Workforce mapped
  onto real, well-documented UK statistics with no methodological strain at all — proving the platform's
  core concept (measure objective administrative and economic outcomes against a conservative evidence
  standard) generalizes fine across the political spectrum for the governance functions that genuinely are
  universal to any local government, regardless of who runs it.

### Deferred architecture (not implemented this pass)

- Two proposed new policy areas (immigration/asylum accommodation policy; cultural/symbolic governance) —
  worth real consideration if Mandate profiles more than one right-populist jurisdiction, but a single
  pilot case doesn't justify a taxonomy change yet.
- A UK-appropriate fiscal-stress substitute for `bond_rating_index` (PWLB borrowing / Section 114-notice
  status) — flagged here, not built, since it would need the same calibration-by-data discipline used for
  Chicago's series-quality thresholds, not a guess.
- Whether the Institutional Pipeline Index needs a parallel "Institutional Retrenchment" framing (or
  simply better stage labels that don't presuppose growth) is a real open question worth its own design
  pass if Mandate profiles more retrenchment-oriented administrations in the future.

---

## Phase 6 — Recommendation

**B) Reform UK should be represented by Durham County Council, not Clacton-on-Sea.**

Evidence for this recommendation, weighing all three options against the phases above:

- **(A) Clacton should become Mandate's next jurisdiction — rejected.** Phase 1 found this isn't just a
  suboptimal choice, it's factually wrong on the premise: Reform does not control Tendring District
  Council, the body that actually governs Clacton. A "Clacton pilot" would measure an Independent-
  Labour-Lib Dem coalition while labeling it a Reform case study, and the one body Reform *does* control
  nearby (Essex CC) governs a county, not a town, and only took office two months before this research
  pass — too early for any institutional evidence. Tendring is also scheduled for legal abolition by
  2027-2028, giving any case study built on it an expiration date within Mandate's normal research horizon.

- **(C) Postpone Reform municipal expansion until stronger governing evidence exists — rejected, but
  understandably tempting.** Phase 3 is honest that almost nothing at Durham clears Stage 3, and nothing
  clears Stage 4. But that is itself the finding, not a reason to avoid measuring it: Chicago and Greater
  Manchester were both profiled at various stages of institutional maturity, including early ones, and a
  conservative Stage 0-2 reading of a 14-month-old administration is exactly what the methodology should
  produce for *any* newly-installed government, regardless of party. Postponing would mean Mandate only
  ever profiles governments once they've already succeeded at institution-building — a selection bias of
  its own, and one that would make Mandate systematically better at documenting mature left-of-center
  institutions (its two existing cases) than nascent right-populist ones. Separately, Phase 4 shows the
  large majority of Mandate's *metrics* (workforce, fiscal, housing, crime statistics) don't depend on
  Reform's institutional maturity at all — real UK government data exists today for these regardless of
  how young Reform's own programs are, so there is genuine, immediately actionable research value in
  starting now.

- **(B) Durham County Council — recommended.** It is a real Reform-controlled, full-power unitary
  authority (the structural type closest to how Mandate already profiles a US city), under continuous,
  uncontested control since May 2025 — over a year of governing record by this research pass. The
  majority of Mandate's metric catalog (~27 of 45) has genuine, named UK government sources at Durham's
  geography. Enough real institutional activity exists to score conservatively rather than leave every
  category empty (the Feb 2026 budget vote and the climate-declaration rescission are both real, dated,
  documented legislative acts). And profiling it now, honestly, at Stage 0-3 across most initiatives,
  is a more methodologically honest outcome than waiting for scores to look more impressive.

**Caveat to carry forward if this recommendation is acted on**: expect most Institutional Pipeline scores
to land in the 0-3 range for the near future — this is a true reflection of a young administration, not a
methodology failure, and should be presented to users as such rather than smoothed over. The two proposed
taxonomy additions (asylum/immigration policy, cultural/symbolic governance) should be revisited if
Mandate profiles a second right-populist jurisdiction, at which point a real pattern (rather than an
n-of-1 pilot) would justify a taxonomy change.
