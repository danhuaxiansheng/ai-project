import dotenv from "dotenv";
import path from "path";
import logger from "../utils/logger";

// 加载环境变量
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

// 必需的环境变量
const requiredEnvVars = [
  "PORT",
  "NODE_ENV",
  "DEEPSEEK_API_URL",
  "DEEPSEEK_API_KEY",
] as const;

// 环境变量类型
type EnvVars = {
  [K in (typeof requiredEnvVars)[number]]: string;
};

// 验证环境变量
const validateEnv = (): EnvVars => {
  const missingVars = requiredEnvVars.filter((name) => !process.env[name]);

  if (missingVars.length > 0) {
    const message = `缺少必需的环境变量: ${missingVars.join(", ")}`;
    logger.error(message);
    throw new Error(message);
  }

  const env = {} as EnvVars;
  requiredEnvVars.forEach((name) => {
    env[name] = process.env[name]!;
  });

  return env;
};

// 导出配置
export const env = validateEnv();
