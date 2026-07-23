import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminLogout } from "@/hooks/useAdminAuth";
import { useResearchQueue, useUpdateResearchTask, useAcceptResearchTask, useRequestRevision } from "@/hooks/useResearchQueue";
import { useUsers } from "@/hooks/useUsers";
import { useResearchHealth } from "@/hooks/useResearchHealth";
import { formatUtcDate } from "@/lib/utils";
import { RESEARCH_TASK_STATUSES } from "@mandate/shared";
import type { ResearchTask } from "@mandate/shared";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  unassigned: "outline",
  in_progress: "secondary",
  awaiting_review: "default",
  changes_requested: "destructive",
  complete: "default",
  unavailable: "destructive",
};

const VIEWING_AS_KEY = "mandate_viewing_as_user_id";

/** "complete" is set only via the accept action (see researchTask.service.ts), never a direct status pick — this is what keeps "submitted" and "verified" from being conflated in the data. */
const SELECTABLE_STATUSES = RESEARCH_TASK_STATUSES.filter((s) => s.status !== "complete");

interface UpdatePayload {
  id: string;
  status?: string;
  assignedResearcher?: string | null;
  assignedResearcherId?: string | null;
  reviewerId?: string | null;
  sourceStatus?: string | null;
  notes?: string | null;
}

export function AdminResearchQueuePage() {
  const logout = useAdminLogout();
  const { data: tasks, isLoading } = useResearchQueue();
  const { data: users } = useUsers();
  const { data: health } = useResearchHealth();
  const update = useUpdateResearchTask();
  const accept = useAcceptResearchTask();
  const requestRevision = useRequestRevision();
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewingAs, setViewingAs] = useState<string>(() => localStorage.getItem(VIEWING_AS_KEY) ?? "");

  function handleViewingAsChange(id: string) {
    setViewingAs(id);
    if (id) localStorage.setItem(VIEWING_AS_KEY, id);
    else localStorage.removeItem(VIEWING_AS_KEY);
  }

  const filtered = tasks?.filter((t) => statusFilter === "all" || t.status === statusFilter) ?? [];

  const myAssigned = useMemo(() => (tasks ?? []).filter((t) => viewingAs && t.assignedResearcherId === viewingAs), [tasks, viewingAs]);
  const myInProgress = myAssigned.filter((t) => t.status === "in_progress" || t.status === "changes_requested");
  const myAwaitingReview = myAssigned.filter((t) => t.status === "awaiting_review");
  const myRecentlyAccepted = myAssigned
    .filter((t) => t.status === "complete")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  const myReviewQueue = useMemo(
    () => (tasks ?? []).filter((t) => viewingAs && t.reviewerId === viewingAs && t.status === "awaiting_review"),
    [tasks, viewingAs]
  );

  function handleAccept(taskId: string) {
    accept.mutate({ id: taskId, reviewerId: viewingAs || undefined });
  }
  function handleRequestRevision(taskId: string) {
    const reviewNotes = window.prompt("What needs to change before this can be accepted?") ?? undefined;
    requestRevision.mutate({ id: taskId, reviewerId: viewingAs || undefined, reviewNotes });
  }

  const unassignedCount = (tasks ?? []).filter((t) => t.status === "unassigned").length;
  const needsReviewerCount = (tasks ?? []).filter((t) => t.status === "awaiting_review" && !t.reviewerId).length;

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin — Research Queue</h1>
        <div className="flex items-center gap-3">
          <Link to="/admin/pipeline" className="text-sm text-muted-foreground hover:underline">
            ← Pipeline Assessments
          </Link>
          <Link to="/admin/imports" className="text-sm text-muted-foreground hover:underline">
            Data Imports
          </Link>
          <Link to="/admin/users" className="text-sm text-muted-foreground hover:underline">
            Researchers
          </Link>
          <Button variant="outline" size="sm" onClick={() => logout.mutate()}>
            Log out
          </Button>
        </div>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        What to work on next, ranked by priority. Pick an unassigned task, put your name on it, and update its
        status as you go — this list is shared by the whole research team, not a personal to-do list.
      </p>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Viewing as:</span>
        <select
          value={viewingAs}
          onChange={(e) => handleViewingAsChange(e.target.value)}
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
        >
          <option value="">— nobody selected —</option>
          {(users ?? []).map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">(stored on this device only — not an authentication mechanism)</span>
      </div>

      {viewingAs && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">My Work</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <MyWorkList title="In Progress" tasks={myInProgress} empty="Nothing in progress." />
            <MyWorkList title="Awaiting Review" tasks={myAwaitingReview} empty="Nothing submitted and waiting on a reviewer." />
            <MyWorkList title="Recently Accepted" tasks={myRecentlyAccepted} empty="Nothing accepted yet." />
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">To Review</h3>
              {myReviewQueue.length === 0 && <p className="text-sm text-muted-foreground">Nothing waiting on your review.</p>}
              <ul className="space-y-2 text-sm">
                {myReviewQueue.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-2 rounded-md border border-border p-2">
                    <span>
                      {t.jurisdictionName} — {t.policyAreaName ?? t.metricName ?? "—"}
                    </span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleAccept(t.id)}>
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleRequestRevision(t.id)}>
                        Request Revision
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Team Tasks</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setStatusFilter("unassigned")}
            className="rounded-md border border-border p-3 text-left hover:bg-accent"
          >
            <div className="text-2xl font-semibold">{unassignedCount}</div>
            <div className="text-xs text-muted-foreground">Unassigned — pick one up</div>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("awaiting_review")}
            className="rounded-md border border-border p-3 text-left hover:bg-accent"
          >
            <div className="text-2xl font-semibold">{needsReviewerCount}</div>
            <div className="text-xs text-muted-foreground">Awaiting review, no reviewer assigned yet</div>
          </button>
        </CardContent>
      </Card>

      {health && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Research &amp; System Health</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-md border border-border p-3">
              <div className="text-2xl font-semibold">
                {health.pipelineCoverage.researchedPairs}/{health.pipelineCoverage.totalPairs}
              </div>
              <div className="text-xs text-muted-foreground">Pipeline coverage (researched jurisdiction × policy area pairs)</div>
            </div>
            <div className="rounded-md border border-border p-3">
              <div className="text-2xl font-semibold">{health.staleAssessments.length + health.staleMetrics.length}</div>
              <div className="text-xs text-muted-foreground">Stale — past their next-review date</div>
            </div>
            <div className="rounded-md border border-border p-3">
              <div className="text-2xl font-semibold">{health.missingEvidence.length}</div>
              <div className="text-xs text-muted-foreground">Current assessments above stage 0 with no cited evidence</div>
            </div>
            <div className="rounded-md border border-border p-3">
              <div className="text-2xl font-semibold">{health.unavailableMetricPairCount}</div>
              <div className="text-xs text-muted-foreground">Metric × jurisdiction pairs marked unavailable</div>
            </div>
          </CardContent>
          {health.pipelineCoverage.unresearchedPairs.length > 0 && (
            <CardContent className="border-t border-border pt-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Unresearched policy areas (candidates for the next roadmap pass):</p>
              <div className="flex flex-wrap gap-2">
                {health.pipelineCoverage.unresearchedPairs.slice(0, 20).map((p) => (
                  <Badge key={`${p.jurisdictionSlug}-${p.policyAreaSlug}`} variant="outline">
                    {p.jurisdictionName} · {p.policyAreaName}
                  </Badge>
                ))}
                {health.pipelineCoverage.unresearchedPairs.length > 20 && (
                  <span className="text-xs text-muted-foreground">+{health.pipelineCoverage.unresearchedPairs.length - 20} more</span>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          {RESEARCH_TASK_STATUSES.map((s) => (
            <TabsTrigger key={s.status} value={s.status}>
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card className="mt-6">
        {isLoading && <p className="p-4 text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && filtered.length === 0 && <p className="p-4 text-sm text-muted-foreground">No tasks in this view.</p>}
        {filtered.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pri.</TableHead>
                <TableHead>Jurisdiction / Target</TableHead>
                <TableHead>Research question</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned to</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Source status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <ResearchTaskRow
                  key={t.id}
                  task={t}
                  users={users ?? []}
                  onUpdate={update.mutate}
                  onAccept={() => handleAccept(t.id)}
                  onRequestRevision={() => handleRequestRevision(t.id)}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </PageContainer>
  );
}

function MyWorkList({ title, tasks, empty }: { title: string; tasks: ResearchTask[]; empty: string }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-muted-foreground">{title}</h3>
      {tasks.length === 0 && <p className="text-sm text-muted-foreground">{empty}</p>}
      <ul className="space-y-1 text-sm">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-2">
            <span>
              {t.jurisdictionName} — {t.policyAreaName ?? t.metricName ?? "—"}
            </span>
            {t.revisionCount > 0 && <span className="text-xs text-muted-foreground">rev. {t.revisionCount}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResearchTaskRow({
  task,
  users,
  onUpdate,
  onAccept,
  onRequestRevision,
}: {
  task: ResearchTask;
  users: Array<{ id: string; name: string; isActive: boolean }>;
  onUpdate: (payload: UpdatePayload) => void;
  onAccept: () => void;
  onRequestRevision: () => void;
}) {
  const [assignedResearcher, setAssignedResearcher] = useState(task.assignedResearcher ?? "");
  const [sourceStatus, setSourceStatus] = useState(task.sourceStatus ?? "");
  const [notes, setNotes] = useState(task.notes ?? "");
  const activeUsers = users.filter((u) => u.isActive);

  return (
    <TableRow>
      <TableCell className="text-muted-foreground">{task.priority}</TableCell>
      <TableCell>
        <div className="font-medium">{task.jurisdictionName}</div>
        <div className="text-xs text-muted-foreground">{task.policyAreaName ?? task.metricName ?? "—"}</div>
      </TableCell>
      <TableCell className="max-w-md text-sm text-muted-foreground">{task.researchQuestion}</TableCell>
      <TableCell>
        <select
          value={task.status}
          disabled={task.status === "complete"}
          onChange={(e) => onUpdate({ id: task.id, status: e.target.value })}
          className="rounded-md border border-border bg-background px-2 py-1 text-xs disabled:opacity-60"
        >
          {(task.status === "complete" ? RESEARCH_TASK_STATUSES : SELECTABLE_STATUSES).map((s) => (
            <option key={s.status} value={s.status}>
              {s.label}
            </option>
          ))}
        </select>
        <Badge variant={STATUS_VARIANT[task.status] ?? "outline"} className="ml-2">
          {RESEARCH_TASK_STATUSES.find((s) => s.status === task.status)?.label ?? task.status}
        </Badge>
        {task.revisionCount > 0 && <span className="ml-2 text-xs text-muted-foreground">rev. {task.revisionCount}</span>}
        {task.status === "awaiting_review" && (
          <div className="mt-1 flex gap-1">
            <Button size="sm" variant="outline" className="h-6 px-2 text-xs" onClick={onAccept}>
              Accept
            </Button>
            <Button size="sm" variant="outline" className="h-6 px-2 text-xs" onClick={onRequestRevision}>
              Request Revision
            </Button>
          </div>
        )}
      </TableCell>
      <TableCell>
        <select
          value={task.assignedResearcherId ?? ""}
          onChange={(e) => onUpdate({ id: task.id, assignedResearcherId: e.target.value || null })}
          className="mb-1 w-32 rounded-md border border-border bg-background px-2 py-1 text-xs"
        >
          <option value="">— unassigned —</option>
          {activeUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <input
          value={assignedResearcher}
          onChange={(e) => setAssignedResearcher(e.target.value)}
          onBlur={() => onUpdate({ id: task.id, assignedResearcher: assignedResearcher || null })}
          placeholder="or free-text name"
          className="w-32 rounded-md border border-border bg-background px-2 py-1 text-xs"
        />
      </TableCell>
      <TableCell>
        <select
          value={task.reviewerId ?? ""}
          onChange={(e) => onUpdate({ id: task.id, reviewerId: e.target.value || null })}
          className="w-32 rounded-md border border-border bg-background px-2 py-1 text-xs"
        >
          <option value="">— none —</option>
          {activeUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </TableCell>
      <TableCell>
        <input
          value={sourceStatus}
          onChange={(e) => setSourceStatus(e.target.value)}
          onBlur={() => onUpdate({ id: task.id, sourceStatus: sourceStatus || null })}
          placeholder="e.g. Tier 1 source found"
          className="w-40 rounded-md border border-border bg-background px-2 py-1 text-xs"
        />
      </TableCell>
      <TableCell>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => onUpdate({ id: task.id, notes: notes || null })}
          placeholder="Notes"
          className="w-40 rounded-md border border-border bg-background px-2 py-1 text-xs"
        />
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">{formatUtcDate(task.updatedAt)}</TableCell>
    </TableRow>
  );
}
