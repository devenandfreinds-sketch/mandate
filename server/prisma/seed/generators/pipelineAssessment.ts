import { seededRandom } from "./prng.js";

const STAGE_LABELS: Record<number, string> = {
  0: "Campaign Promise",
  1: "Legislation Proposed",
  2: "Institution Created",
  3: "Program Operating",
  4: "Measurable Outputs Improving",
  5: "Institution Producing Durable Results",
};

export interface GeneratedPipelineAssessment {
  stage: number;
  assessmentDate: Date;
  timelineNotes: string;
  evidenceSummary: string;
  legislation: { title: string; status: string; sourceKey: string } | null;
  evidenceLinks: { label: string; url: string; evidenceType: string; sourceKey: string }[];
}

export function generatePipelineAssessment(
  jurisdictionSlug: string,
  jurisdictionName: string,
  policyAreaSlug: string,
  policyAreaName: string
): GeneratedPipelineAssessment {
  const rng = seededRandom(jurisdictionSlug, policyAreaSlug, "pipeline");
  // Bias toward the middle of the scale (stages 1-4) since 0 and 5 are rarer in practice.
  const roll = rng();
  const stage = roll < 0.1 ? 0 : roll < 0.35 ? 1 : roll < 0.6 ? 2 : roll < 0.85 ? 3 : roll < 0.97 ? 4 : 5;

  const assessmentYear = 2022 + Math.floor(rng() * 4); // 2022-2025
  const assessmentDate = new Date(Date.UTC(assessmentYear, Math.floor(rng() * 12), 1));

  const timelineNotes = `As of ${assessmentYear}, ${jurisdictionName}'s "${policyAreaName}" effort is assessed at stage ${stage} (${STAGE_LABELS[stage]}).`;
  const evidenceSummary =
    stage <= 1
      ? `Public commitments and/or proposed legislation exist, but no operating institution has yet been established.`
      : stage <= 3
        ? `An institution or program has been created and is operating, though outcome data is still limited or mixed.`
        : `The program has an established track record with measurable, improving outcomes over multiple years.`;

  const legislation =
    stage >= 1
      ? {
          title: `${policyAreaName} Authorization`,
          status: stage >= 2 ? "enacted" : "proposed",
          sourceKey: "local_news",
        }
      : null;

  const evidenceLinks =
    stage >= 2
      ? [
          {
            label: `${jurisdictionName} ${policyAreaName} Program Report`,
            url: "https://example.org/placeholder-evidence",
            evidenceType: "report",
            sourceKey: "local_news",
          },
        ]
      : [];

  return { stage, assessmentDate, timelineNotes, evidenceSummary, legislation, evidenceLinks };
}
