import { prisma } from "../db.js";
import { toIso } from "../utils/serialize.js";
import { RESEARCH_TASK_STATUS_SLUGS } from "@mandate/shared";
import type { ResearchTask } from "@mandate/shared";
import type { Prisma } from "@prisma/client";

const TASK_INCLUDE = {
  jurisdiction: { select: { slug: true, name: true } },
  policyArea: { select: { slug: true, name: true } },
  metricDefinition: { select: { slug: true, name: true } },
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
    sourceStatus: t.sourceStatus,
    notes: t.notes,
    createdAt: toIso(t.createdAt),
    updatedAt: toIso(t.updatedAt),
  };
}

/** Ordered so "what should I work on next" reads top-to-bottom: open work first, highest priority first. */
const STATUS_SORT_RANK: Record<string, number> = {
  in_progress: 0,
  unassigned: 1,
  awaiting_review: 2,
  complete: 3,
  unavailable: 4,
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

export interface UpdateResearchTaskInput {
  status?: string;
  assignedResearcher?: string | null;
  sourceStatus?: string | null;
  notes?: string | null;
}

export async function updateResearchTask(id: string, input: UpdateResearchTaskInput): Promise<ResearchTask> {
  if (input.status !== undefined && !RESEARCH_TASK_STATUS_SLUGS.includes(input.status)) {
    throw new RangeError(`status must be one of ${RESEARCH_TASK_STATUS_SLUGS.join(", ")}, got "${input.status}"`);
  }

  const existing = await prisma.researchTask.findUnique({ where: { id } });
  if (!existing) throw new ResearchTaskNotFoundError(`Research task "${id}" not found`);

  const updated = await prisma.researchTask.update({
    where: { id },
    data: {
      status: input.status,
      assignedResearcher: input.assignedResearcher,
      sourceStatus: input.sourceStatus,
      notes: input.notes,
    },
    include: TASK_INCLUDE,
  });

  return mapTask(updated);
}
