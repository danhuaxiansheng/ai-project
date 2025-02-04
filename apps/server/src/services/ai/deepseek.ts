import axios from "axios";
import logger from "../../utils/logger";

const DEEPSEEK_API_URL =
  process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/v1";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
  logger.error("未设置 DEEPSEEK_API_KEY 环境变量");
  process.exit(1);
}

const client = axios.create({
  baseURL: DEEPSEEK_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
  },
});

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionResponse {
  id: string;
  choices: {
    message: Message;
    finish_reason: string;
  }[];
}

export const deepseekAPI = {
  async chat(messages: Message[]): Promise<string> {
    try {
      const response = await client.post<ChatCompletionResponse>(
        "/chat/completions",
        {
          model: "deepseek-chat",
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      logger.error("DeepSeek API 调用失败:", error);
      throw new Error("AI 服务暂时不可用，请稍后重试");
    }
  },
};
