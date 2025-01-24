# 虚拟世界生成器

一个基于 Python 和 Next.js 的虚拟世界生成器，提供直观的 Web 界面来生成完整的虚拟世界设定，包括世界起源、地理环境和文明发展等内容。

## 项目结构

```
virtual-world-generator/
├── apps/
│   ├── generator/         # Python 后端
│   │   ├── core/         # 核心生成逻辑
│   │   │   ├── world/    # 世界生成核心
│   │   │   ├── geography/# 地理系统
│   │   │   └── culture/  # 文明文化
│   │   ├── data/         # 数据处理
│   │   │   ├── models/   # 数据模型
│   │   │   └── schemas/  # 数据模式
│   │   ├── api/          # API 接口
│   │   └── utils/        # 工具函数
│   └── web/              # Next.js 前端
│       ├── app/          # 页面路由
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── world/    # 世界相关页面
│       ├── components/   # React 组件
│       │   ├── ui/       # UI 基础组件
│       │   └── world/    # 世界相关组件
│       ├── lib/          # 工具函数
│       │   ├── api/      # API 请求
│       │   └── utils/    # 通用工具
│       └── styles/       # 样式文件
├── outputs/              # 生成结果
│   └── [timestamp]/     # 每次生成的输出
├── tests/               # 测试文件
│   ├── unit/           # 单元测试
│   └── integration/    # 集成测试
└── docs/               # 项目文档
    ├── api/            # API 文档
    └── guides/         # 使用指南
```

## 技术栈

### 后端

- Python 3.8+
- FastAPI
- SQLAlchemy

### 前端

- Next.js 13+ (App Router)
- React 18+
- TypeScript 5+
- Tailwind CSS
- SCSS Modules
- Shadcn/ui

## 安装说明

### 后端设置

1. 创建并激活 Python 虚拟环境：

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate     # Windows
```

2. 安装后端依赖：

```bash
cd apps/generator
pip install -r requirements.txt
```

### 前端设置

1. 安装 Node.js (18+) 和 pnpm

2. 安装前端依赖：

```bash
cd apps/web
pnpm install
```

## 开发说明

### 启动后端服务

```bash
cd apps/generator
python main.py
```

### 启动前端开发服务器

```bash
cd apps/web
pnpm dev
```

访问 http://localhost:3000 查看应用

### 构建前端

```bash
cd apps/web
pnpm build
pnpm start  # 运行生产环境
```

## 使用方法

1. 访问 Web 界面：http://localhost:3000
2. 在创建页面设置世界参数
3. 点击生成按钮开始创建虚拟世界
4. 查看生成结果并导出

## 功能特点

- 直观的 Web 界面
- 实时预览生成结果
- 可视化世界地图
- 文明发展时间线
- 导出多种格式
- 历史记录管理

## 开发指南

### 代码规范

- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 TypeScript 类型定义
- 使用 SCSS Modules 和 Tailwind 管理样式

### 提交规范

- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 代码格式
- refactor: 代码重构

## 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 注意事项

- 确保后端服务在前端启动前运行
- 首次运行会下载必要的模型文件
- 推荐使用 Node.js 18+ 版本
- 使用 pnpm 作为包管理器

## 许可证

[添加许可证信息]

## 贡献指南

[添加贡献指南]
