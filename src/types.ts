export interface FeedbackItem {
  id: string;
  kind: "feedback" | "action";
  text: string;
}

export interface RetrospectiveSnapshot {
  id: string;
  sprintName: string;
  date: string;
  participants: string[];
  ratings: Record<string, number>;
  feedback: FeedbackItem[];
}

export interface ActiveRetrospective {
  id: string;
  sprintName: string;
  date: string;
  participants: string[];
  deferred: string[];
  ratings: Record<string, number>;
  feedback: FeedbackItem[];
  currentName: string | null;
  finalRound: string[] | null;
}

export type Route =
  | { name: "dashboard" }
  | { name: "prepare" }
  | { name: "retrospective"; id: string }
  | { name: "ongoing"; id: string };
