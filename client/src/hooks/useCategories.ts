import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Category, MetricDefinition } from "@mandate/shared";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<Category[]>("/categories"),
    staleTime: 5 * 60_000,
  });
}

export function useCategoryMetricDefinitions(categorySlug: string | undefined) {
  return useQuery({
    queryKey: ["category-metric-definitions", categorySlug],
    queryFn: () => api.get<MetricDefinition[]>(`/categories/${categorySlug}/metric-definitions`),
    enabled: Boolean(categorySlug),
    staleTime: 5 * 60_000,
  });
}
