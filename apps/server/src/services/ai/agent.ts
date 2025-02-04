import { Role } from "../../models/role";
import { Novel } from "../../models/novel";
import { Chapter } from "../storage";
import { deepseekAPI, Message } from "./deepseek";
import { loadRoleConfig } from "../../config/role";
import logger from "../../utils/logger";

export class AgentService {
  private buildSystemPrompt(role: Role, novel: Novel): string {
    const config = loadRoleConfig(role.type);
    const { creativity, strictness, speed } = role.settings;

    return `你是一个${config.name}，负责${novel.title}的创作工作。

角色设定：
- 创造力：${creativity}/100
- 严谨度：${strictness}/100
- 响应速度：${speed}/100

写作风格：
${role.settings.style.map((s) => `- ${s}`).join("\n")}

创作限制：
${role.settings.constraints.map((c) => `- ${c}`).join("\n")}

小说信息：
- 标题：${novel.title}
- 简介：${novel.description}
- 进度：${novel.currentChapter}/${novel.totalChapters}章
- 目标字数：${novel.settings.targetLength}字

类型：${novel.settings.genre.join("、")}
主题：${novel.settings.theme.join("、")}
风格：${novel.settings.style.join("、")}
限制：${novel.settings.constraints.join("、")}`;
  }

  private buildTaskPrompt(task: string): string {
    return task;
  }

  async executeTask(
    role: Role,
    novel: Novel,
    task: string,
    context?: { chapters?: Chapter[] }
  ): Promise<string> {
    const messages: Message[] = [
      {
        role: "system",
        content: this.buildSystemPrompt(role, novel),
      },
    ];

    // 添加上下文信息
    if (context?.chapters) {
      const chaptersContext = context.chapters
        .map((ch) => `第${ch.chapterNumber}章 ${ch.title}\n${ch.content}`)
        .join("\n\n");
      messages.push({
        role: "user",
        content: `已有章节内容：\n${chaptersContext}`,
      });
    }

    // 添加任务
    messages.push({
      role: "user",
      content: this.buildTaskPrompt(task),
    });

    try {
      logger.info(`Agent 开始执行任务: ${role.name} - ${task}`);
      const result = await deepseekAPI.chat(messages);
      logger.info(`Agent 任务完成: ${role.name}`);
      return result;
    } catch (error) {
      logger.error(`Agent 任务失败: ${role.name}`, error);
      throw error;
    }
  }
}

export const agentService = new AgentService();
