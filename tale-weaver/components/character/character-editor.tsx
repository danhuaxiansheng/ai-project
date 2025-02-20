"use client";

import { useState } from "react";
import { Character, CharacterRelationship } from "@/types/story";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateUUID } from "@/lib/utils";

interface CharacterEditorProps {
  character?: Character | null;
  onSave: (character: Character) => void;
  onCancel: () => void;
}

export function CharacterEditor({ character, onSave, onCancel }: CharacterEditorProps) {
  const [form, setForm] = useState<Character>({
    id: character?.id || generateUUID(),
    name: character?.name || "",
    role: character?.role || "supporting",
    description: character?.description || "",
    background: character?.background || "",
    relationships: character?.relationships || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
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
            rows={5}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">保存</Button>
      </div>
    </form>
  );
} 