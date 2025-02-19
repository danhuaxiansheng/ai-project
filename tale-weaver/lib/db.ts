import Dexie, { Table } from "dexie";
import { Story } from "@/types/story";
import { StorySession } from "@/types/session";
import { StoryMessage } from "@/types/message";
import { WorldSetting } from "@/types/worldbuilding";

export class NovelDatabase extends Dexie {
  stories!: Table<Story>;
  sessions!: Table<StorySession>;
  messages!: Table<StoryMessage>;
  settings!: Table<WorldSetting>;

  constructor() {
    super("NovelDatabase");

    // 删除旧版本
    this.version(1)
      .stores({})
      .upgrade(() => {});

    // 创建新版本
    this.version(3).stores({
      stories: "id, title, createdAt, updatedAt",
      sessions: "id, storyId, title, createdAt, updatedAt",
      messages:
        "id, sessionId, storyId, timestamp, createdAt, [storyId+timestamp]", // 添加复合索引
      settings: "id, novelId, createdAt, updatedAt",
    });
  }
}

// 创建数据库实例
export const db = new NovelDatabase();

// 添加数据库初始化函数
export async function initDatabase() {
  try {
    // 删除旧数据库
    await Dexie.delete("NovelDatabase");

    // 重新打开数据库
    await db.open();

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}
