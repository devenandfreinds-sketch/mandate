# The Mandate Operating System

**Purpose of this document.** Mandate's long-term ambition is to become the "Bloomberg of municipal
governance" — a durable, continuously updated, evidence-driven system for understanding how cities
govern. That requires an organization, not just an application: one that can be run by a distributed team
of motivated students from DePaul, Illinois State, and similar schools, that survives founder absence,
researcher turnover, and changing priorities, without weakening methodological rigor. This document is
the architecture for that organization — audited from the actual codebase as it exists today, not assumed.

Operating philosophy, stated once so every section below can refer back to it:

> **Centralize the methodology. Decentralize the research.**
> **Centralize the data standard. Decentralize the data collection.**
> **Centralize quality control. Decentralize execution.**
> **Centralize strategic direction. Decentralize operational ownership.**

---

## 1. Current Mandate operating model (as audited, not assumed)

A five-way parallel audit of the schema, source registry, ResearchTask/Pipeline system, admin
auth/docs, and git/deploy/seed provenance found a system whose **data model and methodology are
unusually mature for its size**, but whose **organizational infrastructure assumes exactly one trusted
operator**:

- **No `User` model existed** anywhere in the schema before this pass. "Admin" was (and, for HTTP
  authentication, still is) a single shared bcrypt password producing an identical JWT (`{ role: "admin"
  }`) for anyone who has it — there was no way to tell two logged-in people apart. The only
  attribution field anywhere was `ResearchTask.assignedResearcher`, a free-text string the schema's own
  comment admitted exists because "no per-researcher account system exists yet."
- **No review/approval gate exists on published research.** `PipelineAssessment` creation is
  unconditional immediate publication — the moment `createPipelineAssessment` commits, the row is live
  (either as the current assessment or as timeline history). The only thing resembling "pending
  review" anywhere in the codebase was `ResearchTask.status = "awaiting_review"`, one value in a single
  flat, self-service string with no distinct reviewer identity and nothing stopping the same person from
  moving their own task to `complete`.
- **No methodology versioning existed.** The 0-5 Institutional Pipeline stage rubric and the 6-level
  data-quality vocabulary are both excellent, precisely documented (`docs/PIPELINE_METHODOLOGY.md`,
  `shared/src/types/pipeline.ts`) — but nothing recorded *which version* of that rubric a given
  assessment was made under, so a future rubric change would have no way to identify which past research
  needs revalidation.
- **The source-type vocabulary was declared but not enforced.** `SourceType | string` in TypeScript
  collapses to `string`, providing zero actual protection — confirmed by the fact that three of the
  seven `sourceType` values already in production use (`government_report`, `financial_data`,
  `advocacy_report`) weren't even members of the declared union.
- **A real silent-mislabeling bug existed in the API import path.** `imports.routes.ts` defaulted an
  omitted `quality` field to `"government"` — the *highest*-tier label — with no validation that a
  supplied value was even one of the six valid levels. The CLI path had the right instinct (require an
  explicit choice, no default) but didn't enforce it either.
- **Git/deploy assumes one trusted contributor.** Single branch, single human author across all 16
  commits to date, no CI, no PR review, auto-deploy straight to production on every push to `main`, no
  staging environment. This is a reasonable, low-overhead setup for one person and would need real
  process (not just more code) before multiple simultaneous contributors could work without colliding.
- **What already works well and should NOT be redesigned:** the Institutional Pipeline stage rubric, the
  6-level data-quality vocabulary, the 3-tier source hierarchy, the append-only "flip isCurrent"
  pattern for `PipelineAssessment` history, the seed script's hard-won idempotency discipline (upsert by
  slug/key, scoped deletes, "never overwrite researcher progress" comments), and the `ImportJob`/
  `ImportRowResult` rollback mechanism. These are the load-bearing walls; everything proposed below is
  built around them, not instead of them.

## 2. The proposed Mandate Operating System

Four layers, each centralized or decentralized on purpose:

```
┌─────────────────────────────────────────────────────────────┐
│ CENTRALIZED: Methodology & Data Standard                     │
│  PIPELINE_STAGE_DEFINITIONS · DATA_QUALITY_LEVELS ·           │
│  SOURCE_TYPES · METHODOLOGY_VERSIONS (shared/src/types/*.ts)  │
│  Owned by: methodology_lead + founder                         │
├─────────────────────────────────────────────────────────────┤
│ CENTRALIZED: Quality Control                                  │
│  Review workflow (ResearchTask.reviewerId/status) ·            │
│  Decision-rights matrix (docs/DECISION_OWNERSHIP.md) ·         │
│  Research Passport fields on every published record            │
│  Owned by: reviewer role + methodology_lead                    │
├─────────────────────────────────────────────────────────────┤
│ DECENTRALIZED: Research & Data Collection                     │
│  ResearchTask queue · per-jurisdiction ownership ·             │
│  researcher autonomy within the guardrails above               │
│  Owned by: researcher + jurisdiction_lead roles                │
├─────────────────────────────────────────────────────────────┤
│ CENTRALIZED: Strategic Direction                               │
│  New jurisdictions, new governance models, partnerships,       │
│  recruiting leadership, escalation of last resort               │
│  Owned by: founder                                             │
└─────────────────────────────────────────────────────────────┘
```

This is implemented, not just diagrammed, in three concrete pieces:

1. A minimal **`User` model** (`server/prisma/schema.prisma`) giving every role above a real row to
   attach to — `role` (researcher/reviewer/jurisdiction_lead/methodology_lead/founder) and
   `certificationLevel` (see §11), independent axes. It is deliberately **identity, not login** —
   everyone still authenticates with the existing single shared admin credential
   (`server/src/middleware/adminAuth.ts`). A `User` row records *who* is acting for attribution and
   review-routing; it does not yet gate *what* they're allowed to do at the HTTP layer. That gap is
   named explicitly in §13 (Remaining Risks), not hidden.
2. A **Research Passport** — a fixed set of fields on every `PipelineAssessment` and `MetricValue`
   recording who researched it, who reviewed it, when, under which methodology version, and when it's
   next due for review (§7).
3. A **decision-rights matrix** (`docs/DECISION_OWNERSHIP.md`) mapping every role to what it may decide
   autonomously, what needs review, and what escalates — the concrete answer to "researcher autonomy
   with guardrails."

## 3. Centralized vs. decentralized responsibility matrix

See `docs/DECISION_OWNERSHIP.md` for the full per-decision matrix (18 decision types × 5 roles). Summary:

| Layer | Centralized (methodology_lead / founder) | Decentralized (researcher / jurisdiction_lead) |
|---|---|---|
| What gets measured | Metric/policy-area definitions, taxonomy | Which task to pick up next |
| How it's measured | Stage rubric, data-quality vocabulary, methodology version | The specific stage/quality judgment for one assessment, once evidence is gathered |
| Where evidence comes from | The 3-tier source hierarchy itself | Which specific named source to cite, within that hierarchy |
| Who checks the work | That a review step exists at all; resolving disputes | Reviewing a specific submission (reviewer/jurisdiction_lead, day to day) |
| Where research happens | Nothing — this is fully decentralized by design | Local context, local source discovery, per-jurisdiction ownership |

## 4. Research lifecycle

```
unassigned → in_progress → awaiting_review → [complete | changes_requested → in_progress (loop)]
                                                              ↓ (if genuinely unfindable)
                                                          unavailable
```

Concretely: a researcher picks up a `ResearchTask` (`/admin/research-queue`), does the work per
`docs/RESEARCH_SOP.md`, and either publishes a `MetricValue` (via CSV import) or a `PipelineAssessment`
(via `/admin/pipeline`) — both write paths now default `methodologyVersion` to
`CURRENT_METHODOLOGY_VERSION` automatically, and both accept an optional `researchedById`. The task moves
to `awaiting_review`; a reviewer (set via the new Reviewer column) either approves (task → `complete`) or
requests changes (task → `changes_requested`, which auto-increments `revisionCount` — see
`researchTask.service.ts::updateResearchTask`) and the loop continues. Every step is async by design: no
status transition requires a synchronous conversation, a meeting, or the founder's presence — review
happens whenever the reviewer gets to it, exactly like a GitHub PR review.

## 5. Researcher lifecycle

Onboarding → certification → (optionally) leadership, all documented as concrete artifacts, not tribal
knowledge:

1. **Onboarding**: `docs/FIRST_WEEK_ONBOARDING.md`, a five-day path ending in one real, reviewed
   contribution. Day 5 now explicitly directs the new researcher to register themselves at `/admin/users`
   and set a real Reviewer on their first task, rather than relying only on a free-text name.
2. **Certification**: `docs/RESEARCHER_CERTIFICATION.md` — five levels (new_researcher →
   certified_researcher → senior_researcher → research_lead → methodology_reviewer), advanced by
   demonstrated accuracy/rigor/consistency on reviewed work, never by university prestige or tenure.
   Recorded on `User.certificationLevel`, changed via `/admin/users`.
3. **Leadership**: a `jurisdiction_lead` owns a city's research coverage day-to-day (§6); a
   `methodology_lead` owns the rubric itself (§8). Both are founder-granted `User.role` values, not
   emergent from certification level alone (a very senior researcher isn't automatically a lead — that's
   a distinct, deliberate decision, per `docs/DECISION_OWNERSHIP.md`).
4. **Offboarding**: see §10.

## 6. Central methodology, local context — how jurisdiction teams work technically

Nothing about the current data model prevents this today; it's a matter of consistent role assignment,
not new schema. A "Chicago Team" is: one or more `User` rows with `role: "jurisdiction_lead"` or
`"researcher"` whose `ResearchTask.jurisdictionId` filters to Chicago, working against the exact same
`PolicyArea`/`MetricDefinition` taxonomy every other jurisdiction uses. The Research Queue's per-task
`jurisdictionId` already scopes work this way; the jurisdiction_lead role (§3, §5) formalizes who's
allowed to reassign tasks and flag gaps *within* that jurisdiction without needing founder sign-off, while
`docs/DECISION_OWNERSHIP.md` keeps them from silently changing the shared taxonomy or rubric that every
other city's team also depends on. No new "Chicago-specific" tables or forked methodology files are
needed — the isolation is by `jurisdictionId` filter and role scope, not by code fork, which is exactly
what keeps five cities' worth of research comparable to each other.

## 7. Research Passport design

**Already existed before this pass** (per `PipelineAssessment`/`MetricValue`): what was researched
(`evidenceSummary`/the value itself), what sources were used (`EvidenceLink`/`SupportingLegislation`/
`sourceId`), what data-quality classification was assigned (`dataQuality`), what limitations were
identified (`limitations`), when it was researched (`assessmentDate`/`createdAt`).

**Added by this pass** (all nullable/additive — see §14 for the migration):

| Field | On | Meaning |
|---|---|---|
| `researchedById` | PipelineAssessment, MetricValue | Who did the research (FK → User) |
| `reviewedById` | PipelineAssessment, MetricValue | Who reviewed it (FK → User) |
| `reviewedAt` | PipelineAssessment, MetricValue | When it was last reviewed |
| `methodologyVersion` | PipelineAssessment, MetricValue, ResearchTask | Which `METHODOLOGY_VERSIONS` entry was in effect |
| `nextReviewDate` | PipelineAssessment, MetricValue, ResearchTask | When it should be re-checked |

**Deliberately not implemented**: a full field-by-field diff between assessment versions ("what changed
from the previous version"). The append-only `isCurrent`-flip history (already existed, unchanged) makes
this reconstructable by reading consecutive rows in `getPipelineAssessmentHistory()` — a dedicated diff
view is a real future feature, not infrastructure this pass needed to build to make the Passport concept
whole. What calculations/assumptions were made largely lives in the existing free-text
`evidenceSummary`/`limitations`/`notes` fields and each `Source.methodology` entry — adding a separate
structured "calculation" field per row would duplicate that without adding real rigor, so it was left
alone (see "do not overengineer").

## 8. Methodology governance

`shared/src/types/methodology.ts` — the simplest viable architecture, per the founder's explicit
instruction not to overengineer this: a plain versioned array (`METHODOLOGY_VERSIONS`), a
`CURRENT_METHODOLOGY_VERSION` pointer, and a `triggersRevalidationReview` flag per version. Version 1.0.0
is backfilled honestly onto every existing real (non-placeholder) `MetricValue`/`PipelineAssessment`/
`ResearchTask` row via the migration itself (it's the only rubric that has ever existed, so this is a
true label, not a fabricated one) — synthetic placeholder rows are deliberately left `NULL`. A future
methodology change is a new array entry plus a decision (recorded in `changes`) about whether it's
substantive enough to flag existing research for revalidation; it never rewrites history. Per
`docs/DECISION_OWNERSHIP.md`, only `methodology_lead`/`founder` may add a version.

## 9. Review system

Implemented additively on the existing `ResearchTask` (no new "review" model — the task *is* the review
unit, consistent with "don't build a massive project-management platform"):

- `reviewerId` (FK → User) — who is responsible for reviewing, set explicitly rather than defaulting
  silently to the founder for every submission.
- `status` now includes `changes_requested` alongside the existing five values — a reviewer sends work
  back without deleting or overwriting it.
- `revisionCount` auto-increments on each `changes_requested` transition
  (`researchTask.service.ts::updateResearchTask`) — an honest, automatically-kept signal for both the
  researcher's own record and certification judgment (§11), never a punitive score.
- Preserved exactly as-is: the append-only publication model for `PipelineAssessment` (no draft state was
  retrofitted onto the data record itself — review happens at the *task* level, before/alongside
  publication, not by gating the database write with a new approval workflow that would have meant
  rebuilding `pipeline.service.ts`'s transactional isCurrent-flip logic from scratch for uncertain
  benefit).

## 10. Handoff / offboarding

If a researcher leaves tomorrow, everything needed to reassign their work is already queryable without
new infrastructure, because it's now attached to a real `User.id` rather than scattered free text:

```sql
-- Everything they own or are reviewing
SELECT * FROM "ResearchTask" WHERE "assignedResearcherId" = '<id>' OR "reviewerId" = '<id>';
-- Everything they've published (Research Passport lookup)
SELECT * FROM "PipelineAssessment" WHERE "researchedById" = '<id>' OR "reviewedById" = '<id>';
SELECT * FROM "MetricValue" WHERE "researchedById" = '<id>' OR "reviewedById" = '<id>';
```

The mechanical offboarding steps: (1) run the three queries above, (2) reassign open
`assignedResearcherId`/`reviewerId` tasks to another researcher or back to `unassigned`/`null`, (3) set
`User.isActive = false` (their historical attribution stays intact — Users are never deleted, only
deactivated, so the Research Passport trail never breaks). No code changes needed to execute this today;
it's an `/admin/research-queue` and `/admin/users` workflow, documented here so it doesn't have to be
reinvented under pressure the first time it's actually needed.

## 11. Researcher certification system

See `docs/RESEARCHER_CERTIFICATION.md` for the full ladder (new_researcher → certified_researcher →
senior_researcher → research_lead → methodology_reviewer) and exactly what it rewards (accuracy,
reliability, learning speed, rigor, consistency, honest uncertainty documentation, workflow
improvement) versus what it deliberately excludes (university prestige, raw volume, self-assessment). No
automated score exists or is proposed — advancement is a `User.certificationLevel` change made by a
reviewer/lead/founder, informed by (not computed from) the real signals already available:
`revisionCount`, review history, and task completion patterns.

## 12. Five-year durability analysis

Walking through the founder's own list of what must still work in 2031 without daily founder involvement:

- **Adding new jurisdictions/metrics/policy areas** — already supported by the existing upsert-by-slug
  seed pattern; nothing added this pass changes that, since it was already correctly designed.
- **Splitting/merging metrics** — not schema-blocked today (a `MetricDefinition` is just a row), but
  genuinely requires a migration + a decision about what happens to historical `MetricValue` rows tied to
  the old definition; correctly scoped in `docs/DECISION_OWNERSHIP.md` as a `methodology_lead`/founder
  call, not a researcher one.
- **Changing research teams** — handled entirely through `User.role`/`isActive` and `ResearchTask`
  reassignment (§10); no code change required to add or remove a jurisdiction team.
- **Changing methodology** — `METHODOLOGY_VERSIONS` (§8) is the extension point; existing research keeps
  its stamped version, nothing is silently reinterpreted.
- **Adding new source types** — `SOURCE_TYPES` (`shared/src/types/source.ts`) is a plain array with a
  runtime validator (`isValidSourceType`); adding one is a one-line, reviewable change, not a schema
  migration.
- **Changing review structures** — `ResearchTask.reviewerId`/`status` supports more nuanced routing (e.g.
  jurisdiction-scoped auto-assignment) without a schema change; that logic can live entirely in
  `researchTask.service.ts` later if the team grows enough to need it.
- **What genuinely still depends on the founder in 2031 if untouched further**: real per-person login
  (§13), and the git/deploy process (single branch, no CI, no staging — §1). Both are named explicitly as
  remaining risks below, not glossed over.

## 13. Remaining risks (named, not hidden)

1. **Identity ≠ access control.** The `User` model gives real attribution, but authentication is still
   one shared password. A `User` row does not stop anyone holding that password from editing anyone
   else's task or another jurisdiction's research — the decision-rights matrix is binding *team policy*,
   not a server-enforced permission system. Building real per-person login (and then actual role-gated
   authorization) is the single highest-leverage next investment once the team is larger than 2-3 people,
   and is explicitly flagged in `docs/DECISION_OWNERSHIP.md` as a founder-level product decision, not
   something to build reactively.
2. **Git/deploy still assumes one trusted contributor.** Single branch, no CI, no PR review, auto-deploy
   straight to production. Fine at current scale; would need branch protection + CI type-checking at
   minimum before multiple simultaneous engineering contributors could work safely.
3. **Research Passport fields are all NULL on existing rows** (except the honest `methodologyVersion:
   "1.0.0"` backfill) until researchers start actually filling in `researchedById`/`nextReviewDate` going
   forward through the updated admin forms — this is expected, not a defect: the infrastructure had to
   exist before it could be populated, and nothing was fabricated to make old rows look more
   attributed than they are.
4. **Research Health metrics will read as sparse at first** (stale counts, missing-evidence counts) until
   `nextReviewDate` gets populated on new submissions — again, an honest reflection of "we just built the
   field," not a bug.
5. **No automated test suite** — `npm run build` (typecheck) remains the only automated correctness
   signal, unchanged by this pass; a real test suite for the service layer (especially the new
   `researchTask`/`pipeline`/`user` services) would meaningfully de-risk future changes.

## 14. Code changes made this pass

- `server/prisma/schema.prisma`: new `User` model; Research Passport fields on `PipelineAssessment` and
  `MetricValue`; `assignedResearcherId`/`reviewerId`/`revisionCount`/`methodologyVersion`/`dueDate`/
  `nextReviewDate` on `ResearchTask`; new `changes_requested` status value (documentation-only, no schema
  enum). Migration: `server/prisma/migrations/20260723034602_research_passport_and_users/` — purely
  additive (new nullable columns + one new table), plus an honest backfill of `methodologyVersion:
  "1.0.0"` onto existing real (non-placeholder) rows only.
- `shared/src/types/methodology.ts` (new), `shared/src/types/user.ts` (new): the methodology-version
  registry and the User role/certification vocabularies.
- `shared/src/types/source.ts`: replaced the unenforced `SourceType | string` with a real, validated
  `SOURCE_TYPES` array (`isValidSourceType`) covering all seven values actually in use, plus a vague-name
  guard (`isVagueSourceName`, `FORBIDDEN_VAGUE_SOURCE_NAMES`).
- `shared/src/types/pipeline.ts`, `shared/src/types/metric.ts`, `shared/src/types/researchTask.ts`:
  Research Passport fields added to the API DTOs.
- `server/prisma/seed/index.ts`: fail-fast validation of every `Source`'s `sourceType` and (for
  non-placeholder sources) name-vagueness before any row is written.
- `server/src/import/cli.ts`, `server/src/routes/admin/imports.routes.ts`: fixed the silent
  `quality ?? "government"` default bug; both paths now require and validate an explicit
  `DATA_QUALITY_LEVEL_SLUGS` member.
- `server/src/services/pipeline.service.ts`, `researchTask.service.ts`: Research Passport field mapping
  and writes; `methodologyVersion` auto-defaults to `CURRENT_METHODOLOGY_VERSION`; `revisionCount`
  auto-increments on a `changes_requested` transition.
- `server/src/services/user.service.ts` (new), `server/src/routes/admin/users.routes.ts` (new): User
  CRUD, admin-gated like every other write path.
- `server/src/services/researchHealth.service.ts` (new), `server/src/routes/admin/researchHealth.routes.ts`
  (new): the System/Research Health summary (pipeline coverage, stale assessments/metrics, missing
  evidence, unavailable-metric-pair count, data-quality breakdown) — every number computed live from real
  rows, nothing fabricated.
- `client/src/pages/admin/AdminUsersPage.tsx` (new), `AdminResearchQueuePage.tsx` (extended with a
  "viewing as" selector, My Tasks / Team Tasks / Research & System Health panels, and reviewer/User
  dropdowns), `AdminPipelinePage.tsx` (Researched-by / Next-review-date fields),
  `PipelineDetailPage.tsx` (a public-facing Research Passport card).
- `client/src/hooks/useUsers.ts` (new), `useResearchHealth.ts` (new); `useResearchQueue.ts`,
  `useAdminPipeline.ts` extended for the new fields.
- `client/src/routes.tsx`: new `/admin/users` route.

## 15. Documentation changes made this pass

- `docs/DECISION_OWNERSHIP.md`: added the formal per-role decision-rights matrix (§3 above), and updated
  the "known limitation" section to describe the new `User` model's identity-without-login nature.
- `docs/RESEARCHER_CERTIFICATION.md` (new): the five-level certification ladder.
- `docs/FOUNDER_HANDOFF_CHECKLIST.md`: updated the "at least two researchers" item to reflect the new
  attribution mechanism (still flags what it doesn't yet solve).
- `docs/FIRST_WEEK_ONBOARDING.md`: Day 5 now directs a new researcher to register at `/admin/users` and
  set a real reviewer.
- This document (`docs/MANDATE_OPERATING_SYSTEM.md`, new).

## 16. Database changes

One migration (`20260723034602_research_passport_and_users`), verified locally:

- Additive only: 1 new table (`User`), ~15 new nullable columns across `PipelineAssessment`,
  `MetricValue`, `ResearchTask`. No columns dropped, no types narrowed, no data deleted.
- Backfill: `methodologyVersion = '1.0.0'` on existing non-placeholder `MetricValue`/`PipelineAssessment`
  rows and all `ResearchTask` rows — verified via direct query: 142 real MetricValues and 25 real
  PipelineAssessments stamped correctly; all 3,026 placeholder MetricValues and 36 placeholder
  PipelineAssessments correctly left `NULL`.

## 17. Tests performed

- `npm run build` (shared → server → client) — clean, zero errors, run repeatedly through the pass.
- `npx prisma migrate dev` — applied cleanly against the local dev database.
- `npm run db:seed -w server` — re-run after the new fail-fast source-type/vague-name validation was
  added; all 59 existing sources passed validation with zero rejections; confirmed full idempotency (0
  created, N already-present, research queue refreshed without touching researcher-owned fields).
- Direct `psql` verification of the methodology-version backfill (counts above).
- No Railway deployment — all of the above is local-only, per the explicit instruction to stop before
  production.

## 18. Recommended next research/engineering task

Two tracks, independent of each other:

- **Research**: continue the Chicago roadmap (see `docs/CHICAGO_RESEARCH_ROADMAP.md`) — Chicago remains
  the reference jurisdiction this whole operating system is designed to generalize away from being
  founder-dependent on.
- **Engineering, when the team outgrows 2-3 people sharing one password**: real per-person login. That is
  the one remaining piece that turns this from "a well-documented honor system with good attribution" into
  "a system that mechanically enforces its own decision-rights matrix" — everything in this document is
  designed so that change, whenever it happens, is additive to the `User` model that already exists rather
  than a redesign.
