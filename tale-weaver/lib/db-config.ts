import initSqlJs from "sql.js";
import { openDB } from "idb";
import { vectorStore } from "./vector-store";

// 确保数据目录存在
const DATA_DIR = "/data";

// 初始化 SQL.js
let SQL: any = null;
let db: any = null;

export async function initSQLite() {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file: string) => `/sql.js/${file}`,
    });
  }

  if (!db) {
    // 从 IndexedDB 加载数据库
    const idb = await openDB("tale-weaver", 1, {
      upgrade(db) {
        db.createObjectStore("sqlite");
      },
    });

    const buf = await idb.get("sqlite", "db");
    db = new SQL.Database(buf);

    // 创建表结构
    db.exec(`
      CREATE TABLE IF NOT EXISTS stories (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        story_id TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('story', 'dialogue', 'plot')),
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
        role TEXT NOT NULL CHECK (role IN ('assistant', 'user')),
        content TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        metadata TEXT
      );
    `);

    // 自动保存到 IndexedDB
    setInterval(async () => {
      const data = db.export();
      await idb.put("sqlite", data, "db");
    }, 1000);
  }

  return db;
}

// 导出向量存储实例
export { vectorStore };

// 导出数据库实例获取函数
export async function getDb() {
  return await initSQLite();
}
