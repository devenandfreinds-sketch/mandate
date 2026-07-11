import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { DataCatalogResponse } from "@mandate/shared";

export function useDataCatalog() {
  return useQuery({
    queryKey: ["data-catalog"],
    queryFn: () => api.get<DataCatalogResponse>("/data-catalog"),
    staleTime: 60_000,
  });
}
