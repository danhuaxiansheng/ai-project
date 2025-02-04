"use client";

import { Role } from "@/types/role";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RoleMonitorProps {
  role: Role;
}

export function RoleMonitor({ role }: RoleMonitorProps) {
  const { settings } = role;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{role.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>创造力</span>
            <span>{settings.creativity}%</span>
          </div>
          <Progress value={settings.creativity} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>严谨度</span>
            <span>{settings.strictness}%</span>
          </div>
          <Progress value={settings.strictness} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>响应速度</span>
            <span>{settings.speed}%</span>
          </div>
          <Progress value={settings.speed} />
        </div>
      </CardContent>
    </Card>
  );
}
