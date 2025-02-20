import { Role } from "@/types/role";
import { AIService } from "./ai";
import { errorHandler } from "@/lib/error-handler";
import { db } from "@/lib/db";

export interface CollaborationSession {
  id: string;
  storyId: string;
  title: string;
  participants: {
    role: Role;
    messages: Message[];
  }[];
  status: "active" | "archived";
  createdAt: number;
  updatedAt: number;
}

interface Message {
  id: string;
  role: string; // "user" | "assistant" | Role["id"]
  content: string;
  timestamp: number;
  metadata?: {
    suggestion?: boolean;
    accepted?: boolean;
    rejected?: boolean;
    type?: "plot" | "dialogue" | "review" | "edit";
  };
}

export class SessionService {
  private static instance: SessionService;
  private aiService: AIService;

  private constructor() {
    this.aiService = AIService.getInstance();
  }

  static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  async createSession(
    storyId: string,
    title: string,
    roles: Role[]
  ): Promise<CollaborationSession> {
    return errorHandler.withErrorHandling(async () => {
      const session: CollaborationSession = {
        id: crypto.randomUUID(),
        storyId,
        title,
        participants: roles.map((role) => ({
          role,
          messages: [],
        })),
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await db.sessions.add(session);
      return session;
    }, "创建协作会话");
  }

  async addMessage(
    sessionId: string,
    content: string,
    roleId: string,
    metadata?: Message["metadata"]
  ): Promise<Message> {
    return errorHandler.withErrorHandling(async () => {
      const message: Message = {
        id: crypto.randomUUID(),
        role: roleId,
        content,
        timestamp: Date.now(),
        metadata,
      };

      const session = await db.sessions.get(sessionId);
      if (!session) throw new Error("Session not found");

      const participant = session.participants.find(
        (p) => p.role.id === roleId
      );
      if (!participant) throw new Error("Role not found in session");

      participant.messages.push(message);
      session.updatedAt = Date.now();

      await db.sessions.update(sessionId, session);
      return message;
    }, "添加会话消息");
  }

  async generateAIResponse(
    sessionId: string,
    roleId: string,
    context?: {
      storyContext?: string;
      characterInfo?: string;
      style?: string;
    }
  ): Promise<Message> {
    return errorHandler.withErrorHandling(async () => {
      const session = await db.sessions.get(sessionId);
      if (!session) throw new Error("Session not found");

      const participant = session.participants.find(
        (p) => p.role.id === roleId
      );
      if (!participant) throw new Error("Role not found in session");

      // 获取会话历史
      const messages = this.getRecentMessages(session, 10);

      // 根据角色类型生成响应
      let response: string;
      switch (roleId) {
        case "plot-advisor":
          response = await this.aiService.generatePlotSuggestions(
            messages[messages.length - 1].content,
            context?.storyContext || ""
          );
          break;
        case "dialogue-master":
          response = await this.aiService.improveDialogue(
            messages[messages.length - 1].content,
            context?.characterInfo || ""
          );
          break;
        case "editor":
          response = await this.aiService.polishWriting(
            messages[messages.length - 1].content,
            context?.style || ""
          );
          break;
        default:
          response = await this.aiService.generateResponse(
            participant.role,
            messages.map((m) => ({
              role: m.role,
              content: m.content,
            }))
          );
      }

      // 添加 AI 响应到会话
      return await this.addMessage(sessionId, response, roleId, {
        suggestion: true,
      });
    }, "生成 AI 响应");
  }

  async acceptSuggestion(sessionId: string, messageId: string): Promise<void> {
    return errorHandler.withErrorHandling(async () => {
      const session = await db.sessions.get(sessionId);
      if (!session) throw new Error("Session not found");

      for (const participant of session.participants) {
        const message = participant.messages.find((m) => m.id === messageId);
        if (message && message.metadata?.suggestion) {
          message.metadata.accepted = true;
          break;
        }
      }

      await db.sessions.update(sessionId, session);
    }, "接受建议");
  }

  async rejectSuggestion(sessionId: string, messageId: string): Promise<void> {
    return errorHandler.withErrorHandling(async () => {
      const session = await db.sessions.get(sessionId);
      if (!session) throw new Error("Session not found");

      for (const participant of session.participants) {
        const message = participant.messages.find((m) => m.id === messageId);
        if (message && message.metadata?.suggestion) {
          message.metadata.rejected = true;
          break;
        }
      }

      await db.sessions.update(sessionId, session);
    }, "拒绝建议");
  }

  private getRecentMessages(
    session: CollaborationSession,
    limit: number
  ): Message[] {
    const allMessages = session.participants
      .flatMap((p) => p.messages)
      .sort((a, b) => a.timestamp - b.timestamp);

    return allMessages.slice(-limit);
  }

  async getSession(sessionId: string): Promise<CollaborationSession> {
    return errorHandler.withErrorHandling(async () => {
      const session = await db.sessions.get(sessionId);
      if (!session) throw new Error("Session not found");
      return session;
    }, "获取会话");
  }

  async listSessions(storyId: string): Promise<CollaborationSession[]> {
    return errorHandler.withErrorHandling(async () => {
      return await db.sessions.where("storyId").equals(storyId).toArray();
    }, "获取故事会话列表");
  }

  async updateSessionStatus(
    sessionId: string,
    status: CollaborationSession["status"]
  ): Promise<void> {
    return errorHandler.withErrorHandling(async () => {
      const session = await db.sessions.get(sessionId);
      if (!session) throw new Error("Session not found");

      await db.sessions.update(sessionId, {
        ...session,
        status,
        updatedAt: Date.now(),
      });
    }, "更新会话状态");
  }
}
