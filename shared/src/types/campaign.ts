/**
 * Lightweight, config-only "current research focus" label — deliberately NOT a database table.
 * See docs/RESEARCH_MAP.md, "Collaborative Campaigns": the first implementation is just a labeled
 * pointer at a jurisdiction, with progress computed live from ResearchMapData (never stored). To
 * change the focus, edit this object — no migration needed. If Mandate later wants multiple
 * concurrent campaigns or a history of past campaigns, that's a genuine future schema change, not
 * something to build speculatively now.
 */
export interface ResearchFocus {
  label: string;
  jurisdictionSlug: string;
  objective: string;
  startDate: string; // ISO date
}

export const CURRENT_RESEARCH_FOCUS: ResearchFocus = {
  label: "Chicago Research Campaign",
  jurisdictionSlug: "chicago",
  objective: "Establish Chicago as Mandate's first deeply researched municipal case study, across every metric and institutional pipeline.",
  startDate: "2026-07-10",
};
