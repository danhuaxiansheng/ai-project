export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  status: "draft" | "published";
  createdAt: number;
  updatedAt: number;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  traits: string[];
  relationships: Array<{
    targetId: string;
    type: string;
    description: string;
  }>;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  timestamp: number;
  relatedCharacters: string[];
}

export interface SubPlot {
  id: string;
  title: string;
  description: string;
  relatedCharacters: string[];
  status: "planned" | "in-progress" | "completed";
}

export interface Setting {
  id: string;
  storyId: string;
  type: "world" | "character" | "plot" | "magic-system";
  content: string;
  updatedAt: number;
  version?: number;
}

export interface SettingHistory {
  id: string;
  settingId: string;
  content: string;
  version: number;
  createdAt: number;
}

export interface SettingMetadata {
  tags?: string[];
  references?: {
    type: string;
    id: string;
    title: string;
  }[];
  status: "draft" | "review" | "final";
}
