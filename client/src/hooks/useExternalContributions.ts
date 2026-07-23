import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ExternalContribution } from "@mandate/shared";

export function useExternalContributions() {
  return useQuery({
    queryKey: ["external-contributions"],
    queryFn: () => api.get<ExternalContribution[]>("/admin/external-contributions"),
  });
}

export interface SubmitExternalContributionPayload {
  contributorName: string;
  contributorEmail?: string;
  contributorAffiliation?: string;
  contributionType: string;
  topic: string;
  jurisdictionSlug?: string;
  description: string;
  evidenceUrl?: string;
  relationToExistingResearch?: string;
  limitations?: string;
}

/** Public submission -- no admin auth required, so this hook is safe to use outside RequireAdmin. */
export function useSubmitExternalContribution() {
  return useMutation({
    mutationFn: (payload: SubmitExternalContributionPayload) =>
      api.postJson<ExternalContribution>("/external-contributions", payload),
  });
}

export interface ReviewExternalContributionPayload {
  id: string;
  status?: string;
  reviewerId?: string | null;
  reviewNotes?: string | null;
}

export function useReviewExternalContribution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...patch }: ReviewExternalContributionPayload) =>
      api.patchJson<ExternalContribution>(`/admin/external-contributions/${id}`, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["external-contributions"] }),
  });
}
