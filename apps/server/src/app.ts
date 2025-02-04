import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { novelRoutes } from "./routes/novel";
import { roleRoutes } from "./routes/role";
import { chapterRoutes } from "./routes/chapter";
import { errorHandler } from "./middleware/error";
import logger from "./utils/logger";
import { initStorage } from "./services/storage";
import { taskRoutes } from "./routes/task";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 路由
app.use("/api/novels", novelRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api", chapterRoutes);
app.use("/api", taskRoutes);

// 错误处理中间件
app.use(errorHandler);

// 初始化存储并启动服务器
const startServer = async () => {
  try {
    await initStorage();
    app.listen(port, () => {
      logger.info(`服务器运行在 http://localhost:${port}`);
    });
  } catch (error) {
    logger.error("服务器启动失败:", error);
    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (err) => {
  logger.error("未处理的 Promise 拒绝:", err);
  process.exit(1);
});
