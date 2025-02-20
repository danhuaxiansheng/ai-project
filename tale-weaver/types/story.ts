import { Character } from "./character";
import { TimelineEvent } from "./timeline";
import { Location } from "./location";
import { WorldSetting } from "./worldbuilding";

export interface Outline {
  id: string;
  storyId: string;
  title: string;
  content: string;
  type: 'plot' | 'scene' | 'note';
  order: number;
  chapterId?: string;  // 关联的章节ID
  parentId?: string;   // 父节点ID，用于层级结构
  children?: Outline[];
  createdAt: number;
  updatedAt: number;
}

export interface Chapter {
  id: string;
  storyId: string;
  title: string;
  content: string;
  order: number;
  status: 'draft' | 'published';
  wordCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: 'ongoing' | 'completed' | 'draft';
  progress: number;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  settings?: {
    worldview?: string;
    characters?: Character[];
    timeline?: TimelineEvent[];
    locations?: Location[];
    worldbuilding?: WorldSetting;
    outlines?: Outline[];
  };
  chapters?: Chapter[];
}

export interface Character {
  id: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting';
  description: string;
  background: string;
  relationships: CharacterRelationship[];
}

export interface CharacterRelationship {
  targetId: string;
  type: 'friend' | 'enemy' | 'family' | 'lover' | 'other';
  description: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  relatedCharacters: string[];
  importance: 'major' | 'minor';
}

export interface StorySession {
  id: string;
  storyId: string;
  title: string;
  type: "story" | "dialogue" | "plot";
  createdAt: number;
  updatedAt: number;
}

export interface StoryMessage {
  id: string;
  sessionId: string;
  role: "assistant" | "user";
  content: string;
  timestamp: number;
  metadata?: {
    type?: "setting" | "character" | "plot" | "scene";
    tags?: string[];
  };
}

export type StoryCreateInput = Omit<Story, 'id' | 'createdAt' | 'updatedAt'>;
export type StoryUpdateInput = Partial<Omit<Story, 'id' | 'createdAt'>>;
