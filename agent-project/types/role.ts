export type RoleCategory = "management" | "creation" | "quality";

export interface Role {
  id: string;
  name: string;
  type: "management" | "creation" | "quality";
  description: string;
  permissions: string[];
  systemPrompt: string;
  icon: string; // Iconify 图标名称
}

export interface RoleResponse {
  content: string;
  role: Role;
  timestamp: number;
}

export const roles: Role[] = [
  // 管理层
  {
    id: "product-manager",
    name: "产品经理",
    type: "management",
    description: "需求分析和任务分配，把控创作方向",
    permissions: [],
    systemPrompt: "",
    icon: "mdi:briefcase", // 使用 Material Design Icons
  },
  {
    id: "market-analyst",
    name: "市场分析师",
    type: "management",
    description: "市场定位和数据分析",
    permissions: [],
    systemPrompt: "",
    icon: "mdi:chart-line",
  },

  // 创作层
  {
    id: "world-architect",
    name: "世界观架构师",
    type: "creation",
    description: "构建小说世界观和设定",
    icon: "mdi:earth",
    permissions: [],
    systemPrompt: "",
  },
  {
    id: "plot-designer",
    name: "剧情设计师",
    type: "creation",
    description: "设计情节发展和结构",
    icon: "mdi:pencil",
    permissions: [],
    systemPrompt: "",
  },
  {
    id: "character-designer",
    name: "角色塑造师",
    type: "creation",
    description: "设计和完善人物性格与成长",
    icon: "mdi:account-circle",
    permissions: [],
    systemPrompt: "",
  },

  // 质控层
  {
    id: "quality-inspector",
    name: "品质监理",
    type: "quality",
    description: "审核内容质量和一致性",
    icon: "mdi:shield",
    permissions: [],
    systemPrompt: "",
  },
  {
    id: "logic-checker",
    name: "逻辑检查员",
    type: "quality",
    description: "确保情节和设定的合理性",
    icon: "mdi:brain",
    permissions: [],
    systemPrompt: "",
  },
];
