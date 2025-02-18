import { createDbWorker } from "sql.js-httpvfs";
import { vectorStore } from "./vector-store";
import path from "path";

const workerUrl = path.join(
  process.cwd(),
  "node_modules/sql.js-httpvfs/dist/sqlite.worker.js"
);
const wasmUrl = path.join(
  process.cwd(),
  "node_modules/sql.js-httpvfs/dist/sql-wasm.wasm"
);

let dbWorker: any = null;

export async function initDb() {
  if (!dbWorker) {
    dbWorker = await createDbWorker(
      [
        {
          from: "inline",
          config: {
            serverMode: "full",
            url: "/data/novel.db",
            requestChunkSize: 4096,
          },
        },
      ],
      workerUrl,
      wasmUrl
    );
  }
  return dbWorker.db;
}

export const db = await initDb();
export { vectorStore };

// 导出数据库实例获取函数
export async function getDb() {
  return db;
}
