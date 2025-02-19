import { db } from "@/lib/db-schema";
import { cacheService } from "./cache";
import { Story } from "@/types/story";
import { StorySession } from "@/types/session";
import { StoryMessage } from "@/types/message";

export class SyncManager {
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== "undefined";
  }

  async clearCache() {
    if (!this.isClient) return;
    return cacheService.clearCache();
  }

  async syncCache() {
    if (!this.isClient) return;

    try {
      // 从缓存获取数据
      const stories = await cacheService.getCachedStories();
      const sessions = await Promise.all(
        stories.map((story) => cacheService.getCachedSessions(story.id))
      ).then((sessions) => sessions.flat());
      const messages = await Promise.all(
        sessions.map((session) => cacheService.getCachedMessages(session.id))
      ).then((messages) => messages.flat());

      // 批量同步到 IndexedDB
      await Promise.all([
        ...stories.map((story) => this.syncStory(story)),
        ...sessions.map((session) => this.syncSession(session)),
        ...messages.map((message) => this.syncMessage(message)),
      ]);
    } catch (error) {
      console.error("Error syncing cache:", error);
      // 不抛出错误，让应用继续运行
      console.warn("继续运行，但同步可能不完整");
    }
  }

  private async syncStory(story: Story) {
    if (!this.isClient || !db) return;

    try {
      await db.stories.put(story);
    } catch (error) {
      console.warn("Error syncing story:", story.id, error);
    }
  }

  private async syncSession(session: StorySession) {
    if (!this.isClient) return;

    try {
      await db.sessions.put(session); // 使用 put 替代 add
    } catch (error) {
      console.warn("Error syncing session:", session.id, error);
    }
  }

  private async syncMessage(message: StoryMessage) {
    if (!this.isClient) return;

    try {
      await db.messages.put(message); // 使用 put 替代 add
    } catch (error) {
      console.warn("Error syncing message:", message.id, error);
    }
  }
}

export const syncManager = new SyncManager();
