"use client";

import { SystemStatus } from "@/types/monitor";
import { useGlobalMonitor } from "@/lib/hooks/useGlobalMonitor";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<
  SystemStatus,
  { color: string; label: string; description: string; variant: string }
> = {
  running: {
    color: "bg-green-500",
    label: "运行中",
    description: "系统正常运行",
    variant: "success",
  },
  paused: {
    color: "bg-yellow-500",
    label: "已暂停",
    description: "系统已暂停",
    variant: "warning",
  },
  error: {
    color: "bg-red-500",
    label: "错误",
    description: "系统发生错误",
    variant: "error",
  },
};

export function Header() {
  const { systemStatus, roles, tasks } = useGlobalMonitor();
  const status = statusConfig[systemStatus];

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">AI小说创作中控系统</h1>
            <Badge variant={status.variant as any} title={status.description}>
              {status.label}
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">在线角色: {roles.length}</Badge>
            <Badge variant="secondary">活动任务: {tasks.length}</Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
