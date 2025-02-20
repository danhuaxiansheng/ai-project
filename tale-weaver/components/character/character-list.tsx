"use client";

import { useState } from "react";
import { Character } from "@/types/character";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, Users, Search, Filter, Plus } from "lucide-react";
import { CharacterEditor } from "./character-editor";
import { CharacterCard } from "./character-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { CharacterDetail } from "./character-detail";
import { CharacterStats } from "./character-stats";

interface CharacterListProps {
  storyId: string;
  characters: Character[];
  onUpdate: (character: Character) => void;
  onCreate: (character: Character) => void;
  onDelete: (characterId: string) => void;
}

export function CharacterList({ storyId, characters, onUpdate, onCreate, onDelete }: CharacterListProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Character['role'] | 'all'>('all');
  const [isViewing, setIsViewing] = useState(false);

  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      character.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || character.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const charactersByRole = {
    protagonist: filteredCharacters.filter(c => c.role === 'protagonist'),
    antagonist: filteredCharacters.filter(c => c.role === 'antagonist'),
    supporting: filteredCharacters.filter(c => c.role === 'supporting'),
  };

  const handleEdit = (character: Character) => {
    setEditingCharacter(character);
    setSelectedCharacter(null);
  };

  const handleSave = (updatedCharacter: Partial<Character>) => {
    // 检查角色名称是否重复
    const isDuplicateName = characters.some(c => 
      c.name.toLowerCase() === updatedCharacter.name?.toLowerCase() && 
      c.id !== editingCharacter?.id // 编辑时排除当前角色
    );

    if (isDuplicateName) {
      toast({
        title: "错误",
        description: "角色名称已存在，请使用其他名称",
        variant: "destructive",
      });
      return;
    }

    if (editingCharacter) {
      // 更新现有角色
      onUpdate({
        ...editingCharacter,
        ...updatedCharacter,
        updatedAt: Date.now(),
      });
    } else {
      // 创建新角色
      onCreate({
        ...updatedCharacter,
        id: crypto.randomUUID(),
        storyId: storyId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } as Character);
    }
    
    setEditingCharacter(null);
    setIsCreating(false);
    toast({
      title: "成功",
      description: editingCharacter ? "角色信息已更新" : "角色已创建",
    });
  };

  const handleDelete = async (character: Character) => {
    try {
      const updatedCharacters = characters.filter(c => c.id !== character.id);
      await onUpdate(updatedCharacters);
      
      // 如果删除的是当前选中的角色，清除选中状态
      if (selectedCharacter?.id === character.id) {
        setSelectedCharacter(null);
        setEditingCharacter(null);
      }
      
      await onDelete(character.id);
      
      toast({
        title: "成功",
        description: "角色已删除",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "删除角色失败",
        variant: "destructive",
      });
    }
  };

  const handleCreateClick = () => {
    // 清除选中和编辑状态
    setSelectedCharacter(null);
    setEditingCharacter(null);
    setIsCreating(true);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-2xl font-bold">角色列表</h2>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Input
              placeholder="搜索角色..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px]"
            />
            <Select 
              value={roleFilter} 
              onValueChange={(value: typeof roleFilter) => setRoleFilter(value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="角色类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="protagonist">主角</SelectItem>
                <SelectItem value="antagonist">反派</SelectItem>
                <SelectItem value="supporting">配角</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleCreateClick}
            variant="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            创建角色
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 p-4 min-h-0">
        <div className="w-1/3 min-w-[300px]">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4 pr-4">
              {Object.entries(charactersByRole).map(([role, chars]) => (
                <div key={role} className="space-y-2">
                  {chars.length > 0 && (
                    <>
                      <h3 className="font-medium text-sm text-muted-foreground">
                        {{
                          protagonist: '主角',
                          antagonist: '反派',
                          supporting: '配角'
                        }[role as keyof typeof charactersByRole]}
                        <span className="ml-2 text-xs">({chars.length})</span>
                      </h3>
                      {chars.map((character) => (
                        <CharacterCard
                          key={character.id}
                          character={character}
                          isSelected={selectedCharacter?.id === character.id}
                          onClick={() => {
                            setSelectedCharacter(character);
                            setEditingCharacter(null);
                          }}
                          onEdit={() => handleEdit(character)}
                          onDelete={() => handleDelete(character)}
                        />
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1">
          {selectedCharacter && !isCreating && !editingCharacter && (
            <CharacterDetail
              character={selectedCharacter}
              characters={characters.filter(c => c.id !== selectedCharacter.id)}
              onEdit={() => handleEdit(selectedCharacter)}
              onClose={() => setSelectedCharacter(null)}
            />
          )}
          {(editingCharacter || isCreating) && (
            <CharacterEditor
              character={editingCharacter || undefined}
              characters={characters.filter(c => c.id !== editingCharacter?.id)}
              onSave={handleSave}
              onCancel={() => {
                setEditingCharacter(null);
                setIsCreating(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
} 