"use client";

import { useState } from "react";
import { Character } from "@/types/character";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, UserPlus } from "lucide-react";
import { CharacterEditor } from "./character-editor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

interface CharacterListProps {
  storyId: string;
  characters: Character[];
  onUpdate: (characters: Character[]) => void;
}

export function CharacterList({ storyId, characters, onUpdate }: CharacterListProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddCharacter = () => {
    setSelectedCharacter(null);
    setIsEditing(true);
  };

  const handleEditCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setIsEditing(true);
  };

  const handleSave = async (character: Partial<Character>) => {
    try {
      const newCharacter: Character = {
        id: character.id || generateUUID(),
        storyId,
        name: character.name || "",
        role: character.role || "supporting",
        description: character.description || "",
        background: character.background || "",
        relationships: character.relationships || [],
        createdAt: character.createdAt || Date.now(),
        updatedAt: Date.now(),
      };

      const updatedCharacters = characters.map(c => 
        c.id === character.id ? newCharacter : c
      );

      await onUpdate(updatedCharacters);
      toast({
        title: "成功",
        description: "角色信息已更新",
      });
    } catch (error) {
      console.error('Failed to save character:', error);
      toast({
        title: "错误",
        description: "保存角色信息失败",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">角色列表</h3>
          <Button size="sm" onClick={handleAddCharacter}>
            <UserPlus className="h-4 w-4 mr-2" />
            添加角色
          </Button>
        </div>
        <ScrollArea className="h-[600px]">
          <div className="space-y-2 pr-4">
            {characters.map(character => (
              <Card
                key={character.id}
                className={`p-4 cursor-pointer hover:shadow transition-shadow ${
                  selectedCharacter?.id === character.id ? 'border-primary' : ''
                }`}
                onClick={() => handleEditCharacter(character)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium">{character.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {character.description}
                    </p>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-muted">
                    {{
                      protagonist: '主角',
                      antagonist: '反派',
                      supporting: '配角'
                    }[character.role]}
                  </div>
                </div>
              </Card>
            ))}
            {characters.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Plus className="h-8 w-8 mx-auto mb-2" />
                <p>点击上方按钮添加角色</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="md:col-span-2">
        {isEditing ? (
          <CharacterEditor
            character={selectedCharacter}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <UserPlus className="h-12 w-12 mb-4" />
            <p>选择左侧角色进行编辑，或创建新角色</p>
          </div>
        )}
      </div>
    </div>
  );
} 