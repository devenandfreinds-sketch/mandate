import { useState } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PipelineStageBadge } from "@/components/charts/PipelineStageBadge";
import { DataQualityBadge } from "@/components/governance/DataQualityBadge";
import { useAdminLogout } from "@/hooks/useAdminAuth";
import { usePlaces } from "@/hooks/usePlace";
import { usePolicyAreas } from "@/hooks/usePolicyAreas";
import { usePipelineHistory } from "@/hooks/usePlaceMetrics";
import { useSources } from "@/hooks/useSources";
import { useCreatePipelineAssessment, type CreatePipelineAssessmentPayload } from "@/hooks/useAdminPipeline";
import { PIPELINE_STAGE_DEFINITIONS, SOURCE_TIERS } from "@mandate/shared";

const DATA_QUALITY_OPTIONS = ["government", "academic", "alternative", "estimated", "unavailable", "placeholder"];

type EvidenceDraft = CreatePipelineAssessmentPayload["evidence"][number];

const EMPTY_EVIDENCE: EvidenceDraft = { evidenceType: "report", label: "", description: "", url: "", publicationDate: "", publisher: "", sourceTier: "", sourceName: "" };

export function AdminPipelinePage() {
  const logout = useAdminLogout();
  const { data: places } = usePlaces();
  const { data: policyAreas } = usePolicyAreas();
  const { data: sources } = useSources();

  const [jurisdictionSlug, setJurisdictionSlug] = useState("");
  const [policyAreaSlug, setPolicyAreaSlug] = useState("");
  const [stage, setStage] = useState(0);
  const [dataQuality, setDataQuality] = useState("estimated");
  const [assessmentDate, setAssessmentDate] = useState("");
  const [evidenceSummary, setEvidenceSummary] = useState("");
  const [limitations, setLimitations] = useState("");
  const [evidence, setEvidence] = useState<EvidenceDraft[]>([{ ...EMPTY_EVIDENCE }]);
  const [includeLegislation, setIncludeLegislation] = useState(false);
  const [legislation, setLegislation] = useState({ title: "", billNumber: "", status: "enacted", dateEnacted: "", url: "", sourceName: "" });

  const { data: history } = usePipelineHistory(jurisdictionSlug || undefined, policyAreaSlug || undefined);
  const create = useCreatePipelineAssessment();

  const stageDefinition = PIPELINE_STAGE_DEFINITIONS.find((d) => d.stage === stage);

  function updateEvidenceRow(index: number, patch: Partial<EvidenceDraft>) {
    setEvidence((rows) => rows.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function submit() {
    if (!jurisdictionSlug || !policyAreaSlug || !assessmentDate) return;
    const payload: CreatePipelineAssessmentPayload = {
      jurisdictionSlug,
      policyAreaSlug,
      stage,
      dataQuality,
      assessmentDate,
      evidenceSummary: evidenceSummary || undefined,
      limitations: limitations || undefined,
      evidence: evidence.filter((e) => e.label && e.url),
      legislation: includeLegislation && legislation.title ? legislation : undefined,
    };
    create.mutate(payload, {
      onSuccess: () => {
        setEvidenceSummary("");
        setLimitations("");
        setEvidence([{ ...EMPTY_EVIDENCE }]);
        setIncludeLegislation(false);
      },
    });
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin — Institutional Pipeline Assessments</h1>
        <div className="flex items-center gap-3">
          <Link to="/admin/imports" className="text-sm text-muted-foreground hover:underline">
            ← Data Imports
          </Link>
          <Button variant="outline" size="sm" onClick={() => logout.mutate()}>
            Log out
          </Button>
        </div>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Each submission adds a new assessment to the timeline — it does not overwrite history. Only
        record what you can cite. If no responsible source exists, mark data quality "Unavailable"
        rather than guessing a stage.
      </p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">1. Select what you're assessing</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Field label="Jurisdiction">
            <select value={jurisdictionSlug} onChange={(e) => setJurisdictionSlug(e.target.value)} className={selectClass}>
              <option value="">Select a jurisdiction…</option>
              {places?.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Pipeline category (policy area)">
            <select value={policyAreaSlug} onChange={(e) => setPolicyAreaSlug(e.target.value)} className={selectClass}>
              <option value="">Select a policy area…</option>
              {policyAreas?.map((pa) => (
                <option key={pa.slug} value={pa.slug}>
                  {pa.name}
                </option>
              ))}
            </select>
          </Field>
        </CardContent>
      </Card>

      {jurisdictionSlug && policyAreaSlug && history && history.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Existing history for this pair</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {history.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted-foreground">{new Date(a.assessmentDate).toLocaleDateString()}</span>
                <PipelineStageBadge stage={a.stage} label={a.stageLabel} />
                <DataQualityBadge dataQuality={a.dataQuality} />
                {a.isCurrent && <Badge variant="outline">Current</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">2. Score and status</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Field label="Stage (0-5)">
            <select value={stage} onChange={(e) => setStage(Number(e.target.value))} className={selectClass}>
              {PIPELINE_STAGE_DEFINITIONS.map((d) => (
                <option key={d.stage} value={d.stage}>
                  {d.stage} — {d.label}
                </option>
              ))}
            </select>
            {stageDefinition && <p className="mt-1 text-xs text-muted-foreground">"{stageDefinition.question}" — {stageDefinition.criteria}</p>}
          </Field>
          <Field label="Data quality">
            <select value={dataQuality} onChange={(e) => setDataQuality(e.target.value)} className={selectClass}>
              {DATA_QUALITY_OPTIONS.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Assessment date">
            <input type="date" value={assessmentDate} onChange={(e) => setAssessmentDate(e.target.value)} className={selectClass} />
          </Field>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">3. Neutral summary and limitations</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Field label="Neutral summary">
            <textarea
              value={evidenceSummary}
              onChange={(e) => setEvidenceSummary(e.target.value)}
              rows={3}
              placeholder="Describe what was found, in neutral language — no editorializing."
              className={selectClass}
            />
          </Field>
          <Field label="Limitations">
            <textarea
              value={limitations}
              onChange={(e) => setLimitations(e.target.value)}
              rows={3}
              placeholder="What this assessment does NOT establish, or known weaknesses in the evidence."
              className={selectClass}
            />
          </Field>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">4. Evidence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {evidence.map((row, i) => (
            <div key={i} className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-2">
              <Field label="Evidence type">
                <input value={row.evidenceType} onChange={(e) => updateEvidenceRow(i, { evidenceType: e.target.value })} placeholder="dataset | article | legislation_text | report" className={selectClass} />
              </Field>
              <Field label="Title">
                <input value={row.label} onChange={(e) => updateEvidenceRow(i, { label: e.target.value })} className={selectClass} />
              </Field>
              <Field label="Description">
                <input value={row.description} onChange={(e) => updateEvidenceRow(i, { description: e.target.value })} className={selectClass} />
              </Field>
              <Field label="URL">
                <input value={row.url} onChange={(e) => updateEvidenceRow(i, { url: e.target.value })} className={selectClass} />
              </Field>
              <Field label="Publication date">
                <input type="date" value={row.publicationDate} onChange={(e) => updateEvidenceRow(i, { publicationDate: e.target.value })} className={selectClass} />
              </Field>
              <Field label="Publisher / organization">
                <input value={row.publisher} onChange={(e) => updateEvidenceRow(i, { publisher: e.target.value })} className={selectClass} />
              </Field>
              <Field label="Source tier">
                <select value={row.sourceTier} onChange={(e) => updateEvidenceRow(i, { sourceTier: e.target.value })} className={selectClass}>
                  <option value="">—</option>
                  {SOURCE_TIERS.map((t) => (
                    <option key={t.tier} value={t.tier}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Existing Source in registry (optional)">
                <input list="pipeline-source-names" value={row.sourceName} onChange={(e) => updateEvidenceRow(i, { sourceName: e.target.value })} className={selectClass} />
                <datalist id="pipeline-source-names">
                  {sources?.map((s) => (
                    <option key={s.id} value={s.name} />
                  ))}
                </datalist>
              </Field>
              {evidence.length > 1 && (
                <button
                  type="button"
                  onClick={() => setEvidence((rows) => rows.filter((_, idx) => idx !== i))}
                  className="w-fit text-xs text-muted-foreground underline"
                >
                  Remove this evidence row
                </button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setEvidence((rows) => [...rows, { ...EMPTY_EVIDENCE }])}>
            + Add another evidence record
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <input type="checkbox" checked={includeLegislation} onChange={(e) => setIncludeLegislation(e.target.checked)} />
            5. Legislation (optional)
          </CardTitle>
        </CardHeader>
        {includeLegislation && (
          <CardContent className="grid gap-2 sm:grid-cols-2">
            <Field label="Title">
              <input value={legislation.title} onChange={(e) => setLegislation((l) => ({ ...l, title: e.target.value }))} className={selectClass} />
            </Field>
            <Field label="Bill / ordinance number">
              <input value={legislation.billNumber} onChange={(e) => setLegislation((l) => ({ ...l, billNumber: e.target.value }))} className={selectClass} />
            </Field>
            <Field label="Status">
              <select value={legislation.status} onChange={(e) => setLegislation((l) => ({ ...l, status: e.target.value }))} className={selectClass}>
                <option value="proposed">Proposed</option>
                <option value="passed">Passed</option>
                <option value="enacted">Enacted</option>
              </select>
            </Field>
            <Field label="Date enacted">
              <input type="date" value={legislation.dateEnacted} onChange={(e) => setLegislation((l) => ({ ...l, dateEnacted: e.target.value }))} className={selectClass} />
            </Field>
            <Field label="URL">
              <input value={legislation.url} onChange={(e) => setLegislation((l) => ({ ...l, url: e.target.value }))} className={selectClass} />
            </Field>
            <Field label="Existing Source in registry (optional)">
              <input list="pipeline-source-names" value={legislation.sourceName} onChange={(e) => setLegislation((l) => ({ ...l, sourceName: e.target.value }))} className={selectClass} />
            </Field>
          </CardContent>
        )}
      </Card>

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={submit} disabled={!jurisdictionSlug || !policyAreaSlug || !assessmentDate || create.isPending}>
          {create.isPending ? "Saving…" : "Save assessment"}
        </Button>
        {create.isSuccess && <span className="text-sm text-emerald-600">Saved.</span>}
        {create.isError && <span className="text-sm text-red-500">{(create.error as Error).message}</span>}
      </div>
    </PageContainer>
  );
}

const selectClass = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
