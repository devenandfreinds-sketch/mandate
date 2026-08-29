# Institutional Hardening & Research Expansion Sprint — 2026-08-20

**Brief.** Audit Mandate as if asked "could this organization operate for five years if the founder
stopped touching the code and researchers rotated every semester?" Fix what's small and safe. Document,
rather than unilaterally implement, anything that's a real architectural or methodological decision.
Don't rebuild what already works. This document is the final deliverable for that sprint.

## 1. Institutional Health Report

**Strengths.** The parts of Mandate that are enforced in code, not just convention, are genuinely
solid: a real self-review guard (verified this pass with a live test against real `User` rows — blocked
correctly, and a legitimate different-reviewer accept succeeded correctly); append-only
`PipelineAssessment` history that is never mutated in place; real per-person attribution via foreign
keys, not free-text guesses; methodology versioning that pins which rules applied when; a seed script
that is unusually well-guarded against destructive mistakes (scoped `isPlaceholder` deletes, upsert by
stable key, never overwriting live researcher progress); and deployment documentation that matches the
actual code exactly, with no drift found anywhere in the deploy path itself. The CSV import pipeline
fails safely and clearly on every malformed-input case tested this pass (11 for 11 — see §7).

**Weaknesses.** Continuity currently depends heavily on free text that gets overwritten rather than
appended: `ResearchTask.notes`/`sourceStatus`/`reviewNotes` and `ExternalContribution.reviewNotes` are
all single scalar fields with no history, and there is no schema concept at all for "a source was
considered and rejected, and here's why." The research queue can silently drift from the real state of
the database when work happens through the direct CSV import path instead of the ResearchTask workflow —
this isn't hypothetical; it happened three times this session and was only caught by an unrelated audit
pass. Access control is a single shared password with no per-person login, so the self-review guard
stops accidents, not deliberate misuse. There is no CI and no automated test gate before a deploy reaches
production. And one specific institutional-pipeline score (Chicago's `affordable-housing-institution`,
Stage 4) currently overclaims relative to its own cited evidence.

**Biggest risk.** Not any single bug — it's that Mandate's correctness currently depends on one person
(or one AI session) remembering to keep the research queue, the seed data, and the actual database in
sync by hand, every time. Nothing catches the drift automatically; it only gets caught when someone goes
looking, the way this sprint did.

**Biggest opportunity.** Almost everything found this pass was fixable with additive, low-risk changes —
an append-only notes table here, a state-machine guard there — following patterns Mandate already uses
elsewhere in its own schema. The institution doesn't need a redesign; it needs the same discipline it
already applies to `PipelineAssessment` history extended to two or three more places.

## 2. Five-Year Survivability Assessment (qualitative)

| Dimension | Assessment |
|---|---|
| Research continuity | **Good, with a real gap.** Task assignment/review/attribution survive rotation cleanly. Mid-task handoff (what was tried, what was rejected, why) does not — it lives in overwritable text. |
| Data integrity | **Strong.** dataQuality vocabulary, real-vs-placeholder separation, and the series-quality classifier's recency safeguard are all well-designed and (for the classifier) well-tested. |
| Methodology continuity | **Good.** Methodology versioning exists and is used. One live overclaim found (Chicago housing, see §1) shows the *scoring* logic itself has zero test coverage — the one place this matters most. |
| Researcher onboarding | **Mixed.** Docs are thorough once found, but discoverability was poor before this pass (no `START_HERE.md`, no path from the Research Map to the internal queue, a checklist doc that told researchers to do something the code forbids). Several of these were fixed this pass. |
| Researcher turnover | **Untested in practice.** `FOUNDER_HANDOFF_CHECKLIST.md` itself says so honestly — "a new researcher can complete a task independently" has never been exercised with a real non-founder. This remains the single most important unresolved item, and no amount of documentation fixes it — only running the actual pilot does. |
| External contributions | **Functional, one-way.** The submission flow is genuinely well-designed for a non-technical contributor. But there's no notification mechanism at all — a contributor's email is collected and never used, so they never learn the outcome. |
| Technical deployment | **Strong.** Deploy docs are accurate, seed/import are correctly distinguished, CORS fails safe. No CI and no rollback runbook beyond Railway's own UI are the two real gaps. |
| Documentation | **Improved this pass, still uneven.** Several real contradictions between docs and code were found and fixed (see §5). No single index existed before this pass (`docs/START_HERE.md` now does). |
| Source resilience | **Uneven by era.** Post-Greater-Manchester-era sources are consistently well-documented (country/language/methodology fields populated); the original Chicago-era batch mostly isn't. Not a correctness problem today, but a real gap for judging source currency later. |

## 3. Research Opportunity Map (as of this pass)

Chicago is the most thoroughly researched jurisdiction (7 rounds this project's history) and is
effectively saturated for easy/medium-difficulty metrics — what remains (e.g. `graduate_employment_rate`)
is explicitly flagged "hard" in its own queue entry. Greater Manchester's flagship pass closed its most
important pipeline gaps and pulled roughly half its GREEN-flagged metrics; the other half plus two
taxonomy decisions (a Regional Spatial Planning policy area; reframing "Progressive Revenue Institution"
for non-US jurisdictions) await methodology-lead sign-off. Durham (Reform UK) has real fiscal and
workforce data but deliberately no pipeline score yet, pending a decision about whether Mandate's
Institutional Pipeline tracks jurisdiction history or administration-attributable achievement. NYC,
Minneapolis, Seattle, and DC — collectively "the DSA cities" — went from ~5-7% real metric coverage to
meaningfully higher this sprint across fiscal health, crime, workforce, and housing production; the
remaining clusters (transit, innovation/business formation) are expected, on Chicago/GM precedent, to be
mostly structural dead ends (patent counts, VC investment, and similar metrics don't exist at
sub-metro-area granularity for most American cities) rather than a research backlog with real yield.

## 4. Architecture Debt, Ranked

1. **No append-only "notes"/"rejected source" record anywhere in the schema** — the single highest-value
   fix, following an already-established pattern (`EvidenceLink` off `PipelineAssessment`).
2. **`ExternalContribution` has no state-transition validation** — `ResearchTask` already has the
   correct pattern to copy.
3. **No per-person authentication** — known and already documented as a deliberate, founder-level
   tradeoff, not a surprise, but the cost (self-review guard can't stop deliberate impersonation) is
   worth re-confirming is still acceptable as researcher count grows.
4. **Zero test coverage for institutional-pipeline stage-scoring/transition logic.**
5. **No CI / automated pre-deploy test gate.**
6. **No deploy-rollback or migration-failure runbook** beyond Railway's own "redeploy previous build" UI
   feature.

## 5. Changes Made This Sprint

**Documentation fixes (contradictions/staleness caught against actual code, not assumed):**
- `docs/RESEARCH_SOP.md` — corrected an instruction that told researchers to set a task to `complete`
  directly, which the code explicitly forbids; fixed a dead "ask whoever set up your account" reference.
- `docs/RAILWAY_DEPLOYMENT.md` — replaced a stale cookie/`SameSite` troubleshooting paragraph that
  contradicted the correct bearer-token explanation 15 lines above it.
- `docs/FIRST_WEEK_ONBOARDING.md` — removed a now-false "Chicago is the only jurisdiction with completed
  case studies" claim; stopped hardcoding specific task names (which had already gone stale) in favor of
  pointing at the live queue's own priority ordering.
- `CONTRIBUTING.md` — added a note on what to do if `git commit` fails citing a missing identity (the
  exact failure this sprint hit firsthand — see `docs/FIVE_YEAR_HANDOFF_TEST.md`'s second pass).
- `docs/FIVE_YEAR_HANDOFF_TEST.md` — extended with a dated second-pass section (chosen over creating a
  differently-named new document, per "don't rebuild existing systems" — see §6).
- `docs/START_HERE.md` — new, linked from `README.md` and `CONTRIBUTING.md`.
- Three stale `ResearchTask` seed entries (`chicago-unemployment-rate-metric`,
  `chicago-median-wages-metric`, `gm-crime-rate-metrics`) corrected — their seed text falsely claimed
  "100% placeholder" and was being re-pushed into the live database on every reseed; one had never even
  been marked complete.

**Frontend/UX fixes:**
- Fixed a live currency-display bug: the Dashboard's cross-jurisdiction comparison chart defaulted every
  series to USD formatting with no warning; now detects mixed currencies and flags them explicitly
  (confirmed live with Greater Manchester's GBP `budget_balance` data).
- Added the missing "most recent period not yet researched" recency caveat to `MetricCard`.
- Linked the data-quality methodology page from `MetricDetailPage`, `DataCatalogPage`, and
  `ResearchJurisdictionDetailPage`, none of which had it before.
- Added a discoverable path from the Research Map to the internal research queue for logged-in
  researchers (previously only the external contribution form was linked).

**Research/data (see the DSA clean-out rounds this session for full detail):** real fiscal, crime,
workforce, and housing-production data imported for NYC, Minneapolis, Seattle, and DC; Durham County
Council stood up as Mandate's first Reform UK jurisdiction; Greater Manchester's flagship pass closed
pipeline gaps and pulled its first batch of GREEN metrics.

## 6. Changes Deliberately NOT Made

- **No append-only notes/rejected-source schema change** — flagged in detail (§4.1) as the highest-value
  fix, but it's a new data model, not a doc correction, and was left for explicit sign-off rather than
  built unilaterally mid-sprint.
- **No `ExternalContribution` state-machine validation added** — same reasoning; small, but a real
  behavior change to a live workflow.
- **No fix to the Chicago housing-institution overclaim's stage score** — that's a research/scoring
  judgment call for a methodology lead, not an engineering fix.
- **No new `docs/FIVE_YEAR_OPERATING_TEST.md` file**, despite the original sprint brief naming exactly
  that file. `docs/FIVE_YEAR_HANDOFF_TEST.md` already existed and covers the same ground; a second,
  near-identically-named document would have recreated the exact "too many similarly-named docs, no way
  to tell which to read" problem this same sprint's documentation audit flagged as a real issue. Extended
  the existing document with a dated new section instead. Flagging this explicitly as a deliberate
  deviation from the letter of the brief, in service of its own stated principle.
- **No CI pipeline added** — a real, named gap, but adding one is an infrastructure decision (which
  provider, what gates, whether to require it before merge) that affects every future contributor's
  workflow, not a same-session fix.
- **No per-person authentication system built** — already a known, documented, deliberate tradeoff; not
  revisited without being asked to.
- **Transit and innovation metric clusters for the DSA cities were not researched this pass** — Chicago
  and Greater Manchester's own precedent strongly suggests most of these (patent counts, VC investment,
  university spinouts) are structural dead ends at city/metro geography for most American cities, so this
  was deliberately deprioritized in favor of the housing/fiscal/workforce/crime clusters that had real
  yield, rather than spending research effort chasing metrics likely to resolve to "unavailable" anyway.

## 7. Verification

- **Typecheck**: clean across `shared`, `server`, and `client` after every change this sprint.
- **Build**: `npm run build -w shared` clean.
- **Seed idempotency**: verified via repeated `npm run db:seed` runs — stable metric-value counts,
  correct create/refresh counts on the research queue, no duplicate rows introduced.
- **Duplicate-row checks**: confirmed via direct query after every import round this sprint.
- **Failure-mode testing** (local dev database only, never production): 11 distinct failure scenarios
  tested, all handled safely with clear, specific error messages and no silent failures or data
  corruption — malformed CSV (missing column), invalid period format, out-of-range percent value, unknown
  jurisdiction, unknown metric slug, intra-batch duplicate rows, re-running an identical import twice
  (correctly idempotent), a real self-review attempt (correctly blocked, verified against a real `User`
  row created and deleted for the test), a legitimate different-reviewer accept (correctly succeeded),
  accepting a task not in `awaiting_review` (correctly blocked), and setting `complete` directly
  (correctly blocked).
- **Browser checks**: the Dashboard currency-mismatch fix and the new Research Map card were both
  visually confirmed rendering correctly in the local dev server.
- **Production checks**: all research-data changes this sprint were verified live against the production
  API after syncing (see the relevant DSA/GM/Durham rounds).

## 8. Final Recommendation

If engineering attention steps back now and the DePaul → Purdue → Illinois State research organization
operates this system unassisted, the things most likely to actually break, in rough order of likelihood:

1. **A researcher's rejected-source reasoning or mid-task notes get silently overwritten by the next
   person to touch the same task**, and nobody notices until someone re-does work that was already ruled
   out once. This is the single most probable real-world failure, because it requires zero mistakes to
   trigger — it's the *designed* behavior of an overwrite-on-edit field, not an edge case.
2. **The research queue drifts from database reality again**, the same way it did three times this
   sprint, because nothing currently reminds a researcher (or an AI session doing CSV imports directly)
   to also update the matching `ResearchTask`. This will keep happening at the same rate it happened this
   sprint unless the two paths are linked.
3. **A new researcher hits the exact "no fallback documented" failure this sprint hit** — some local
   environment quirk nobody wrote down because only one person's machine ever needed to work before. Git
   identity is now covered; the *next* one won't be, because it's impossible to enumerate them in advance.
4. **The onboarding pilot never actually gets run with real non-founder researchers**, and the gap between
   "the documentation says this should work" and "this has been proven to work" quietly becomes the
   actual five-year risk, exactly as `FOUNDER_HANDOFF_CHECKLIST.md` already honestly flags.
5. **A production deploy or migration goes wrong with nobody around who knows to check, because there's
   no automated gate and no rollback runbook** — a low-probability, high-severity risk rather than a
   likely one, but the one item on this list that isn't primarily a documentation/process fix.

Items 1 and 2 are the two the sprint would most strongly recommend fixing next, precisely because they
are cheap, additive, low-risk schema changes that follow patterns Mandate already uses successfully
elsewhere — not because they're dramatic, but because they're the ones most likely to actually happen,
repeatedly, in ordinary use.
