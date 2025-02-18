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
