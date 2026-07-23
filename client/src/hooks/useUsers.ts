import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { User } from "@mandate/shared";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => api.get<User[]>("/admin/users"),
  });
}

export interface CreateUserPayload {
  name: string;
  email: string;
  affiliation?: string;
  role?: string;
  certificationLevel?: string;
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => api.postJson<User>("/admin/users", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export interface UpdateUserPayload {
  id: string;
  name?: string;
  affiliation?: string;
  role?: string;
  certificationLevel?: string;
  isActive?: boolean;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...patch }: UpdateUserPayload) => api.patchJson<User>(`/admin/users/${id}`, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}
