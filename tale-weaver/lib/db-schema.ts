import Dexie, { Table } from "dexie";
import { Story, StorySession, StoryMessage } from "@/types/story";
import { NovelSetting, NovelSettingHistory } from "@/types/novel-setting";

let db: TaleWeaverDB;

export class TaleWeaverDB extends Dexie {
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
      messages: "id, sessionId, storyId, [storyId+timestamp], timestamp",
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

// 确保只在客户端初始化数据库
if (typeof window !== "undefined") {
  db = new TaleWeaverDB();
}

export { db };
