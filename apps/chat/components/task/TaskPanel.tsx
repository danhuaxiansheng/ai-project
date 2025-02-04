"use client";

import { Role } from "@/types/role";
import { Novel } from "@/types/novel";
import { TaskExecutor } from "./TaskExecutor";
import { TaskHistory } from "./TaskHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TaskPanelProps {
  role: Role;
  novel: Novel;
}

export function TaskPanel({ role, novel }: TaskPanelProps) {
  return (
    <Tabs defaultValue="execute" className="w-full">
      <TabsList>
        <TabsTrigger value="execute">执行任务</TabsTrigger>
        <TabsTrigger value="history">历史记录</TabsTrigger>
      </TabsList>
      <TabsContent value="execute">
        <TaskExecutor role={role} novel={novel} />
      </TabsContent>
      <TabsContent value="history">
        <TaskHistory role={role} novel={novel} />
      </TabsContent>
    </Tabs>
  );
}
