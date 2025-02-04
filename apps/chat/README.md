# AI小说创作系统 - 中控对话系统

## 项目说明
该模块作为整个AI小说创作系统的中央控制中心，拥有最高决策权限，负责实时监控、干预和调整所有AI角色的行为。通过实时对话方式，确保创作过程的质量和方向始终符合预期。

## 项目结构
```
apps/chat/
├── app/                      # Next.js 应用目录
│   ├── layout.tsx           # 布局组件
│   ├── page.tsx            # 控制台首页
│   ├── monitor/            # 监控页面
│   │   ├── overview.tsx   # 总览面板
│   │   ├── roles/         # 角色监控
│   │   └── tasks/         # 任务监控
│   └── intervention/       # 干预控制页面
├── components/              # 组件目录
│   ├── monitor/            # 监控组件
│   │   ├── RoleMonitor.tsx    # 角色行为监控
│   │   ├── TaskProgress.tsx   # 任务进度监控
│   │   └── QualityMetrics.tsx # 质量指标监控
│   ├── intervention/        # 干预组件
│   │   ├── CommandPanel.tsx   # 指令控制面板
│   │   ├── FeedbackEditor.tsx # 反馈编辑器
│   │   └── RoleAdjuster.tsx   # 角色行为调整器
│   └── shared/             # 共享组件
├── lib/                    # 工具函数
│   ├── api/               # API 请求
│   │   ├── monitor.ts    # 监控相关API
│   │   └── control.ts    # 控制相关API
│   └── hooks/             # 自定义Hooks
└── types/                 # 类型定义
```

## 核心功能

### 1. 全局监控
- 实时监控所有角色的行为和输出
- 追踪创作进度和质量指标
- 检测潜在问题和风险
- 分析角色间的协作效果

### 2. 高权限干预
- 一键暂停所有角色操作
- 发布全局指令和调整要求
- 直接修改角色行为参数
- 否决和回滚不当操作

### 3. 质量控制
- 实时评估内容质量
- 审核角色决策合理性
- 确保风格和设定统一
- 把控作品整体方向

### 4. 角色协调
- 调解角色间冲突
- 优化协作流程
- 统一决策标准
- 协调资源分配

## 技术实现

### 1. 监控系统
```typescript
// lib/hooks/useGlobalMonitor.ts
export function useGlobalMonitor() {
  const [roles, setRoles] = useState<RoleStatus[]>([]);
  const [tasks, setTasks] = useState<TaskStatus[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // 实时监控所有角色状态
  useEffect(() => {
    const unsubscribe = monitorService.subscribeToRoles((updates) => {
      setRoles(updates);
      checkForIssues(updates);
    });
    return () => unsubscribe();
  }, []);

  // 问题检测和预警
  const checkForIssues = (roleUpdates: RoleStatus[]) => {
    const newAlerts = detectIssues(roleUpdates);
    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev, ...newAlerts]);
      triggerIntervention(newAlerts);
    }
  };

  return { roles, tasks, alerts };
}
```

### 2. 干预控制
```typescript
// lib/api/control.ts
export const controlAPI = {
  // 暂停所有角色操作
  async pauseAll() {
    return await fetch('/api/control/pause-all', { method: 'POST' });
  },

  // 发布全局指令
  async issueCommand(command: GlobalCommand) {
    return await fetch('/api/control/command', {
      method: 'POST',
      body: JSON.stringify(command)
    });
  },

  // 调整角色参数
  async adjustRole(roleId: string, adjustments: RoleAdjustment) {
    return await fetch(`/api/control/roles/${roleId}/adjust`, {
      method: 'POST',
      body: JSON.stringify(adjustments)
    });
  },

  // 回滚操作
  async rollback(taskId: string) {
    return await fetch(`/api/control/tasks/${taskId}/rollback`, {
      method: 'POST'
    });
  }
};
```

### 3. 控制面板组件
```typescript
// components/intervention/CommandPanel.tsx
export function CommandPanel() {
  const { roles, alerts } = useGlobalMonitor();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleEmergencyStop = async () => {
    await controlAPI.pauseAll();
    notify.warning('已暂停所有角色操作');
  };

  const handleRoleAdjustment = async (adjustment: RoleAdjustment) => {
    if (!selectedRole) return;
    await controlAPI.adjustRole(selectedRole, adjustment);
    notify.success('角色参数已调整');
  };

  return (
    <div className="command-panel">
      <EmergencyButton onClick={handleEmergencyStop} />
      <RoleSelector 
        roles={roles}
        onSelect={setSelectedRole}
      />
      <AdjustmentControls 
        roleId={selectedRole}
        onAdjust={handleRoleAdjustment}
      />
      <AlertList alerts={alerts} />
    </div>
  );
}
```

## 使用说明

### 1. 监控操作
- 实时查看各角色状态
- 追踪任务执行进度
- 监控质量指标变化
- 接收预警信息

### 2. 干预操作
- 发布全局指令
- 调整角色参数
- 暂停/恢复操作
- 回滚错误操作

## 注意事项

1. 权限控制
- 严格控制访问权限
- 记录所有操作日志
- 定期审查操作记录

2. 干预原则
- 保持必要性原则
- 干预要有理有据
- 避免过度干预
- 注重效果评估

3. 应急处理
- 制定应急预案
- 快速响应机制
- 问题升级流程
- 定期演练测试

4. 系统维护
- 定期检查系统状态
- 优化响应速度
- 备份重要数据
- 更新安全策略 