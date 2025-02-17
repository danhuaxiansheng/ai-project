import { Story, StorySession, StoryMessage } from "@/types/story";
import { errorHandler } from "./error-handler";
import { cacheService } from "./cache";

class StoryDB {
  async createStory(story: Story) {
    return errorHandler.withRetry(async () => {
      const response = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createStory",
          data: story,
        }),
      });
      if (!response.ok) throw new Error("Failed to create story");
      await cacheService.cacheStory(story);
      return response.json();
    });
  }

  async getStories() {
    return errorHandler.withRetry(async () => {
      try {
        // 先尝试从缓存获取
        const cachedStories = await cacheService.getCachedStories();
        if (cachedStories.length > 0) {
          return cachedStories;
        }

        // 缓存未命中，从服务器获取
        const response = await fetch("/api/db?action=getStories");
        if (!response.ok) throw new Error("Failed to get stories");
        const stories = await response.json();

        // 缓存结果
        await Promise.all(
          stories.map((story) => cacheService.cacheStory(story))
        );
        return stories;
      } catch (error) {
        console.error("Error fetching stories:", error);
        // 如果有缓存数据，在出错时返回缓存
        const cachedStories = await cacheService.getCachedStories();
        if (cachedStories.length > 0) {
          return cachedStories;
        }
        throw error;
      }
    });
  }

  async createSession(session: StorySession) {
    return errorHandler.withRetry(async () => {
      const response = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createSession",
          data: session,
        }),
      });
      if (!response.ok) throw new Error("Failed to create session");
      await cacheService.cacheSession(session);
      return response.json();
    });
  }

  async getStorySessions(storyId: string) {
    return errorHandler.withRetry(async () => {
      try {
        // 先尝试从缓存获取
        const cachedSessions = await cacheService.getCachedSessions(storyId);
        if (cachedSessions.length > 0) {
          return cachedSessions;
        }

        // 缓存未命中，从服务器获取
        const response = await fetch(
          `/api/db?action=getStorySessions&id=${storyId}`
        );
        if (!response.ok) throw new Error("Failed to get story sessions");
        const sessions = await response.json();

        // 缓存结果
        await Promise.all(
          sessions.map((session) => cacheService.cacheSession(session))
        );
        return sessions;
      } catch (error) {
        console.error("Error fetching sessions:", error);
        // 如果有缓存数据，在出错时返回缓存
        const cachedSessions = await cacheService.getCachedSessions(storyId);
        if (cachedSessions.length > 0) {
          return cachedSessions;
        }
        throw error;
      }
    });
  }

  async addMessage(message: StoryMessage) {
    return errorHandler.withRetry(async () => {
      const response = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addMessage",
          data: message,
        }),
      });
      if (!response.ok) throw new Error("Failed to add message");
      await cacheService.cacheMessage(message);
      return response.json();
    });
  }

  async getSessionMessages(sessionId: string) {
    return errorHandler.withRetry(async () => {
      try {
        // 先尝试从缓存获取
        const cachedMessages = await cacheService.getCachedMessages(sessionId);
        if (cachedMessages.length > 0) {
          return cachedMessages;
        }

        // 缓存未命中，从服务器获取
        const response = await fetch(
          `/api/db?action=getSessionMessages&id=${sessionId}`
        );
        if (!response.ok) throw new Error("Failed to get session messages");
        const messages = await response.json();

        // 缓存结果
        await Promise.all(
          messages.map((message) => cacheService.cacheMessage(message))
        );
        return messages;
      } catch (error) {
        console.error("Error fetching messages:", error);
        // 如果有缓存数据，在出错时返回缓存
        const cachedMessages = await cacheService.getCachedMessages(sessionId);
        if (cachedMessages.length > 0) {
          return cachedMessages;
        }
        throw error;
      }
    });
  }

  async getStorySettings(storyId: string, type: string = "setting") {
    return errorHandler.withRetry(async () => {
      const response = await fetch(
        `/api/db?action=getStorySettings&id=${storyId}&type=${type}`
      );
      if (!response.ok) throw new Error("Failed to get story settings");
      const settings = await response.json();
      // 设定也作为消息缓存
      await Promise.all(
        settings.map((setting) => cacheService.cacheMessage(setting))
      );
      return settings;
    });
  }

  async searchSettings(storyId: string, query: string) {
    return errorHandler.withRetry(async () => {
      const response = await fetch(
        `/api/db?action=searchSettings&id=${storyId}&query=${encodeURIComponent(
          query
        )}`
      );
      if (!response.ok) throw new Error("Failed to search settings");
      return response.json();
    });
  }

  async addSetting(message: StoryMessage) {
    return this.addMessage({
      ...message,
      metadata: {
        ...message.metadata,
        type: "setting",
      },
    });
  }

  // 新增：清理缓存
  async clearCache() {
    return cacheService.clearCache();
  }

  // 新增：同步缓存到服务器
  async syncCache() {
    try {
      const stories = await cacheService.getCachedStories();
      const sessions = await Promise.all(
        stories.map((story) => cacheService.getCachedSessions(story.id))
      ).then((sessions) => sessions.flat());
      const messages = await Promise.all(
        sessions.map((session) => cacheService.getCachedMessages(session.id))
      ).then((messages) => messages.flat());

      // 批量同步到服务器
      await Promise.all([
        ...stories.map((story) => this.createStory(story)),
        ...sessions.map((session) => this.createSession(session)),
        ...messages.map((message) => this.addMessage(message)),
      ]);
    } catch (error) {
      console.error("Error syncing cache:", error);
      throw error;
    }
  }
}

export const storyDB = new StoryDB();
