/**
 * The external contribution workflow answers a different question than the Research Queue: not
 * "what should Mandate build next" but "does someone outside the organization have something that
 * should change what Mandate has already built." See docs/MANDATE_RESEARCH_NETWORK.md, "External
 * Contribution System". Deliberately a single flat submission + internal review, not a peer-review
 * platform -- no external contribution ever mutates production data directly; only an internal
 * researcher acting on an accepted/incorporated contribution does that, through the normal
 * Research Queue / admin write paths.
 */
export interface ContributionTypeOption {
  type: string;
  label: string;
  description: string;
}

export const CONTRIBUTION_TYPES: ContributionTypeOption[] = [
  { type: "methodological_critique", label: "Methodological Critique", description: "A challenge to how Mandate defines or scores something." },
  { type: "dataset", label: "Dataset", description: "A dataset that could fill a coverage gap or corroborate existing research." },
  { type: "academic_research", label: "Academic Research", description: "A paper, study, or working research relevant to a jurisdiction or metric." },
  { type: "policy_analysis", label: "Policy Analysis", description: "Analysis of a specific policy, program, or institution." },
  { type: "expert_commentary", label: "Expert Commentary", description: "Domain expertise or context that informs interpretation, not raw data." },
  { type: "source_recommendation", label: "Source Recommendation", description: "A source Mandate isn't using yet that it should consider." },
  { type: "data_correction", label: "Data Correction", description: "A specific claim that a published Mandate figure is wrong, with evidence." },
  { type: "report_review", label: "Report Review", description: "Feedback on a published Mandate report." },
];

export const CONTRIBUTION_TYPE_SLUGS = CONTRIBUTION_TYPES.map((c) => c.type);

export interface ContributionStatusOption {
  status: string;
  label: string;
}

/**
 * submitted -> under_review -> one of accepted/rejected/incorporated/cited. "Accepted" means the
 * internal team agrees it's sound; "incorporated" means it actually changed the knowledge base;
 * "cited" means it's referenced/credited without changing existing data. Accepted doesn't imply
 * incorporated -- a correct critique can be accepted without (yet) being acted on.
 */
export const CONTRIBUTION_STATUSES: ContributionStatusOption[] = [
  { status: "submitted", label: "Submitted" },
  { status: "under_review", label: "Under Review" },
  { status: "accepted", label: "Accepted" },
  { status: "rejected", label: "Rejected" },
  { status: "incorporated", label: "Incorporated" },
  { status: "cited", label: "Cited" },
];

export const CONTRIBUTION_STATUS_SLUGS = CONTRIBUTION_STATUSES.map((s) => s.status);

export interface ExternalContribution {
  id: string;
  contributorName: string;
  contributorEmail: string | null;
  contributorAffiliation: string | null;
  contributorUserId: string | null;
  contributionType: string;
  topic: string;
  jurisdictionSlug: string | null;
  jurisdictionName: string | null;
  description: string;
  evidenceUrl: string | null;
  relationToExistingResearch: string | null;
  limitations: string | null;
  status: string;
  reviewerId: string | null;
  reviewerName: string | null;
  reviewNotes: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
