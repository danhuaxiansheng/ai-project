import Dexie, { Table } from "dexie";
import { Story, StorySession, StoryMessage } from "@/types/story";
import { NovelSetting, NovelSettingHistory } from "@/types/novel-setting";

class TaleWeaverDB extends Dexie {
  stories!: Table<Story>;
  sessions!: Table<StorySession>;
  messages!: Table<StoryMessage>;
  settings!: Table<NovelSetting>;
  settingHistory!: Table<NovelSettingHistory>;
  cache!: Table<any>;

  constructor() {
    super("TaleWeaverDB");

    this.version(1).stores({
      stories: "id, title, createdAt, updatedAt",
      sessions: "id, storyId, title, type, createdAt, updatedAt",
      messages: "id, sessionId, storyId, role, timestamp",
    });

    this.version(2).stores({
      settings: "id, novelId, title, version, updatedAt",
      settingHistory: "id, settingId, version, createdAt",
    });

    this.version(3).stores({
      cache: "key, value, timestamp",
    });
  }
}

// 创建单例实例
const db = typeof window !== "undefined" ? new TaleWeaverDB() : null;

// 导出数据库实例
export { db };
