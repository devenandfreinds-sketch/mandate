import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { GovernanceModelDetail, PipelineSummary } from "@mandate/shared";

export function useGovernanceModel(slug: string | undefined) {
  return useQuery({
    queryKey: ["governance-model", slug],
    queryFn: () => api.get<GovernanceModelDetail>(`/governance-models/${slug}`),
    enabled: Boolean(slug),
  });
}

export function usePipelineSummary(slug: string | undefined) {
  return useQuery({
    queryKey: ["governance-model-pipeline-summary", slug],
    queryFn: () => api.get<PipelineSummary>(`/governance-models/${slug}/pipeline-summary`),
    enabled: Boolean(slug),
  });
}
