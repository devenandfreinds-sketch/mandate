import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ResearchMapData, JurisdictionResearchDetail } from "@mandate/shared";

export function useResearchMap() {
  return useQuery({
    queryKey: ["research-map"],
    queryFn: () => api.get<ResearchMapData>("/research-map"),
  });
}

export function useJurisdictionResearchDetail(jurisdictionSlug: string | undefined) {
  return useQuery({
    queryKey: ["research-map", jurisdictionSlug],
    queryFn: () => api.get<JurisdictionResearchDetail>(`/research-map/${jurisdictionSlug}`),
    enabled: Boolean(jurisdictionSlug),
  });
}
