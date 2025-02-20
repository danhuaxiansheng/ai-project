"use client";

import { Character } from "@/types/character";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CharacterPersonalityChartProps {
  character: Character;
}

export function CharacterPersonalityChart({ character }: CharacterPersonalityChartProps) {
  const personalityTraits = [
    { name: '外向性', value: character.personality?.extraversion || 0 },
    { name: '开放性', value: character.personality?.openness || 0 },
    { name: '尽责性', value: character.personality?.conscientiousness || 0 },
    { name: '亲和性', value: character.personality?.agreeableness || 0 },
    { name: '情绪稳定性', value: character.personality?.neuroticism || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {personalityTraits.map(trait => (
          <div key={trait.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{trait.name}</span>
              <Badge variant="outline">{trait.value}</Badge>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${trait.value * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <Card className="p-4">
        <h4 className="font-medium mb-2">性格特征分析</h4>
        <p className="text-sm text-muted-foreground">
          {character.personality?.analysis || '暂无性格分析'}
        </p>
      </Card>
    </div>
  );
} 