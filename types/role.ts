import {
  Users,
  Briefcase,
  LineChart,
  Globe2,
  PenTool,
  UserCircle,
  Shield,
  Brain,
  LucideIcon,
} from "lucide-react";

export type RoleCategory = "management" | "creation" | "quality";

export interface Role {
  id: string;
  name: string;
  category: RoleCategory;
  description: string;
  icon: LucideIcon;
}

export const roles: Role[] = [
  // 管理层
  {
    id: "product-manager",
    name: "产品经理",
    category: "management",
    description: "需求分析和任务分配，把控创作方向",
    icon: Briefcase,
  },
  {
    id: "market-analyst",
    name: "市场分析师",
    category: "management",
    description: "市场定位和数据分析",
    icon: LineChart,
  },

  // 创作层
  {
    id: "world-architect",
    name: "世界观架构师",
    category: "creation",
    description: "构建小说世界观和设定",
    icon: Globe2,
  },
  {
    id: "plot-designer",
    name: "剧情设计师",
    category: "creation",
    description: "设计情节发展和结构",
    icon: PenTool,
  },
  {
    id: "character-designer",
    name: "角色塑造师",
    category: "creation",
    description: "设计和完善人物性格与成长",
    icon: UserCircle,
  },

  // 质控层
  {
    id: "quality-inspector",
    name: "品质监理",
    category: "quality",
    description: "审核内容质量和一致性",
    icon: Shield,
  },
  {
    id: "logic-checker",
    name: "逻辑检查员",
    category: "quality",
    description: "确保情节和设定的合理性",
    icon: Brain,
  },
];
