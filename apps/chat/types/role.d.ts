export type RoleType = "writer" | "reviewer" | "rater" | "creator" | "manager";

export interface Role {
  id: string;
  type: RoleType;
  name: string;
  status: RoleStatus;
  currentTask?: string;
  settings: RoleSettings;
}

export type RoleStatus = "idle" | "working" | "paused" | "error";

export interface RoleSettings {
  creativity: number; // 创造力水平 (0-100)
  strictness: number; // 严格程度 (0-100)
  speed: number; // 响应速度 (0-100)
  style: string[]; // 风格标签
  constraints: string[]; // 限制条件
}

export interface RoleAdjustment {
  settings?: Partial<RoleSettings>;
  status?: RoleStatus;
  task?: string;
}
