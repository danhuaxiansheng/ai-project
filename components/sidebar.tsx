"use client";
import { cn } from "@/lib/utils";
import { RoleSelector } from "@/components/role-selector";
import { useRoleStore } from "@/store/role-store";
import { CollaboratorsList } from "./collaborators-list";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const { selectedRole, setSelectedRole } = useRoleStore();

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">AI 小说创作系统</h1>
      </div>

      {/* 角色选择区 */}
      <div className="flex-1 p-4 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">
          角色选择
        </h2>
        <RoleSelector
          selectedRole={selectedRole}
          onRoleSelect={setSelectedRole}
        />
      </div>

      {/* 项目信息区 */}
      <div className="p-4 border-t">
        <div className="text-sm text-muted-foreground">当前项目：示例项目</div>
        {selectedRole && (
          <div className="flex items-center gap-2 mt-2 text-sm">
            <selectedRole.icon className="w-4 h-4" />
            当前角色：{selectedRole.name}
          </div>
        )}
      </div>

      {/* 协作者列表 */}
      <div className="p-4 border-t">
        <CollaboratorsList />
      </div>
    </div>
  );
}
