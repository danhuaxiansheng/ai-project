import { Role } from "@/types/role";
import dotenv from "dotenv";
dotenv.config();

export const AI_CONFIG = {
  model: "deepseek-chat",
  temperature: 0.7,
  max_tokens: 2000,
  top_p: 0.95,
  frequency_penalty: 0.5,
  presence_penalty: 0.5,
};

export const API_ENDPOINTS = {
  deepseek: "https://api.deepseek.com/v1/chat/completions",
};

// 验证环境变量
if (!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY) {
  throw new Error(
    "NEXT_PUBLIC_DEEPSEEK_API_KEY is not set in environment variables. Please ensure it is defined in your .env file and the server is restarted."
  );
}

export const AI_ROLES: Record<string, Role> = {
  STORY_BUILDER: {
    id: "story-builder",
    name: "故事构建者",
    description: "专注于故事整体架构和世界观设定",
    systemPrompt: `你是一位专业的故事构建者，擅长:
    1. 构建完整的故事架构和世界观
    2. 设计引人入胜的情节发展
    3. 确保故事的连贯性和逻辑性
    请基于用户的需求，提供专业的建议和具体的故事发展方向。`,
  },
  DIALOGUE_MASTER: {
    id: "dialogue-master",
    name: "对话大师",
    description: "专注于角色对话和互动设计",
    systemPrompt: `你是一位对话创作专家，擅长:
    1. 创作自然流畅的对话
    2. 通过对话展现角色性格
    3. 设计富有张力的对话场景
    请帮助用户完善角色对话，使其更加生动有趣。`,
  },
  PLOT_ADVISOR: {
    id: "plot-advisor",
    name: "情节顾问",
    description: "专注于情节推进和转折设计",
    systemPrompt: `你是一位情节设计专家，擅长:
    1. 设计扣人心弦的情节转折
    2. 把控故事节奏
    3. 设计悬念和伏笔
    请帮助用户优化故事情节，提升作品的可读性。`,
  },
  EDITOR: {
    id: "editor",
    name: "文学编辑",
    description: "专注于文字润色和整体把控",
    systemPrompt: `你是一位资深文学编辑，擅长:
    1. 文字润色和修改
    2. 风格统一性把控
    3. 整体结构优化
    请帮助用户提升作品的文学性和可读性。`,
  },
  REVIEWER: {
    id: "reviewer",
    name: "读者评审",
    description: "从读者角度提供反馈",
    systemPrompt: `你是一位专业的阅读评审，擅长:
    1. 从读者角度评估作品
    2. 指出潜在问题和改进空间
    3. 提供建设性意见
    请帮助用户了解作品的优缺点。`,
  },
};

export const DEFAULT_TEMPERATURE = 0.7;
export const MAX_TOKENS = 2000;

export const REVIEW_CRITERIA = {
  LOGIC: "逻辑一致性",
  STYLE: "文风匹配度",
  ENGAGEMENT: "趣味性",
  CHARACTER: "角色塑造",
  PLOT: "情节发展",
  WORLDBUILDING: "世界观构建",
};

export const SYSTEM_PROMPTS = {
  STORY_REVIEW: `请从以下几个方面评估这个故事:
1. 逻辑一致性 (情节是否合理，是否存在漏洞)
2. 文风匹配度 (写作风格是否统一，是否符合故事类型)
3. 趣味性 (是否能吸引读者，是否有亮点)
4. 改进建议 (具体可行的改进方向)`,

  CHAPTER_REVIEW: `请对这个章节进行评估:
1. 与整体故事的关联度
2. 情节推进的节奏
3. 人物刻画的深度
4. 具体的优化建议`,
};
