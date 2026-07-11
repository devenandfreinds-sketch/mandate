import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceCard } from "@/components/governance/PlaceCard";
import { SourceCitation } from "@/components/governance/SourceCitation";
import { PipelineStageBadge } from "@/components/charts/PipelineStageBadge";
import { useGovernanceModel, usePipelineSummary } from "@/hooks/useGovernanceModel";

export function GovernanceModelDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: model, isLoading } = useGovernanceModel(slug);
  const { data: pipelineSummary } = usePipelineSummary(slug);

  if (isLoading) return <PageContainer><p className="text-muted-foreground">Loading…</p></PageContainer>;
  if (!model) return <PageContainer><p className="text-muted-foreground">Governance model not found.</p></PageContainer>;

  const sourceIds = Array.from(new Set(model.timelineEvents.map((e) => e.sourceId).filter((id): id is string => Boolean(id))));

  return (
    <PageContainer>
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: model.colorHex ?? undefined }} />
        <h1 className="text-2xl font-semibold">{model.name}</h1>
        {model.foundedYear && <Badge variant="secondary">Since {model.foundedYear}</Badge>}
      </div>
      <p className="mt-2 max-w-3xl text-muted-foreground">{model.summary}</p>

      <section className="mt-8 grid gap-6 sm:grid-cols-3">
        <TextBlock title="Overview" body={model.overview} />
        <TextBlock title="History" body={model.history} />
        <TextBlock title="Political Context" body={model.politicalContext} />
      </section>

      {model.corePriorities.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Core Priorities</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {model.corePriorities.map((p) => (
              <Card key={p.id}>
                <CardHeader>
                  <CardTitle className="text-base">{p.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{p.description}</CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Cities & Regions Included</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {model.jurisdictions.map((j) => (
            <PlaceCard key={j.id} place={j} />
          ))}
        </div>
      </section>

      {model.timelineEvents.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Timeline</h2>
          <ol className="space-y-4 border-l border-border pl-4">
            {model.timelineEvents.map((e) => (
              <li key={e.id}>
                <div className="text-xs text-muted-foreground">{new Date(e.eventDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}</div>
                <div className="font-medium">{e.title}</div>
                <p className="text-sm text-muted-foreground">{e.description}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Institutional Pipeline Analysis</h2>
        {pipelineSummary && pipelineSummary.policyAreaCount > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Average maturity stage: {pipelineSummary.averageStage.toFixed(1)} / 5
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pipelineSummary.byCategory.map((c) => (
                <div key={c.categorySlug} className="flex items-center justify-between">
                  <span className="text-sm">{c.categoryName}</span>
                  <PipelineStageBadge stage={Math.round(c.averageStage)} label={`avg across ${model.jurisdictions.length} jurisdictions`} />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <p className="text-sm text-muted-foreground">Pipeline analysis coming soon for this governance model.</p>
        )}
      </section>

      {sourceIds.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Supporting Documentation</h2>
          <ul>
            {sourceIds.map((id) => (
              <SourceCitation key={id} sourceId={id} />
            ))}
          </ul>
        </section>
      )}
    </PageContainer>
  );
}

function TextBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      <p className="mt-1 text-sm">{body}</p>
    </div>
  );
}
