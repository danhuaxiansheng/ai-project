import Dexie, { Table } from "dexie";
import { Story, Chapter, Outline } from "@/types/story";
import { StorySession } from "@/types/session";
import { StoryMessage } from "@/types/message";
import { WorldSetting } from "@/types/worldbuilding";
import { Character } from "@/types/character";
import { generateUUID } from "@/lib/utils";
import { Location } from "@/types/location";
import { TimelineEvent } from "@/types/timeline";

export class NovelDatabase extends Dexie {
  stories!: Table<Story>;
  sessions!: Table<StorySession>;
  messages!: Table<StoryMessage>;
  settings!: Table<WorldSetting>;
  chapters!: Table<Chapter>;
  outlines!: Table<Outline>;
  characters!: Table<Character>;
  locations!: Table<Location>;
  timeline!: Table<TimelineEvent>;

  constructor() {
    super("NovelDatabase");

    // 删除旧版本
    this.version(1)
      .stores({})
      .upgrade(() => {});

    // 创建新版本
    this.version(5).stores({
      stories: "id, title, createdAt, updatedAt",
      sessions: "id, storyId, title, createdAt, updatedAt",
      messages:
        "id, sessionId, storyId, timestamp, createdAt, [storyId+timestamp]", // 添加复合索引
      settings: "id, storyId, createdAt, updatedAt",
      chapters: "id, storyId, title, order, status",
      outlines: "id, storyId, title, type, parentId, order",
      characters: "id, storyId, name, role",
      locations: "id, storyId, name",
      timeline: "id, storyId, date, importance",
    });
  }
}

// 创建数据库实例
export const db = new NovelDatabase();

// 添加数据库初始化函数
export async function initDatabase() {
  try {
    // 删除旧数据库
    await Dexie.delete("NovelDatabase");

    // 重新打开数据库
    await db.open();

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}

// 故事相关操作
export async function getStories(): Promise<Story[]> {
  return await db.stories.toArray();
}

export async function getStoryById(id: string): Promise<Story | undefined> {
  return await db.stories.get(id);
}

export async function createStory(story: Story): Promise<void> {
  await db.stories.add(story);
}

export async function updateStory(id: string, updates: Partial<Story>): Promise<void> {
  await db.stories.update(id, updates);
}

export async function deleteStory(id: string): Promise<void> {
  await db.transaction('rw', [
    db.stories, 
    db.chapters, 
    db.outlines, 
    db.settings,
    db.characters,
    db.locations,
    db.timeline,
    db.sessions,
    db.messages
  ], async () => {
    // 删除所有相关数据
    await Promise.all([
      db.outlines.where('storyId').equals(id).delete(),
      db.chapters.where('storyId').equals(id).delete(),
      db.settings.where('storyId').equals(id).delete(),
      db.characters.where('storyId').equals(id).delete(),
      db.locations.where('storyId').equals(id).delete(),
      db.timeline.where('storyId').equals(id).delete(),
      db.sessions.where('storyId').equals(id).delete(),
      db.messages.where('storyId').equals(id).delete(),
      db.stories.delete(id)
    ]);
  });
}

// 章节相关操作
export async function getChaptersByStoryId(storyId: string): Promise<Chapter[]> {
  return await db.chapters.where('storyId').equals(storyId).toArray();
}

export async function updateChapters(storyId: string, chapters: Chapter[]): Promise<void> {
  await db.transaction('rw', [db.chapters, db.stories], async () => {
    // 更新章节
    await db.chapters.where('storyId').equals(storyId).delete();
    await db.chapters.bulkAdd(chapters);

    // 更新故事进度
    const publishedCount = chapters.filter(c => c.status === 'published').length;
    const progress = Math.round((publishedCount / chapters.length) * 100) || 0;
    
    await db.stories.update(storyId, {
      progress,
      updatedAt: Date.now()
    });
  });
}

// 大纲相关操作
export async function getOutlinesByStoryId(storyId: string): Promise<Outline[]> {
  return await db.outlines.where('storyId').equals(storyId).toArray();
}

export async function updateOutlines(storyId: string, outlines: Outline[]): Promise<void> {
  await db.transaction('rw', [db.outlines, db.stories], async () => {
    // 更新大纲
    await db.outlines.where('storyId').equals(storyId).delete();
    await db.outlines.bulkAdd(outlines.map(outline => ({
      ...outline,
      storyId,
      updatedAt: Date.now()
    })));

    // 更新故事
    await db.stories.update(storyId, {
      'settings.outlines': outlines,
      updatedAt: Date.now()
    });
  });
}

// 世界观设定相关操作
export async function getWorldSettingByStoryId(storyId: string): Promise<WorldSetting | undefined> {
  return await db.settings.where('storyId').equals(storyId).first();
}

export async function updateWorldSetting(storyId: string, settings: WorldSetting): Promise<void> {
  const existing = await getWorldSettingByStoryId(storyId);
  if (existing) {
    await db.settings.update(existing.id, {
      ...settings,
      updatedAt: Date.now(),
    });
  } else {
    await db.settings.add({
      ...settings,
      id: generateUUID(),
      storyId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }
}

// 角色相关操作
export async function updateCharacters(storyId: string, characters: Character[]): Promise<void> {
  await db.transaction('rw', [db.characters, db.stories], async () => {
    // 更新角色
    await db.characters.where('storyId').equals(storyId).delete();
    await db.characters.bulkAdd(characters.map(character => ({
      ...character,
      storyId,
      updatedAt: Date.now()
    })));

    // 更新故事
    await db.stories.update(storyId, {
      'settings.characters': characters,
      updatedAt: Date.now()
    });
  });
}

// 添加新的数据库操作函数
export async function getLocationsByStoryId(storyId: string): Promise<Location[]> {
  return await db.locations.where('storyId').equals(storyId).toArray();
}

export async function updateLocations(storyId: string, locations: Location[]): Promise<void> {
  await db.transaction('rw', db.locations, async () => {
    await db.locations.where('storyId').equals(storyId).delete();
    await db.locations.bulkAdd(locations);
  });
}

export async function getTimelineByStoryId(storyId: string): Promise<TimelineEvent[]> {
  return await db.timeline.where('storyId').equals(storyId).toArray();
}

export async function updateTimeline(storyId: string, events: TimelineEvent[]): Promise<void> {
  await db.transaction('rw', db.timeline, async () => {
    await db.timeline.where('storyId').equals(storyId).delete();
    await db.timeline.bulkAdd(events);
  });
}

// 添加批量操作函数
export async function bulkUpdateStoryData(storyId: string, updates: {
  chapters?: Chapter[];
  outlines?: Outline[];
  characters?: Character[];
  locations?: Location[];
  timeline?: TimelineEvent[];
  worldbuilding?: WorldSetting;
}): Promise<void> {
  await db.transaction('rw', [
    db.stories,
    db.chapters,
    db.outlines,
    db.characters,
    db.locations,
    db.timeline,
    db.settings
  ], async () => {
    const updatePromises: Promise<void>[] = [];

    if (updates.chapters) {
      updatePromises.push(updateChapters(storyId, updates.chapters));
    }
    if (updates.outlines) {
      updatePromises.push(updateOutlines(storyId, updates.outlines));
    }
    if (updates.characters) {
      updatePromises.push(updateCharacters(storyId, updates.characters));
    }
    if (updates.locations) {
      updatePromises.push(updateLocations(storyId, updates.locations));
    }
    if (updates.timeline) {
      updatePromises.push(updateTimeline(storyId, updates.timeline));
    }
    if (updates.worldbuilding) {
      updatePromises.push(updateWorldSetting(storyId, updates.worldbuilding));
    }

    await Promise.all(updatePromises);
  });
}
