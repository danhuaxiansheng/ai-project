import { Role } from "@/types/role";

export interface AIResponse {
  content: string;
  status: "success" | "error";
  message?: string;
}

export interface SaveContentRequest {
  role: Role;
  content: string;
  timestamp: number;
}

export class APIService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

  static async chatWithAI(role: Role, message: string): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: role.id,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("AI 响应失败");
      }

      return await response.json();
    } catch (error) {
      console.error("AI 调用错误:", error);
      return {
        content: "",
        status: "error",
        message: "AI 服务暂时不可用",
      };
    }
  }

  static async saveContent(data: SaveContentRequest): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return response.ok;
    } catch (error) {
      console.error("保存内容错误:", error);
      return false;
    }
  }
}
