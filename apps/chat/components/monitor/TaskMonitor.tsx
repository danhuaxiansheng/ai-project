import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface TaskMonitorProps {
  task: Task;
  onRollback?: (taskId: string) => void;
}

const statusColors = {
  pending: "bg-gray-400",
  in_progress: "bg-blue-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
  cancelled: "bg-yellow-500",
};

export function TaskMonitor({ task, onRollback }: TaskMonitorProps) {
  const duration = formatDistanceToNow(task.startTime, {
    locale: zhCN,
    addSuffix: true,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">
            任务 #{task.id.slice(-6)}
          </CardTitle>
          <Badge className={statusColors[task.status]}>{task.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>类型:</span>
            <span>{task.type}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>开始时间:</span>
            <span>{duration}</span>
          </div>
          {task.status === "completed" && onRollback && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onRollback(task.id)}
            >
              回滚此任务
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
