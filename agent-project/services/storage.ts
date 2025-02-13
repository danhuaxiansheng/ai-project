import { Role } from "@/types/role";
import { Message } from "@/types/message";

export interface CachedContent {
  role: Role;
  content: string;
  timestamp: number;
}

export class StorageService {
  private static readonly CONTENT_KEY = "novel-content";
  private static readonly MESSAGE_KEY = "chat_messages";

  private static isClient = typeof window !== "undefined";

  // 内容缓存
  static saveContentToCache(data: CachedContent): void {
    if (!this.isClient) return;
    try {
      const cached = this.getContentFromCache();
      cached[data.role.id] = data;
      localStorage.setItem(this.CONTENT_KEY, JSON.stringify(cached));
    } catch (error) {
      console.error("缓存保存失败:", error);
    }
  }

  static getContentFromCache(): Record<string, CachedContent> {
    if (!this.isClient) return {};
    try {
      const cached = localStorage.getItem(this.CONTENT_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch (error) {
      console.error("读取缓存失败:", error);
      return {};
    }
  }

  static getRoleContent(roleId: string): CachedContent | null {
    if (!this.isClient) return null;
    const cached = this.getContentFromCache();
    return cached[roleId] || null;
  }

  static clearContentCache(): void {
    if (!this.isClient) return;
    localStorage.removeItem(this.CONTENT_KEY);
  }

  // 消息缓存
  static saveMessagesToCache(messages: Message[]): void {
    if (!this.isClient) return;
    try {
      localStorage.setItem(this.MESSAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("保存消息到缓存失败:", error);
    }
  }

  static getMessagesFromCache(): Message[] {
    if (!this.isClient) return [];
    try {
      const cached = localStorage.getItem(this.MESSAGE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error("从缓存获取消息失败:", error);
      return [];
    }
  }

  static clearMessageCache(): void {
    if (!this.isClient) return;
    localStorage.removeItem(this.MESSAGE_KEY);
  }
}
