export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: number;
  metadata?: {
    type?: "setting" | "character" | "plot" | "scene";
    tags?: string[];
  };
}
