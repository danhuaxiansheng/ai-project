"use client";

import { Character, CharacterRelationship } from "@/types/character";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Home, 
  Swords,
  Users, 
  HelpCircle
} from "lucide-react";

interface CharacterRelationshipAnalysisProps {
  character: Character;
  characters: Character[];
}

interface RelationshipGroup {
  type: CharacterRelationship['type'];
  characters: Array<{
    character: Character;
    relationship: CharacterRelationship;
    mutual: boolean;
  }>;
}

export function CharacterRelationshipAnalysis({ character, characters }: CharacterRelationshipAnalysisProps) {
  // 分析关系
  const relationshipGroups: Record<CharacterRelationship['type'], RelationshipGroup> = {
    friend: { type: 'friend', characters: [] },
    enemy: { type: 'enemy', characters: [] },
    family: { type: 'family', characters: [] },
    lover: { type: 'lover', characters: [] },
    other: { type: 'other', characters: [] },
  };

  // 分组关系
  character.relationships.forEach(rel => {
    const targetCharacter = characters.find(c => c.id === rel.targetId);
    if (!targetCharacter) return;

    // 检查是否为双向关系
    const mutualRelationship = targetCharacter.relationships.find(r => 
      r.targetId === character.id && r.type === rel.type
    );

    relationshipGroups[rel.type].characters.push({
      character: targetCharacter,
      relationship: rel,
      mutual: Boolean(mutualRelationship),
    });
  });

  const getRelationshipIcon = (type: CharacterRelationship['type']) => {
    switch (type) {
      case 'friend': return <Users className="h-4 w-4" />;
      case 'enemy': return <Swords className="h-4 w-4" />;
      case 'family': return <Home className="h-4 w-4" />;
      case 'lover': return <Heart className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getRelationshipLabel = (type: CharacterRelationship['type']) => {
    return {
      friend: '朋友',
      enemy: '敌人',
      family: '家人',
      lover: '恋人',
      other: '其他'
    }[type];
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">关系分析</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6">
          {Object.values(relationshipGroups).map(group => 
            group.characters.length > 0 && (
              <div key={group.type} className="space-y-2">
                <div className="flex items-center gap-2">
                  {getRelationshipIcon(group.type)}
                  <h4 className="font-medium">{getRelationshipLabel(group.type)}</h4>
                  <Badge variant="outline">{group.characters.length}</Badge>
                </div>
                <div className="grid gap-2">
                  {group.characters.map(({ character: target, relationship, mutual }) => (
                    <Card key={target.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{target.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {relationship.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {mutual && (
                            <Badge variant="secondary">双向关系</Badge>
                          )}
                          <div className="flex gap-0.5">
                            {Array.from({ length: relationship.strength }).map((_, i) => (
                              <div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-primary"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </ScrollArea>
    </Card>
  );
} 