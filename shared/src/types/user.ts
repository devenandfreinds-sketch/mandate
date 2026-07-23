/**
 * Researcher identity. Deliberately minimal -- see the User model comment in
 * server/prisma/schema.prisma and docs/MANDATE_OPERATING_SYSTEM.md. A User row identifies WHO is
 * acting (for attribution, review routing, and certification), not a per-person login/password;
 * authentication is still the single shared admin credential.
 */
export interface UserRoleOption {
  role: string;
  label: string;
  description: string;
}

/**
 * AFFILIATION is WHO this person is to the organization; ROLE (below) is WHAT they're capable of
 * doing. The two are independent dimensions, not one permission level -- see
 * docs/MANDATE_RESEARCH_NETWORK.md, "The Critical Distinction". Do not infer one from the other:
 * an external advisor can hold the same "researcher" or "reviewer" role an internal person can.
 */
export interface AffiliationOption {
  affiliation: string;
  label: string;
  description: string;
}

export const AFFILIATIONS: AffiliationOption[] = [
  {
    affiliation: "internal",
    label: "Internal",
    description: "Part of Mandate's research organization: builds and maintains institutional memory under the shared methodology.",
  },
  {
    affiliation: "external",
    label: "External",
    description: "Outside the organization: professors, other universities, think tanks, practitioners, journalists. Expands, challenges, and enriches institutional memory, but their contributions don't become authoritative data until internally reviewed.",
  },
];

export const AFFILIATION_SLUGS = AFFILIATIONS.map((a) => a.affiliation);

/**
 * See the decision-rights matrix in docs/MANDATE_OPERATING_SYSTEM.md for exactly what each role
 * may and may not do unilaterally. Role is about DECISION AUTHORITY (what you're allowed to
 * decide); certificationLevel (below) is about DEMONSTRATED SKILL (how much has been proven).
 * They're independent -- a jurisdiction_lead is still a "new_researcher" on certification until
 * they've actually completed and had reviewed several tasks.
 *
 * researcher/reviewer/jurisdiction_lead/methodology_lead/admin are typically internal; advisor/
 * practitioner/contributor are typically external -- but affiliation is a separate field and
 * nothing here enforces that pairing. A person can never accept/review their own submitted work
 * regardless of role (see researchTask.service.ts's self-review guard).
 */
export const USER_ROLES: UserRoleOption[] = [
  {
    role: "researcher",
    label: "Researcher",
    description: "Picks up tasks from the Research Queue, researches metrics and pipeline assessments, submits findings for review.",
  },
  {
    role: "reviewer",
    label: "Reviewer",
    description: "Reviews another researcher's submitted work for methodological correctness before it's treated as final.",
  },
  {
    role: "jurisdiction_lead",
    label: "Jurisdiction Lead",
    description: "Owns a city/jurisdiction's research coverage: coordinates researchers, identifies gaps, monitors staleness, without needing admin approval for routine work.",
  },
  {
    role: "methodology_lead",
    label: "Methodology Lead",
    description: "Maintains Mandate's definitions and scoring rubric, approves methodology version changes, resolves methodological disputes.",
  },
  {
    role: "admin",
    label: "Admin",
    description:
      "Full research and administrative capability: founders and founding team members. Sets strategic direction, recruits leaders, resolves disputes escalated past a methodology lead, can conduct/review/manage research across the whole roster -- but still can never accept their own submitted work.",
  },
  {
    role: "advisor",
    label: "Advisor",
    description: "Typically a professor or subject-matter expert: provides expert commentary, critiques methodology, reviews reports on request. Not part of the internal review chain.",
  },
  {
    role: "practitioner",
    label: "Practitioner",
    description: "A municipal practitioner or domain expert who contributes ground-level context, flags errors, or reviews reports from lived experience.",
  },
  {
    role: "contributor",
    label: "Contributor",
    description: "An independent analyst, journalist, or other outside participant who submits datasets, corrections, or source recommendations through the external contribution workflow.",
  },
];

export const USER_ROLE_SLUGS = USER_ROLES.map((r) => r.role);

export interface CertificationLevelOption {
  level: string;
  label: string;
  description: string;
}

/**
 * The researcher development ladder (docs/MANDATE_OPERATING_SYSTEM.md, "Researcher Certification").
 * Progression is earned through demonstrated accuracy/reliability/rigor on completed, reviewed
 * work -- never through university prestige, tenure, or self-assessment. Advancing someone's
 * certificationLevel is a reviewer/methodology-lead judgment call recorded on their User row, not
 * an automated score.
 */
export const CERTIFICATION_LEVELS: CertificationLevelOption[] = [
  {
    level: "new_researcher",
    label: "New Researcher",
    description: "Onboarding or has completed fewer than a handful of reviewed tasks. Work should be reviewed before publication.",
  },
  {
    level: "certified_researcher",
    label: "Certified Researcher",
    description: "Has completed several tasks with consistently accurate, well-documented, methodologically sound submissions.",
  },
  {
    level: "senior_researcher",
    label: "Senior Researcher",
    description: "Demonstrated judgment on ambiguous cases; can be trusted with minimal review on routine tasks.",
  },
  {
    level: "research_lead",
    label: "Research Lead",
    description: "Can coordinate other researchers and review their work; typically paired with the jurisdiction_lead role.",
  },
  {
    level: "methodology_reviewer",
    label: "Methodology Reviewer",
    description: "Trusted to weigh in on methodology disputes and proposed version changes; typically paired with the methodology_lead role.",
  },
];

export const CERTIFICATION_LEVEL_SLUGS = CERTIFICATION_LEVELS.map((c) => c.level);

export interface User {
  id: string;
  name: string;
  email: string;
  affiliation: string;
  role: string;
  certificationLevel: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
