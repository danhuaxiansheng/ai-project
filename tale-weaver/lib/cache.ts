"use client";

import { db } from "./db-schema";
import { Story, StorySession, StoryMessage } from "@/types/story";

export class CacheService {
  private readonly CACHE_PREFIX = "tale-weaver-cache:";
  private readonly STORIES_CACHE_KEY = `${this.CACHE_PREFIX}stories`;
  private readonly SESSIONS_CACHE_KEY = `${this.CACHE_PREFIX}sessions`;

  constructor() {
    this.initCache();
  }

  private async initCache() {
    if (typeof window === "undefined") return;
    try {
      // 确保缓存表存在
      await db.cache.count();
    } catch (error) {
      console.warn("Initializing cache table...");
      await db.version(3).stores({
        cache: "key, value, timestamp",
      });
    }
  }

  async cacheStory(story: Story): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      const stories = await this.getCachedStories();
      const updatedStories = Array.isArray(stories)
        ? [...stories.filter((s) => s.id !== story.id), story]
        : [story];

      await db.cache.put({
        key: this.STORIES_CACHE_KEY,
        value: updatedStories,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error caching story:", error);
    }
  }

  async getCachedStories(): Promise<Story[]> {
    if (typeof window === "undefined") return [];

    try {
      const cache = await db.cache.get(this.STORIES_CACHE_KEY);
      return cache?.value || [];
    } catch (error) {
      console.error("Error getting cached stories:", error);
      return [];
    }
  }

  async getCachedSessions(): Promise<StorySession[]> {
    if (typeof window === "undefined") return [];

    try {
      const cache = await db.cache.get(this.SESSIONS_CACHE_KEY);
      return cache?.value || [];
    } catch (error) {
      console.error("Error getting cached sessions:", error);
      return [];
    }
  }

  async clearCache() {
    if (typeof window === "undefined") return;

    try {
      await db.cache.clear();
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }
}

export const cacheService = new CacheService();
