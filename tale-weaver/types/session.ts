export interface StorySession {
  id: string;
  storyId: string;
  title: string;
  type: "story" | "dialogue" | "plot";
  createdAt: number;
  updatedAt: number;
} 