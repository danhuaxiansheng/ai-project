import { createDbWorker } from "sql.js-httpvfs";
import type { Message } from "@/types/message";
import path from "path";

interface MemoryRecord {
  id: string;
  text: string;
  embedding: number[];
  timestamp: number;
  role: string;
  type: "story" | "dialogue" | "plot";
  reference_id: string;
  score: number;
}

export class MemorySystem {
  private dbWorker: any;

  constructor() {
    this.initDb();
  }

  private async initDb() {
    const workerUrl = path.join(
      process.cwd(),
      "node_modules/sql.js-httpvfs/dist/sqlite.worker.js"
    );
    const wasmUrl = path.join(
      process.cwd(),
      "node_modules/sql.js-httpvfs/dist/sql-wasm.wasm"
    );

    this.dbWorker = await createDbWorker(
      [
        {
          from: "inline",
          config: {
            serverMode: "full",
            url: "/data/memory.db",
            requestChunkSize: 4096,
          },
        },
      ],
      workerUrl,
      wasmUrl
    );

    // 初始化表结构
    await this.dbWorker.db.exec(`
      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        embedding BLOB,
        timestamp INTEGER NOT NULL,
        role TEXT NOT NULL,
        type TEXT NOT NULL,
        reference_id TEXT NOT NULL,
        score REAL
      );
      
      CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(type);
      CREATE INDEX IF NOT EXISTS idx_memories_reference ON memories(reference_id);
    `);
  }

  async addMemory(memory: Omit<MemoryRecord, "id">) {
    const id = crypto.randomUUID();
    const { text, embedding, timestamp, role, type, reference_id, score } =
      memory;
    await this.dbWorker.db.run(
      `INSERT INTO memories (id, text, embedding, timestamp, role, type, reference_id, score)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, text, embedding, timestamp, role, type, reference_id, score]
    );
  }

  async searchMemories(query: string, limit: number = 10) {
    const result = await this.dbWorker.db.exec(
      `SELECT * FROM memories 
       ORDER BY timestamp DESC 
       LIMIT ?`,
      [limit]
    );
    return result[0]?.values || [];
  }

  async getMemoryStats() {
    const result = await this.dbWorker.db.exec(`
      SELECT 
        type,
        COUNT(*) as count,
        AVG(LENGTH(text)) as avgLength
      FROM memories 
      GROUP BY type
    `);
    return result[0]?.values || [];
  }
}

export const memorySystem = new MemorySystem();
