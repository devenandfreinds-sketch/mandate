import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ImportJob, ImportJobDetail, ImportSummary } from "@mandate/shared";

export function useImportJobs() {
  return useQuery({
    queryKey: ["import-jobs"],
    queryFn: () => api.get<ImportJob[]>("/admin/imports"),
  });
}

export function useImportJob(id: string | undefined) {
  return useQuery({
    queryKey: ["import-job", id],
    queryFn: () => api.get<ImportJobDetail>(`/admin/imports/${id}`),
    enabled: Boolean(id),
  });
}

export function usePreviewImport() {
  return useMutation({
    mutationFn: (formData: FormData) => api.postForm<ImportSummary>("/admin/imports/preview", formData),
  });
}

export function useCommitImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => api.postForm<ImportSummary>("/admin/imports", formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["import-jobs"] }),
  });
}

export function useRollbackImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (importJobId: string) => api.postJson(`/admin/imports/${importJobId}/rollback`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["import-jobs"] }),
  });
}
