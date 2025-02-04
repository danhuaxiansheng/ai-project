import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { novelRoutes } from "./routes/novel";
import { roleRoutes } from "./routes/role";
import { errorHandler } from "./middleware/error";

dotenv.config();

// 连接数据库
connectDB();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 路由
app.use("/api/novels", novelRoutes);
app.use("/api/roles", roleRoutes);

// 错误处理中间件
app.use(errorHandler);

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error("未处理的 Promise 拒绝:", err);
  process.exit(1);
});
