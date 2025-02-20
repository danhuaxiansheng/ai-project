"use client";

import { useState } from "react";
import { Character } from "@/types/character";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, Users, Search, Filter } from "lucide-react";
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
  onUpdate: (characters: Character[]) => void;
}

export function CharacterList({ storyId, characters, onUpdate }: CharacterListProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleDelete = async (character: Character) => {
    try {
      const updatedCharacters = characters.filter(c => c.id !== character.id);
      await onUpdate(updatedCharacters);
      
      // 如果删除的是当前选中的角色，清除选中状态
      if (selectedCharacter?.id === character.id) {
        setSelectedCharacter(null);
        setIsEditing(false);
      }
      
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

  return (
    <div className="space-y-6">
      {/* 添加角色统计 */}
      <CharacterStats characters={characters} />

      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            角色列表
          </h2>
          <div className="text-sm text-muted-foreground">
            共 {characters.length} 个角色
          </div>
        </div>
        <Button onClick={() => {
          setSelectedCharacter(null);
          setIsEditing(true);
        }}>
          <UserPlus className="h-4 w-4 mr-2" />
          添加角色
        </Button>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索角色..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={(value: any) => setRoleFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="角色定位" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部角色</SelectItem>
            <SelectItem value="protagonist">主角</SelectItem>
            <SelectItem value="antagonist">反派</SelectItem>
            <SelectItem value="supporting">配角</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 主要内容区 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 角色列表 */}
        <div className="space-y-6">
          {Object.entries(charactersByRole).map(([role, chars]) => chars.length > 0 && (
            <div key={role} className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {{
                  protagonist: '主角',
                  antagonist: '反派',
                  supporting: '配角'
                }[role as keyof typeof charactersByRole]}
              </h3>
              <div className="space-y-2">
                {chars.map(character => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    isSelected={selectedCharacter?.id === character.id}
                    onClick={() => {
                      setSelectedCharacter(character);
                      setIsEditing(true);
                    }}
                    onEdit={() => {
                      setSelectedCharacter(character);
                      setIsEditing(true);
                    }}
                    onDelete={() => handleDelete(character)}
                  />
                ))}
              </div>
            </div>
          ))}
          {filteredCharacters.length === 0 && (
            <Card className="p-8 flex flex-col items-center justify-center text-center">
              <Users className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">还没有添加任何角色</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSelectedCharacter(null);
                  setIsEditing(true);
                }}
              >
                立即添加
              </Button>
            </Card>
          )}
        </div>

        {/* 编辑/查看区域 */}
        <div className="md:col-span-2">
          {isEditing ? (
            <CharacterEditor
              character={selectedCharacter}
              characters={characters}
              onSave={async (character) => {
                try {
                  const updatedCharacters = selectedCharacter
                    ? characters.map(c => c.id === character.id ? character : c)
                    : [...characters, character];
                  await onUpdate(updatedCharacters);
                  setIsEditing(false);
                  setIsViewing(true);
                  toast({
                    title: "成功",
                    description: "角色信息已保存",
                  });
                } catch (error) {
                  toast({
                    title: "错误",
                    description: "保存角色信息失败",
                    variant: "destructive",
                  });
                }
              }}
              onCancel={() => {
                setIsEditing(false);
                setSelectedCharacter(null);
              }}
            />
          ) : isViewing && selectedCharacter ? (
            <CharacterDetail
              character={selectedCharacter}
              characters={characters.filter(c => c.id !== selectedCharacter.id)}
              onEdit={() => {
                setIsViewing(false);
                setIsEditing(true);
              }}
              onClose={() => {
                setIsViewing(false);
                setSelectedCharacter(null);
              }}
            />
          ) : (
            <Card className="p-8 flex flex-col items-center justify-center text-center h-full">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">选择左侧角色进行查看或编辑，或创建新角色</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 