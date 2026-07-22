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
  sourceStatus?: string | null;
  notes?: string | null;
}

export function useUpdateResearchTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...patch }: UpdateResearchTaskPayload) => api.patchJson<ResearchTask>(`/admin/research-tasks/${id}`, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-queue"] });
    },
  });
}
