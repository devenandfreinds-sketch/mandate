import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoverageBar, CoverageLegend } from "@/components/research/CoverageBar";
import { useResearchMap } from "@/hooks/useResearchMap";
import { formatUtcDate } from "@/lib/utils";
import { CURRENT_RESEARCH_FOCUS, PIPELINE_STAGE_LABELS } from "@mandate/shared";

const TASK_STATUS_LABEL: Record<string, string> = {
  in_progress: "In Progress",
  awaiting_review: "Awaiting Review",
  changes_requested: "Needs Revision",
  unassigned: "Unassigned",
};

export function ResearchMapPage() {
  const { data, isLoading } = useResearchMap();

  if (isLoading) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">Loading…</p>
      </PageContainer>
    );
  }
  if (!data) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">Research map data unavailable.</p>
      </PageContainer>
    );
  }

  const focusJurisdiction = data.jurisdictions.find((j) => j.jurisdictionSlug === CURRENT_RESEARCH_FOCUS.jurisdictionSlug);

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold">Research Map</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        What percentage of Mandate's municipal governance knowledge base has been responsibly researched — measured
        against real evidence, not placeholder data. Coverage here is calculated directly from the underlying
        research state, not from task counts.
      </p>

      {/* Overall coverage */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Overall Mandate Research Coverage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="text-4xl font-semibold tabular-nums">{data.overall.overallCoveragePercent}%</div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">Data Coverage</span>
              <span className="text-muted-foreground">{data.overall.dataCoverage.coveragePercent}%</span>
            </div>
            <CoverageBar coverage={data.overall.dataCoverage} />
            <CoverageLegend coverage={data.overall.dataCoverage} />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">Institutional Pipeline Coverage</span>
              <span className="text-muted-foreground">{data.overall.pipelineCoverage.coveragePercent}%</span>
            </div>
            <CoverageBar coverage={data.overall.pipelineCoverage} />
            <CoverageLegend coverage={data.overall.pipelineCoverage} />
          </div>
        </CardContent>
      </Card>

      {/* Current research focus */}
      {focusJurisdiction && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Current Research Focus — {CURRENT_RESEARCH_FOCUS.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{CURRENT_RESEARCH_FOCUS.objective}</p>
            <div className="flex items-center justify-between text-sm">
              <span>Overall progress</span>
              <span className="font-medium tabular-nums">{focusJurisdiction.overallCoveragePercent}%</span>
            </div>
            <CoverageBar coverage={focusJurisdiction.dataCoverage} />
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
              <span>
                Metrics measured: {focusJurisdiction.dataCoverage.measured} / {focusJurisdiction.dataCoverage.total}
              </span>
              <span>
                Institutional pipelines researched: {focusJurisdiction.pipelineCoverage.measured} / {focusJurisdiction.pipelineCoverage.total}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Jurisdiction cards */}
      <h2 className="mb-3 mt-8 text-lg font-semibold">Jurisdiction Coverage</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.jurisdictions.map((j) => (
          <Link key={j.jurisdictionSlug} to={`/research/${j.jurisdictionSlug}`} className="block">
            <Card className="h-full transition-colors hover:bg-accent/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{j.jurisdictionName}</CardTitle>
                  <span className="text-xl font-semibold tabular-nums">{j.overallCoveragePercent}%</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Data Coverage</span>
                    <span>{j.dataCoverage.coveragePercent}%</span>
                  </div>
                  <CoverageBar coverage={j.dataCoverage} />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Institutional Pipeline Coverage</span>
                    <span>{j.pipelineCoverage.coveragePercent}%</span>
                  </div>
                  <CoverageBar coverage={j.pipelineCoverage} />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
                  <span>{j.tasksInProgress} in progress</span>
                  <span>{j.tasksAwaitingReview} awaiting review</span>
                  {j.tasksNeedingRevision > 0 && <span>{j.tasksNeedingRevision} needing revision</span>}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Research frontiers */}
      <h2 className="mb-3 mt-8 text-lg font-semibold">Research Frontiers</h2>
      <p className="mb-3 -mt-2 text-sm text-muted-foreground">The most important remaining areas per jurisdiction.</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.jurisdictions.map((j) => {
          const items = data.frontiers[j.jurisdictionSlug] ?? [];
          if (items.length === 0) return null;
          return (
            <Card key={j.jurisdictionSlug}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{j.jurisdictionName}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {items.map((item) => (
                    <li key={`${item.kind}-${item.label}`} className="flex items-center justify-between gap-2">
                      <span>{item.label}</span>
                      {item.hasOpenTask ? (
                        <Badge variant="outline" className="shrink-0 text-xs">
                          task open
                        </Badge>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active research */}
      <h2 className="mb-3 mt-8 text-lg font-semibold">Active Research</h2>
      <Card>
        <CardContent className="p-0">
          {data.activeResearch.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No open tasks in progress right now.</p>
          ) : (
            <ul className="divide-y divide-border">
              {data.activeResearch.map((t) => (
                <li key={t.taskId} className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm">
                  <span>
                    <span className="font-medium">{t.jurisdictionName}</span> — {t.label}
                  </span>
                  <Badge variant={t.status === "awaiting_review" ? "default" : "secondary"}>{TASK_STATUS_LABEL[t.status] ?? t.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Recently verified */}
      <h2 className="mb-3 mt-8 text-lg font-semibold">Recently Verified</h2>
      <Card>
        <CardContent className="p-0">
          {data.recentlyVerified.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">Nothing verified yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {data.recentlyVerified.map((v, i) => (
                <li key={i} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm">
                  <span>
                    <span className="font-medium">{v.jurisdictionName}</span> — {v.policyAreaName}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {v.stage}/5 · {PIPELINE_STAGE_LABELS[v.stage] ?? v.stageLabel}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatUtcDate(v.verifiedAt)}
                    {v.researchedByName ? ` · ${v.researchedByName}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
