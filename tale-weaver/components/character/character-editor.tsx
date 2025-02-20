"use client";

import { useState } from "react";
import { Character, CharacterRelationship } from "@/types/character";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateUUID } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { CharacterTags } from "./character-tags";

interface CharacterEditorProps {
  character?: Character | null;
  characters: Character[];
  onSave: (character: Character) => void;
  onCancel: () => void;
}

export function CharacterEditor({ character, characters, onSave, onCancel }: CharacterEditorProps) {
  const [form, setForm] = useState<Character>({
    id: character?.id || generateUUID(),
    storyId: character?.storyId || "",
    name: character?.name || "",
    role: character?.role || "supporting",
    description: character?.description || "",
    background: character?.background || "",
    relationships: character?.relationships || [],
    createdAt: character?.createdAt || Date.now(),
    updatedAt: Date.now(),
    tags: character?.tags || [],
    attributes: character?.attributes || {},
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const addRelationship = () => {
    setForm(prev => ({
      ...prev,
      relationships: [
        ...prev.relationships,
        {
          targetId: "",
          type: "other",
          description: "",
          strength: 3,
          bidirectional: true,
        },
      ],
    }));
  };

  const removeRelationship = (index: number) => {
    setForm(prev => ({
      ...prev,
      relationships: prev.relationships.filter((_, i) => i !== index),
    }));
  };

  const updateRelationship = (index: number, updates: Partial<CharacterRelationship>) => {
    setForm(prev => ({
      ...prev,
      relationships: prev.relationships.map((rel, i) =>
        i === index ? { ...rel, ...updates } : rel
      ),
    }));
  };

  // 常用标签建议
  const tagSuggestions = [
    "重要", "神秘", "聪明", "勇敢", "善良",
    "邪恶", "复杂", "忠诚", "叛徒", "领袖"
  ];

  const renderRelationshipCard = (relationship: CharacterRelationship, index: number) => (
    <Card key={index} className="p-4">
      <div className="flex items-start justify-between mb-4">
        <h4 className="text-sm font-medium">关系 #{index + 1}</h4>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => removeRelationship(index)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">关联角色</label>
            <Select
              value={relationship.targetId}
              onValueChange={value => updateRelationship(index, { targetId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择关联角色" />
              </SelectTrigger>
              <SelectContent>
                {characters
                  .filter(c => c.id !== form.id)
                  .map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">关系类型</label>
            <Select
              value={relationship.type}
              onValueChange={value => updateRelationship(index, { type: value as CharacterRelationship['type'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择关系类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friend">朋友</SelectItem>
                <SelectItem value="enemy">敌人</SelectItem>
                <SelectItem value="family">家人</SelectItem>
                <SelectItem value="lover">恋人</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">关系强度</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="5"
              value={relationship.strength}
              onChange={e => updateRelationship(index, { strength: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-8 text-center">
              {relationship.strength}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`bidirectional-${index}`}
            checked={relationship.bidirectional}
            onChange={e => updateRelationship(index, { bidirectional: e.target.checked })}
          />
          <label htmlFor={`bidirectional-${index}`} className="text-sm font-medium">
            双向关系
          </label>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">关系描述</label>
          <Textarea
            value={relationship.description}
            onChange={e => updateRelationship(index, { description: e.target.value })}
            placeholder="描述两个角色之间的关系"
            rows={2}
          />
        </div>
      </div>
    </Card>
  );

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {character ? "编辑角色" : "创建角色"}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              取消
            </Button>
            <Button type="submit">保存</Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-6">
            {/* 基本信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">角色名称</label>
                <Input
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="输入角色名称"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">角色定位</label>
                <Select
                  value={form.role}
                  onValueChange={value => setForm(prev => ({ ...prev, role: value as Character['role'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择角色定位" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="protagonist">主角</SelectItem>
                    <SelectItem value="antagonist">反派</SelectItem>
                    <SelectItem value="supporting">配角</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">角色描述</label>
              <Textarea
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="描述角色的外貌、性格等特征"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">背景故事</label>
              <Textarea
                value={form.background}
                onChange={e => setForm(prev => ({ ...prev, background: e.target.value }))}
                placeholder="描述角色的成长经历、重要事件等"
                rows={6}
              />
            </div>

            {/* 角色关系 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">角色关系</label>
                <Button type="button" variant="outline" size="sm" onClick={addRelationship}>
                  <Plus className="h-4 w-4 mr-2" />
                  添加关系
                </Button>
              </div>
              <div className="space-y-4">
                {form.relationships.map((relationship, index) => 
                  renderRelationshipCard(relationship, index)
                )}
              </div>
            </div>

            {/* 角色标签 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">角色标签</label>
              <CharacterTags
                tags={form.tags}
                onChange={tags => setForm(prev => ({ ...prev, tags }))}
                suggestions={tagSuggestions}
              />
            </div>

            {/* 角色属性 */}
            <div className="space-y-4">
              <label className="text-sm font-medium">角色属性</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">年龄</label>
                  <Input
                    value={form.attributes.age || ""}
                    onChange={e => setForm(prev => ({
                      ...prev,
                      attributes: { ...prev.attributes, age: e.target.value }
                    }))}
                    placeholder="输入年龄"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">性别</label>
                  <Select
                    value={form.attributes.gender || ""}
                    onValueChange={value => setForm(prev => ({
                      ...prev,
                      attributes: { ...prev.attributes, gender: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择性别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">男</SelectItem>
                      <SelectItem value="female">女</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">职业</label>
                  <Input
                    value={form.attributes.occupation || ""}
                    onChange={e => setForm(prev => ({
                      ...prev,
                      attributes: { ...prev.attributes, occupation: e.target.value }
                    }))}
                    placeholder="输入职业"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">出生地</label>
                  <Input
                    value={form.attributes.birthplace || ""}
                    onChange={e => setForm(prev => ({
                      ...prev,
                      attributes: { ...prev.attributes, birthplace: e.target.value }
                    }))}
                    placeholder="输入出生地"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </Card>
    </form>
  );
} 