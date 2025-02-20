"use client";

import { Character, CharacterRelationship } from "@/types/character";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CharacterRelationshipStatsProps {
  character: Character;
  characters: Character[];
}

export function CharacterRelationshipStats({ character, characters }: CharacterRelationshipStatsProps) {
  // 计算关系统计
  const stats = {
    total: character.relationships.length,
    bidirectional: character.relationships.filter(rel => {
      const targetChar = characters.find(c => c.id === rel.targetId);
      return targetChar?.relationships.some(r => r.targetId === character.id);
    }).length,
    avgStrength: character.relationships.reduce((acc, rel) => acc + rel.strength, 0) / 
      (character.relationships.length || 1),
    types: {
      friend: character.relationships.filter(r => r.type === 'friend').length,
      enemy: character.relationships.filter(r => r.type === 'enemy').length,
      family: character.relationships.filter(r => r.type === 'family').length,
      lover: character.relationships.filter(r => r.type === 'lover').length,
      other: character.relationships.filter(r => r.type === 'other').length,
    }
  };

  // 分析关系特点
  const analysis = {
    socialLevel: stats.total > 5 ? '广泛' : stats.total > 2 ? '一般' : '有限',
    connectionStrength: stats.avgStrength > 4 ? '紧密' : stats.avgStrength > 2 ? '一般' : '疏远',
    mutualityRate: (stats.bidirectional / stats.total) * 100,
    dominantRelationType: Object.entries(stats.types)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0],
  };

  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium mb-4">关系概览</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">总关系数</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{stats.bidirectional}</div>
            <div className="text-sm text-muted-foreground">双向关系</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{stats.avgStrength.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">平均强度</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>双向关系比例</span>
              <span>{Math.round(analysis.mutualityRate)}%</span>
            </div>
            <Progress value={analysis.mutualityRate} />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">关系类型分布</div>
            {Object.entries(stats.types).map(([type, count]) => count > 0 && (
              <div key={type} className="space-y-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {{
                      friend: '朋友',
                      enemy: '敌人',
                      family: '家人',
                      lover: '恋人',
                      other: '其他'
                    }[type as keyof typeof stats.types]}
                  </span>
                  <span>{count}</span>
                </div>
                <Progress value={(count / stats.total) * 100} />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm font-medium mb-2">关系特点分析</div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>该角色的社交范围{analysis.socialLevel}。</p>
            <p>整体关系强度{analysis.connectionStrength}。</p>
            {analysis.mutualityRate > 70 && (
              <p>大部分关系都是双向的，说明人际关系较为稳固。</p>
            )}
            {analysis.mutualityRate < 30 && (
              <p>双向关系较少，可能需要加强关系的互动和发展。</p>
            )}
            <p>主要关系类型为{
              {
                friend: '友好关系',
                enemy: '对立关系',
                family: '家庭关系',
                lover: '恋爱关系',
                other: '其他关系'
              }[analysis.dominantRelationType as keyof typeof stats.types]
            }。</p>
          </div>
        </div>
      </div>
    </Card>
  );
} 