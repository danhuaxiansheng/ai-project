import { LanceDB } from "lancedb";
import { Message } from "@/types/message";
import { Database } from "better-sqlite3";
import path from "path";

interface MemoryRecord {
  text: string;
  embedding: number[];
  timestamp: number;
  role: string;
  type: "story" | "dialogue" | "plot";
}

export class MemorySystem {
  private vectorDB: any;
  private sqliteDB: Database;

  constructor() {
    // 初始化 SQLite
    this.sqliteDB = new Database(path.join(process.cwd(), "data/novel.db"));
    this.initSQLite();
  }

  private async initSQLite() {
    this.sqliteDB.exec(`
      CREATE TABLE IF NOT EXISTS memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        role TEXT NOT NULL,
        type TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        metadata TEXT
      )
    `);
  }

  async init() {
    // 初始化 LanceDB
    const db = await LanceDB.connect("data/lancedb");
    this.vectorDB = await db.openTable("memories");
    if (!this.vectorDB) {
      this.vectorDB = await db.createTable("memories", {
        text: "string",
        embedding: "float32[384]",
        timestamp: "int64",
        role: "string",
        type: "string",
      });
    }
  }

  async storeMemory(message: Message, type: "story" | "dialogue" | "plot") {
    if (!this.vectorDB) await this.init();

    const embedding = await this.generateEmbedding(message.content);
    const record: MemoryRecord = {
      text: message.content,
      embedding,
      timestamp: message.timestamp,
      role: message.role,
      type,
    };

    // 向量存储
    await this.vectorDB.add([record]);

    // 结构化存储
    this.sqliteDB
      .prepare(
        `
      INSERT INTO memories (content, role, type, timestamp, metadata)
      VALUES (?, ?, ?, ?, ?)
    `
      )
      .run(
        message.content,
        message.role,
        type,
        message.timestamp,
        JSON.stringify({ embedding })
      );
  }

  async searchRelatedMemories(
    query: string,
    type?: "story" | "dialogue" | "plot"
  ) {
    if (!this.vectorDB) await this.init();

    const queryEmbedding = await this.generateEmbedding(query);

    // 向量检索
    const vectorResults = await this.vectorDB
      .search(queryEmbedding)
      .filter(type ? `type = '${type}'` : null)
      .limit(5)
      .execute();

    // 关键词检索
    const keywordResults = this.sqliteDB
      .prepare(
        `
      SELECT * FROM memories 
      WHERE content LIKE ? 
      ${type ? "AND type = ?" : ""}
      ORDER BY timestamp DESC 
      LIMIT 5
    `
      )
      .all(`%${query}%`, type);

    return this.mergeAndDeduplicate(vectorResults, keywordResults);
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    // TODO: 使用 transformers.js 生成嵌入向量
    return new Array(384).fill(0).map(() => Math.random());
  }

  private mergeAndDeduplicate(vectorResults: any[], keywordResults: any[]) {
    const seen = new Set();
    const merged = [...vectorResults, ...keywordResults].filter((item) => {
      const key = item.text || item.content;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return merged.sort((a, b) => b.timestamp - a.timestamp);
  }

  async getMemoryStats() {
    const stats = this.sqliteDB
      .prepare(
        `
      SELECT 
        type,
        COUNT(*) as count,
        AVG(LENGTH(content)) as avgLength
      FROM memories 
      GROUP BY type
    `
      )
      .all();

    return stats;
  }
}

export const memorySystem = new MemorySystem();
