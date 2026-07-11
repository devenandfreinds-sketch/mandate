import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { GovernanceModelCard } from "@/components/governance/GovernanceModelCard";
import { buttonClassName } from "@/components/ui/button";
import { useGovernanceModels } from "@/hooks/useGovernanceModels";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";

export function LandingPage() {
  const { data: models, isLoading } = useGovernanceModels();
  const { data: summary } = useDashboardSummary();

  return (
    <PageContainer>
      <section className="py-12 text-center sm:py-20">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Governance, measured.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Mandate tracks whether emerging urban political movements deliver measurable results once they enter
          government — through transparent, publicly sourced statistics, not editorial scoring.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/dashboard" className={buttonClassName({ size: "lg" })}>
            View the Dashboard
          </Link>
          <Link to="/governance-models" className={buttonClassName({ variant: "outline", size: "lg" })}>
            Explore Governance Models
          </Link>
        </div>
      </section>

      {summary && (
        <section className="grid grid-cols-2 gap-4 border-y border-border py-8 sm:grid-cols-4">
          <Stat label="Governance Models" value={summary.governanceModelCount} />
          <Stat label="Cities & Regions" value={summary.jurisdictionCount} />
          <Stat label="Tracked Metrics" value={summary.metricDefinitionCount} />
          <Stat label="Data Points" value={summary.metricValueCount} />
        </section>
      )}

      <section className="py-12">
        <h2 className="mb-6 text-2xl font-semibold">Governance Models</h2>
        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          {models?.map((m) => (
            <GovernanceModelCard key={m.id} model={m} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-semibold">{value.toLocaleString()}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
