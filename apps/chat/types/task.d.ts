export type TaskType =
  | "creation"
  | "review"
  | "rating"
  | "setting"
  | "management";

export interface Task {
  id: string;
  type: TaskType;
  status: TaskStatus;
  assignedRole: string;
  content: any;
  result?: any;
  startTime: number;
  endTime?: number;
}

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "failed"
  | "cancelled";
