import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, setAdminToken, clearAdminToken } from "@/lib/api";

export function useAdminMe() {
  return useQuery({
    queryKey: ["admin-me"],
    queryFn: () => api.get<{ authenticated: boolean }>("/admin/me"),
    retry: false,
  });
}

export function useAdminLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (password: string) => api.postJson<{ authenticated: boolean; token: string }>("/admin/login", { password }),
    onSuccess: (data) => {
      setAdminToken(data.token);
      queryClient.invalidateQueries({ queryKey: ["admin-me"] });
    },
  });
}

export function useAdminLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.postJson<{ authenticated: boolean }>("/admin/logout", {}),
    onSuccess: () => {
      clearAdminToken();
      queryClient.invalidateQueries({ queryKey: ["admin-me"] });
    },
  });
}
