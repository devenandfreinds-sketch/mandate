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
 * See the decision-rights matrix in docs/MANDATE_OPERATING_SYSTEM.md for exactly what each role
 * may and may not do unilaterally. Role is about DECISION AUTHORITY (what you're allowed to
 * decide); certificationLevel (below) is about DEMONSTRATED SKILL (how much has been proven).
 * They're independent -- a jurisdiction_lead is still a "new_researcher" on certification until
 * they've actually completed and had reviewed several tasks.
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
    description: "Owns a city/jurisdiction's research coverage: coordinates researchers, identifies gaps, monitors staleness, without needing founder approval for routine work.",
  },
  {
    role: "methodology_lead",
    label: "Methodology Lead",
    description: "Maintains Mandate's definitions and scoring rubric, approves methodology version changes, resolves methodological disputes.",
  },
  {
    role: "founder",
    label: "Founder",
    description: "Sets strategic direction, recruits leaders, resolves disputes escalated past a methodology lead, periodically audits the institution.",
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
  role: string;
  certificationLevel: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
