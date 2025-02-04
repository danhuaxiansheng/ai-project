import express from "express";
import cors from "cors";
import { novelRoutes } from "./routes/novel";
import { roleRoutes } from "./routes/role";
import { chapterRoutes } from "./routes/chapter";
import { taskRoutes } from "./routes/task";
import { errorHandler } from "./middleware/error";
import logger from "./utils/logger";
import { initStorage } from "./services/storage";
import { env } from "./config/env";

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    env: env.NODE_ENV,
    apiUrl: env.DEEPSEEK_API_URL,
  });
});

// API 路由
app.use("/api/novels", novelRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api", chapterRoutes);
app.use("/api", taskRoutes);

// 错误处理中间件
app.use(errorHandler);

// 初始化存储并启动服务器
const startServer = async () => {
  try {
    // 初始化存储
    await initStorage();
    logger.info("存储系统初始化成功");

    // 启动服务器
    app.listen(env.PORT, () => {
      logger.info(`服务器运行在 http://localhost:${env.PORT}`);
      logger.info("环境变量:", {
        NODE_ENV: env.NODE_ENV,
        PORT: env.PORT,
        DEEPSEEK_API_URL: env.DEEPSEEK_API_URL,
      });
    });
  } catch (error) {
    logger.error("服务器启动失败:", error);
    process.exit(1);
  }
};

// 启动服务器
startServer().catch((error) => {
  logger.error("服务器启动过程中发生错误:", error);
  process.exit(1);
});

// 错误处理
process.on("uncaughtException", (error) => {
  logger.error("未捕获的异常:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("未处理的 Promise 拒绝:", reason);
  process.exit(1);
});
