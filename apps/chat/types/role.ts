export interface RoleSetting {
  creativity: number;
  strictness: number;
  speed: number;
  style: string[];
  constraints: string[];
}

export interface Role {
  id: string;
  type: "writer" | "reviewer" | "rater";
  name: string;
  status: "idle" | "working" | "paused" | "error";
  settings: RoleSetting;
  currentTask?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleAdjustment {
  creativity?: number;
  strictness?: number;
  speed?: number;
  style?: string[];
  constraints?: string[];
}
