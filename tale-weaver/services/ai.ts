import { Role } from "@/types/role";
import {
  AI_ROLES,
  SYSTEM_PROMPTS,
  DEFAULT_TEMPERATURE,
  MAX_TOKENS,
} from "@/config/ai";
import { errorHandler } from "@/lib/error-handler";

export class AIService {
  private static instance: AIService;

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateResponse(
    role: Role,
    messages: { role: string; content: string }[],
    temperature: number = DEFAULT_TEMPERATURE
  ) {
    return errorHandler.withErrorHandling(async () => {
      const chatMessages = [
        {
          role: "system",
          content: `${role.systemPrompt}\n\n你现在是${role.name}。请基于已有的对话内容继续对话。`,
        },
        ...messages,
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          messages: chatMessages,
          temperature,
          max_tokens: MAX_TOKENS,
        }),
      });

      if (!response.ok) {
        throw new Error("AI response failed");
      }

      const data = await response.json();
      return data.message;
    }, "生成 AI 响应");
  }

  async reviewStory(storyContent: string) {
    return errorHandler.withErrorHandling(async () => {
      return await this.generateResponse(
        AI_ROLES.REVIEWER,
        [
          {
            role: "user",
            content: `${SYSTEM_PROMPTS.STORY_REVIEW}\n\n故事内容：\n${storyContent}`,
          },
        ],
        0.3 // 使用较低的温度以获得更稳定的评审结果
      );
    }, "故事评审");
  }

  async reviewChapter(chapterContent: string, storyContext: string) {
    return errorHandler.withErrorHandling(async () => {
      return await this.generateResponse(
        AI_ROLES.REVIEWER,
        [
          {
            role: "user",
            content: `${SYSTEM_PROMPTS.CHAPTER_REVIEW}\n\n故事背景：\n${storyContext}\n\n章节内容：\n${chapterContent}`,
          },
        ],
        0.3
      );
    }, "章节评审");
  }

  async generatePlotSuggestions(currentPlot: string, storyContext: string) {
    return errorHandler.withErrorHandling(async () => {
      return await this.generateResponse(
        AI_ROLES.PLOT_ADVISOR,
        [
          {
            role: "user",
            content: `基于以下故事背景和当前情节，请提供3-5个可能的情节发展建议：\n\n故事背景：\n${storyContext}\n\n当前情节：\n${currentPlot}`,
          },
        ],
        0.8 // 使用较高的温度以获得更有创意的建议
      );
    }, "生成情节建议");
  }

  async improveDialogue(dialogue: string, characterInfo: string) {
    return errorHandler.withErrorHandling(async () => {
      return await this.generateResponse(
        AI_ROLES.DIALOGUE_MASTER,
        [
          {
            role: "user",
            content: `请基于角色设定优化以下对话：\n\n角色信息：\n${characterInfo}\n\n当前对话：\n${dialogue}`,
          },
        ],
        0.6
      );
    }, "优化对话");
  }

  async polishWriting(content: string, style: string) {
    return errorHandler.withErrorHandling(async () => {
      return await this.generateResponse(
        AI_ROLES.EDITOR,
        [
          {
            role: "user",
            content: `请按照以下风格要求润色文字：\n\n目标风格：\n${style}\n\n原文内容：\n${content}`,
          },
        ],
        0.4
      );
    }, "文字润色");
  }

  async generateWorldSetting(type: string, content: string) {
    return this.generateResponse(
      AI_ROLES.STORY_BUILDER,
      [
        {
          role: "system",
          content: `你是一位专业的世界观构建者，擅长设计完整而合理的奇幻/科幻世界。请根据用户的描述，提供更详细的${type}设定建议。`,
        },
        {
          role: "user",
          content: `请完善以下${type}设定：\n\n${content}`,
        },
      ],
      0.7
    );
  }
}
