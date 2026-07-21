import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PolicyArea } from "@mandate/shared";

export function usePolicyAreas() {
  return useQuery({
    queryKey: ["policy-areas"],
    queryFn: () => api.get<PolicyArea[]>("/policy-areas"),
    staleTime: 5 * 60_000,
  });
}
