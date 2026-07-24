# Institutional Pipeline Architecture

**Problem this solves.** Greater Manchester's affordable-housing capacity rests on at least three real,
independently-operating institutions: the Housing Investment Loans Fund (GMHILF, a revolving loan
fund), the Brownfield Housing Fund (a separate grant/subsidy mechanism), and Places for Everyone (a
joint statutory spatial plan across 9 of 10 boroughs). `PipelineAssessment` assumed exactly one primary
institution per (jurisdiction, policyArea) — so this pass had to pick just ONE (GMHILF) to represent
"Affordable Housing Production Institution" and leave the other two undocumented as separate pipeline
rows, purely because the schema couldn't hold more than one. This document audits that assumption and
implements the minimum fix.

## The conceptual separation considered

The task brief proposed splitting Policy Area → Institution → Program → Governance Mechanism → Evidence
into five distinct concepts. Worth stating clearly: **this was seriously considered and NOT built**,
for a concrete reason tied to actual evidence, not a vague "keep it simple" gesture.

Walking Greater Manchester's own three institutions through the proposed five-way split:

- **GMHILF**: Institution = GMCA itself (administering directly, no separate legal entity). Program =
  the loan fund. Governance Mechanism = the 2014 devolution deal designation + GMCA's internal loan-
  approval process. Evidence = GMCA's claimed "11,000 homes" vs. the independent ~7,800 count.
- **Places for Everyone**: Institution = the nine constituent councils acting jointly (no separate body
  at all — literally the councils themselves). Program = arguably the plan IS the institution here;
  there's no narrower "program" underneath it. Governance Mechanism = the joint Regulation 18/19
  statutory planning process. Evidence = individual borough planning-committee decisions citing it.
- **Devolved AEB**: Institution = GMCA (again, no separate entity). Program = the Adult Skills Fund
  itself. Governance Mechanism = the 1 August 2019 legal/administrative transfer. Evidence = GMCA's own
  annual participation reports plus the IES independent evaluation.

The pattern that emerges: **"Institution" and "Governance Mechanism" collapse into the same thing in
two of three real cases** (GMCA administers both GMHILF and the AEB directly, with no separate legal
entity — the "institution" IS "GMCA acting under a specific devolution-deal authorization"). Forcing a
five-table split onto data that doesn't actually have five independently-varying dimensions would
create four mostly-empty or duplicate-content tables for the sake of a taxonomy that doesn't match how
these institutions actually work. This is exactly the kind of complexity the task brief itself warned
against ("do not make the system unnecessarily complicated").

**What Greater Manchester's real cases actually needed was much narrower: a way to have more than one
named institution under one policy area.** That's the one dimension that was genuinely blocking real
research (GMHILF vs. Brownfield Fund vs. Places for Everyone, all real, all under "housing," none
reducible to the others). So that's the one thing this pass built.

## What was implemented

One new field on `PipelineAssessment`, plus a change to its unique constraint:

```prisma
institutionName String @default("")
```

```prisma
@@unique([jurisdictionId, policyAreaId, institutionName, assessmentDate])
```

- **Default `""`** means "the single/primary institution for this policy area, not otherwise
  distinguished" — the exact behavior every existing row (Chicago's 25, Greater Manchester's 10)
  already has, unchanged by this addition. Not nullable, deliberately: a nullable field would have
  broken the unique constraint's guarantees (Postgres treats each NULL as distinct in a unique index,
  which would have silently permitted duplicate `""`-institution rows to slip through — the opposite of
  what the constraint exists to prevent).
- **A non-empty value** opts a row into being tracked as one of several named institutions within the
  same policy area, each with its own fully independent `isCurrent` history — a second institution's
  timeline doesn't interfere with the first's.
- **`pipeline.service.ts`'s `createPipelineAssessment()`** now scopes its "flip the previous current row
  to not-current" logic by `institutionName` too, so adding a new assessment for one institution never
  touches another institution's current row under the same policy area.
- **`getPipelineAssessmentHistory()`** gained an optional `institutionName` parameter: omit it to get
  every institution's history interleaved by date (harmless today — everything real uses `""`); pass it
  once a policy area genuinely has more than one institution, to get just one institution's timeline.

## The scoring methodology is unchanged

The 0-5 stage ladder, the data-quality vocabulary, and every existing stage assignment for Chicago and
Greater Manchester are untouched. This pass answers "how many institutions can a policy area hold,"
not "how should any institution be scored" — those are genuinely separate questions, and the brief was
explicit that the second one should not be casually changed. It wasn't.

## What's deliberately NOT built this pass

- **GMHILF/Brownfield Fund/Places for Everyone were NOT retroactively split into three separate rows
  this pass.** The schema capability now exists, but populating it requires: (a) deciding whether
  Places for Everyone even fits any existing PolicyArea (it arguably doesn't — see
  `docs/GREATER_MANCHESTER_RESEARCH_ROADMAP.md`'s item 3, which recommends this as a future research
  task with its own taxonomy question, not something to force through now), and (b) client UI work (see
  below). Doing this today would be exactly the kind of "add more data" the brief said NOT to prioritize
  in this pass.
- **No client UI renders multiple institutions under one policy area.** `getJurisdictionPipeline()` —
  which powers the Place Profile page's pipeline card grid — still returns one row per policy area for
  every jurisdiction today, because every real row still uses the default institution. The first time a
  researcher actually adds a second named institution under an existing policy area, the Place Profile
  page will need a design decision (does the policy-area card expand into institution sub-cards? show
  the highest-staged institution with a "+2 more" indicator? something else?) that hasn't been designed,
  let alone built. Flagged honestly here and in the architecture audit, not silently assumed away.
- **No Institution/Program/GovernanceMechanism models.** See the reasoning above — not built because
  the real evidence collected this pass doesn't support that the five-way split would add clarity
  rather than empty tables, not because it wasn't considered.

## Verification

- Migration adds one column with a harmless default and changes one unique constraint's column list
  (from 3 columns to 4) — additive, no data loss, verified against the actual dev database (see
  Phase 13).
- All 35 real `PipelineAssessment` rows (25 Chicago, 10 Greater Manchester) continue to have
  `institutionName: ""` and render identically on both the Place Profile and Pipeline Detail pages.
- Reseed remains idempotent after this change (see Phase 13 testing results).
