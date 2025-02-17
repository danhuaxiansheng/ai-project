import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Story, StorySession, StoryMessage } from "@/types/story";

interface TaleWeaverDB extends DBSchema {
  stories: {
    key: string;
    value: Story;
    indexes: { "by-updated": number };
  };
  sessions: {
    key: string;
    value: StorySession;
    indexes: { "by-story": string };
  };
  messages: {
    key: string;
    value: StoryMessage;
    indexes: { "by-session": string };
  };
}

class CacheService {
  private db: IDBPDatabase<TaleWeaverDB> | null = null;

  async init() {
    if (this.db) return;

    this.db = await openDB<TaleWeaverDB>("tale-weaver", 1, {
      upgrade(db) {
        // 故事表
        const storyStore = db.createObjectStore("stories", { keyPath: "id" });
        storyStore.createIndex("by-updated", "updatedAt");

        // 会话表
        const sessionStore = db.createObjectStore("sessions", {
          keyPath: "id",
        });
        sessionStore.createIndex("by-story", "storyId");

        // 消息表
        const messageStore = db.createObjectStore("messages", {
          keyPath: "id",
        });
        messageStore.createIndex("by-session", "sessionId");
      },
    });
  }

  // 故事相关操作
  async cacheStory(story: Story) {
    await this.init();
    await this.db!.put("stories", story);
  }

  async getCachedStories(): Promise<Story[]> {
    await this.init();
    return this.db!.getAllFromIndex("stories", "by-updated");
  }

  // 会话相关操作
  async cacheSession(session: StorySession) {
    await this.init();
    await this.db!.put("sessions", session);
  }

  async getCachedSessions(storyId: string): Promise<StorySession[]> {
    await this.init();
    return this.db!.getAllFromIndex("sessions", "by-story", storyId);
  }

  // 消息相关操作
  async cacheMessage(message: StoryMessage) {
    await this.init();
    await this.db!.put("messages", message);
  }

  async getCachedMessages(sessionId: string): Promise<StoryMessage[]> {
    await this.init();
    return this.db!.getAllFromIndex("messages", "by-session", sessionId);
  }

  // 清理缓存
  async clearCache() {
    await this.init();
    await Promise.all([
      this.db!.clear("stories"),
      this.db!.clear("sessions"),
      this.db!.clear("messages"),
    ]);
  }
}

export const cacheService = new CacheService();
