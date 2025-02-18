export interface Memory {
  reference_id: string;
  text: string;
  type: "story" | "dialogue" | "plot";
  score?: number;
  timestamp: number;
  role?: string;
  embedding?: number[];
}
