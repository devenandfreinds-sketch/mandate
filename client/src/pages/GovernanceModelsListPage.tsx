import { PageContainer } from "@/components/layout/PageContainer";
import { GovernanceModelCard } from "@/components/governance/GovernanceModelCard";
import { useGovernanceModels } from "@/hooks/useGovernanceModels";

export function GovernanceModelsListPage() {
  const { data: models, isLoading } = useGovernanceModels();

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold">Governance Models</h1>
      <p className="mt-1 text-muted-foreground">
        A governance model is a comparative grouping of cities or regions where a particular political movement or
        institutional structure has meaningfully shaped municipal governance.
      </p>
      {isLoading && <p className="mt-6 text-muted-foreground">Loading…</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {models?.map((m) => (
          <GovernanceModelCard key={m.id} model={m} />
        ))}
      </div>
    </PageContainer>
  );
}
