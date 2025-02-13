"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Brain, MessageSquare, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStory } from "@/contexts/story-context";
import { roles } from "@/types/role";

export function RoleSelector() {
  const { state, dispatch } = useStory();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">选择 AI 角色</h2>
      <div className="space-y-2">
        {roles.map((role) => (
          <Card
            key={role.id}
            className={cn(
              "p-4 cursor-pointer transition-colors hover:bg-accent",
              state.selectedRole?.id === role.id && "border-primary"
            )}
            onClick={() => dispatch({ type: "SET_ROLE", payload: role })}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 text-primary">
                {role.id === "world-builder" ? (
                  <Brain className="h-6 w-6" />
                ) : role.id === "dialogue-generator" ? (
                  <MessageSquare className="h-6 w-6" />
                ) : (
                  <PlayCircle className="h-6 w-6" />
                )}
              </div>
              <div>
                <h3 className="font-medium">{role.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {role.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
