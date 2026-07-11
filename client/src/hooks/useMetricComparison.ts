import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { MetricSeries } from "@mandate/shared";

/** Cross-jurisdiction metric values, grouped by jurisdiction — the shape the future Compare tool consumes. */
export function useMetricComparison(metricSlug: string | undefined, jurisdictionSlugs: string[]) {
  return useQuery({
    queryKey: ["metric-comparison", metricSlug, jurisdictionSlugs.join(",")],
    queryFn: () =>
      api.get<MetricSeries[]>(`/metric-definitions/${metricSlug}/values?jurisdictions=${jurisdictionSlugs.join(",")}`),
    enabled: Boolean(metricSlug) && jurisdictionSlugs.length > 0,
  });
}
