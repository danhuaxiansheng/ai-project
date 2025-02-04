export type AlertSeverity = "info" | "warning" | "error" | "success";

export interface Alert {
  id: string;
  message: string;
  severity: AlertSeverity;
  timestamp: number;
  roleId?: string;
  taskId?: string;
}
