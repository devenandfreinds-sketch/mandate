import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { MetricSeries, PipelineAssessment } from "@mandate/shared";

export function usePlaceMetrics(slug: string | undefined, categorySlug: string | undefined, administrationId?: string) {
  return useQuery({
    queryKey: ["place-metrics", slug, categorySlug, administrationId],
    queryFn: () => {
      const params = new URLSearchParams({ category: categorySlug ?? "" });
      if (administrationId) params.set("administrationId", administrationId);
      return api.get<MetricSeries[]>(`/jurisdictions/${slug}/metrics?${params.toString()}`);
    },
    enabled: Boolean(slug) && Boolean(categorySlug),
  });
}

export function usePlacePipeline(slug: string | undefined) {
  return useQuery({
    queryKey: ["place-pipeline", slug],
    queryFn: () => api.get<PipelineAssessment[]>(`/jurisdictions/${slug}/pipeline`),
    enabled: Boolean(slug),
  });
}

/** Full history (not just the current assessment) for one jurisdiction + policy area, oldest to newest. */
export function usePipelineHistory(jurisdictionSlug: string | undefined, policyAreaSlug: string | undefined) {
  return useQuery({
    queryKey: ["pipeline-history", jurisdictionSlug, policyAreaSlug],
    queryFn: () => api.get<PipelineAssessment[]>(`/jurisdictions/${jurisdictionSlug}/pipeline/${policyAreaSlug}`),
    enabled: Boolean(jurisdictionSlug) && Boolean(policyAreaSlug),
  });
}
