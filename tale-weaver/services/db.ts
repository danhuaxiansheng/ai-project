import { db } from "@/lib/db-schema";
import { Story, StorySession, StoryMessage } from "@/types/story";
import { cacheService } from "@/lib/cache";
import { errorHandler } from "@/lib/error-handler";
import { NovelSetting } from "@/types/novel-setting";

export class DatabaseService {
  // 故事相关操作
  async createStory(story: Story) {
    await db.stories.add(story);
    await cacheService.cacheStory(story);
  }

  async getStories(): Promise<Story[]> {
    if (typeof window === "undefined") {
      return []; // 服务端返回空数组
    }

    try {
      const stories = await cacheService.getCachedStories();
      // 确保返回的是数组
      if (!Array.isArray(stories)) {
        console.warn("Stories is not an array:", stories);
        return [];
      }
      return stories;
    } catch (error) {
      console.error("Error fetching stories:", error);
      return [];
    }
  }

  async updateStory(id: string, updates: Partial<Story>) {
    await db.stories.update(id, updates);
  }

  async deleteStory(id: string) {
    await db.stories.delete(id);
  }

  // 会话相关操作
  async createSession(session: StorySession) {
    await db.sessions.add(session);
  }

  async getStorySessions(storyId: string) {
    return await db.sessions
      .filter((session) => session.storyId === storyId)
      .toArray();
  }

  async updateSession(id: string, updates: Partial<StorySession>) {
    await db.sessions.update(id, updates);
  }

  async deleteSession(id: string) {
    await db.sessions.delete(id);
  }

  // 消息相关操作
  async addMessage(message: StoryMessage) {
    await db.messages.add(message);
  }

  async getSessionMessages(sessionId: string) {
    return await db.messages
      .filter((message) => message.sessionId === sessionId)
      .toArray();
  }

  async updateMessage(id: string, updates: Partial<StoryMessage>) {
    await db.messages.update(id, updates);
  }

  async deleteMessage(id: string) {
    await db.messages.delete(id);
  }

  // 实用方法
  async getStoryWithSessions(storyId: string) {
    const story = await db.stories.get(storyId);
    const sessions = await db.sessions
      .filter((session) => session.storyId === storyId)
      .toArray();
    return { story, sessions };
  }

  async getSessionWithMessages(sessionId: string) {
    const session = await db.sessions.get(sessionId);
    const messages = await db.messages
      .filter((message) => message.sessionId === sessionId)
      .toArray();
    return { session, messages };
  }

  async saveStory(story: Story): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      await cacheService.cacheStory(story);
    } catch (error) {
      console.error("Error saving story:", error);
    }
  }

  // 新增：获取小说设定
  async getNovelSettings(novelId: string) {
    return errorHandler.withRetry(async () => {
      const response = await fetch(
        `/api/db?action=getNovelSettings&id=${novelId}`
      );
      if (!response.ok) throw new Error("获取小说设定失败");
      return response.json();
    });
  }

  // 新增：更新小说设定
  async updateNovelSettings(novelId: string, settings: Partial<NovelSetting>) {
    return errorHandler.withRetry(async () => {
      const response = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateNovelSettings",
          data: { novelId, settings },
        }),
      });
      if (!response.ok) throw new Error("更新小说设定失败");
      return response.json();
    });
  }

  // 新增：获取章节列表
  async getChapters(novelId: string) {
    return errorHandler.withRetry(async () => {
      const response = await fetch(`/api/db?action=getChapters&id=${novelId}`);
      if (!response.ok) throw new Error("获取章节列表失败");
      return response.json();
    });
  }
}

export const database = new DatabaseService();
