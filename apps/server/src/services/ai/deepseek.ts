import axios from "axios";
import logger from "../../utils/logger";
import { env } from "../../config/env";

const client = axios.create({
  baseURL: env.DEEPSEEK_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
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
      logger.info("发送请求到 DeepSeek API", {
        url: env.DEEPSEEK_API_URL,
        messageCount: messages.length,
      });

      const response = await client.post<ChatCompletionResponse>(
        "/chat/completions",
        {
          model: "deepseek-chat",
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        }
      );

      logger.info("DeepSeek API 响应成功", {
        messageId: response.data.id,
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      logger.error("DeepSeek API 调用失败:", error);
      throw new Error("AI 服务暂时不可用，请稍后重试");
    }
  },
};
