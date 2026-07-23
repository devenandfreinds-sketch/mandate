import { prisma } from "../db.js";
import { toIso } from "../utils/serialize.js";
import { RESEARCH_TASK_STATUS_SLUGS } from "@mandate/shared";
import type { ResearchTask } from "@mandate/shared";
import type { Prisma } from "@prisma/client";

const TASK_INCLUDE = {
  jurisdiction: { select: { slug: true, name: true } },
  policyArea: { select: { slug: true, name: true } },
  metricDefinition: { select: { slug: true, name: true } },
  assignedResearcherUser: { select: { id: true, name: true } },
  reviewer: { select: { id: true, name: true } },
} satisfies Prisma.ResearchTaskInclude;

type TaskRow = Prisma.ResearchTaskGetPayload<{ include: typeof TASK_INCLUDE }>;

function mapTask(t: TaskRow): ResearchTask {
  return {
    id: t.id,
    jurisdictionSlug: t.jurisdiction.slug,
    jurisdictionName: t.jurisdiction.name,
    policyAreaSlug: t.policyArea?.slug ?? null,
    policyAreaName: t.policyArea?.name ?? null,
    metricSlug: t.metricDefinition?.slug ?? null,
    metricName: t.metricDefinition?.name ?? null,
    taskType: t.taskType,
    researchQuestion: t.researchQuestion,
    priority: t.priority,
    status: t.status,
    assignedResearcher: t.assignedResearcher,
    assignedResearcherId: t.assignedResearcherId,
    assignedResearcherName: t.assignedResearcherUser?.name ?? null,
    reviewerId: t.reviewerId,
    reviewerName: t.reviewer?.name ?? null,
    sourceStatus: t.sourceStatus,
    notes: t.notes,
    revisionCount: t.revisionCount,
    methodologyVersion: t.methodologyVersion,
    dueDate: toIso(t.dueDate),
    nextReviewDate: toIso(t.nextReviewDate),
    submittedAt: toIso(t.submittedAt),
    reviewedAt: toIso(t.reviewedAt),
    reviewNotes: t.reviewNotes,
    createdAt: toIso(t.createdAt),
    updatedAt: toIso(t.updatedAt),
  };
}

/** Ordered so "what should I work on next" reads top-to-bottom: open work first, highest priority first. */
const STATUS_SORT_RANK: Record<string, number> = {
  in_progress: 0,
  changes_requested: 1,
  unassigned: 2,
  awaiting_review: 3,
  complete: 4,
  unavailable: 5,
};

export async function listResearchTasks(): Promise<ResearchTask[]> {
  const rows = await prisma.researchTask.findMany({
    include: TASK_INCLUDE,
    orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
  });
  return rows
    .map(mapTask)
    .sort((a, b) => (STATUS_SORT_RANK[a.status] ?? 5) - (STATUS_SORT_RANK[b.status] ?? 5) || a.priority - b.priority);
}

export class ResearchTaskNotFoundError extends Error {}
export class ResearchTaskStateError extends Error {}

export interface UpdateResearchTaskInput {
  status?: string;
  assignedResearcher?: string | null;
  assignedResearcherId?: string | null;
  reviewerId?: string | null;
  sourceStatus?: string | null;
  notes?: string | null;
  dueDate?: Date | null;
  nextReviewDate?: Date | null;
}

/**
 * Every status transition here is self-service by design (see docs/MANDATE_OPERATING_SYSTEM.md,
 * "Async First") — no second-party gate blocks a researcher from moving their own task forward.
 * Two pieces of bookkeeping this function enforces automatically, so nobody has to remember to log
 * them by hand:
 *  - moving to "changes_requested" increments revisionCount
 *  - moving to "awaiting_review" stamps submittedAt (every time it's re-submitted, not just once)
 * This function deliberately does NOT set reviewedAt/reviewNotes or move a task to "complete" —
 * that is the acceptResearchTask()/requestRevision() actions below, so "submitted" (self-service)
 * and "reviewed" (a distinct decision) can never be conflated in the data itself.
 */
export async function updateResearchTask(id: string, input: UpdateResearchTaskInput): Promise<ResearchTask> {
  if (input.status !== undefined && !RESEARCH_TASK_STATUS_SLUGS.includes(input.status)) {
    throw new RangeError(`status must be one of ${RESEARCH_TASK_STATUS_SLUGS.join(", ")}, got "${input.status}"`);
  }
  if (input.status === "complete") {
    throw new ResearchTaskStateError(
      'A task cannot be marked "complete" directly — use the accept action (POST /admin/research-tasks/:id/accept), which is how Mandate keeps "submitted" distinct from "verified."'
    );
  }

  const existing = await prisma.researchTask.findUnique({ where: { id } });
  if (!existing) throw new ResearchTaskNotFoundError(`Research task "${id}" not found`);

  const updated = await prisma.researchTask.update({
    where: { id },
    data: {
      status: input.status,
      assignedResearcher: input.assignedResearcher,
      assignedResearcherId: input.assignedResearcherId,
      reviewerId: input.reviewerId,
      sourceStatus: input.sourceStatus,
      notes: input.notes,
      dueDate: input.dueDate,
      nextReviewDate: input.nextReviewDate,
      revisionCount:
        input.status === "changes_requested" && existing.status !== "changes_requested"
          ? { increment: 1 }
          : undefined,
      submittedAt: input.status === "awaiting_review" ? new Date() : undefined,
    },
    include: TASK_INCLUDE,
  });

  return mapTask(updated);
}

/**
 * The "ACCEPTED" half of SUBMITTED -> REVIEW -> ACCEPTED/NEEDS REVISION. Only valid from
 * "awaiting_review" — this is what actually moves a task to "complete," deliberately kept out of
 * the generic updateResearchTask() above. Accepting the TASK does not, by itself, change any
 * MetricValue/PipelineAssessment row's dataQuality/isPlaceholder — those are set independently when
 * the researcher published the underlying data (via CSV import or /admin/pipeline). This action
 * only marks the queue item itself as reviewed and done; Research Map coverage is always derived
 * from the underlying data state, never from this task status (see researchProgress.service.ts).
 */
export async function acceptResearchTask(id: string, reviewerId?: string | null): Promise<ResearchTask> {
  const existing = await prisma.researchTask.findUnique({ where: { id } });
  if (!existing) throw new ResearchTaskNotFoundError(`Research task "${id}" not found`);
  if (existing.status !== "awaiting_review") {
    throw new ResearchTaskStateError(`Only a task with status "awaiting_review" can be accepted (this task is "${existing.status}").`);
  }

  const updated = await prisma.researchTask.update({
    where: { id },
    data: {
      status: "complete",
      reviewedAt: new Date(),
      reviewerId: reviewerId ?? existing.reviewerId,
    },
    include: TASK_INCLUDE,
  });
  return mapTask(updated);
}

/** The "NEEDS REVISION" half. Only valid from "awaiting_review"; increments revisionCount like any other changes_requested transition. */
export async function requestRevision(id: string, reviewerId?: string | null, reviewNotes?: string | null): Promise<ResearchTask> {
  const existing = await prisma.researchTask.findUnique({ where: { id } });
  if (!existing) throw new ResearchTaskNotFoundError(`Research task "${id}" not found`);
  if (existing.status !== "awaiting_review") {
    throw new ResearchTaskStateError(`Only a task with status "awaiting_review" can have revisions requested (this task is "${existing.status}").`);
  }

  const updated = await prisma.researchTask.update({
    where: { id },
    data: {
      status: "changes_requested",
      revisionCount: { increment: 1 },
      reviewedAt: new Date(),
      reviewerId: reviewerId ?? existing.reviewerId,
      reviewNotes: reviewNotes ?? existing.reviewNotes,
    },
    include: TASK_INCLUDE,
  });
  return mapTask(updated);
}
