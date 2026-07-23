import { useState } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminLogout } from "@/hooks/useAdminAuth";
import { useExternalContributions, useReviewExternalContribution } from "@/hooks/useExternalContributions";
import { useUsers } from "@/hooks/useUsers";
import { formatUtcDate } from "@/lib/utils";
import { CONTRIBUTION_STATUSES, CONTRIBUTION_TYPES } from "@mandate/shared";
import type { ExternalContribution } from "@mandate/shared";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  submitted: "outline",
  under_review: "secondary",
  accepted: "default",
  rejected: "destructive",
  incorporated: "default",
  cited: "secondary",
};

/**
 * Internal review queue for docs/MANDATE_RESEARCH_NETWORK.md's external contribution workflow.
 * Nothing here directly mutates production research data -- accepting/incorporating a
 * contribution is a signal for an internal researcher to act on it through the normal Research
 * Queue / admin write paths, not an automatic data change.
 */
export function AdminExternalContributionsPage() {
  const logout = useAdminLogout();
  const { data: contributions, isLoading } = useExternalContributions();
  const { data: users } = useUsers();
  const review = useReviewExternalContribution();
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = (contributions ?? []).filter((c) => statusFilter === "all" || c.status === statusFilter);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin — External Contributions</h1>
        <div className="flex items-center gap-3">
          <Link to="/admin/research-queue" className="text-sm text-muted-foreground hover:underline">
            ← Research Queue
          </Link>
          <Button variant="outline" size="sm" onClick={() => logout.mutate()}>
            Log out
          </Button>
        </div>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Submissions from outside Mandate's research organization — critiques, datasets, corrections, expert
        commentary. Review each one and move it through the workflow; accepting or incorporating a contribution
        does not by itself change any published data.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant={statusFilter === "all" ? "default" : "outline"} onClick={() => setStatusFilter("all")}>
          All
        </Button>
        {CONTRIBUTION_STATUSES.map((s) => (
          <Button key={s.status} size="sm" variant={statusFilter === s.status ? "default" : "outline"} onClick={() => setStatusFilter(s.status)}>
            {s.label}
          </Button>
        ))}
      </div>

      <Card className="mt-4">
        {isLoading && <p className="p-4 text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && filtered.length === 0 && <p className="p-4 text-sm text-muted-foreground">No contributions in this view.</p>}
        {filtered.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submitted</TableHead>
                <TableHead>Contributor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reviewer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <ContributionRow
                  key={c.id}
                  contribution={c}
                  users={users ?? []}
                  onReview={review.mutate}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </PageContainer>
  );
}

function ContributionRow({
  contribution,
  users,
  onReview,
}: {
  contribution: ExternalContribution;
  users: Array<{ id: string; name: string; isActive: boolean }>;
  onReview: (payload: { id: string; status?: string; reviewerId?: string | null; reviewNotes?: string | null }) => void;
}) {
  const activeUsers = users.filter((u) => u.isActive);
  const typeLabel = CONTRIBUTION_TYPES.find((t) => t.type === contribution.contributionType)?.label ?? contribution.contributionType;

  return (
    <TableRow>
      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatUtcDate(contribution.createdAt)}</TableCell>
      <TableCell>
        <div className="font-medium">{contribution.contributorName}</div>
        {contribution.contributorAffiliation && (
          <div className="text-xs text-muted-foreground">{contribution.contributorAffiliation}</div>
        )}
      </TableCell>
      <TableCell className="text-sm">{typeLabel}</TableCell>
      <TableCell className="max-w-xs text-sm">
        <div className="font-medium">{contribution.topic}</div>
        {contribution.jurisdictionName && <div className="text-xs text-muted-foreground">{contribution.jurisdictionName}</div>}
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{contribution.description}</p>
        {contribution.evidenceUrl && (
          <a href={contribution.evidenceUrl} target="_blank" rel="noreferrer" className="mt-1 block text-xs underline">
            Evidence link
          </a>
        )}
      </TableCell>
      <TableCell>
        <select
          value={contribution.status}
          onChange={(e) => onReview({ id: contribution.id, status: e.target.value })}
          className="rounded-md border border-border bg-background px-2 py-1 text-xs"
        >
          {CONTRIBUTION_STATUSES.map((s) => (
            <option key={s.status} value={s.status}>
              {s.label}
            </option>
          ))}
        </select>
        <Badge variant={STATUS_VARIANT[contribution.status] ?? "outline"} className="ml-2">
          {CONTRIBUTION_STATUSES.find((s) => s.status === contribution.status)?.label ?? contribution.status}
        </Badge>
      </TableCell>
      <TableCell>
        <select
          value={contribution.reviewerId ?? ""}
          onChange={(e) => onReview({ id: contribution.id, reviewerId: e.target.value || null })}
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
    </TableRow>
  );
}
