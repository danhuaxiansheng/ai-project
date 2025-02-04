import { Role } from "@/types/role";
import { Task } from "@/types/task";
import { Alert } from "@/types/alert";

export const mockRoles: Role[] = [
  {
    id: "writer-1",
    type: "writer",
    name: "小说创作者",
    status: "working",
    settings: {
      creativity: 80,
      strictness: 60,
      speed: 70,
      style: ["武侠", "仙侠"],
      constraints: ["避免过度描写", "保持情节紧凑"],
    },
  },
  {
    id: "reviewer-1",
    type: "reviewer",
    name: "审核员",
    status: "idle",
    settings: {
      creativity: 50,
      strictness: 90,
      speed: 85,
      style: ["严谨", "专业"],
      constraints: ["确保质量", "维护一致性"],
    },
  },
  {
    id: "rater-1",
    type: "rater",
    name: "评分员",
    status: "working",
    settings: {
      creativity: 60,
      strictness: 85,
      speed: 75,
      style: ["客观", "全面"],
      constraints: ["多维度评估", "避免偏见"],
    },
  },
];

export const mockTasks: Task[] = [
  {
    id: "task-1",
    type: "creation",
    status: "in_progress",
    assignedRole: "writer-1",
    content: "创作第一章节",
    startTime: Date.now() - 3600000,
  },
  {
    id: "task-2",
    type: "review",
    status: "pending",
    assignedRole: "reviewer-1",
    content: "审核第一章节",
    startTime: Date.now(),
  },
];

export const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    message: "检测到情节重复，建议修改",
    severity: "warning",
    timestamp: Date.now(),
    roleId: "writer-1",
    taskId: "task-1",
  },
  {
    id: "alert-2",
    message: "角色设定出现矛盾",
    severity: "error",
    timestamp: Date.now() - 1800000,
    roleId: "writer-1",
    taskId: "task-1",
  },
];
