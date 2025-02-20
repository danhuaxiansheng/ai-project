"use client";

import { Character } from "@/types/character";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface CharacterInfluenceMapProps {
  character: Character;
  characters: Character[];
}

interface InfluenceScore {
  character: Character;
  score: number;
  type: 'positive' | 'negative' | 'neutral';
  reason: string;
}

export function CharacterInfluenceMap({ character, characters }: CharacterInfluenceMapProps) {
  // 计算影响力分数
  const calculateInfluenceScores = (): InfluenceScore[] => {
    return characters.map(target => {
      // 基础分数计算
      let score = 0;
      let type: InfluenceScore['type'] = 'neutral';
      let reasons: string[] = [];

      // 查找双向关系
      const relationship = character.relationships.find(r => r.targetId === target.id);
      const reverseRelationship = target.relationships.find(r => r.targetId === character.id);

      if (relationship) {
        score += relationship.strength * 2;
        
        // 根据关系类型调整分数
        switch (relationship.type) {
          case 'friend':
            score += 3;
            reasons.push('友好关系');
            break;
          case 'enemy':
            score -= 2;
            reasons.push('对立关系');
            break;
          case 'family':
            score += 4;
            reasons.push('家庭关系');
            break;
          case 'lover':
            score += 5;
            reasons.push('亲密关系');
            break;
        }

        // 双向关系加成
        if (reverseRelationship && relationship.bidirectional) {
          score += 2;
          reasons.push('双向影响');
        }
      }

      // 确定影响类型
      if (score > 5) {
        type = 'positive';
      } else if (score < -2) {
        type = 'negative';
      }

      return {
        character: target,
        score: Math.round(score),
        type,
        reason: reasons.join('、')
      };
    }).sort((a, b) => Math.abs(b.score) - Math.abs(a.score));
  };

  const influenceScores = calculateInfluenceScores();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="font-medium mb-2">总体影响力</h4>
          <div className="text-2xl font-bold">
            {Math.round(influenceScores.reduce((sum, item) => sum + Math.abs(item.score), 0) / influenceScores.length)}
          </div>
          <p className="text-sm text-muted-foreground">基于角色关系网络分析</p>
        </Card>
        <Card className="p-4">
          <h4 className="font-medium mb-2">关键影响</h4>
          <div className="text-2xl font-bold">
            {influenceScores.filter(s => Math.abs(s.score) > 5).length}
          </div>
          <p className="text-sm text-muted-foreground">显著影响的角色数量</p>
        </Card>
      </div>

      <Card className="p-4">
        <h4 className="font-medium mb-4">影响力详情</h4>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {influenceScores.map(score => (
              <Card key={score.character.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{score.character.name}</span>
                    {score.type === 'positive' && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {score.type === 'negative' && <TrendingDown className="h-4 w-4 text-red-500" />}
                    {score.type === 'neutral' && <Minus className="h-4 w-4 text-gray-500" />}
                  </div>
                  <Badge variant={
                    score.type === 'positive' ? 'default' :
                    score.type === 'negative' ? 'destructive' : 'secondary'
                  }>
                    {score.score > 0 ? `+${score.score}` : score.score}
                  </Badge>
                </div>
                {score.reason && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {score.reason}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
} 