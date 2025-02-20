"use client";

import { Character } from "@/types/character";
import { Card } from "@/components/ui/card";
import { Users, UserPlus, UserMinus, Network } from "lucide-react";

interface CharacterStatsProps {
  characters: Character[];
}

export function CharacterStats({ characters }: CharacterStatsProps) {
  const stats = {
    total: characters.length,
    protagonists: characters.filter(c => c.role === 'protagonist').length,
    antagonists: characters.filter(c => c.role === 'antagonist').length,
    supporting: characters.filter(c => c.role === 'supporting').length,
    avgRelationships: Math.round(
      characters.reduce((sum, c) => sum + c.relationships.length, 0) / characters.length
    ) || 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">总角色数</p>
            <p className="text-2xl font-semibold">{stats.total}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <UserPlus className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">主要角色</p>
            <p className="text-2xl font-semibold">{stats.protagonists}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <UserMinus className="h-5 w-5 text-red-500" />
          <div>
            <p className="text-sm text-muted-foreground">反派角色</p>
            <p className="text-2xl font-semibold">{stats.antagonists}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Network className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">平均关系数</p>
            <p className="text-2xl font-semibold">{stats.avgRelationships}</p>
          </div>
        </div>
      </Card>
    </div>
  );
} 