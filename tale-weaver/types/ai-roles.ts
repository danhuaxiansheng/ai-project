export type AIRoleType = 
  | 'editor'        // 编辑：规划和完善故事情节
  | 'reviewer'      // 评审：读者角度反馈
  | 'mentor'        // 导师：写作技巧指导
  | 'creative'      // 创意师：灵感激发
  | 'world-builder' // 世界观构建
  | 'dialogue-gen'  // 对话生成
  | 'plot-driver';  // 情节推进

export interface AIRole {
  id: string;
  name: string;
  role: AIRoleType;
  personality: string;
  expertise: string[];
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}

export interface AIMessage {
  role: 'assistant' | 'user';
  content: string;
  roleType?: AIRoleType;
} 