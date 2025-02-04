export interface RoleSetting {
  creativity: number; // 创造力 0-100
  strictness: number; // 严格度 0-100
  speed: number; // 响应速度 0-100
  style: string[]; // 写作风格
  constraints: string[]; // 创作限制
}

export interface Role {
  id: string;
  type: "writer" | "reviewer" | "rater"; // 角色类型
  name: string;
  status: "idle" | "working" | "paused" | "error";
  settings: RoleSetting;
  currentTask?: string; // 当前任务ID
  createdAt: string;
  updatedAt: string;
}
