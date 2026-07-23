# The Mandate Research Network

**Purpose of this document.** Mandate's long-term ambition is to become the "Bloomberg of municipal
governance" — a durable, continuously maintained institutional knowledge system, not a short-lived
student research project. That requires two distinct contribution layers working together: an
**internal research organization** that builds and maintains the knowledge base under a shared
methodology, and an **external research network** that challenges, tests, and enriches it from
outside. This document explains both, why they're structurally different (not just two permission
levels), and how the software supports the distinction. Written to be readable by a future Mandate
researcher who has never met the founders — see `docs/MANDATE_OPERATING_SYSTEM.md` for the broader
organizational architecture this extends.

---

## 1. Internal Researchers

Internal researchers are formally part of Mandate's research organization. They're trained in
Mandate's common methodology (`docs/PIPELINE_METHODOLOGY.md`, `docs/RESEARCH_SOP.md`) and work
directly within Mandate's infrastructure: the Research Queue, the admin research tools, the source
registry.

The initial primary talent pipeline is:

**DePaul University → Purdue University → Illinois State University**

Internal researchers' work includes:

- Maintaining the core municipal governance dataset (`MetricValue` rows)
- Researching individual metrics and building jurisdiction profiles
- Conducting governance-model comparisons
- Maintaining the source registry (`Source`)
- Validating data against Mandate's data-quality vocabulary
- Researching and maintaining the Institutional Pipeline Index (`PipelineAssessment`)
- Producing Mandate reports
- Maintaining institutional memory — the accumulated, defensible record of what's been researched
  and why

Internal researchers work asynchronously (see `docs/MANDATE_OPERATING_SYSTEM.md`, "Async First").
Another internal researcher reviews each submission before it enters the knowledge base. **The core
principle: internal researchers build institutional memory.**

## 2. External Researchers

External researchers are not necessarily members of the Mandate organization. They may be professors,
graduate students, researchers at other universities, think-tank researchers, practitioners,
independent researchers, journalists, international scholars, or subject-matter experts.

Potential external networks include NYU, Tulane, Georgetown, University of Michigan, University of
Chicago, international universities, think tanks, and professional networks.

External contributors may critique Mandate's methodology, suggest new metrics, contribute datasets,
review reports, provide domain expertise, identify methodological weaknesses, challenge Mandate's
interpretations, suggest alternative sources, provide expert commentary, or flag potential data
errors.

**External contributions never automatically become authoritative Mandate data.** They enter the
external contribution/review workflow (§6) and are evaluated by the internal research organization
before anything is incorporated. **The core principle: external researchers expand, challenge, and
enrich institutional memory.**

## 3. The Critical Distinction

Internal and External are not two permission levels — they're two different *functions*:

| | Internal | External |
|---|---|---|
| Provides | Continuity, institutional memory, methodological consistency, core dataset maintenance, long-term ownership | Diversity, intellectual challenge, domain expertise, methodological criticism, alternative perspectives |
| Asks | "How should Mandate measure and maintain this?" | "Is Mandate measuring this correctly?" |

Both are necessary. An organization with only internal researchers drifts into groupthink about its
own methodology; an organization that only takes external input never builds anything durable enough
to be worth critiquing.

## 4. Software Architecture: Affiliation vs. Role

Two independent fields on `User` (`server/prisma/schema.prisma`):

- **`affiliation`** (`internal` | `external`) — WHO this person is to the organization.
- **`role`** (`researcher` | `reviewer` | `jurisdiction_lead` | `methodology_lead` | `admin` |
  `advisor` | `practitioner` | `contributor`) — WHAT they're capable of doing.

Affiliation never determines role. Examples from the spec this document implements:

| Person | Affiliation | Role |
|---|---|---|
| Founder | Internal | Admin |
| Founding team member | Internal | Admin |
| Internal researcher | Internal | Researcher |
| Trusted internal reviewer | Internal | Reviewer |
| Professor | External | Advisor |
| External academic | External | Researcher |
| Municipal practitioner | External | Practitioner |
| Independent analyst | External | Contributor |

Most external contributors never get a `User` row at all — the `ExternalContribution` model (§6)
carries a free-text `contributorName`/`contributorEmail`/`contributorAffiliation` for one-off
submitters. A `User` row with `affiliation: external` is for the smaller set of recurring external
participants worth tracking on the roster (e.g. a professor who reviews reports regularly).

This is deliberately *not* a full RBAC system — there's still one shared admin credential for the
whole team (see `docs/DECISION_OWNERSHIP.md`, "Known limitation"). `affiliation` and `role` are
roster/identity fields, the same trust model every other `User` field already uses, not a new
authorization layer.

## 5. Research Review Philosophy

**SUBMITTED ≠ VERIFIED.** A task moving to `awaiting_review` means someone did the work, not that the
work is correct. Only the accept action (`POST /admin/research-tasks/:id/accept`) moves a task to
`complete`, and Research Map coverage (`docs/RESEARCH_MAP.md`) is calculated from the underlying data
state, never from task status — accepting a task doesn't itself increase coverage; only
evidence-backed, accepted research does.

**A person can never review or accept their own submitted work.** Enforced in
`researchTask.service.ts`'s `assertNotSelfReview()`: `acceptResearchTask`, `requestRevision`, and
`updateResearchTask` all reject an attempt to set the same identity as both `assignedResearcherId` and
`reviewerId`. This is a data-integrity guard, not a security boundary — there's no per-person login
(see §4), so it compares whichever identity the caller declares, the same trust model as everything
else. The same principle applies to external contributions: a contributor with a `User` row can't
review their own submission either (`externalContribution.service.ts`).

For the founding phase, all founding team members hold `role: admin` and can conduct, review, and
manage research across the whole roster — but the self-review rule still applies to them. An admin
can review anyone else's work, including another admin's, but never their own.

## 6. External Contribution System

`ExternalContribution` (`server/prisma/schema.prisma`) is a single, deliberately lightweight table —
not a peer-review platform. One row per submission.

**Contribution types:** Methodological Critique, Dataset, Academic Research, Policy Analysis, Expert
Commentary, Source Recommendation, Data Correction, Report Review (`shared/src/types/externalContribution.ts`).

**Fields:** contributor name/email/affiliation (free text) + optional link to a `User` row, contribution
type, topic, jurisdiction (optional), description, evidence URL, relation to existing Mandate
research, limitations, status, reviewer, review notes/date.

**Workflow:**

```
External Contributor
  → Submission (POST /api/v1/external-contributions — public, no admin auth)
  → status: submitted
  → Internal Review (PATCH /api/v1/admin/external-contributions/:id — requireAdmin)
  → status: under_review → accepted / rejected / incorporated / cited
  → If accepted/incorporated: an internal researcher acts on it through the normal Research Queue
    / admin write paths — the contribution itself never mutates production data
```

The public submission endpoint intentionally does nothing but create a `submitted` row. There is no
code path from an anonymous external submission to a changed `MetricValue`, `PipelineAssessment`, or
any other production data — every actual data change still goes through the existing internal write
paths (CSV import, `/admin/pipeline`, Research Queue), operated by an internal researcher who decided
the contribution warranted it.

**Where to submit:** the public `/contribute` page, linked from the Research Map (`/research`).
**Where to review:** `/admin/external-contributions`, linked from the admin Research Queue.

## 7. The Knowledge Base Concept

Mandate should be understood internally as: **a structured, continuously maintained institutional
memory of municipal governance.** The systems that connect to form it:

- **Research Queue** (`docs/RESEARCH_SOP.md`) → how the knowledge base is built
- **Research Map** (`docs/RESEARCH_MAP.md`) → how complete the knowledge base is
- **Institutional Pipeline Index** (`docs/PIPELINE_METHODOLOGY.md`) → what the knowledge base
  concludes about institutional capacity
- **Source Registry** → where knowledge comes from
- **Evidence Links** → why conclusions are defensible
- **Reports** → how knowledge is communicated publicly
- **External Research Network** (this document, §2/§6) → how the knowledge base is challenged and
  improved from outside

No new UI was built purely to represent this concept — it's documented here and lightly integrated
(the Research Map's "Outside Mandate's Research Organization?" card, the Contribute page) rather than
given its own dashboard, per the instruction not to build unnecessary UI where existing pages already
carry the concept.

## 8. The Founding Team Admin Model

During the founding phase, founders and founding team members are internal admins
(`affiliation: internal`, `role: admin`) — full research and administrative capability across the
roster: they can conduct, review, and manage research, add Source Registry entries, and resolve
disputes. See `docs/DECISION_OWNERSHIP.md` for the full decision-rights matrix (its `founder` column
is this same `role: admin` value — "founder" there is an organizational title, not a distinct system
role).

The one restriction that applies even to admins: **a person can never accept or review their own
submitted research** (§5). As the team grows past the founding phase, review authority for a specific
researcher's work can shift explicitly to another researcher once their judgment is demonstrated (see
`docs/DECISION_OWNERSHIP.md`'s review-assignment discussion) — that's a deliberate decision, not
something that should drift by default.

## 9. Future Talent Pipeline

Documented, not over-engineered — there is no separate database table or scoring system for this.

**Primary internal pipeline:** DePaul → Purdue → Illinois State. Responsible for institutional
continuity — the researchers who maintain the dataset year over year.

**External intellectual network:** NYU → Tulane → Georgetown → Michigan → UChicago → international
universities → think tanks → practitioners. Provides intellectual diversity and challenge.

**Do not turn this into a prestige hierarchy.** Mandate recruits for demonstrated ability, curiosity,
reliability, and intellectual independence — the same criteria the researcher certification ladder
already uses (`shared/src/types/user.ts`'s `CERTIFICATION_LEVELS`), not university prestige. The named
schools are a starting talent pipeline, not a ranking of whose research counts more.

## What was intentionally deferred

- **Per-person login.** Still one shared admin credential; `affiliation`/`role` are identity fields,
  not an authorization system (see §4, `docs/DECISION_OWNERSHIP.md`).
- **A full peer-review platform for external contributions.** One flat table, one review action —
  by design (§6).
- **Automatic incorporation of any external contribution into production data.** Always requires an
  internal researcher to act on it explicitly through the existing write paths.
- **A jurisdiction-specific or contribution-count-based reputation system for external contributors.**
  Not requested and would cut against "gamify the mission, not the researcher" (`docs/RESEARCH_MAP.md`).
