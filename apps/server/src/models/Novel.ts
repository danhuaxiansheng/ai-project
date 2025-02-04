export interface NovelSetting {
  genre: string[];
  theme: string[];
  targetLength: number;
  style: string[];
  constraints: string[];
}

export interface Novel {
  id: string;
  title: string;
  description: string;
  status: "draft" | "creating" | "paused" | "completed";
  progress: number;
  currentChapter: number;
  totalChapters: number;
  settings: NovelSetting;
  createdAt: string;
  updatedAt: string;
}
