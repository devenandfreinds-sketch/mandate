/**
 * Chicago is the pilot jurisdiction for real Institutional Pipeline research (see docs on the
 * Pipeline Detail Page / methodology page). This file replaces the synthetic PRNG-generated
 * assessment for exactly one (jurisdiction, policyArea) pair — "affordable-housing-institution"
 * for Chicago — with two real, cited assessments forming a genuine (if short) history:
 *
 *   2021-10-01  stage 2  Legislation Enacted / Formally Adopted   (ARO 2021 amendment)
 *   2026-07-21  stage 4  Operating with Observable Outputs        (DOH Annual Report production data)
 *
 * Stage 5 ("Measurable Outputs Demonstrating Improvement") is deliberately NOT claimed: DOH's own
 * annual production figures fluctuate year to year rather than show a clean improving trend, so
 * "producing results" is not yet supported by the evidence on hand.
 *
 * The other 6 Chicago policy areas remain the synthetic placeholder generator's output — they are
 * NOT researched, and continue to be marked isPlaceholder/dataQuality: "placeholder" accordingly.
 * This is intentionally a single, fully-evidenced template rather than a rushed pass across all 7.
 */

export interface ResearchedPipelineAssessmentSpec {
  jurisdictionSlug: string;
  policyAreaSlug: string;
  stage: number;
  dataQuality: string;
  assessmentDate: string;
  isCurrent: boolean;
  evidenceSummary: string;
  limitations: string | null;
  evidenceLinks: Array<{
    label: string;
    description: string;
    url: string;
    evidenceType: string;
    publicationDate: string | null;
    publisher: string;
    sourceTier: string;
    sourceKey: string | null;
  }>;
  legislation: {
    title: string;
    billNumber: string | null;
    status: string;
    dateEnacted: string | null;
    url: string | null;
    sourceKey: string | null;
  } | null;
}

export const chicagoResearchedPipelineAssessments: ResearchedPipelineAssessmentSpec[] = [
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "affordable-housing-institution",
    stage: 2,
    dataQuality: "government",
    assessmentDate: "2021-10-01",
    isCurrent: false,
    evidenceSummary:
      "Chicago's inclusionary housing requirement was formally re-enacted and strengthened via the 2021 Affordable Requirements Ordinance amendment, legally requiring affordable units in qualifying developments.",
    limitations:
      "This assessment covers only the legal-enactment milestone; it does not by itself establish that a dedicated production institution was newly created (Chicago's Department of Housing already existed prior to this ordinance).",
    evidenceLinks: [],
    legislation: {
      title: "Affordable Requirements Ordinance (2021 Amendment)",
      billNumber: "Municipal Code of Chicago Ch. 2-44-085",
      status: "enacted",
      dateEnacted: "2021-10-01",
      url: "https://www.chicago.gov/city/en/sites/affordable-requirements-ordinance/home.html",
      sourceKey: "chicago_aro",
    },
  },
  {
    jurisdictionSlug: "chicago",
    policyAreaSlug: "affordable-housing-institution",
    stage: 4,
    dataQuality: "estimated",
    assessmentDate: "2026-07-21",
    isCurrent: true,
    evidenceSummary:
      "The Chicago Department of Housing is an established institution administering the Affordable Requirements Ordinance and Low-Income Housing Tax Credit allocation, and publishes annual production figures showing the program is actively operating and producing housing units. Whether output is durably improving over time is not yet established (see limitations).",
    limitations:
      "Observable-output evidence (units produced per year) comes from DOH's own Annual Report, which presents this only as a chart with no accompanying data table — figures were extracted by measuring bar height, not read from exact published digits (see the chicago_doh_annual_report Source's methodology). Production also fluctuates year to year rather than showing a clean improving trend, so this assessment does not claim stage 5 (measurable, improving results). The most recent DOH Annual Report edition available covers only through 2022; a newer edition would be needed to confirm the institution's current-year output.",
    evidenceLinks: [
      {
        label: "Affordable Requirements Ordinance — official program page",
        description:
          "City of Chicago's official ARO page, confirming the ordinance is in active effect and administered by the Department of Housing.",
        url: "https://www.chicago.gov/city/en/sites/affordable-requirements-ordinance/home.html",
        evidenceType: "dataset",
        publicationDate: null,
        publisher: "City of Chicago Department of Housing",
        sourceTier: "government",
        sourceKey: "chicago_aro",
      },
      {
        label: "Chicago DOH Annual Report — total affordable units produced per year",
        description:
          "Department of Housing's own annual report shows total affordable multi-family units produced per year, 2014-2022, by Area Median Income band — the clearest available evidence that the institution is operating and producing observable output.",
        url: "https://www.chicago.gov/content/dam/city/depts/doh/plans/Annual%20Report%20Final%208.29.23.pdf",
        evidenceType: "report",
        publicationDate: "2023-08-29",
        publisher: "City of Chicago Department of Housing",
        sourceTier: "government",
        sourceKey: "chicago_doh_annual_report",
      },
    ],
    legislation: null,
  },
];
