/**
 * The research queue answers one question for a distributed research team: "what should I work on
 * next?" It is deliberately not a project-management system — no sprints, no per-user accounts, no
 * notifications. Just a shared, persistent list of research tasks with a status a researcher can
 * update themselves. See docs/RESEARCH_SOP.md for how a task moves through these statuses.
 */
export interface ResearchTaskStatus {
  status: string;
  label: string;
}

export const RESEARCH_TASK_STATUSES: ResearchTaskStatus[] = [
  { status: "unassigned", label: "Unassigned" },
  { status: "in_progress", label: "In Progress" },
  { status: "awaiting_review", label: "Awaiting Review" },
  { status: "complete", label: "Complete" },
  { status: "unavailable", label: "Unavailable" },
];

export const RESEARCH_TASK_STATUS_SLUGS = RESEARCH_TASK_STATUSES.map((s) => s.status);

export interface ResearchTaskTypeOption {
  type: string;
  label: string;
}

export const RESEARCH_TASK_TYPES: ResearchTaskTypeOption[] = [
  { type: "metric", label: "Metric" },
  { type: "pipeline_assessment", label: "Pipeline Assessment" },
];

export interface ResearchTask {
  id: string;
  jurisdictionSlug: string;
  jurisdictionName: string;
  policyAreaSlug: string | null;
  policyAreaName: string | null;
  metricSlug: string | null;
  metricName: string | null;
  taskType: string;
  researchQuestion: string;
  priority: number;
  status: string;
  assignedResearcher: string | null;
  sourceStatus: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
