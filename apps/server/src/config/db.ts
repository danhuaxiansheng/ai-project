import mongoose from "mongoose";
import logger from "../utils/logger";

export const connectDB = async () => {
  try {
    // 增加连接选项
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 超时时间
      socketTimeoutMS: 45000, // Socket 超时
    };

    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai-novel",
      options
    );

    logger.info(`MongoDB 已连接: ${conn.connection.host}`);
  } catch (error) {
    logger.error("MongoDB 连接失败:", error);
    process.exit(1);
  }
};

// 监听连接事件
mongoose.connection.on("connected", () => {
  logger.info("Mongoose 已连接");
});

mongoose.connection.on("error", (err) => {
  logger.error("Mongoose 连接错误:", err);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("Mongoose 连接断开");
});

// 应用关闭时断开连接
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  logger.info("Mongoose 连接已关闭");
  process.exit(0);
});
