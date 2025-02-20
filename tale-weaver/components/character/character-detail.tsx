"use client";

import dynamic from 'next/dynamic';
import { Character } from "@/types/character";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, X } from "lucide-react";
import { CharacterRelationships } from "./character-relationships";
import { cn } from "@/lib/utils";
import { CharacterAttributes } from "./character-attributes";
import { Badge } from "@/components/ui/badge";
import { CharacterRelationshipAnalysis } from "./character-relationship-analysis";
import { CharacterAnalysis } from "./character-analysis";
import { useState } from "react";
import { CharacterRelationshipLegend } from "./character-relationship-legend";
import { CharacterRelationshipStats } from "./character-relationship-stats";

// 动态导入 CharacterNetwork 组件，禁用 SSR
const CharacterNetwork = dynamic(
  () => import('./character-network').then(mod => mod.CharacterNetwork),
  { ssr: false }
);

interface CharacterDetailProps {
  character: Character;
  characters: Character[];
  onEdit: () => void;
  onClose: () => void;
}

const RelationshipStrength = ({ strength }: { strength: number }) => {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-2 h-2 rounded-full",
            i < strength ? "bg-primary" : "bg-muted"
          )}
        />
      ))}
    </div>
  );
};

export function CharacterDetail({ character, characters, onEdit, onClose }: CharacterDetailProps) {
  const [selectedRelationId, setSelectedRelationId] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);

  const handleCharacterClick = (characterId: string) => {
    setSelectedRelationId(characterId === selectedRelationId ? null : characterId);
  };

  const selectedCharacter = selectedRelationId 
    ? characters.find(c => c.id === selectedRelationId)
    : null;

  return (
    <Card className="p-6 h-full">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold">{character.name}</h2>
            <div className={cn(
              "text-sm px-2 py-1 rounded-full",
              character.role === 'protagonist' && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
              character.role === 'antagonist' && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
              character.role === 'supporting' && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            )}>
              {{
                protagonist: '主角',
                antagonist: '反派',
                supporting: '配角'
              }[character.role]}
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl">{character.description}</p>
        </div>
        <div className="flex gap-2 ml-4">
          <Button variant="outline" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 space-y-6">
            {character.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {character.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2">基本属性</h3>
              <CharacterAttributes attributes={character.attributes} />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">性格分析</h3>
              <CharacterAnalysis character={character} />
            </div>
          </div>

          <div className="col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">角色关系</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLegend(prev => !prev)}
                >
                  {showLegend ? "隐藏图例" : "显示图例"}
                </Button>
              </div>
              <div className="space-y-4">
                {showLegend && <CharacterRelationshipLegend />}
                <div className="grid grid-cols-2 gap-4">
                  <CharacterRelationshipStats
                    character={character}
                    characters={characters}
                  />
                  <CharacterNetwork 
                    characters={[character, ...characters]} 
                    onCharacterClick={handleCharacterClick}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">背景故事</h3>
              <Card className="p-4">
                <div className="prose dark:prose-invert max-w-none">
                  {character.background.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
} 