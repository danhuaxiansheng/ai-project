import { RoleMessage } from '@/types/role';
import { RoleManager } from '../roles/roleManager';
import { AIService } from '../ai/aiService';
import { EventBus } from '../events/eventBus';

export class ChatManager {
  private messages: RoleMessage[] = [];
  private roleManager: RoleManager;
  private aiService: AIService;
  private eventBus: EventBus;

  constructor(roleManager: RoleManager) {
    this.roleManager = roleManager;
    this.aiService = new AIService();
    this.eventBus = EventBus.getInstance();
  }

  public async processUserInput(content: string): Promise<void> {
    try {
      // 1. 产品经理分析
      const pmResponse = await this.generatePMResponse(content);
      await this.addMessage({
        id: crypto.randomUUID(),
        roleId: 'product_manager',
        content: pmResponse.content,
        timestamp: Date.now(),
        type: 'decision'
      });

      // 2. 激活相关角色
      await this.activateRelevantRoles(content, pmResponse.suggestions || []);

      // 3. 收集反馈
      await this.collectRoleFeedback(content);
    } catch (error) {
      console.error('Error processing user input:', error);
      this.eventBus.emit('chat:error', {
        message: '处理消息时出现错误，请稍后重试'
      });
    }
  }

  private async generatePMResponse(content: string) {
    const pmRole = this.roleManager.getRoleById('product_manager');
    if (!pmRole) throw new Error('Product Manager role not found');
    
    return await this.aiService.generateResponse(
      pmRole,
      content,
      this.getContextMessages()
    );
  }

  private async activateRelevantRoles(content: string, suggestions: string[]) {
    // 基于产品经理的建议激活角色
    const relevantRoles = suggestions
      .map(suggestion => this.mapSuggestionToRole(suggestion))
      .filter(roleId => roleId !== null) as string[];

    relevantRoles.forEach(roleId => this.roleManager.activateRole(roleId));
  }

  private async collectRoleFeedback(content: string) {
    const activeRoles = this.roleManager.getActiveRoles();
    
    for (const role of activeRoles) {
      const response = await this.aiService.generateResponse(
        role,
        content,
        this.getContextMessages()
      );

      await this.addMessage({
        id: crypto.randomUUID(),
        roleId: role.id,
        content: response.content,
        timestamp: Date.now(),
        type: 'suggestion'
      });
    }
  }

  private getContextMessages(): string[] {
    return this.messages.slice(-5).map(m => 
      `[${m.roleId}]: ${m.content}`
    );
  }

  private async addMessage(message: RoleMessage) {
    this.messages.push(message);
    this.eventBus.emit('chat:newMessage', message);
  }

  private mapSuggestionToRole(suggestion: string): string | null {
    // 根据建议内容映射到相应角色
    const mappings: Record<string, string[]> = {
      'world_builder': ['世界观', '设定', '背景'],
      'character_designer': ['人物', '角色', '性格'],
      'plot_designer': ['情节', '剧情', '故事'],
      'battle_designer': ['战斗', '功法', '修炼'],
      'quality_controller': ['质量', '逻辑', '一致性']
    };

    for (const [roleId, keywords] of Object.entries(mappings)) {
      if (keywords.some(keyword => suggestion.includes(keyword))) {
        return roleId;
      }
    }
    return null;
  }
} 