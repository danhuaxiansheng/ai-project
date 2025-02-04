"use client";

import { useState } from "react";
import { Role } from "@/types/role";
import { Novel } from "@/types/novel";
import { TaskResult } from "./TaskResult";

interface TaskHistoryItem {
  id: string;
  task: string;
  result: string;
  timestamp: string;
}

interface TaskHistoryProps {
  role: Role;
  novel: Novel;
}

export function TaskHistory({ role, novel }: TaskHistoryProps) {
  const [history] = useState<TaskHistoryItem[]>([]);

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        暂无任务历史记录
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <div key={item.id} className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <div>{item.task}</div>
            <div>{new Date(item.timestamp).toLocaleString()}</div>
          </div>
          <TaskResult result={item.result} />
        </div>
      ))}
    </div>
  );
}
