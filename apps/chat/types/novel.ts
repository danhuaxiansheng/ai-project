export interface NovelSetting {
  genre: string[]; // 小说类型
  theme: string[]; // 主题
  targetLength: number; // 目标字数
  style: string[]; // 写作风格
  constraints: string[]; // 创作限制
}

export interface Novel {
  id: string;
  title: string;
  description: string;
  status: "draft" | "creating" | "paused" | "completed";
  progress: number; // 创作进度 0-100
  currentChapter: number;
  totalChapters: number;
  settings: NovelSetting;
  createdAt: string;
  updatedAt: string;
}
