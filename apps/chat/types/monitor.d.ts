import { Role } from "./role";
import { Task } from "./task";
import { Alert } from "./alert";

export interface MonitorState {
  roles: Role[];
  tasks: Task[];
  alerts: Alert[];
  systemStatus: SystemStatus;
}

export type SystemStatus = "running" | "paused" | "error";

export interface MonitorUpdate {
  type: "role" | "task" | "alert" | "system";
  data: any;
}
