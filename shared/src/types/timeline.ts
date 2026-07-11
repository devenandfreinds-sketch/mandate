export type TimelineEventType = "election" | "legislation" | "program_launch" | "milestone";

export interface TimelineEvent {
  id: string;
  governanceModelId: string | null;
  jurisdictionId: string | null;
  administrationId: string | null;
  eventDate: string;
  title: string;
  description: string;
  eventType: TimelineEventType | string;
  sourceId: string | null;
  isPlaceholder: boolean;
}
