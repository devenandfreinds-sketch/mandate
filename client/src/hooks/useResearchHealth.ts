import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ResearchHealthSummary {
  pipelineCoverage: {
    totalPairs: number;
    researchedPairs: number;
    unresearchedPairs: Array<{ jurisdictionSlug: string; jurisdictionName: string; policyAreaSlug: string; policyAreaName: string }>;
  };
  staleAssessments: Array<{ id: string; jurisdictionName: string; policyAreaName: string; nextReviewDate: string }>;
  staleMetrics: Array<{ id: string; metricName: string; jurisdictionName: string; nextReviewDate: string }>;
  missingEvidence: Array<{ id: string; jurisdictionName: string; policyAreaName: string; stage: number }>;
  unavailableMetricPairCount: number;
  dataQualityBreakdown: Record<string, number>;
}

export function useResearchHealth() {
  return useQuery({
    queryKey: ["research-health"],
    queryFn: () => api.get<ResearchHealthSummary>("/admin/research-health"),
  });
}
