"use client";

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
import { CharacterNetwork } from "./character-network";

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
  return (
    <Card className="p-6 h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
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
          <p className="text-muted-foreground">{character.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-6">
          {/* 角色标签 */}
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

          {/* 角色属性 */}
          <div>
            <h3 className="text-lg font-semibold mb-2">基本属性</h3>
            <CharacterAttributes attributes={character.attributes} />
          </div>

          {/* 背景故事 */}
          <div>
            <h3 className="text-lg font-semibold mb-2">背景故事</h3>
            <div className="prose dark:prose-invert max-w-none">
              {character.background.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* 角色关系 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">角色关系</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CharacterNetwork characters={[character, ...characters]} />
              <CharacterRelationshipAnalysis 
                character={character} 
                characters={characters} 
              />
            </div>
          </div>

          {/* 添加角色分析部分 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">角色分析</h3>
            <CharacterAnalysis 
              character={character} 
              characters={characters} 
            />
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
} 