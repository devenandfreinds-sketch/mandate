import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataQualityBadge, dominantDataQuality } from "@/components/governance/DataQualityBadge";
import { useDataCatalog } from "@/hooks/useDataCatalog";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";
import type { DataCatalogEntry } from "@mandate/shared";

export function DataCatalogPage() {
  const { data: catalog, isLoading } = useDataCatalog();
  const { data: categories } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [missingOnly, setMissingOnly] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const entries = useMemo(() => {
    let list = catalog?.entries ?? [];
    if (activeCategory !== "all") list = list.filter((e) => e.categorySlug === activeCategory);
    if (missingOnly) list = list.filter((e) => e.isFullyPlaceholder);
    return list;
  }, [catalog, activeCategory, missingOnly]);

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold">Data Catalog</h1>
      <p className="mt-1 max-w-3xl text-muted-foreground">
        Every metric Mandate tracks, its definition and methodology, which official source it should come from, and
        how complete real (non-placeholder) data is across the 6 tracked jurisdictions. Use this page to find
        exactly which datasets still need to be imported.
      </p>

      {catalog && (
        <section className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-6 sm:grid-cols-5">
          <Stat label="Total Metrics" value={catalog.summary.totalMetrics} />
          <Stat label="With Real Data" value={catalog.summary.metricsWithAnyRealData} />
          <Stat label="Fully Placeholder" value={catalog.summary.metricsFullyPlaceholder} accent="text-muted-foreground" />
          <Stat label="Missing a Source" value={catalog.summary.metricsMissingSource} accent="text-amber-600 dark:text-amber-400" />
          <Stat label="Avg. Completion" value={`${catalog.summary.averageCompletionPercent}%`} />
        </section>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {categories && (
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="flex-wrap">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map((c) => (
                <TabsTrigger key={c.slug} value={c.slug}>
                  {c.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={missingOnly} onChange={(e) => setMissingOnly(e.target.checked)} className="h-4 w-4 rounded border-border" />
          Missing data only
        </label>
      </div>

      {isLoading && <p className="mt-6 text-muted-foreground">Loading catalog…</p>}

      {entries.length > 0 && (
        <Card className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead />
                <TableHead>Metric</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Update Freq.</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Data Quality</TableHead>
                <TableHead>Coverage</TableHead>
                <TableHead>Years</TableHead>
                <TableHead>Completion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <CatalogRow
                  key={entry.metricSlug}
                  entry={entry}
                  isExpanded={expanded === entry.metricSlug}
                  onToggle={() => setExpanded((prev) => (prev === entry.metricSlug ? null : entry.metricSlug))}
                />
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {!isLoading && entries.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">No metrics match this filter.</p>
      )}
    </PageContainer>
  );
}

function CatalogRow({ entry, isExpanded, onToggle }: { entry: DataCatalogEntry; isExpanded: boolean; onToggle: () => void }) {
  const quality = dominantDataQuality(Object.keys(entry.dataQualityBreakdown));
  const years = entry.firstRealYear && entry.lastRealYear ? `${entry.firstRealYear}–${entry.lastRealYear}` : "No real data yet";

  return (
    <>
      <TableRow
        className={cn("cursor-pointer", entry.isFullyPlaceholder && "bg-muted/30")}
        onClick={onToggle}
      >
        <TableCell className="w-6 text-muted-foreground">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </TableCell>
        <TableCell>
          <Link
            to={`/metrics/${entry.metricSlug}`}
            onClick={(e) => e.stopPropagation()}
            className="font-medium hover:underline"
          >
            {entry.metricName}
          </Link>
        </TableCell>
        <TableCell className="text-muted-foreground">{entry.categoryName}</TableCell>
        <TableCell className="text-muted-foreground">{entry.unit}</TableCell>
        <TableCell className="text-muted-foreground">{entry.primarySource?.updateFrequency ?? "—"}</TableCell>
        <TableCell>
          {entry.primarySource ? (
            <span className="inline-flex items-center gap-1">
              {entry.primarySource.publisher ?? entry.primarySource.name}
              {entry.primarySource.url && (
                <a
                  href={entry.primarySource.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={`Open source: ${entry.primarySource.name}`}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </span>
          ) : (
            <Badge variant="destructive">No source identified</Badge>
          )}
        </TableCell>
        <TableCell>
          <DataQualityBadge dataQuality={quality} />
        </TableCell>
        <TableCell className="whitespace-nowrap">
          {entry.jurisdictionsWithRealData.length}/{entry.jurisdictionsTotal}
        </TableCell>
        <TableCell className="whitespace-nowrap text-muted-foreground">{years}</TableCell>
        <TableCell>
          <CompletionBar percent={entry.completionPercent} />
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow className="bg-muted/20">
          <TableCell />
          <TableCell colSpan={9}>
            <div className="grid gap-4 py-2 sm:grid-cols-2">
              <Detail label="Definition" value={entry.description} />
              <Detail label="Calculation" value={entry.calculationMethod ?? "Not yet documented."} />
              <Detail label="Source methodology" value={entry.primarySource?.methodology ?? "Not documented for this source."} />
              <Detail label="Limitations" value={entry.limitations ?? "None documented."} />
              {entry.jurisdictionsMissing.length > 0 && (
                <div className="sm:col-span-2">
                  <div className="text-xs font-semibold text-muted-foreground">Missing real data for</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {entry.jurisdictionsMissing.map((slug) => (
                      <Badge key={slug} variant="outline">
                        {slug}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold text-muted-foreground">{label}</div>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}

function CompletionBar({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", percent === 100 ? "bg-emerald-500" : percent > 0 ? "bg-amber-500" : "bg-muted-foreground/40")}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{percent}%</span>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number | string; accent?: string }) {
  return (
    <div>
      <div className={cn("text-2xl font-semibold", accent)}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
