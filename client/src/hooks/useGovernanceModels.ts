import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { GovernanceModelSummary } from "@mandate/shared";

export function useGovernanceModels() {
  return useQuery({
    queryKey: ["governance-models"],
    queryFn: () => api.get<GovernanceModelSummary[]>("/governance-models"),
  });
}
