import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminLogout } from "@/hooks/useAdminAuth";
import { useCommitImport, useImportJobs, usePreviewImport, useRollbackImport } from "@/hooks/useImports";
import { useMetricDefinitions } from "@/hooks/useMetricDefinitions";
import { useSources } from "@/hooks/useSources";
import { useCategories } from "@/hooks/useCategories";
import { DATA_QUALITY_LEVELS } from "@mandate/shared";
import type { ImportSummary } from "@mandate/shared";

const ROW_STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  created: "default",
  updated: "secondary",
  skipped: "outline",
  rejected: "destructive",
};

export function AdminImportsPage() {
  const logout = useAdminLogout();
  const { data: metricDefs } = useMetricDefinitions();
  const { data: sources } = useSources();
  const { data: categories } = useCategories();
  const { data: jobs } = useImportJobs();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [metric, setMetric] = useState("");
  const [source, setSource] = useState("");
  // No legacy default — "official" is deprecated (kept only for old rows created before the current
  // 6-level vocabulary existed). A new import must explicitly choose a real level; defaulting silently
  // to a deprecated label is exactly how a new researcher would mislabel real source quality.
  const [quality, setQuality] = useState("government");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState<ImportSummary | null>(null);

  const preview = usePreviewImport();
  const commit = useCommitImport();
  const rollback = useRollbackImport();

  function buildFormData(): FormData | null {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return null;
    const fd = new FormData();
    fd.append("file", file);
    if (metric) fd.append("metric", metric);
    fd.append("source", source);
    fd.append("quality", quality);
    if (category) fd.append("category", category);
    return fd;
  }

  function handlePreview() {
    const fd = buildFormData();
    if (!fd) return;
    preview.mutate(fd, { onSuccess: setSummary });
  }

  function handleCommit() {
    const fd = buildFormData();
    if (!fd) return;
    commit.mutate(fd, { onSuccess: setSummary });
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin — Data Imports</h1>
        <div className="flex items-center gap-3">
          <Link to="/admin/research-queue" className="text-sm text-muted-foreground hover:underline">
            Research Queue
          </Link>
          <Link to="/admin/pipeline" className="text-sm text-muted-foreground hover:underline">
            Pipeline Assessments →
          </Link>
          <Button variant="outline" size="sm" onClick={() => logout.mutate()}>
            Log out
          </Button>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Upload a CSV or JSON file</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <input ref={fileInputRef} type="file" accept=".csv,.json" className="text-sm" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Metric slug (fixed for this file)">
              <input
                list="metric-slugs"
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                placeholder="e.g. housing_permits_issued"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <datalist id="metric-slugs">
                {metricDefs?.map((m) => (
                  <option key={m.slug} value={m.slug}>
                    {m.name}
                  </option>
                ))}
              </datalist>
            </Field>
            <Field label="Source (id or name)">
              <input
                list="source-names"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. American Community Survey"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <datalist id="source-names">
                {sources?.map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </Field>
            <Field label="Data quality">
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                {DATA_QUALITY_LEVELS.map((q) => (
                  <option key={q.level} value={q.level}>
                    {q.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Category (optional, for logging)">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">—</option>
                {categories?.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={handlePreview} disabled={!source || preview.isPending}>
              {preview.isPending ? "Validating…" : "Preview"}
            </Button>
            <Button onClick={handleCommit} disabled={!source || commit.isPending}>
              {commit.isPending ? "Importing…" : "Commit Import"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {summary && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">
              Validation Report {summary.importJobId ? `(committed — job ${summary.importJobId.slice(0, 8)})` : "(preview only)"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-4 text-sm text-muted-foreground">
              <span>Total: {summary.totalRows}</span>
              <span className="text-emerald-600">Valid: {summary.validRows}</span>
              <span className="text-red-500">Invalid: {summary.invalidRows}</span>
              {summary.importJobId && (
                <>
                  <span>Created: {summary.createdCount}</span>
                  <span>Updated: {summary.updatedCount}</span>
                </>
              )}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Row</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.rows.map((r) => (
                  <TableRow key={r.rowNumber}>
                    <TableCell>{r.rowNumber}</TableCell>
                    <TableCell>
                      <Badge variant={ROW_STATUS_VARIANT[r.status] ?? "outline"}>{r.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.message ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Import History</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filename</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rows</TableHead>
                <TableHead>Created</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs?.map((j) => (
                <TableRow key={j.id}>
                  <TableCell>{j.filename}</TableCell>
                  <TableCell>{j.importType}</TableCell>
                  <TableCell>
                    <Badge variant={j.status === "rolled_back" ? "destructive" : "secondary"}>{j.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {j.createdCount + j.updatedCount}/{j.totalRows}
                  </TableCell>
                  <TableCell>{new Date(j.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    {j.status !== "rolled_back" && (
                      <Button size="sm" variant="outline" disabled={rollback.isPending} onClick={() => rollback.mutate(j.id)}>
                        Rollback
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>
    </PageContainer>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
