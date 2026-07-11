import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AdministrationDetail, JurisdictionDetail, JurisdictionSummary } from "@mandate/shared";

export function usePlaces(governanceModelSlug?: string) {
  return useQuery({
    queryKey: ["places", governanceModelSlug],
    queryFn: () =>
      api.get<JurisdictionSummary[]>(
        governanceModelSlug ? `/jurisdictions?governanceModel=${governanceModelSlug}` : "/jurisdictions"
      ),
  });
}

export function usePlace(slug: string | undefined) {
  return useQuery({
    queryKey: ["place", slug],
    queryFn: () => api.get<JurisdictionDetail>(`/jurisdictions/${slug}`),
    enabled: Boolean(slug),
  });
}

export function useAdministrationDetail(jurisdictionSlug: string | undefined, administrationId: string | undefined) {
  return useQuery({
    queryKey: ["administration-detail", jurisdictionSlug, administrationId],
    queryFn: () => api.get<AdministrationDetail>(`/jurisdictions/${jurisdictionSlug}/administrations/${administrationId}`),
    enabled: Boolean(jurisdictionSlug) && Boolean(administrationId),
  });
}
