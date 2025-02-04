# AI辅助小说创作系统

一个基于多角色协作的AI小说创作系统，专注于创作高质量的网络小说。系统采用金庸风格写作手法，结合现代网文特色，面向起点中文网18-40岁男性读者群体。

## 项目结构

```
ai-novel-system/
├── apps/
│   ├── generator/         # Python 后端
│   │   ├── data/         # 数据存储
│   │   │   └── novels/   # 小说数据
│   │   ├── core/         # 核心创作逻辑
│   │   ├── utils/        # 工具函数
│   │   └── ...
│   └── web/              # Next.js 前端
│       ├── app/          # 页面路由
│       ├── components/   # React 组件
│       ├── lib/          # 工具函数
│       └── styles/       # 样式文件
├── outputs/              # 创作输出
│   └── [novel_id]/      # 每部小说的输出
├── tests/               # 测试文件
└── docs/               # 项目文档
```

## 系统角色

1. **小说创作者**
   - 负责具体章节创作
   - 保持金庸风格特色
   - 确保情节连贯性

2. **设定创作者**
   - 构建世界观体系
   - 设计人物关系
   - 制定规则体系

3. **审核员**
   - 把控作品质量
   - 确保设定一致
   - 提供修改建议

4. **评分员**
   - 多维度评分
   - 分析作品优劣
   - 提出改进建议

5. **产品经理**
   - 协调创作流程
   - 把控市场定位
   - 优化读者体验

## 技术栈

### 后端
- Python 3.8+
- FastAPI
- SQLAlchemy
- DeepSeek API

### 前端
- Next.js 13+
- React 18+
- TypeScript 5+
- Tailwind CSS
- SCSS Modules
- Shadcn/ui

## 创作流程

1. **前期准备**
   - 确定作品定位
   - 构建世界观
   - 设计人物关系

2. **创作过程**
   - 章节创作
   - 实时审核
   - 质量评估

3. **优化改进**
   - 读者反馈分析
   - 数据指标跟踪
   - 持续优化调整

## 主要功能

- 多角色协同创作
- 实时质量监控
- 市场数据分析
- 读者反馈管理
- 创作进度追踪

## 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEEPSEEK_API_KEY=your_deepseek_api_key
```

## 输出规范

### 小说目录结构
```
outputs/[novel_id]/
├── novel_config.json     # 小说配置
├── chapters/            # 章节内容
├── settings/           # 设定文档
├── reviews/           # 审核评分
└── analytics/        # 数据分析
```

## 注意事项

- 确保创作符合起点中文网规范
- 注重作品的市场表现
- 保持更新的稳定性
- 重视读者反馈
