import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PipelineAssessment } from "@mandate/shared";

export interface CreatePipelineAssessmentPayload {
  jurisdictionSlug: string;
  policyAreaSlug: string;
  stage: number;
  dataQuality: string;
  assessmentDate: string;
  evidenceSummary?: string;
  limitations?: string;
  evidence: Array<{
    evidenceType: string;
    label: string;
    description?: string;
    url: string;
    publicationDate?: string;
    publisher?: string;
    sourceTier?: string;
    sourceName?: string;
  }>;
  legislation?: {
    title: string;
    billNumber?: string;
    status?: string;
    dateEnacted?: string;
    url?: string;
    sourceName?: string;
  };
}

export function useCreatePipelineAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePipelineAssessmentPayload) =>
      api.postJson<PipelineAssessment>("/admin/pipeline-assessments", payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pipeline-history", variables.jurisdictionSlug, variables.policyAreaSlug] });
      queryClient.invalidateQueries({ queryKey: ["place-pipeline", variables.jurisdictionSlug] });
    },
  });
}
