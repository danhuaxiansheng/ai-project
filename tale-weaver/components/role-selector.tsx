"use client";

import { useState } from "react";
import { useStory } from "@/contexts/story-context";
import { cn } from "@/lib/utils";
import { Role } from "@/types/role";

const ROLES: Role[] = [
  {
    id: "editor",
    name: "编辑",
    description: "帮助你规划和完善故事情节",
    icon: "📝",
  },
  {
    id: "reviewer",
    name: "评审",
    description: "从读者角度提供反馈和建议",
    icon: "👀",
  },
  {
    id: "mentor",
    name: "导师",
    description: "指导写作技巧和风格提升",
    icon: "🎓",
  },
  {
    id: "brainstormer",
    name: "创意师",
    description: "激发灵感，提供新的创意方向",
    icon: "💡",
  },
];

export function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const { currentStory } = useStory();

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  if (!currentStory) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        请先选择或创建一个故事
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">选择角色</div>
      <div className="grid gap-2">
        {ROLES.map((role) => (
          <div
            key={role.id}
            className={cn(
              "rounded-lg border p-4 cursor-pointer transition-colors hover:bg-accent",
              selectedRole?.id === role.id && "border-primary"
            )}
            onClick={() => handleRoleSelect(role)}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{role.icon}</span>
              <div>
                <div className="font-medium">{role.name}</div>
                <div className="text-sm text-muted-foreground">
                  {role.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
