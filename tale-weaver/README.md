### **优化后的完整 AI 小说创作助手方案**

---

#### **一、核心目标**

开发基于 DeepSeek API 的 AI 小说创作助手，实现：

1. **用户与多个 AI 角色协同创作**：故事构建者、对话生成者、情节推进者分工明确
2. **上下文持续性**：通过本地存储实现可靠的数据持久化
3. **质量导向审核**：三级审核机制（逻辑一致性、文风匹配度、观赏度）
4. **实时反馈闭环**：支持人工修改建议并实时更新 AI 输出
5. **基础设定管理**：按照小说名称分类管理各类设定、大纲、章节等必要元素

---

#### **二、技术架构**

```mermaid
graph TD
    A[用户界面] --> B(Next.js前端)
    B --> C{API路由}
    C --> D[AI角色模块]
    C --> E[数据存储]
    C --> F[审核系统]
    D --> G[DeepSeek API]
    E --> H[IndexedDB]
    F --> I[向量检索]
    E --> J[基础设定管理]
```

---

#### **三、技术栈**

| 模块      | 技术方案                   | 关键优势                   |
| --------- | -------------------------- | -------------------------- |
| 前端框架  | Next.js 14 + React 19      | App Router, 服务端组件     |
| UI 组件库 | shadcn/ui + Tailwind CSS   | 高度可定制, 主题系统       |
| 状态管理  | React Context + TypeScript | 类型安全, 上下文共享       |
| 数据存储  | SQL.js + IndexedDB         | 本地持久化, 结构化查询     |
| 向量检索  | @xenova/transformers       | 轻量级文本向量化, 离线支持 |
| API 集成  | DeepSeek Chat API          | 中文优化, 上下文理解       |

---

#### **四、核心功能**

1. **多角色协作**

   - 故事构建者：世界观和主线设定
   - 对话生成者：角色对话创作
   - 情节推进者：剧情发展和转折

2. **记忆系统**

   - 基于向量的语义检索
   - 本地持久化存储
   - 混合查询策略

3. **质量控制**

   - 实时文本分析
   - 多维度评估
   - 修改建议生成

4. **基础设定管理**

   - 按照小说名称分类管理
   - 各类设定、大纲、章节等必要元素

   1. **数据结构**

   ```typescript
   // 基础设定数据结构
   interface NovelSetting {
     id: string; // UUID
     title: string;
     settings: {
       worldview: string;
       characterProfiles: Character[];
       timeline: Event[];
     };
     outline: {
       mainPlot: string;
       subPlots: SubPlot[];
     };
     chapters: Chapter[];
   }
   ```

   2. **功能模块**

   ```mermaid
   graph TD
       A[基础设定管理] --> B[新增设定]
       A --> C[编辑设定]
       A --> D[删除设定]
       A --> E[导入设定]
       A --> F[导出设定]
       B --> G[保存至IndexedDB]
       C --> G
       D --> H[从IndexedDB删除]
       E --> I[解析导入文件]
       F --> J[生成导出文件]
   ```

---

#### **五、数据流设计**

```mermaid
sequenceDiagram
    participant 用户
    participant 前端
    participant API路由
    participant AI角色
    participant IndexedDB

    用户->>前端: 输入创作指令
    前端->>API路由: 携带上下文请求
    API路由->>IndexedDB: 获取历史记录
    IndexedDB-->>API路由: 返回历史数据
    API路由->>AI角色: 生成请求
    AI角色-->>API路由: 生成内容
    API路由->>IndexedDB: 保存新内容
    API路由-->>前端: 返回结果
    前端->>用户: 展示生成内容
```

1. **本地存储层**
   - IndexedDB: 向量数据和设置
   - SQL.js: 结构化数据
2. **内存缓存层**

   - 向量存储：Map 实现
   - 会话状态：Context 管理

3. **API 交互层**
   - 异步请求处理
   - 错误重试机制
   - 数据同步策略

---

#### **六、迭代路线**

1. **Phase 1**

   - 实现基础角色协作
   - 完成 DeepSeek API 集成
   - 搭建 IndexedDB 存储

2. **Phase 2**

   - 增加角色参数自定义
   - 实现历史记录管理
   - 优化 API 调用效率

3. **Phase 3**

   - 实现基础设定管理
   - 按照小说名称分类管理
   - 各类设定、大纲、章节等必要元素

4. **Phase 4**

   - 添加协同编辑功能
   - 内置创作模板库
   - 实现自动备份系统

---
