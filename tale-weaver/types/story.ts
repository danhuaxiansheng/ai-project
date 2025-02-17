export interface Story {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

export interface StorySession {
  id: string;
  storyId: string;
  title: string;
  type: "story" | "dialogue" | "plot";
  createdAt: number;
  updatedAt: number;
}

export interface StoryMessage {
  id: string;
  sessionId: string;
  role: "assistant" | "user";
  content: string;
  timestamp: number;
  metadata?: {
    type?: "setting" | "character" | "plot" | "scene";
    tags?: string[];
  };
}
