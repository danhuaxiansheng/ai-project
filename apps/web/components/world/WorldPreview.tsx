"use client";

import React from "react";
import { World } from "../lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WorldPreviewProps {
  world: World;
  onClick?: () => void;
}

export const WorldPreview: React.FC<WorldPreviewProps> = ({
  world,
  onClick,
}) => {
  return (
    <Card
      className="mb-4 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-xl">{world.name}</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">复杂度: {world.complexity}</Badge>
          {world.focus_areas?.map((area) => (
            <Badge key={area} variant="outline">
              {area}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          创建时间: {new Date(world.created_at).toLocaleString()}
        </p>

        <p className="line-clamp-3">{world.description}</p>

        {world.geography && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            地理特征: {world.geography.terrain.summary}
          </p>
        )}

        {world.culture && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            文化特征: {world.culture.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
