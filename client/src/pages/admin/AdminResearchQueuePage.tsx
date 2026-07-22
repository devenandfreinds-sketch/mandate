import { useState } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminLogout } from "@/hooks/useAdminAuth";
import { useResearchQueue, useUpdateResearchTask } from "@/hooks/useResearchQueue";
import { formatUtcDate } from "@/lib/utils";
import { RESEARCH_TASK_STATUSES } from "@mandate/shared";
import type { ResearchTask } from "@mandate/shared";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  unassigned: "outline",
  in_progress: "secondary",
  awaiting_review: "default",
  complete: "default",
  unavailable: "destructive",
};

export function AdminResearchQueuePage() {
  const logout = useAdminLogout();
  const { data: tasks, isLoading } = useResearchQueue();
  const update = useUpdateResearchTask();
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = tasks?.filter((t) => statusFilter === "all" || t.status === statusFilter) ?? [];

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
          <Button variant="outline" size="sm" onClick={() => logout.mutate()}>
            Log out
          </Button>
        </div>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        What to work on next, ranked by priority. Pick an unassigned task, put your name on it, and update its
        status as you go — this list is shared by the whole research team, not a personal to-do list.
      </p>

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
                <TableHead>Source status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <ResearchTaskRow key={t.id} task={t} onUpdate={update.mutate} />
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </PageContainer>
  );
}

function ResearchTaskRow({
  task,
  onUpdate,
}: {
  task: ResearchTask;
  onUpdate: (payload: { id: string; status?: string; assignedResearcher?: string | null; sourceStatus?: string | null; notes?: string | null }) => void;
}) {
  const [assignedResearcher, setAssignedResearcher] = useState(task.assignedResearcher ?? "");
  const [sourceStatus, setSourceStatus] = useState(task.sourceStatus ?? "");
  const [notes, setNotes] = useState(task.notes ?? "");

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
          onChange={(e) => onUpdate({ id: task.id, status: e.target.value })}
          className="rounded-md border border-border bg-background px-2 py-1 text-xs"
        >
          {RESEARCH_TASK_STATUSES.map((s) => (
            <option key={s.status} value={s.status}>
              {s.label}
            </option>
          ))}
        </select>
        <Badge variant={STATUS_VARIANT[task.status] ?? "outline"} className="ml-2">
          {RESEARCH_TASK_STATUSES.find((s) => s.status === task.status)?.label ?? task.status}
        </Badge>
      </TableCell>
      <TableCell>
        <input
          value={assignedResearcher}
          onChange={(e) => setAssignedResearcher(e.target.value)}
          onBlur={() => onUpdate({ id: task.id, assignedResearcher: assignedResearcher || null })}
          placeholder="Name"
          className="w-28 rounded-md border border-border bg-background px-2 py-1 text-xs"
        />
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
