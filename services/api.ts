import { Role } from "@/types/role";

interface APIResponse<T = any> {
  status: "success" | "error";
  content?: string;
  message?: string;
  data?: T;
}

export interface SaveContentRequest {
  role: Role;
  content: string;
  timestamp: number;
}

export class APIService {
  private static baseUrl = "/api";

  private static async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout = 30000
  ) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  private static async fetchDeepSeek(messages: any[]) {
    const response = await fetch(
      `${process.env.DEEPSEEK_API_BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: messages,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`DeepSeek API 错误: ${response.statusText}`);
    }

    return await response.json();
  }

  static async chatWithAI(
    role: Role,
    message: string,
    context?: string
  ): Promise<APIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          message,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error("AI 响应失败");
      }

      const data = await response.json();
      return {
        status: "success",
        content: data.content,
      };
    } catch (error) {
      console.error("AI 调用错误:", error);
      return {
        status: "error",
        message: error instanceof Error ? error.message : "未知错误",
      };
    }
  }

  static async saveContent(content: string): Promise<APIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("保存失败");
      }

      return {
        status: "success",
        message: "保存成功",
      };
    } catch (error) {
      console.error("保存错误:", error);
      return {
        status: "error",
        message: error instanceof Error ? error.message : "保存失败",
      };
    }
  }
}
