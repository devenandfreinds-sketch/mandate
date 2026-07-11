import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Source } from "@mandate/shared";

export function useSources() {
  return useQuery({
    queryKey: ["sources"],
    queryFn: () => api.get<Source[]>("/sources"),
    staleTime: 5 * 60_000,
  });
}
