# AI 小说创作系统

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
