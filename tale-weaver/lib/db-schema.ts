import Dexie, { Table } from "dexie";
import { Story, StorySession, StoryMessage } from "@/types/story";

export class TaleWeaverDB extends Dexie {
  stories!: Table<Story>;
  sessions!: Table<StorySession>;
  messages!: Table<StoryMessage>;

  constructor() {
    super("TaleWeaverDB");
    this.version(1).stores({
      stories: "id, title, createdAt, updatedAt",
      sessions: "id, storyId, title, type, createdAt, updatedAt",
      messages: "id, sessionId, role, timestamp",
    });
  }
}

export const db = new TaleWeaverDB();
