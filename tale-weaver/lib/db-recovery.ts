import { db } from "./db-schema";

export async function recoverDatabase() {
  if (typeof window === "undefined") return;

  try {
    // 删除旧数据库
    await deleteDatabase();
    // 重新初始化数据库
    location.reload();
  } catch (error) {
    console.error("Error recovering database:", error);
  }
}

async function deleteDatabase() {
  return new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase("TaleWeaverDB");
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// 在发生严重错误时调用此函数
export async function handleDatabaseError(error: any) {
  console.error("Database error:", error);
  if (error.name === "VersionError" || error.name === "NotFoundError") {
    await recoverDatabase();
  }
}
