export interface StoryMessage {
  id: string;
  sessionId: string;
  storyId: string;
  role: "assistant" | "user";
  content: string;
  timestamp: number;
  metadata?: {
    type?: "setting" | "character" | "plot" | "scene";
    tags?: string[];
  };
} 