# AI 小说创作系统

## 项目目标

该系统作为 AI 小说创作的中央控制中心，通过多角色协作的方式，帮助用户创作高质量的网络小说。

### 核心功能

1. **用户输入与交互**: 接收用户输入的小说片段，提供实时反馈和选择机制
2. **多角色分析**: 通过不同角色视角分析内容，确保创作质量
3. **智能创作**: 基于用户选择和角色反馈进行创作
4. **实时反馈**: 提供类群聊式的互动体验
5. **版本管理**: 追踪创作历史，支持多版本管理

### 角色体系

1. **管理层**
   - 产品经理：需求分析和任务分配，把控创作方向
   - 市场分析师：市场定位和数据分析
   - 项目协调员：负责角色间的沟通和进度管理

2. **创作层**
   - 世界观架构师：构建小说世界观和设定
   - 剧情设计师：设计情节发展和结构
   - 文案优化师：优化文字表达和风格
   - 角色塑造师：设计和完善人物性格与成长
   - 战斗设计师：设计修仙功法和战斗场景

3. **质控层**
   - 品质监理：审核内容质量和一致性
   - 体验官：评估用户体验和市场接受度
   - 逻辑检查员：确保情节和设定的合理性
   - 文风把控师：确保文风统一和吸引力

### 角色协同机制

```typescript
interface RoleCollaboration {
  workflow: {
    // 创作流程
    stages: [
      {
        name: '前期准备';
        roles: ['产品经理', '市场分析师'];
        output: '创作大纲和市场定位';
      },
      {
        name: '世界构建';
        roles: ['世界观架构师', '角色塑造师'];
        output: '世界观体系和角色设定';
      },
      {
        name: '内容创作';
        roles: ['剧情设计师', '文案优化师', '战斗设计师'];
        output: '章节内容';
      },
      {
        name: '质量控制';
        roles: ['品质监理', '逻辑检查员', '文风把控师'];
        output: '审核报告和修改建议';
      },
      {
        name: '用户反馈';
        roles: ['体验官', '项目协调员'];
        output: '反馈总结和优化方案';
      }
    ];

    // 协作规则
    rules: {
      communication: {
        type: '实时对话';
        channel: '角色群聊';
        priority: '由项目协调员设定';
      };
      
      review: {
        mode: '多轮审核';
        participants: '所有相关角色';
        consensus: '需达到80%同意';
      };
      
      conflict: {
        resolver: '项目协调员';
        escalation: '产品经理';
        resolution: '48小时内';
      };
    };
  };
  
  // 角色权限
  permissions: {
    management: {
      canOverride: true;
      canAssignTasks: true;
      canSetPriority: true;
    };
    creation: {
      canPropose: true;
      canEdit: true;
      requiresApproval: true;
    };
    quality: {
      canReview: true;
      canReject: true;
      canSuggest: true;
    };
  };
}
```

## 系统架构

```typescript
interface SystemConfig {
  core: {
    engine: 'DeepSeek';
    mode: '多角色协作';
    target: '网文小说创作';
    constraints: {
      maxWords: 1000000;
      genre: '修仙小说';
      style: '金庸笔法';
    };
  };
  
  features: {
    creation: {
      ideaGeneration: boolean;
      plotDevelopment: boolean;
      characterDesign: boolean;
      worldBuilding: boolean;
    };
    quality: {
      styleCheck: boolean;
      logicCheck: boolean;
      consistencyCheck: boolean;
      marketAnalysis: boolean;
    };
    versioning: {
      autoSave: boolean;
      historyTracking: boolean;
      feedbackRecord: boolean;
    };
  };
}
```

## 技术实现

```typescript
interface TechStack {
  frontend: {
    framework: 'Next.js 14';
    language: 'TypeScript 5';
    ui: {
      framework: 'React 18';
      styling: 'Tailwind CSS';
      components: 'shadcn/ui';
    };
  };
  tools: {
    packageManager: 'PNPM';
    codeQuality: {
      linter: 'ESLint';
      formatter: 'Prettier';
    };
  };
}
```

## 项目结构

```
.
├── app/                       # Next.js 主应用
├── public/                    # 静态资源
├── role/                      # 角色定义
└── projects/                  # 小说项目文件
```

## 核心组件

```typescript
interface Components {
  chat: {
    ChatContainer: '管理对话流程和状态';
    ChatMessage: '展示对话消息';
    RoleSelector: '角色选择和管理';
  };

  editor: {
    purpose: '小说内容编辑';
    features: ['实时保存', '版本控制', '角色反馈'];
  };

  toolbar: {
    purpose: '快捷操作';
    features: ['导出', '设置', '帮助'];
  };
}
```

## AI 模型集成

```typescript
interface AIModelConfig {
  // 主要模型选择
  primary: {
    provider: 'DeepSeek' | 'OpenAI';
    models: {
      chat: 'deepseek-chat' | 'gpt-4-turbo';
      creation: 'deepseek-coder' | 'gpt-4';
      analysis: 'deepseek-base' | 'gpt-3.5-turbo';
    };
  };

  // 角色设定
  rolePrompts: {
    management: {
      systemPrompt: string;  // 管理层角色的系统提示词
      temperature: 0.7;      // 更注重逻辑性
    };
    creation: {
      systemPrompt: string;  // 创作层角色的系统提示词
      temperature: 0.9;      // 更注重创造性
    };
    quality: {
      systemPrompt: string;  // 质控层角色的系统提示词
      temperature: 0.3;      // 更注重准确性
    };
  };

  // API 配置
  apiConfig: {
    deepseek: {
      apiKey: string;
      baseUrl: string;
      maxTokens: number;
      timeout: number;
    };
    openai: {
      apiKey: string;
      baseUrl: string;
      maxTokens: number;
      timeout: number;
    };
  };
}
```

### 模型使用说明

1. **角色分工**
   - 产品经理：使用 GPT-4/DeepSeek-Chat 进行需求分析和任务分配
   - 世界观架构师：使用 GPT-4/DeepSeek-Chat 构建世界观和设定
   - 剧情设计师：使用 GPT-4/DeepSeek-Chat 设计情节发展
   - 其他角色：根据具体任务选择适合的模型

2. **模型特点**
   - DeepSeek：
     - 优势：对中文创作理解更深，特别适合修仙小说创作
     - 使用场景：世界观构建、修仙体系设计、战斗场景描写
   - OpenAI：
     - 优势：逻辑性强，上下文理解准确
     - 使用场景：情节规划、人物性格设计、质量控制

3. **提示词策略**
   ```typescript
   interface PromptStrategy {
     // 角色定位
     roleDefinition: {
       background: string;    // 角色背景
       responsibility: string; // 具体职责
       constraints: string[]; // 行为约束
     };
     
     // 输出格式
     outputFormat: {
       structure: string;     // 输出结构
       style: string;        // 表达风格
       length: number;       // 内容长度
     };
     
     // 质量控制
     qualityControl: {
       requirements: string[]; // 质量要求
       examples: string[];    // 示例
       forbidden: string[];   // 禁止内容
     };
   }
   ```

4. **环境变量配置**
   ```bash
   # DeepSeek配置
   DEEPSEEK_API_KEY=your_deepseek_api_key
   DEEPSEEK_API_URL=https://api.deepseek.com/v1
   
   # OpenAI配置
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_API_URL=https://api.openai.com/v1
   ```

5. **模型调用流程**
   - 初始分析：使用 GPT-4/DeepSeek-Chat 进行内容理解
   - 创作阶段：根据任务特点选择合适的模型
   - 质量审核：使用 GPT-4 进行逻辑性和连贯性检查
   - 优化完善：根据反馈使用相应模型进行修改

6. **注意事项**
   - 确保 API 密钥安全存储
   - 实现请求速率限制
   - 添加错误重试机制
   - 保持模型响应的多样性
   - 定期更新提示词策略
