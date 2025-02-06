import { Role } from '@/types/role';

export interface AIResponse {
  content: string;
  confidence: number;
  suggestions?: string[];
}

export class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    this.baseUrl = process.env.DEEPSEEK_API_URL || '';
  }

  async generateResponse(
    role: Role,
    content: string,
    context: string[]
  ): Promise<AIResponse> {
    try {
      const prompt = this.constructPrompt(role, content, context);
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `你现在扮演小说创作系统中的${role.name}角色。职责是${role.description}`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      return {
        content: data.choices[0].message.content,
        confidence: data.choices[0].confidence || 0.8,
        suggestions: data.choices[0].suggestions || []
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  private constructPrompt(role: Role, content: string, context: string[]): string {
    return `
基于以下背景信息：
${context.join('\n')}

用户输入：
${content}

请以${role.name}的身份，根据职责"${role.description}"提供专业的分析和建议。
要求：
1. 保持角色特征
2. 给出具体可行的建议
3. 注意与其他角色的建议协调
    `;
  }
} 