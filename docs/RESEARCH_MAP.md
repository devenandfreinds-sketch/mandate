# The Research Map

A collective progress layer above the Research Queue. The Research Queue is where researchers work
task by task; the Research Map (`/research`, public) is where the whole team — and anyone else — sees
how much of Mandate's municipal governance knowledge base has actually been responsibly researched.

Core principle: **gamify the mission, not the researcher.** No points, no XP, no individual leaderboard,
no "Top Researcher." The only thing that grows is the map itself, and it only grows when real,
evidence-backed research replaces a placeholder — never when a task is merely marked done.

## How coverage is calculated (never stored, always derived)

Every number on the Research Map is computed live from `MetricValue`/`PipelineAssessment` rows —
never from `ResearchTask.status`, and never stored as a percentage anywhere. See
`server/src/services/researchProgress.service.ts`.

For a jurisdiction:

- **Data Coverage** — across every `MetricValue` row for that jurisdiction (every metric, every
  year): what fraction is `measured` (real dataQuality — government/academic/alternative/estimated),
  what fraction is `unavailable` (genuinely investigated, no responsible source exists), what
  fraction is `unresearched` (still `placeholder`).
- **Institutional Pipeline Coverage** — same three-way split, across the current `PipelineAssessment`
  row for each policy area.
- **Overall Coverage** — a simple average of the two. They're treated as two coequal workstreams
  rather than combined by raw row count, because metrics vastly outnumber policy areas per
  jurisdiction (order of 500 metric-years vs. 7 policy areas) — an unweighted combination would make
  pipeline coverage nearly invisible in the "overall" number.

`measured + unavailable` is reported separately as **coverage** (Mandate has investigated and reached
a conclusion) — this is deliberately never collapsed with "unresearched" into one misleading number.
A city that is 90% "resolved" but only 60% "measured" is shown as exactly that, not as 90% researched.

## Research status model

| Status | Meaning | Where it lives |
|---|---|---|
| Unresearched | Nobody has looked; still synthetic placeholder data | `isPlaceholder: true` on the data row |
| In Progress | A researcher has claimed the task | `ResearchTask.status = "in_progress"` |
| Awaiting Review | Submitted, not yet accepted | `ResearchTask.status = "awaiting_review"`, `submittedAt` stamped |
| Needs Revision | A reviewer sent it back | `ResearchTask.status = "changes_requested"`, `revisionCount` incremented |
| Complete (accepted) | A reviewer explicitly accepted it | `ResearchTask.status = "complete"`, `reviewedAt`/`reviewerId` stamped |
| Unavailable | Investigated; no responsible source exists | `dataQuality = "unavailable"` on the data row, or `ResearchTask.status = "unavailable"` |

**Submitted ≠ verified**, enforced in code, not just convention: `updateResearchTask()` (the generic,
self-service PATCH researchers use for routine status changes) explicitly rejects a direct transition
to `"complete"` — only the dedicated `acceptResearchTask()` action can do that, and only from
`"awaiting_review"`. Accepting the *task* does not, by itself, touch any `MetricValue`/
`PipelineAssessment` row — those already had to be real (evidence-backed, non-placeholder) before the
task could reasonably be submitted for review in the first place. This is why Research Map coverage
is derived from the data, not the task: a task can be accepted, but coverage only moves when the
underlying research was actually real.

## The review workflow

```
unassigned → in_progress → awaiting_review → complete (via Accept)
                                ↓
                          changes_requested → in_progress (via Request Revision, loop)
```

- `PATCH /admin/research-tasks/:id` — routine self-service field changes (status other than
  `complete`, assignment, notes, due dates). Stamps `submittedAt` automatically whenever status
  becomes `awaiting_review`.
- `POST /admin/research-tasks/:id/accept` — the ACCEPTED action. Only valid from `awaiting_review`.
- `POST /admin/research-tasks/:id/request-revision` — the NEEDS REVISION action. Only valid from
  `awaiting_review`; increments `revisionCount`, stores `reviewNotes`.

No synchronous meeting is required anywhere in this loop — every transition is a single async HTTP
call, consistent with Mandate's "async first" design (see `docs/MANDATE_OPERATING_SYSTEM.md`).

## What the Research Map shows

- **Overall Mandate Research Coverage** — global data + pipeline coverage, averaged.
- **Current Research Focus** — a lightweight, config-only pointer (`shared/src/types/campaign.ts`) at
  today's priority jurisdiction, with live-computed progress. Not a database table — changing focus
  means editing one object, no migration.
- **Jurisdiction cards** — coverage, in-progress/awaiting-review/needs-revision counts, link to a
  per-jurisdiction drill-down (`/research/:slug`) listing every metric and policy area's exact status.
- **Research Frontiers** — the highest-priority remaining (partially or fully unresearched) items per
  jurisdiction, preferring ones that already have an open task, then by task priority.
- **Active Research** — every task currently `in_progress` or `awaiting_review`, unranked, no
  researcher-vs-researcher comparison.
- **Recently Verified** — recently created, real (non-placeholder) `PipelineAssessment` rows.
  Recognition without a leaderboard: a researcher's name may appear (Research Passport attribution),
  but nothing here counts, ranks, or scores people against each other.

## What's deliberately not built

- No individual leaderboard, points, or XP — never, by explicit design.
- No campaign/milestone database table — `CURRENT_RESEARCH_FOCUS` is a config object; a real
  multi-campaign history system is a future, deliberate schema change if ever needed, not built
  speculatively now.
- No metric-level "recently verified" feed (only pipeline assessments) — a metric import is a batch of
  numbers without the same natural "this policy area now tells a story" narrative; scoped out to avoid
  a noisier, less meaningful feed.
- No automated "coverage % triggers X" logic (e.g. auto-closing tasks at some threshold) — humans
  decide when something is genuinely resolved, via the accept/request-revision actions.
