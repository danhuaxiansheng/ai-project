import { SessionService, CollaborationSession } from "./session";
import { AI_ROLES } from "@/config/ai";
import { errorHandler } from "@/lib/error-handler";
import { db } from "@/lib/db";

export type SettingType = "world" | "character" | "plot" | "magic-system";

interface SettingContext {
  type: SettingType;
  currentContent: string;
  existingSettings?: string;
  requirements?: string;
}

export class SettingCollaborationService {
  private static instance: SettingCollaborationService;
  private sessionService: SessionService;

  private constructor() {
    this.sessionService = SessionService.getInstance();
  }

  static getInstance(): SettingCollaborationService {
    if (!SettingCollaborationService.instance) {
      SettingCollaborationService.instance = new SettingCollaborationService();
    }
    return SettingCollaborationService.instance;
  }

  async startSettingSession(
    storyId: string,
    settingType: SettingType,
    context: SettingContext
  ): Promise<CollaborationSession> {
    return errorHandler.withErrorHandling(async () => {
      // 根据设定类型选择合适的 AI 角色
      const roles = this.getRolesForSettingType(settingType);

      // 创建新的协作会话
      const session = await this.sessionService.createSession(
        storyId,
        `${this.getSettingTypeTitle(settingType)}设定会话`,
        roles
      );

      // 发送初始上下文消息
      await this.sessionService.addMessage(
        session.id,
        this.generateContextMessage(context),
        "user",
        { type: "context" }
      );

      // 获取 AI 初始建议
      await this.generateInitialSuggestions(session.id, context);

      return session;
    }, "启动设定协作会话");
  }

  async acceptSuggestion(
    sessionId: string,
    messageId: string
  ): Promise<CollaborationSession> {
    return errorHandler.withErrorHandling(async () => {
      await this.sessionService.acceptSuggestion(sessionId, messageId);
      return await this.sessionService.getSession(sessionId);
    }, "接受设定建议");
  }

  async rejectSuggestion(
    sessionId: string,
    messageId: string
  ): Promise<CollaborationSession> {
    return errorHandler.withErrorHandling(async () => {
      await this.sessionService.rejectSuggestion(sessionId, messageId);
      return await this.sessionService.getSession(sessionId);
    }, "拒绝设定建议");
  }

  async getSession(sessionId: string): Promise<CollaborationSession> {
    return this.sessionService.getSession(sessionId);
  }

  private getRolesForSettingType(
    type: SettingType
  ): (typeof AI_ROLES)[keyof typeof AI_ROLES][] {
    switch (type) {
      case "world":
        return [AI_ROLES.STORY_BUILDER, AI_ROLES.PLOT_ADVISOR];
      case "character":
        return [AI_ROLES.DIALOGUE_MASTER, AI_ROLES.STORY_BUILDER];
      case "plot":
        return [AI_ROLES.PLOT_ADVISOR, AI_ROLES.STORY_BUILDER];
      case "magic-system":
        return [AI_ROLES.STORY_BUILDER, AI_ROLES.PLOT_ADVISOR];
      default:
        return [AI_ROLES.STORY_BUILDER];
    }
  }

  private getSettingTypeTitle(type: SettingType): string {
    const titles = {
      world: "世界观",
      character: "角色",
      plot: "剧情",
      "magic-system": "魔法体系",
    };
    return titles[type];
  }

  private generateContextMessage(context: SettingContext): string {
    let message = `正在创建${this.getSettingTypeTitle(context.type)}设定：\n\n`;

    if (context.existingSettings) {
      message += `现有设定：\n${context.existingSettings}\n\n`;
    }

    if (context.currentContent) {
      message += `当前内容：\n${context.currentContent}\n\n`;
    }

    if (context.requirements) {
      message += `特殊要求：\n${context.requirements}\n\n`;
    }

    message += "请提供专业的建议和完善方案。";
    return message;
  }

  private async generateInitialSuggestions(
    sessionId: string,
    context: SettingContext
  ): Promise<void> {
    const roles = this.getRolesForSettingType(context.type);

    for (const role of roles) {
      await this.sessionService.generateAIResponse(sessionId, role.id, {
        storyContext: context.existingSettings,
      });
    }
  }

  async applyAcceptedSuggestions(
    session: CollaborationSession
  ): Promise<string> {
    return errorHandler.withErrorHandling(async () => {
      // 收集所有被接受的建议
      const acceptedSuggestions = session.participants
        .flatMap((participant) =>
          participant.messages
            .filter((msg) => msg.metadata?.suggestion && msg.metadata?.accepted)
            .map((msg) => ({
              content: msg.content,
              roleId: participant.role.id,
              timestamp: msg.timestamp,
            }))
        )
        .sort((a, b) => a.timestamp - b.timestamp);

      // 合并建议内容
      let finalContent = "";
      for (const suggestion of acceptedSuggestions) {
        finalContent += `${suggestion.content}\n\n`;
      }

      return finalContent.trim();
    }, "应用已接受的建议");
  }

  async updateSetting(
    storyId: string,
    settingType: SettingType,
    content: string
  ): Promise<void> {
    return errorHandler.withErrorHandling(async () => {
      const story = await db.stories.get(storyId);
      if (!story) throw new Error("Story not found");

      // 根据设定类型更新相应的设定内容
      switch (settingType) {
        case "world":
          await db.settings.put({
            id: `${storyId}-world`,
            storyId,
            type: "world",
            content,
            updatedAt: Date.now(),
          });
          break;
        case "character":
          await db.settings.put({
            id: `${storyId}-character`,
            storyId,
            type: "character",
            content,
            updatedAt: Date.now(),
          });
          break;
        // ... 其他设定类型的处理
      }
    }, "更新设定内容");
  }

  async getLatestSuggestions(sessionId: string): Promise<string[]> {
    return errorHandler.withErrorHandling(async () => {
      const session = await this.sessionService.getSession(sessionId);
      if (!session) throw new Error("Session not found");

      // 获取所有未处理的建议
      const suggestions = session.participants
        .flatMap((participant) =>
          participant.messages
            .filter(
              (msg) =>
                msg.metadata?.suggestion &&
                !msg.metadata?.accepted &&
                !msg.metadata?.rejected
            )
            .map((msg) => msg.content)
        )
        .filter(Boolean);

      return suggestions;
    }, "获取最新 AI 建议");
  }
}
