import Dexie, { Table } from "dexie";
import { Story } from "@/types/story";
import { CollaborationSession } from "@/services/session";
import { Setting, SettingHistory } from "@/types/setting";

export class TaleWeaverDB extends Dexie {
  stories!: Table<Story>;
  sessions!: Table<CollaborationSession>;
  settings!: Table<Setting>;
  settingHistory!: Table<SettingHistory>;

  constructor() {
    super("tale-weaver");

    this.version(1).stores({
      stories: "id, title, status, createdAt, updatedAt",
      sessions: "id, storyId, title, status, createdAt, updatedAt",
      settings: "id, storyId, type, updatedAt",
      settingHistory: "id, settingId, version, createdAt",
    });
  }
}

export const db = new TaleWeaverDB();
