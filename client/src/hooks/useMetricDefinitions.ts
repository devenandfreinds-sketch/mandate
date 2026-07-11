import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { MetricDefinition, MetricDefinitionDetail } from "@mandate/shared";

export function useMetricDefinitions() {
  return useQuery({
    queryKey: ["metric-definitions"],
    queryFn: () => api.get<MetricDefinition[]>("/metric-definitions"),
    staleTime: 5 * 60_000,
  });
}

export function useMetricDefinition(slug: string | undefined) {
  return useQuery({
    queryKey: ["metric-definition", slug],
    queryFn: () => api.get<MetricDefinitionDetail>(`/metric-definitions/${slug}`),
    enabled: Boolean(slug),
  });
}
