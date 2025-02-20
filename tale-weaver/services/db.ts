import { db } from "@/lib/db-schema";
import { Story, StorySession, StoryMessage } from "@/types/story";
import { cacheService } from "@/lib/cache";
import { errorHandler } from "@/lib/error-handler";
import { NovelSetting, NovelSettingHistory } from "@/types/novel-setting";
import { WorldSetting } from "@/types/worldbuilding";
import Dexie, { Table } from "dexie";

export class DatabaseService extends Dexie {
  stories!: Table<Story, string>;
  sessions!: Table<StorySession, string>;
  messages!: Table<StoryMessage, string>;
  settings!: Table<WorldSetting, string>;
  settingHistory!: Table<any, string>;

  constructor() {
    super('tale-weaver');
    this.version(1).stores({
      stories: 'id, title, status, createdAt, updatedAt',
      sessions: 'id, storyId, title, type, createdAt',
      messages: 'id, sessionId, [storyId+timestamp]',
      settings: 'id, storyId, createdAt',
      settingHistory: 'id, settingId, version, createdAt'
    });
  }

  private isClient = typeof window !== "undefined";

  async getStories(): Promise<Story[]> {
    try {
      const cachedStories = await cacheService.getCachedStories();
      if (cachedStories.length > 0) {
        return cachedStories;
      }
      const stories = await this.stories.toArray();
      await cacheService.setCache(CACHE_KEYS.STORIES, stories);
      return stories;
    } catch (error) {
      console.error("Error getting stories:", error);
      return [];
    }
  }

  async createStory(story: Story): Promise<string> {
    try {
      const id = await this.stories.add(story);
      await cacheService.cacheStory(story);
      return id;
    } catch (error) {
      console.error("Error creating story:", error);
      throw error;
    }
  }

  async updateStory(id: string, updates: Partial<Story>): Promise<void> {
    await this.stories.update(id, { ...updates, updatedAt: Date.now() });
    const updatedStory = await this.stories.get(id);
    if (updatedStory) {
      await cacheService.cacheStory(updatedStory);
    }
  }

  async deleteStory(id: string): Promise<void> {
    await this.stories.delete(id);
    await cacheService.removeStoryFromCache(id);
  }

  async searchStories(query: string): Promise<Story[]> {
    return this.stories
      .filter(story => 
        story.title.toLowerCase().includes(query.toLowerCase()) ||
        story.excerpt.toLowerCase().includes(query.toLowerCase())
      )
      .toArray();
  }

  async createSession(session: StorySession) {
    await this.sessions.add(session);
  }

  async getStorySessions(storyId: string) {
    debugger;
    return await this.sessions
      .filter((session) => session.storyId === storyId)
      .toArray();
  }

  async updateSession(id: string, updates: Partial<StorySession>) {
    await this.sessions.update(id, updates);
  }

  async deleteSession(id: string) {
    await this.sessions.delete(id);
  }

  async addMessage(message: StoryMessage) {
    if (!this.isClient || !db) return;

    try {
      const messageWithTimestamp = {
        ...message,
        timestamp: message.timestamp || Date.now(),
      };
      await this.messages.add(messageWithTimestamp);
      return messageWithTimestamp;
    } catch (error) {
      console.error("Error adding message:", error);
      throw error;
    }
  }

  async getSessionMessages(sessionId: string) {
    return await this.messages
      .filter((message) => message.sessionId === sessionId)
      .toArray();
  }

  async updateMessage(id: string, updates: Partial<StoryMessage>) {
    await this.messages.update(id, updates);
  }

  async deleteMessage(id: string) {
    await this.messages.delete(id);
  }

  async getStoryWithSessions(storyId: string) {
    const story = await this.stories.get(storyId);
    const sessions = await this.sessions
      .filter((session) => session.storyId === storyId)
      .toArray();
    return { story, sessions };
  }

  async getSessionWithMessages(sessionId: string) {
    const session = await this.sessions.get(sessionId);
    const messages = await this.messages
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

  async getNovelSettings(novelId: string) {
    if (!this.isClient) return null;

    try {
      if (!novelId) {
        throw new Error("无效的小说 ID");
      }

      const settings = await this.settings
        .where("novelId")
        .equals(novelId)
        .first();

      if (!settings) {
        const defaultSettings = {
          id: crypto.randomUUID(),
          novelId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          geography: { regions: [] },
          society: { cultures: [] },
          powerSystem: { rules: [], artifacts: [] },
        };

        await this.settings.add(defaultSettings);
        return defaultSettings;
      }

      return settings;
    } catch (error) {
      console.error("获取小说设置失败:", error);
      throw error;
    }
  }

  async updateNovelSettings(novelId: string, settings: any) {
    if (!this.isClient) return;

    try {
      const existingSettings = await this.getNovelSettings(novelId);
      if (existingSettings) {
        await this.settings.update(existingSettings.id, {
          ...settings,
          updatedAt: Date.now(),
        });
      } else {
        await this.settings.add({
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

  async getChapters(storyId: string): Promise<Chapter[]> {
    if (!this.isClient) return [];
    try {
      const story = await this.stories.get(storyId);
      return story?.chapters || [];
    } catch (error) {
      console.error("Error getting chapters:", error);
      return [];
    }
  }

  async updateChapters(storyId: string, chapters: Chapter[]): Promise<void> {
    if (!this.isClient) return;
    try {
      await this.stories.update(storyId, {
        chapters,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error("Error updating chapters:", error);
      throw error;
    }
  }

  async getChapterById(storyId: string, chapterId: string): Promise<Chapter | undefined> {
    if (!this.isClient) return undefined;
    try {
      const story = await this.stories.get(storyId);
      return story?.chapters?.find(c => c.id === chapterId);
    } catch (error) {
      console.error("Error getting chapter:", error);
      return undefined;
    }
  }

  async updateChapter(storyId: string, chapter: Chapter): Promise<void> {
    if (!this.isClient) return;
    try {
      const story = await this.stories.get(storyId);
      if (!story) throw new Error("Story not found");

      const chapters = story.chapters || [];
      const index = chapters.findIndex(c => c.id === chapter.id);
      
      if (index > -1) {
        chapters[index] = chapter;
      } else {
        chapters.push(chapter);
      }

      await this.stories.update(storyId, {
        chapters,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error("Error updating chapter:", error);
      throw error;
    }
  }

  async deleteChapter(storyId: string, chapterId: string): Promise<void> {
    if (!this.isClient) return;
    try {
      const story = await this.stories.get(storyId);
      if (!story) throw new Error("Story not found");

      const chapters = story.chapters?.filter(c => c.id !== chapterId) || [];
      
      // 重新排序
      chapters.forEach((chapter, index) => {
        chapter.order = index;
      });

      await this.stories.update(storyId, {
        chapters,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error("Error deleting chapter:", error);
      throw error;
    }
  }

  async reorderChapters(storyId: string, chapterIds: string[]): Promise<void> {
    if (!this.isClient) return;
    try {
      const story = await this.stories.get(storyId);
      if (!story) throw new Error("Story not found");

      const chapters = story.chapters || [];
      const reorderedChapters = chapterIds
        .map((id, index) => {
          const chapter = chapters.find(c => c.id === id);
          return chapter ? { ...chapter, order: index } : null;
        })
        .filter((c): c is Chapter => c !== null);

      await this.stories.update(storyId, {
        chapters: reorderedChapters,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error("Error reordering chapters:", error);
      throw error;
    }
  }

  async createSettingVersion(setting: NovelSetting) {
    const history: NovelSettingHistory = {
      id: crypto.randomUUID(),
      settingId: setting.id,
      version: setting.version,
      changes: setting,
      createdAt: Date.now(),
      createdBy: "system",
    };

    await this.settingHistory.add(history);
    return history;
  }

  async getSettingHistory(settingId: string) {
    return await this.settingHistory
      .where("settingId")
      .equals(settingId)
      .reverse()
      .sortBy("version");
  }

  async rollbackSetting(settingId: string, version: number) {
    const history = await this.settingHistory
      .where({ settingId, version })
      .first();

    if (!history) {
      throw new Error("版本不存在");
    }

    const setting = await this.settings.get(settingId);
    if (!setting) {
      throw new Error("设定不存在");
    }

    const updatedSetting = {
      ...setting,
      ...history.changes,
      version: setting.version + 1,
      updatedAt: Date.now(),
    };

    await this.settings.put(updatedSetting);
    await this.createSettingVersion(updatedSetting);

    return updatedSetting;
  }

  async updateSettingTags(settingId: string, tags: string[]) {
    const setting = await this.settings.get(settingId);
    if (!setting) {
      throw new Error("设定不存在");
    }

    const updatedSetting = {
      ...setting,
      tags,
      version: setting.version + 1,
      updatedAt: Date.now(),
    };

    await this.settings.put(updatedSetting);
    await this.createSettingVersion(updatedSetting);

    return updatedSetting;
  }

  async searchSettingsByTag(tag: string) {
    return await this.settings
      .filter((setting) => setting.tags.includes(tag))
      .toArray();
  }

  async getStoryMessages(storyId: string) {
    if (!this.isClient) return [];
    try {
      return await this.messages
        .where("[storyId+timestamp]")
        .between([storyId, Dexie.minKey], [storyId, Dexie.maxKey])
        .reverse()
        .toArray();
    } catch (error) {
      console.error("Error getting story messages:", error);
      throw error;
    }
  }

  async getWorldSetting(storyId: string): Promise<WorldSetting | undefined> {
    return await this.settings.where('storyId').equals(storyId).first();
  }

  async updateWorldSetting(setting: WorldSetting): Promise<void> {
    const { id, ...updates } = setting;
    await this.settings.update(id, { ...updates, updatedAt: Date.now() });
    await this.createSettingVersion(setting);
  }

  async deleteWorldSetting(storyId: string) {
    if (!this.isClient) return;
    return await this.settings.delete(storyId);
  }

  async createSettingVersion(setting: WorldSetting) {
    if (!this.isClient) return;
    const version = {
      id: crypto.randomUUID(),
      settingId: setting.id,
      data: setting,
      createdAt: Date.now(),
    };
    return await this.settingHistory.add(version);
  }

  async getSettingVersions(settingId: string) {
    if (!this.isClient) return [];
    return await this.settingHistory
      .where("settingId")
      .equals(settingId)
      .reverse()
      .toArray();
  }
}

export const database = new DatabaseService();
