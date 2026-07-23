import { useState } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePlaces } from "@/hooks/usePlace";
import { useSubmitExternalContribution } from "@/hooks/useExternalContributions";
import { CONTRIBUTION_TYPES } from "@mandate/shared";

const inputClass = "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm";

/**
 * Public entry point for Mandate's external research network (see docs/MANDATE_RESEARCH_NETWORK.md).
 * No login required -- anyone outside the organization can submit a critique, dataset, or
 * correction. It's reviewed internally before it ever affects the published knowledge base.
 */
export function ContributePage() {
  const { data: places } = usePlaces();
  const submit = useSubmitExternalContribution();

  const [contributorName, setContributorName] = useState("");
  const [contributorEmail, setContributorEmail] = useState("");
  const [contributorAffiliation, setContributorAffiliation] = useState("");
  const [contributionType, setContributionType] = useState(CONTRIBUTION_TYPES[0].type);
  const [topic, setTopic] = useState("");
  const [jurisdictionSlug, setJurisdictionSlug] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [relationToExistingResearch, setRelationToExistingResearch] = useState("");
  const [limitations, setLimitations] = useState("");

  const canSubmit = Boolean(contributorName.trim() && topic.trim() && description.trim()) && !submit.isPending;

  function handleSubmit() {
    submit.mutate({
      contributorName,
      contributorEmail: contributorEmail || undefined,
      contributorAffiliation: contributorAffiliation || undefined,
      contributionType,
      topic,
      jurisdictionSlug: jurisdictionSlug || undefined,
      description,
      evidenceUrl: evidenceUrl || undefined,
      relationToExistingResearch: relationToExistingResearch || undefined,
      limitations: limitations || undefined,
    });
  }

  if (submit.isSuccess) {
    return (
      <PageContainer>
        <Card className="mx-auto mt-12 max-w-lg">
          <CardHeader>
            <CardTitle>Thank you</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Your contribution has been submitted for internal review. It won't change anything in Mandate's
              published research until an internal researcher has reviewed it.
            </p>
            <Link to="/research" className="underline">
              Back to the Research Map
            </Link>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold">Contribute to Mandate's Research</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Mandate is built by an internal research organization, but it's meant to be challenged. If you're a
        professor, researcher, practitioner, or journalist and you think Mandate's methodology, data, or
        conclusions are wrong or incomplete, tell us. Every submission goes through internal review before it can
        affect the published knowledge base — nothing here is incorporated automatically.
      </p>

      <Card className="mt-6">
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Your name">
              <input value={contributorName} onChange={(e) => setContributorName(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Email (optional)">
              <input value={contributorEmail} onChange={(e) => setContributorEmail(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Affiliation / organization (optional)">
              <input
                value={contributorAffiliation}
                onChange={(e) => setContributorAffiliation(e.target.value)}
                placeholder="e.g. NYU, Brookings Institution"
                className={inputClass}
              />
            </Field>
            <Field label="Contribution type">
              <select value={contributionType} onChange={(e) => setContributionType(e.target.value)} className={inputClass}>
                {CONTRIBUTION_TYPES.map((c) => (
                  <option key={c.type} value={c.type}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <p className="text-xs text-muted-foreground">
            {CONTRIBUTION_TYPES.find((c) => c.type === contributionType)?.description}
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Topic">
              <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What is this about?" className={inputClass} />
            </Field>
            <Field label="Jurisdiction (optional)">
              <select value={jurisdictionSlug} onChange={(e) => setJurisdictionSlug(e.target.value)} className={inputClass}>
                <option value="">— not jurisdiction-specific —</option>
                {(places ?? []).map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="What are you contributing, and why does it matter?"
              className={inputClass}
            />
          </Field>

          <Field label="Evidence URL (optional)">
            <input value={evidenceUrl} onChange={(e) => setEvidenceUrl(e.target.value)} placeholder="Link to a dataset, paper, or article" className={inputClass} />
          </Field>

          <Field label="How does this relate to existing Mandate research? (optional)">
            <textarea
              value={relationToExistingResearch}
              onChange={(e) => setRelationToExistingResearch(e.target.value)}
              rows={2}
              placeholder="Does it confirm, challenge, or extend something Mandate has already published?"
              className={inputClass}
            />
          </Field>

          <Field label="Limitations (optional)">
            <textarea
              value={limitations}
              onChange={(e) => setLimitations(e.target.value)}
              rows={2}
              placeholder="Anything a reviewer should know about the strength or scope of this contribution"
              className={inputClass}
            />
          </Field>

          <div>
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              {submit.isPending ? "Submitting…" : "Submit contribution"}
            </Button>
            {submit.isError && (
              <span className="ml-3 text-sm text-destructive">
                {submit.error instanceof Error ? submit.error.message : "Failed to submit"}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
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
