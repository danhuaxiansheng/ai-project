# AI 小说创作系统

## 项目目标

该模块作为整个 AI 小说创作系统的中央控制中心，拥有最高决策权限，负责实时监控、干预和调整所有 AI 角色的行为。通过实时对话方式，确保创作过程的质量和方向始终符合预期。

### 具体目标

1. **用户输入**: 用户在网页上输入一部分小说的片段，系统接收并处理这些输入。
2. **角色分析**: 启动多个角色（如小说审核员、评分员、专业创作者、设定创作者和产品经理）对用户输入的小说片段进行分析，并生成反馈。
3. **用户反馈与选择**: 用户对分析后的内容进行反馈和选择，保留部分特点并进行再次刷新，直到满意为止。
4. **角色创作**: 根据用户的最终选择，角色-小说创作者开始进行创作，其他角色也在同时工作，确保协作顺畅。
5. **实时反馈机制**: 各个角色向用户提供实时反馈，用户确认后再进入下一个角色的操作，形成类似群聊的互动。
6. **循环创作过程**: 通过不断的反馈和调整，最终创建出一部完整的小说。

### 角色描述

1. **用户（网页输入）**

   - 负责输入小说片段并提供反馈，直接影响创作过程。

2. **网文创作的产品经理**

   - 负责将用户输入的内容转化为各个角色的分工内容。
   - 接收用户的反馈，将相关调整分配给其他角色。
   - 协调各个角色的工作，确保创作流程顺畅。

3. **小说设定创作者**

   - 负责构建小说的世界观和人物设定，确保设定与故事情节相符。
   - 与其他角色密切合作，提供必要的背景信息和设定支持。

4. **小说审核员**

   - 负责审核小说内容的质量和一致性，提供反馈和修改建议。
   - 确保小说符合设定的风格和主题，维护作品的整体质量。

5. **小说评分员**

   - 对小说内容进行评分，分析其优劣，提供改进建议。
   - 评分员的反馈可以帮助创作者了解哪些方面需要改进。

6. **专业小说创作者**
   - 根据用户的最终选择进行小说创作，确保情节连贯。
   - 灵活应对用户反馈，调整创作方向以满足用户需求。


## 系统概述

```typescript
interface SystemOverview {
  name: 'AI小说创作系统';
  type: 'AI辅助创作工具';
  core: {
    engine: 'DeepSeek';
    mode: '多角色协作';
    target: '网文小说创作';
  };
  constraints: {
    maxWords: 1000000;      // 100万字上限
    genre: '修仙小说';      // 主要针对修仙类型
    style: '金庸笔法';      // 文风目标
  };
}
```

## 核心功能

```typescript
interface CoreFeatures {
  // 创作辅助
  creation: {
    ideaGeneration: boolean;    // 创意生成
    plotDevelopment: boolean;   // 情节发展
    characterDesign: boolean;   // 人物设计
    worldBuilding: boolean;     // 世界观构建
  };
  
  // 质量控制
  quality: {
    styleCheck: boolean;        // 文风把控
    logicCheck: boolean;        // 逻辑检查
    consistencyCheck: boolean;  // 一致性检查
    marketAnalysis: boolean;    // 市场分析
  };
  
  // 版本管理
  versioning: {
    autoSave: boolean;         // 自动保存
    historyTracking: boolean;  // 历史追踪
    feedbackRecord: boolean;   // 反馈记录
  };
}
```

## 角色定义

```typescript
interface Role {
  // 基础角色属性
  base: {
    id: string;
    name: string;
    type: 'management' | 'creation' | 'quality';
    priority: number;
  };
  
  // 角色列表
  roles: {
    management: [
      {
        id: 'product_manager';
        name: '产品经理';
        priority: 1;
      },
      {
        id: 'market_analyst';
        name: '市场分析师';
        priority: 2;
      }
    ];
    creation: [
      {
        id: 'world_builder';
        name: '世界观架构师';
        priority: 3;
      },
      {
        id: 'plot_designer';
        name: '剧情设计师';
        priority: 4;
      },
      {
        id: 'content_optimizer';
        name: '文案优化师';
        priority: 5;
      }
    ];
    quality: [
      {
        id: 'quality_controller';
        name: '品质监理';
        priority: 6;
      },
      {
        id: 'experience_officer';
        name: '体验官';
        priority: 7;
      }
    ];
  };
}
```

## 工作流程

```typescript
interface Workflow {
  // 基本流程
  basic: {
    input: '用户输入想法或片段';
    process: [
      '角色分析响应',
      '用户确认方向',
      '持续优化迭代'
    ];
    output: '完整小说内容';
  };
  
  // 角色响应顺序
  sequence: {
    order: [
      'management',  // 管理层优先
      'creation',    // 创作层其次
      'quality'      // 质控层最后
    ];
    mode: 'sequential';  // 顺序响应
    interval: 1000;      // 响应间隔(ms)
  };
}
```

## 数据存储

```typescript
interface Storage {
  // 文件系统
  files: {
    root: './projects';
    structure: {
      content: ['story.md', 'outline.md', 'settings.md'];
      feedback: ['roles.json', 'decisions.json', 'history.json'];
      versions: 'v{number}-{timestamp}.md';
    };
  };
  
  // 自动保存
  autoSave: {
    interval: 300000;  // 5分钟
    minChanges: 100;   // 最小改动字数
  };
}
```

## API 集成

```typescript
interface Integration {
  // DeepSeek API
  ai: {
    endpoint: string;
    models: {
      creative: string;  // 创作模型
      analysis: string;  // 分析模型
      chat: string;     // 对话模型
    };
    features: [
      'streaming',
      'function-calling'
    ];
  };
}
```

## 技术栈

```typescript
interface TechStack {
  // 前端技术
  frontend: {
    framework: 'Next.js 14';
    language: 'TypeScript 5';
    ui: {
      framework: 'React 18';
      styling: 'Tailwind CSS';
      components: 'shadcn/ui';
    };
  };

  // 项目管理
  projectManagement: {
    monorepo: 'Turborepo';
    packageManager: 'PNPM';
    linter: 'ESLint';
    formatter: 'Prettier';
  };

  // 开发工具
  devTools: {
    vscode: {
      extensions: [
        'ESLint',
        'Prettier',
        'Tailwind CSS IntelliSense'
      ];
    };
    git: {
      workflow: 'trunk-based';
      commitLint: true;
    };
  };
}
```

## 项目结构

```
.
├── apps/
│   └── web/                    # Next.js 主应用
│       ├── src/
│       │   ├── app/           # App Router 路由
│       │   │   ├── chat/     # 对话相关组件
│       │   │   ├── editor/   # 编辑器组件
│       │   │   └── ui/       # 通用UI组件
│       │   ├── lib/          # 工具函数
│       │   └── types/        # TypeScript 类型
│       └── public/           # 静态资源
│
├── packages/
│   ├── ui/                    # 共享UI组件库
│   ├── eslint-config/        # ESLint 配置
│   └── typescript-config/    # TypeScript 配置
│
├── role/                      # 角色定义文件
│   ├── product-manager.md
│   ├── market-analyst.md
│   ├── world-builder.md
│   └── ...
│
└── projects/                  # 小说项目文件
    └── {projectId}/
        ├── content/          # 内容文件
        ├── feedback/         # 反馈记录
        └── versions/         # 版本历史
```

## 关键组件

```typescript
interface Components {
  // 对话系统
  chat: {
    ChatContainer: {
      purpose: '管理对话流程和状态';
      features: [
        '角色调度',
        '消息历史',
        '上下文管理'
      ];
    };
    ChatMessage: {
      purpose: '展示对话消息';
      features: [
        '角色标识',
        '消息格式化',
        '反馈交互'
      ];
    };
    RoleSelector: {
      purpose: '角色选择和管理';
      features: [
        '角色列表',
        '权限控制',
        '状态显示'
      ];
    };
  };

  // 编辑器
  editor: {
    purpose: '小说内容编辑';
    features: [
      '实时保存',
      '版本控制',
      '角色反馈集成'
    ];
  };

  // 工具栏
  toolbar: {
    purpose: '快捷操作和工具';
    features: [
      '导出功能',
      '设置选项',
      '帮助文档'
    ];
  };
}
```
