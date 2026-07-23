# Greater Manchester Research Roadmap

**Who this is for.** A researcher — internal (DePaul, Purdue, Illinois State) or external (NYU, Tulane,
or any other contributor) — picking up Greater Manchester work who has never worked on Mandate before.
Each item below is meant to be understandable and actionable without talking to the founder first. See
`docs/GREATER_MANCHESTER_CASE_STUDY.md` for the full context on what's already been researched and why.

Ranked by **Value × Reproducibility × Source Quality × Researcher Accessibility** — not by what's
easiest. Items 1-5 already exist as real `ResearchTask` rows in the Research Queue
(`server/prisma/seed/data/researchQueue.ts`, keys prefixed `gm-`); items 6-10 are recommended future
priorities not yet formalized as tasks.

---

### 1. Crime rate metrics (violent_crime_rate, property_crime_rate)

- **Governance level:** Greater Manchester Police force area (confirm this matches the 10-borough GMCA
  boundary exactly before importing).
- **Why it matters:** Currently 100% placeholder for Greater Manchester; public safety is one of
  Mandate's core categories and has zero real GM data today.
- **Preferred source:** UK Home Office "Police recorded crime" open data (police.uk / gov.uk).
- **Source tier:** Government (Tier 1).
- **Difficulty:** Medium — the data is straightforward to pull, but requires an explicit, documented
  judgment call mapping UK offence categories to Mandate's US-style "violent"/"property" definitions.
- **Expected time:** 4-6 hours including the mapping writeup.
- **Methodological concerns:** UK "violence against the person" includes lower-severity assault than US
  "aggravated assault" — must be documented as a limitation, not silently treated as equivalent.
- **Suitable for a new undergraduate researcher:** Yes — official source, clear boundaries, and a good
  first exercise in documenting a definitional mismatch honestly rather than hiding it.

### 2. Homelessness metric methodology + Rough Sleeping Snapshot data

- **Governance level:** 10 constituent boroughs, summed to a GM total (matching the pattern used for
  housing completions).
- **Why it matters:** This pass gathered real statutory-homelessness data but deliberately did NOT
  import it, because it doesn't match the `homelessness_count` metric's Point-in-Time Count definition
  — the closer match (MHCLG's Rough Sleeping Snapshot) was not yet researched.
- **Preferred source:** MHCLG "Rough sleeping snapshot in England" annual statistics.
- **Source tier:** Government (Tier 1).
- **Difficulty:** Medium-high — the data pull itself is straightforward, but the task also requires a
  real methodology decision (does statutory homelessness deserve its own separate metric?) that needs
  methodology_lead/admin sign-off, not just a researcher's own call.
- **Expected time:** 3-4 hours for the data pull; the methodology decision is a separate, slower
  conversation.
- **Methodological concerns:** Do not import statutory homelessness data under the existing
  `homelessness_count` slug without that decision being made explicitly — see the case study for the
  raw statutory data already gathered.
- **Suitable for a new undergraduate researcher:** Partially — the data pull yes; the taxonomy decision
  should be escalated, not resolved unilaterally.

### 3. Places for Everyone / spatial planning pipeline + taxonomy question

- **Governance level:** 9 of 10 boroughs jointly (Stockport opted out) — a genuinely new kind of
  governance unit for Mandate (neither GMCA-wide nor single-borough).
- **Why it matters:** A real, operating institution (formally adopted 21 Mar 2024, in documented
  planning-decision use through 2025) that this pass could not cleanly score under any existing
  PolicyArea.
- **Preferred source:** GMCA's Places for Everyone adoption/examination pages; individual borough
  planning committee reports citing PfE policies (e.g. Bolton MBC's).
- **Source tier:** Government (Tier 1).
- **Difficulty:** Medium — the research itself is well-documented and traceable; the harder part is a
  taxonomy recommendation (should Mandate add a new PolicyArea?).
- **Expected time:** 5-7 hours.
- **Methodological concerns:** Adding a new PolicyArea is a global schema-data change affecting every
  jurisdiction's coverage stats — this task's deliverable should be a recommendation with supporting
  research, not a unilateral implementation.
- **Suitable for a new undergraduate researcher:** The research portion yes; the architecture
  recommendation is better suited to a more experienced researcher or external academic contributor.

### 4. Business Rate Retention Pilot as a Progressive Revenue Institution candidate

- **Governance level:** GMCA (with HM Treasury as the counterparty).
- **Why it matters:** The only candidate identified this pass for GM's currently-unresearched
  "Progressive Revenue Institution" policy area — but not investigated deeply enough to score.
- **Preferred source:** GMCA financial reporting; HM Treasury business rates retention pilot
  documentation.
- **Source tier:** Government (Tier 1), likely supplemented by Institute for Fiscal Studies commentary
  (Tier 2).
- **Difficulty:** Medium — UK local government finance has no direct equivalent to a US progressive-tax
  institution, so this task may legitimately conclude "not a clean fit" rather than force a score.
- **Expected time:** 4-6 hours.
- **Methodological concerns:** Do not inflate a fit that isn't there — a well-reasoned "this doesn't
  qualify, here's why" is a legitimate and valuable research output.
- **Suitable for a new undergraduate researcher:** Yes, with guidance on the conservative-scoring
  principle (see `docs/PIPELINE_METHODOLOGY.md`).

### 5. Bee Network rail integration follow-up (after 13 Dec 2026)

- **Governance level:** GMCA / TfGM, in coordination with national rail operators.
- **Why it matters:** The first real test of whether Bee Network rail integration — currently a
  committed date, not yet operating — actually happens on schedule.
- **Preferred source:** TfGM/GMCA press materials; National Rail / operator announcements.
- **Source tier:** Government (Tier 1).
- **Difficulty:** Low — a straightforward check-in once the date has passed.
- **Expected time:** 1-2 hours.
- **Methodological concerns:** Do not create a new PipelineAssessment row before the milestone actually
  occurs — a committed date is not evidence of operation.
- **Suitable for a new undergraduate researcher:** Yes — an easy, low-stakes task, good for someone
  building research-queue familiarity.

---

### 6. Housing starts / planning permissions granted (housing_starts, housing_permits_issued)

- **Governance level:** 10 boroughs, summed to GM total.
- **Why it matters:** Companion series to the already-imported housing_completions — MHCLG's Live
  Table 253 (starts) and planning-application live tables (permissions) cover the same geography and
  period convention already established this pass.
- **Preferred source:** MHCLG Live Tables on House Building (starts) and Planning Applications
  (permissions granted).
- **Source tier:** Government (Tier 1).
- **Difficulty:** Low — same source family and fiscal-year period convention already built this pass.
- **Expected time:** 2-3 hours per metric.
- **Methodological concerns:** England has no direct "building permit" equivalent to a US permit —
  "planning permission granted" is the correct analogue, and should be documented as such.
- **Suitable for a new undergraduate researcher:** Yes.

### 7. Transit reliability / punctuality (transit_reliability)

- **Governance level:** GMCA/TfGM (Bee Network bus network).
- **Why it matters:** TfGM already publishes real punctuality data (66%→80%→82.7% across tranches,
  cited as pipeline evidence this pass) — extracting it as a proper metric time series, not just
  pipeline-evidence prose, would strengthen the Transit category directly.
- **Preferred source:** TfGM punctuality reports (tfgm.com/ways-to-travel/bus/punctuality-report).
- **Source tier:** Government (Tier 1), self-reported by the operating authority.
- **Difficulty:** Low-medium.
- **Expected time:** 3-4 hours.
- **Methodological concerns:** Data only exists from the franchising era onward (Sept 2023+) — no
  pre-franchising comparable series was found, so there is no "before/after" baseline to import.
- **Suitable for a new undergraduate researcher:** Yes.

### 8. Currency-metric architecture decision (median_rent, median_wages, and fiscal-health metrics)

- **Governance level:** Cross-cutting architecture question, not jurisdiction-specific.
- **Why it matters:** Six metric definitions hardcode `unit: "usd"`, which blocked importing several
  otherwise-available real GM series (ONS/VOA private rental statistics for median_rent, in particular)
  this pass. This is the highest-priority architectural gap identified — see the case study's P1 list.
- **Preferred source:** N/A — this is a schema/methodology task, not a data-pull task.
- **Source tier:** N/A.
- **Difficulty:** Medium — likely a `currencyCode` field addition (additive, backward-compatible,
  defaulting existing rows to `"USD"`), but the exact design should be a deliberate methodology_lead/
  admin decision, not an improvised fix.
- **Expected time:** Design discussion + implementation, likely a full separate engineering pass.
- **Methodological concerns:** Do not solve this by fabricating an exchange-rate conversion without an
  explicit, documented methodology.
- **Suitable for a new undergraduate researcher:** No — this is an architecture/methodology decision,
  best suited to an experienced internal researcher or the methodology lead.

### 9. Sub-jurisdiction (borough-level) disaggregation

- **Governance level:** Would require new Jurisdiction rows for individual boroughs (e.g. Manchester,
  Wigan) nested under Greater Manchester.
- **Why it matters:** All the borough-level detail behind this pass's GM-total housing/homelessness
  figures already exists in the raw MHCLG source data — Mandate just has no schema place to put it yet.
- **Preferred source:** Same MHCLG live tables already used this pass, at their native by-LA grain.
- **Source tier:** Government (Tier 1).
- **Difficulty:** High — this is a genuine schema change (likely a `parentJurisdictionId` self-relation
  on `Jurisdiction`), not a data-pull task, and would meaningfully expand Research Map coverage
  denominators for every future metro-region jurisdiction.
- **Expected time:** A full engineering design-and-implementation pass.
- **Methodological concerns:** Do not build this reactively — see the case study's recommendation to
  resolve the currency and multi-institution-per-policy-area questions first, since they're more
  clearly blocking real research today.
- **Suitable for a new undergraduate researcher:** No — architecture work, not research.

### 10. GM devolved health and social care integration

- **Governance level:** GMCA (Greater Manchester was the first English region to gain devolved control
  of a combined NHS/social care budget, from 2016).
- **Why it matters:** Potentially the single most significant GM institutional pipeline not yet
  researched at all this pass — health devolution predates and is arguably more consequential than
  transport franchising, but this pass did not have research capacity to investigate it.
- **Preferred source:** NHS Greater Manchester Integrated Care Board; Greater Manchester Health and
  Social Care Partnership publications; academic health-policy literature (University of Manchester).
- **Source tier:** Government (Tier 1) and Academic (Tier 2).
- **Difficulty:** High — health and social care integration is one of the most institutionally complex
  areas of UK devolution, and doesn't fit any of Mandate's current 7 PolicyAreas (a new category may be
  needed, similar to the Places for Everyone question above).
- **Expected time:** A substantial multi-week research effort, likely for an external academic
  contributor (e.g. a health-policy researcher at NYU, Tulane, or a UK university) rather than a single
  undergraduate task.
- **Methodological concerns:** Do not attempt a quick, shallow pass on something this institutionally
  complex — better to leave it clearly flagged as unresearched than to score it carelessly.
- **Suitable for a new undergraduate researcher:** No — recommended as an external contribution
  candidate specifically, testing the external research network on genuinely hard subject matter.
