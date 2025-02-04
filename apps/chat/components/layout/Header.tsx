import { SystemStatus } from "@/types/monitor";
import { useGlobalMonitor } from "@/lib/hooks/useGlobalMonitor";

const statusColors: Record<SystemStatus, string> = {
  running: "bg-green-500",
  paused: "bg-yellow-500",
  error: "bg-red-500",
};

export function Header() {
  const { systemStatus, roles, tasks } = useGlobalMonitor();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">AI小说创作中控系统</h1>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${statusColors[systemStatus]}`}
              />
              <span className="text-sm text-gray-600">
                系统状态: {systemStatus}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              在线角色: {roles.length}
            </span>
            <span className="text-sm text-gray-600">
              活动任务: {tasks.length}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
