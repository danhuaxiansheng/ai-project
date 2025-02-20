"use client";

import { Character, CharacterRelationship } from "@/types/character";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Swords, Home, Heart, HelpCircle } from "lucide-react";

interface CharacterRelationshipAnalysisProps {
  character: Character;
  characters: Character[];
  onCharacterClick?: (characterId: string) => void;
}

export function CharacterRelationshipAnalysis({ 
  character, 
  characters,
  onCharacterClick 
}: CharacterRelationshipAnalysisProps) {
  const relationshipStats = {
    friend: character.relationships.filter(r => r.type === 'friend').length,
    enemy: character.relationships.filter(r => r.type === 'enemy').length,
    family: character.relationships.filter(r => r.type === 'family').length,
    lover: character.relationships.filter(r => r.type === 'lover').length,
    other: character.relationships.filter(r => r.type === 'other').length,
  };

  const getCharacterName = (id: string) => 
    characters.find(c => c.id === id)?.name || '未知角色';

  const getRelationshipIcon = (type: CharacterRelationship['type']) => {
    switch (type) {
      case 'friend': return <Users className="h-4 w-4" />;
      case 'enemy': return <Swords className="h-4 w-4" />;
      case 'family': return <Home className="h-4 w-4" />;
      case 'lover': return <Heart className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  // 检查是否存在双向关系
  const checkMutualRelationship = (targetId: string, type: CharacterRelationship['type']) => {
    const targetCharacter = characters.find(c => c.id === targetId);
    return targetCharacter?.relationships.some(r => 
      r.targetId === character.id && r.type === type
    );
  };

  const RelationshipStrength = ({ strength }: { strength: number }) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            i < strength ? "bg-primary" : "bg-muted"
          )}
        />
      ))}
    </div>
  );

  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium mb-4">关系分析</h3>
      
      <div className="space-y-4">
        {/* 关系统计 */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(relationshipStats).map(([type, count]) => count > 0 && (
            <div key={type} className="flex items-center gap-1">
              {getRelationshipIcon(type as CharacterRelationship['type'])}
              <Badge variant="secondary" className="flex items-center gap-1">
                {{
                  friend: '朋友',
                  enemy: '敌人',
                  family: '家人',
                  lover: '恋人',
                  other: '其他'
                }[type]}
                <span className="text-xs ml-1">{count}</span>
              </Badge>
            </div>
          ))}
        </div>

        {/* 关系列表 */}
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 pr-4">
            {character.relationships.map((rel, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer"
                onClick={() => onCharacterClick?.(rel.targetId)}
              >
                <div className="flex items-start gap-3">
                  {getRelationshipIcon(rel.type)}
                  <div>
                    <div className="font-medium">{getCharacterName(rel.targetId)}</div>
                    <div className="text-sm text-muted-foreground">{rel.description}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {{
                        friend: '朋友',
                        enemy: '敌人',
                        family: '家人',
                        lover: '恋人',
                        other: '其他'
                      }[rel.type]}
                    </Badge>
                    {checkMutualRelationship(rel.targetId, rel.type) && (
                      <Badge variant="secondary">双向</Badge>
                    )}
                  </div>
                  <RelationshipStrength strength={rel.strength} />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
} 