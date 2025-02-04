"use client";

import { useState } from "react";
import { Role } from "@/types/role";
import { Novel } from "@/types/novel";
import { taskAPI } from "@/lib/api/task";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface TaskExecutorProps {
  role: Role;
  novel: Novel;
  onComplete?: (result: string) => void;
}

export function TaskExecutor({ role, novel, onComplete }: TaskExecutorProps) {
  const [task, setTask] = useState("");
  const [executing, setExecuting] = useState(false);

  const handleExecute = async () => {
    if (!task.trim()) {
      toast({
        title: "错误",
        description: "请输入任务内容",
        variant: "destructive",
      });
      return;
    }

    try {
      setExecuting(true);
      const { result } = await taskAPI.executeTask(role.id, novel.id, task);
      toast({
        title: "成功",
        description: "任务执行完成",
      });
      onComplete?.(result);
      setTask("");
    } catch (error) {
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "任务执行失败",
        variant: "destructive",
      });
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="请输入任务内容..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        disabled={executing}
        rows={4}
      />
      <div className="flex justify-end">
        <Button onClick={handleExecute} disabled={executing}>
          {executing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          执行任务
        </Button>
      </div>
    </div>
  );
}
