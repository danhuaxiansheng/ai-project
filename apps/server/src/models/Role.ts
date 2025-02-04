import mongoose, { Document, Schema } from "mongoose";

export interface RoleSetting {
  creativity: number; // 创造力 0-100
  strictness: number; // 严格度 0-100
  speed: number; // 响应速度 0-100
  style: string[]; // 写作风格
  constraints: string[]; // 创作限制
}

export interface Role extends Document {
  type: "writer" | "reviewer" | "rater"; // 角色类型
  name: string;
  status: "idle" | "working" | "paused" | "error";
  settings: RoleSetting;
  currentTask?: string; // 当前任务ID
  createdAt: Date;
  updatedAt: Date;
}

const RoleSettingSchema = new Schema<RoleSetting>({
  creativity: { type: Number, required: true, min: 0, max: 100 },
  strictness: { type: Number, required: true, min: 0, max: 100 },
  speed: { type: Number, required: true, min: 0, max: 100 },
  style: [String],
  constraints: [String],
});

const RoleSchema = new Schema<Role>({
  type: {
    type: String,
    enum: ["writer", "reviewer", "rater"],
    required: true,
  },
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ["idle", "working", "paused", "error"],
    default: "idle",
  },
  settings: { type: RoleSettingSchema, required: true },
  currentTask: { type: Schema.Types.ObjectId, ref: "Novel" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const RoleModel = mongoose.model<Role>("Role", RoleSchema);
