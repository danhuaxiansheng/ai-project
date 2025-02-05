# AI 小说创作系统

基于 DeepSeek 的智能小说创作系统，通过多角色协作的方式，帮助用户创作小说。

## 系统特点

1. **多角色自动协作**
   - 系统采用群聊形式，模拟真实的创作团队协作
   - 角色按管理层、创作层、质控层的顺序自动响应
   - 每个角色根据自身职责提供专业意见

2. **角色设定**
   - 管理层
     - 产品经理：负责整体产品规划与定义
     - 小说产品经理：专注网文市场分析
   - 创作层
     - 设定创作者：构建完整世界观体系
     - 小说创作者：进行核心故事创作
     - 创作助手：协助具体写作工作
   - 质控层
     - 评分员：评估作品质量
     - 审核员：把控作品整体质量

3. **工作流程**
   1. **用户输入**: 用户在系统中输入创作想法或小说片段
   2. **自动分工**: 系统自动触发多角色评审流程
      - 管理层优先响应，进行市场和商业价值分析
      - 创作层跟进，提供具体创作建议
      - 质控层最后把关，确保作品质量
   3. **实时反馈**: 各角色以群聊形式提供专业建议
   4. **用户确认**: 用户可以根据建议进行调整和确认
   5. **循环优化**: 通过多轮对话不断完善作品

4. **界面特点**
   - 群聊式界面设计
   - 角色头像和身份标识
   - 时间戳显示
   - 消息状态提示

## 技术实现

1. **前端架构**
   - Next.js + React
   - TailwindCSS 样式系统
   - TypeScript 类型支持

2. **核心功能**
   - 多角色自动响应机制
   - 上下文感知的对话系统
   - 实时状态反馈
   - 消息流程控制

3. **待实现功能**
   - DeepSeek API 集成
   - 角色间智能互动
   - 历史记录保存
   - 作品导出功能

## 使用说明

1. 输入创作想法或小说片段
2. 系统自动触发多角色评审
3. 等待各角色依次提供专业意见
4. 根据建议调整创作方向
5. 通过多轮对话完善作品

## 开发计划

- [x] 基础界面搭建
- [x] 多角色响应机制
- [x] 群聊式交互
- [ ] AI 模型集成
- [ ] 数据持久化
- [ ] 导出功能

## 项目目标

该模块作为整个 AI 小说创作系统的中央控制中心，拥有最高决策权限，负责实时监控、干预和调整所有 AI 角色的行为。通过实时对话方式，确保创作过程的质量和方向始终符合预期。

### 具体目标

1. **用户输入**: 用户在网页上输入一部分小说的片段，系统接收并处理这些输入。
2. **角色分析**: 启动多个角色（如小说审核员、评分员、专业创作者、设定创作者和产品经理）对用户输入的小说片段进行分析，并生成反馈。
3. **用户反馈与选择**: 用户对分析后的内容进行反馈和选择，保留部分特点并进行再次刷新，直到满意为止。
4. **角色创作**: 根据用户的最终选择，角色-小说创作者开始进行创作，其他角色也在同时工作，确保协作顺畅。
5. **实时反馈机制**: 各个角色向用户提供实时反馈，用户确认后再进入下一个角色的操作，形成类似群聊的互动。
6. **循环创作过程**: 通过不断的反馈和调整，最终创建出一部完整的小说。

## 核心定位
- 面向起点中文网
- 目标读者：18-40岁男性
- 创作风格：金庸笔法结合网文特色

## 项目规划

### 第一阶段
- [x] 项目基础架构搭建
- [x] AI 角色系统设计
- [ ] 用户交互界面开发
- [ ] 基础 AI 对话功能

### 第二阶段
- [ ] 多角色协同系统
- [ ] 实时反馈机制
- [ ] 创作质量评估系统
- [ ] 用户个性化配置

## 角色分工

### 管理层角色

1. **产品经理 (Product Manager)**
   - 负责整体产品规划与定义
   - 收集市场需求和用户反馈
   - 协调各团队工作
   - 把控产品开发方向

2. **小说产品经理 (Novel Product Manager)**
   - 专注网文市场分析
   - 制定创作方向和策略
   - 确保作品符合市场需求
   - 监控创作数据指标

### 创作层角色

3. **设定创作者 (Setting Creator)**
   - 构建完整世界观体系
   - 设计人物谱系和规则
   - 创造文化背景
   - 维护设定一致性

4. **小说创作者 (Story Creator)**
   - 进行核心故事创作
   - 负责情节发展和人物塑造
   - 保持叙事连贯性
   - 创造引人入胜的故事

5. **小说创作助手 (Writer)**
   - 协助具体写作工作
   - 提供写作建议
   - 完善故事细节
   - 优化文字表达

### 质控层角色

6. **小说评分员 (Story Rater)**
   - 评估作品艺术性（30分）
   - 评估故事性（30分）
   - 评估技术性（20分）
   - 评估创新性（20分）

7. **小说审核员 (Story Reviewer)**
   - 把控作品整体质量
   - 审核情节合理性
   - 确保人物塑造连贯
   - 验证设定符合要求

## 角色协作流程

1. **创作前期**
   - 产品经理确定产品方向
   - 小说产品经理制定创作策略
   - 设定创作者构建世界观

2. **创作中期**
   - 小说创作者负责主要创作
   - 创作助手配合细节完善
   - 评分员定期评估质量
   - 审核员把控创作方向

3. **创作后期**
   - 评分员进行终评
   - 审核员最终审核
   - 产品经理确认发布
   - 小说产品经理跟踪效果

## DeepSeek API 集成

本系统使用 DeepSeek API 来实现各个角色的功能，通过 API 调用实现：
- 角色人格设定
- 内容生成和优化
- 多轮对话交互
- 实时反馈和修改

### 技术栈
- Monorepo
  - Turborepo
  - PNPM Workspace
- 前端框架
  - Next.js 14+
  - React 18+
  - TypeScript 5+
- 样式方案
  - Tailwind CSS
  - SCSS Modules
  - Shadcn/ui

### 开发指南

1. **环境准备**
```bash
# 安装 PNPM
npm install -g pnpm

# 安装依赖
pnpm install
```

2. **开发命令**
```bash
# 开发模式
pnpm dev

# 构建项目
pnpm build

# 代码检查
pnpm lint

# 格式化代码
pnpm format
```

3. **项目配置**
- 在 `.env.local` 中配置环境变量
- 确保 DeepSeek API Key 已正确设置

### 技术栈：全栈
- Monorepo
  - Turborepo
  - PNPM Workspace
- 前端框架
  - Next.js 14+
  - React 18+
  - TypeScript 5+
- 样式方案
  - Tailwind CSS
  - SCSS Modules
  - Shadcn/ui


### 项目结构
├── apps/
│   └── web/                # 主应用
├── packages/
│   ├── eslint-config/     # 共享 ESLint 配置
│   ├── typescript-config/ # 共享 TS 配置
│   └── ui/               # 共享 UI 组件
├── package.json          # 工作空间根配置
├── pnpm-workspace.yaml   # PNPM 工作空间配置
└── turbo.json           # Turbo 配置

### web应用结构
```bash
apps/web/src/
├── app/                    # Next.js 应用主目录
│   ├── layout.tsx         # 主布局
│   ├── page.tsx          # 首页
│   └── chat/             # 对话系统页面
├── components/            # 通用组件
│   ├── ui/               # UI基础组件
│   └── chat/             # 对话相关组件
├── lib/                   # 工具函数和配置
│   ├── deepseek/         # DeepSeek API 相关
│   └── roles/            # 角色系统相关
├── types/                # TypeScript 类型定义
└── styles/               # 样式文件
```
