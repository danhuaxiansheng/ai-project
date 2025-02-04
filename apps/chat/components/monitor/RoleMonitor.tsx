import { useGlobalMonitor } from "@/lib/hooks/useGlobalMonitor";
import { Role, RoleStatus } from "@/types/role";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface RoleMonitorProps {
  role: Role;
  onSelect: (role: Role) => void;
}

const statusColors = {
  idle: "bg-gray-400",
  working: "bg-green-500",
  paused: "bg-yellow-500",
  error: "bg-red-500",
};

export function RoleMonitor({ role, onSelect }: RoleMonitorProps) {
  const { tasks } = useGlobalMonitor();
  const currentTask = tasks.find((t) => t.id === role.currentTask);

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect(role)}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{role.name}</CardTitle>
          <Badge className={statusColors[role.status]}>{role.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>当前任务:</span>
            <span>{currentTask?.type || "无"}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>创造力</span>
              <span>{role.settings.creativity}%</span>
            </div>
            <Progress value={role.settings.creativity} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>严格度</span>
              <span>{role.settings.strictness}%</span>
            </div>
            <Progress value={role.settings.strictness} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
