import { initSQLite } from "./db-config";

async function init() {
  try {
    console.log("正在初始化数据库...");
    await initSQLite();
    console.log("数据库初始化成功！");
  } catch (error) {
    console.error("数据库初始化失败:", error);
    process.exit(1);
  }
}

init();
