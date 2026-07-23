import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ResearchTask } from "@mandate/shared";

export function useResearchQueue() {
  return useQuery({
    queryKey: ["research-queue"],
    queryFn: () => api.get<ResearchTask[]>("/admin/research-tasks"),
  });
}

export interface UpdateResearchTaskPayload {
  id: string;
  status?: string;
  assignedResearcher?: string | null;
  assignedResearcherId?: string | null;
  reviewerId?: string | null;
  sourceStatus?: string | null;
  notes?: string | null;
  dueDate?: string | null;
  nextReviewDate?: string | null;
}

export function useUpdateResearchTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...patch }: UpdateResearchTaskPayload) => api.patchJson<ResearchTask>(`/admin/research-tasks/${id}`, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-queue"] });
      queryClient.invalidateQueries({ queryKey: ["research-map"] });
    },
  });
}

/** The "ACCEPTED" action — only valid from awaiting_review. Moves the task to complete; does NOT by itself change any underlying data quality. */
export function useAcceptResearchTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reviewerId }: { id: string; reviewerId?: string | null }) =>
      api.postJson<ResearchTask>(`/admin/research-tasks/${id}/accept`, { reviewerId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-queue"] });
      queryClient.invalidateQueries({ queryKey: ["research-map"] });
    },
  });
}

/** The "NEEDS REVISION" action — only valid from awaiting_review. */
export function useRequestRevision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reviewerId, reviewNotes }: { id: string; reviewerId?: string | null; reviewNotes?: string | null }) =>
      api.postJson<ResearchTask>(`/admin/research-tasks/${id}/request-revision`, { reviewerId, reviewNotes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-queue"] });
      queryClient.invalidateQueries({ queryKey: ["research-map"] });
    },
  });
}
