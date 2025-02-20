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
import { Badge } from "@/components/ui/badge";

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
      {/* 顶部工具栏 */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">角色列表</h2>
            <Badge variant="secondary">
              {characters.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted/50 rounded-lg p-1">
              <Input
                placeholder="搜索角色..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[200px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
            </div>
            <Select 
              value={roleFilter} 
              onValueChange={(value: typeof roleFilter) => setRoleFilter(value)}
            >
              <SelectTrigger className="w-[120px] bg-muted/50 border-0">
                <SelectValue placeholder="角色类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部角色</SelectItem>
                <SelectItem value="protagonist">主角</SelectItem>
                <SelectItem value="antagonist">反派</SelectItem>
                <SelectItem value="supporting">配角</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleCreateClick}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              创建角色
            </Button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 flex gap-6 p-6 min-h-0 bg-muted/5">
        {/* 左侧角色列表 */}
        <div className="w-[320px]">
          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="space-y-6 pr-4">
              {Object.entries(charactersByRole).map(([role, chars]) => (
                <div key={role} className="space-y-3">
                  {chars.length > 0 && (
                    <>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          {{
                            protagonist: '主角',
                            antagonist: '反派',
                            supporting: '配角'
                          }[role as keyof typeof charactersByRole]}
                          <Badge variant="outline" className="text-xs">
                            {chars.length}
                          </Badge>
                        </h3>
                        <div className="h-[1px] flex-1 bg-border/50 ml-4" />
                      </div>
                      <div className="space-y-2">
                        {chars.map((character) => (
                          <CharacterCard
                            key={character.id}
                            character={character}
                            isSelected={selectedCharacter?.id === character.id}
                            onClick={() => {
                              setSelectedCharacter(character);
                              setEditingCharacter(null);
                              setIsCreating(false);
                            }}
                            onEdit={() => handleEdit(character)}
                            onDelete={() => handleDelete(character)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* 右侧详情/编辑区域 */}
        <div className="flex-1 min-w-0">
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
          {!selectedCharacter && !isCreating && !editingCharacter && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">选择一个角色</h3>
                <p className="text-sm text-muted-foreground">
                  从左侧列表选择一个角色查看详情，或者创建新角色
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 