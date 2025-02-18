"use client";

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
    if (typeof window === "undefined") return; // 服务端不初始化

    try {
      this.db = await openDB<TaleWeaverDB>("tale-weaver-cache", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("stories")) {
            db.createObjectStore("stories", { keyPath: "id" });
          }
        },
      });
    } catch (error) {
      console.error("Failed to initialize cache:", error);
    }
  }

  // 故事相关操作
  async cacheStory(story: Story): Promise<void> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) return;

    try {
      const store = this.db
        .transaction("stories", "readwrite")
        .objectStore("stories");
      await store.put(story);
    } catch (error) {
      console.error("Failed to cache story:", error);
    }
  }

  async getCachedStories(): Promise<Story[]> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) return []; // 如果仍然没有 db，返回空数组

    try {
      const store = this.db
        .transaction("stories", "readonly")
        .objectStore("stories");
      const stories = await store.getAll();
      // 确保返回的是数组
      return Array.isArray(stories) ? stories : [];
    } catch (error) {
      console.error("Failed to get cached stories:", error);
      return [];
    }
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
