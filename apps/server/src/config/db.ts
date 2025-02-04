import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ai-novel"
    );
    console.log(`MongoDB 已连接: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB 连接失败:", error);
    process.exit(1);
  }
};
