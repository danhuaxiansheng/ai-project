import { db } from "@/lib/db-schema";
import { Story, StorySession, StoryMessage } from "@/types/story";
import { cacheService } from "@/lib/cache";
import { errorHandler } from "@/lib/error-handler";
import { NovelSetting, NovelSettingHistory } from "@/types/novel-setting";
import { WorldSetting } from "@/types/worldbuilding";
import Dexie from "dexie";

export class DatabaseService {
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== "undefined";
  }

  // 故事相关操作
  async createStory(story: Story) {
    if (!this.isClient) return;

    try {
      console.log("Creating story:", story);
      // 添加到数据库
      await db.stories.add(story);
      // 更新缓存
      await cacheService.cacheStory(story);
      console.log("Story created successfully");
      // 返回创建的故事对象
      return story;
    } catch (error) {
      console.error("Error creating story:", error);
      throw error;
    }
  }

  async getStories(): Promise<Story[]> {
    // 如果是服务器端，直接返回空数组
    if (!this.isClient) return [];

    try {
      // 先尝试从缓存获取
      const cachedStories = await cacheService.getCachedStories();
      if (cachedStories.length > 0) {
        return cachedStories;
      }
      // 从数据库获取
      const stories = await db.stories.toArray();
      return stories;
    } catch (error) {
      console.error("Error getting stories:", error);
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
    debugger;
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
    if (!this.isClient || !db) return;

    try {
      const messageWithTimestamp = {
        ...message,
        timestamp: message.timestamp || Date.now(),
      };
      await db.messages.add(messageWithTimestamp);
      return messageWithTimestamp;
    } catch (error) {
      console.error("Error adding message:", error);
      throw error;
    }
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
    if (!this.isClient) return null;

    try {
      // 确保 novelId 存在且有效
      if (!novelId) {
        throw new Error("无效的小说 ID");
      }

      // 从数据库获取设置
      const settings = await db.settings
        .where("novelId")
        .equals(novelId)
        .first();

      // 如果没有找到设置，返回空对象
      if (!settings) {
        // 创建默认设置
        const defaultSettings = {
          id: crypto.randomUUID(),
          novelId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          geography: { regions: [] },
          society: { cultures: [] },
          powerSystem: { rules: [], artifacts: [] },
        };

        // 保存默认设置
        await db.settings.add(defaultSettings);
        return defaultSettings;
      }

      return settings;
    } catch (error) {
      console.error("获取小说设置失败:", error);
      throw error;
    }
  }

  // 新增：更新小说设定
  async updateNovelSettings(novelId: string, settings: any) {
    if (!this.isClient) return;

    try {
      const existingSettings = await this.getNovelSettings(novelId);
      if (existingSettings) {
        await db.settings.update(existingSettings.id, {
          ...settings,
          updatedAt: Date.now(),
        });
      } else {
        await db.settings.add({
          ...settings,
          id: crypto.randomUUID(),
          novelId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    } catch (error) {
      console.error("更新小说设置失败:", error);
      throw error;
    }
  }

  // 新增：获取章节列表
  async getChapters(novelId: string) {
    return errorHandler.withRetry(async () => {
      const response = await fetch(`/api/db?action=getChapters&id=${novelId}`);
      if (!response.ok) throw new Error("获取章节列表失败");
      return response.json();
    });
  }

  // 设定版本控制
  async createSettingVersion(setting: NovelSetting) {
    const history: NovelSettingHistory = {
      id: crypto.randomUUID(),
      settingId: setting.id,
      version: setting.version,
      changes: setting,
      createdAt: Date.now(),
      createdBy: "system", // 后续可以改为实际用户
    };

    await db.settingHistory.add(history);
    return history;
  }

  async getSettingHistory(settingId: string) {
    return await db.settingHistory
      .where("settingId")
      .equals(settingId)
      .reverse()
      .sortBy("version");
  }

  async rollbackSetting(settingId: string, version: number) {
    const history = await db.settingHistory
      .where({ settingId, version })
      .first();

    if (!history) {
      throw new Error("版本不存在");
    }

    const setting = await db.settings.get(settingId);
    if (!setting) {
      throw new Error("设定不存在");
    }

    const updatedSetting = {
      ...setting,
      ...history.changes,
      version: setting.version + 1,
      updatedAt: Date.now(),
    };

    await db.settings.put(updatedSetting);
    await this.createSettingVersion(updatedSetting);

    return updatedSetting;
  }

  // 标签管理
  async updateSettingTags(settingId: string, tags: string[]) {
    const setting = await db.settings.get(settingId);
    if (!setting) {
      throw new Error("设定不存在");
    }

    const updatedSetting = {
      ...setting,
      tags,
      version: setting.version + 1,
      updatedAt: Date.now(),
    };

    await db.settings.put(updatedSetting);
    await this.createSettingVersion(updatedSetting);

    return updatedSetting;
  }

  async searchSettingsByTag(tag: string) {
    return await db.settings
      .filter((setting) => setting.tags.includes(tag))
      .toArray();
  }

  async getStoryMessages(storyId: string) {
    if (!this.isClient || !db) return [];
    try {
      return await db.messages
        .where("[storyId+timestamp]")
        .between([storyId, Dexie.minKey], [storyId, Dexie.maxKey])
        .reverse()
        .toArray();
    } catch (error) {
      console.error("Error getting story messages:", error);
      throw error;
    }
  }

  // 世界观设定相关方法
  async createWorldSetting(setting: WorldSetting) {
    if (!this.isClient) return;
    return await db.settings.add(setting);
  }

  async getWorldSetting(storyId: string) {
    if (!this.isClient) return null;
    return await db.settings.get(storyId);
  }

  async updateWorldSetting(setting: WorldSetting) {
    if (!this.isClient) return;
    return await db.settings.put(setting);
  }

  async deleteWorldSetting(storyId: string) {
    if (!this.isClient) return;
    return await db.settings.delete(storyId);
  }

  // 版本历史相关方法
  async createSettingVersion(setting: WorldSetting) {
    if (!this.isClient) return;
    const version = {
      id: crypto.randomUUID(),
      settingId: setting.id,
      data: setting,
      createdAt: Date.now(),
    };
    return await db.settingHistory.add(version);
  }

  async getSettingVersions(settingId: string) {
    if (!this.isClient) return [];
    return await db.settingHistory
      .where("settingId")
      .equals(settingId)
      .reverse()
      .toArray();
  }
}

export const database = new DatabaseService();
