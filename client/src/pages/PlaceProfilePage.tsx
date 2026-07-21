import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdministrationTimeline } from "@/components/governance/AdministrationTimeline";
import { CampaignPromiseList } from "@/components/governance/CampaignPromiseList";
import { CategorySection } from "@/components/governance/CategorySection";
import { SourceCitation } from "@/components/governance/SourceCitation";
import { DataQualityBadge } from "@/components/governance/DataQualityBadge";
import { PipelineStageBadge } from "@/components/charts/PipelineStageBadge";
import { buttonClassName } from "@/components/ui/button";
import { useAdministrationDetail, usePlace } from "@/hooks/usePlace";
import { usePlaceMetrics, usePlacePipeline } from "@/hooks/usePlaceMetrics";
import { useCategories } from "@/hooks/useCategories";
import { formatMetricValue } from "@/lib/utils";
import { api } from "@/lib/api";
import type { AdministrationSummary } from "@mandate/shared";

export function PlaceProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: place, isLoading } = usePlace(slug);
  const { data: categories } = useCategories();
  const { data: pipeline } = usePlacePipeline(slug);

  const [selectedAdmin, setSelectedAdmin] = useState<AdministrationSummary | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const activeCategory = selectedCategory ?? categories?.[0]?.slug;

  const { data: seriesList } = usePlaceMetrics(slug, activeCategory, selectedAdmin?.id);

  if (isLoading) return <PageContainer><p className="text-muted-foreground">Loading…</p></PageContainer>;
  if (!place) return <PageContainer><p className="text-muted-foreground">Place not found.</p></PageContainer>;

  const admin = place.currentAdministration;

  return (
    <PageContainer>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">{place.name}</h1>
        <Badge variant="secondary">{place.governanceModelName}</Badge>
        <Badge variant="outline">{place.kind === "metro_region" ? "Metro Region" : "City"}</Badge>
      </div>
      <p className="mt-2 max-w-3xl text-muted-foreground">{place.description}</p>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Population" value={place.population ? place.population.toLocaleString() : "Unknown"} sub={place.populationYear ? `as of ${place.populationYear}` : undefined} />
        <StatCard label={admin?.leaderTitle ?? "Leader"} value={admin?.leaderName ?? "—"} sub={admin?.politicalParty ?? undefined} />
        <StatCard label="Political Coalition" value={admin?.coalitionDescription ?? "—"} />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Administration Timeline</h2>
        <p className="mb-3 text-sm text-muted-foreground">Select an administration to filter the charts below to its time in office.</p>
        <AdministrationTimeline
          administrations={place.administrations}
          selectedId={selectedAdmin?.id}
          onSelect={(a) => setSelectedAdmin((prev) => (prev?.id === a.id ? null : a))}
        />
      </section>

      {selectedAdmin && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Campaign Promises — {selectedAdmin.leaderName}</h2>
          <AdministrationCampaignPromises administrationId={selectedAdmin.id} jurisdictionSlug={slug} />
        </section>
      )}

      {pipeline && pipeline.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold">Institutional Pipeline Scores</h2>
            <Link to="/methodology/pipeline" className="text-xs text-muted-foreground hover:underline">
              How is this scored?
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {pipeline.map((p) => (
              <Link key={p.id} to={`/places/${slug}/pipeline/${p.policyAreaSlug}`}>
                <Card className="transition-colors hover:border-foreground/30">
                  <CardContent className="flex items-center justify-between gap-3 py-4">
                    <span className="text-sm font-medium">{p.policyAreaName}</span>
                    <div className="flex items-center gap-2">
                      <DataQualityBadge dataQuality={p.dataQuality} />
                      <PipelineStageBadge stage={p.stage} label={p.stageLabel} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {categories && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Historical Charts</h2>
          <Tabs value={activeCategory} onValueChange={setSelectedCategory}>
            <TabsList className="flex-wrap">
              {categories.map((c) => (
                <TabsTrigger key={c.slug} value={c.slug}>
                  {c.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="mt-4">
            <CategorySection seriesList={seriesList ?? []} />
          </div>
        </section>
      )}

      {seriesList && seriesList.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Raw Statistics</h2>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seriesList.flatMap((s) =>
                  s.values.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell>{s.metricDefinition.name}</TableCell>
                      <TableCell>{v.periodLabel}</TableCell>
                      <TableCell>{formatMetricValue(v.value, s.metricDefinition.unit, s.metricDefinition.decimalPrecision)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Downloadable Datasets</h2>
        <a
          className={buttonClassName({ variant: "outline" })}
          href={api.url(`/jurisdictions/${slug}/export?format=csv${activeCategory ? `&category=${activeCategory}` : ""}`)}
        >
          Download CSV ({categories?.find((c) => c.slug === activeCategory)?.name ?? "all"})
        </a>
      </section>

      {seriesList && seriesList.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Sources</h2>
          <ul>
            {Array.from(new Set(seriesList.flatMap((s) => s.values.map((v) => v.sourceId)))).map((id) => (
              <SourceCitation key={id} sourceId={id} />
            ))}
          </ul>
        </section>
      )}
    </PageContainer>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-lg font-semibold">{value}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </CardContent>
    </Card>
  );
}

function AdministrationCampaignPromises({ administrationId, jurisdictionSlug }: { administrationId: string; jurisdictionSlug: string | undefined }) {
  const promises = useAdministrationDetail(jurisdictionSlug, administrationId);
  if (!promises.data) return <p className="text-sm text-muted-foreground">Loading…</p>;
  return <CampaignPromiseList promises={promises.data.campaignPromises} />;
}
