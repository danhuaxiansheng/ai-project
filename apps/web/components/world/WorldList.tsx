"use client";

import React from "react";
import { World } from "@/lib/types";
import { WorldPreview } from "./WorldPreview";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorldListProps {
  worlds: World[];
  onWorldSelect?: (world: World) => void;
}

export const WorldList: React.FC<WorldListProps> = ({
  worlds,
  onWorldSelect,
}) => {
  const router = useRouter();
  const handleWorldClick = (world: World) => {
    if (onWorldSelect) {
      onWorldSelect(world);
    } else {
      router.push(`/worlds/${world.project || "default_project"}/${world.id}`);
    }
  };

  if (!worlds || worlds.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>没有世界</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            还没有创建任何世界。点击"创建世界"开始你的创作之旅。
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-4">
        {worlds.map((world) => (
          <WorldPreview
            key={world.id}
            world={world}
            onClick={() => handleWorldClick(world)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
