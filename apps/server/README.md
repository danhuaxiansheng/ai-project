apps/server/
├── src/
│   ├── config/
│   │   └── index.ts         # 配置文件
│   ├── controllers/
│   │   ├── novel.ts         # 小说相关控制器
│   │   └── role.ts          # AI角色相关控制器
│   ├── models/
│   │   ├── Novel.ts         # 小说模型
│   │   └── Role.ts          # 角色模型
│   ├── routes/
│   │   ├── novel.ts         # 小说相关路由
│   │   └── role.ts          # 角色相关路由
│   ├── services/
│   │   ├── novel.ts         # 小说业务逻辑
│   │   └── role.ts          # 角色业务逻辑
│   ├── types/
│   │   └── index.ts         # 类型定义
│   ├── utils/
│   │   └── index.ts         # 工具函数
│   └── app.ts               # 应用入口
├── .env                     # 环境变量
├── package.json
└── tsconfig.json