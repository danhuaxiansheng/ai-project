"use client";

import { Story, StorySession } from "@/types/story";

const CACHE_PREFIX = 'tale-weaver:';
const CACHE_KEYS = {
  STORIES: `${CACHE_PREFIX}stories`,
  SESSIONS: `${CACHE_PREFIX}sessions`,
} as const;

const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

interface CacheData<T> {
  data: T;
  timestamp: number;
}

export const cacheService = {
  private isClient: boolean = typeof window !== "undefined",

  // 通用缓存方法
  async getCache<T>(key: string): Promise<T | null> {
    if (!this.isClient) return null;
    
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached) as CacheData<T>;
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  },

  async setCache<T>(key: string, data: T): Promise<void> {
    if (!this.isClient) return;
    
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  },

  // 故事相关缓存方法
  async getCachedStories(): Promise<Story[]> {
    return await this.getCache<Story[]>(CACHE_KEYS.STORIES) || [];
  },

  async cacheStory(story: Story): Promise<void> {
    const stories = await this.getCachedStories();
    const index = stories.findIndex(s => s.id === story.id);
    
    if (index > -1) {
      stories[index] = story;
    } else {
      stories.push(story);
    }

    await this.setCache(CACHE_KEYS.STORIES, stories);
  },

  async removeStoryFromCache(id: string): Promise<void> {
    const stories = await this.getCachedStories();
    const filtered = stories.filter(s => s.id !== id);
    await this.setCache(CACHE_KEYS.STORIES, filtered);
  },

  // 会话相关缓存方法
  async getCachedSessions(): Promise<StorySession[]> {
    return await this.getCache<StorySession[]>(CACHE_KEYS.SESSIONS) || [];
  },

  async cacheSession(session: StorySession): Promise<void> {
    const sessions = await this.getCachedSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    
    if (index > -1) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }

    await this.setCache(CACHE_KEYS.SESSIONS, sessions);
  },

  clearCache(): void {
    if (!this.isClient) return;
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
};
