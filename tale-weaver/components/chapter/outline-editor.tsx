"use client";

import { useState } from "react";
import { Outline } from "@/types/story";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateUUID } from "@/lib/utils";

interface OutlineEditorProps {
  outline?: Outline | null;
  chapters?: { id: string; title: string }[];
  parentId?: string;
  onSave: (outline: Outline) => void;
  onCancel: () => void;
}

export function OutlineEditor({ outline, chapters, parentId, onSave, onCancel }: OutlineEditorProps) {
  const [form, setForm] = useState<Outline>({
    id: outline?.id || generateUUID(),
    title: outline?.title || "",
    content: outline?.content || "",
    type: outline?.type || "plot",
    order: outline?.order || 0,
    chapterId: outline?.chapterId,
    parentId: outline?.parentId || parentId,
    createdAt: outline?.createdAt || Date.now(),
    updatedAt: Date.now(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {outline ? "编辑大纲" : "新建大纲"}
        </h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">标题</label>
            <Input
              value={form.title}
              onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="输入标题"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">类型</label>
            <Select
              value={form.type}
              onValueChange={value => setForm(prev => ({ ...prev, type: value as Outline['type'] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plot">情节</SelectItem>
                <SelectItem value="scene">场景</SelectItem>
                <SelectItem value="note">笔记</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {chapters && (
          <div className="space-y-2">
            <label className="text-sm font-medium">关联章节</label>
            <Select
              value={form.chapterId}
              onValueChange={value => setForm(prev => ({ ...prev, chapterId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择关联章节" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">无关联章节</SelectItem>
                {chapters.map(chapter => (
                  <SelectItem key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">内容</label>
          <Textarea
            value={form.content}
            onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
            placeholder="在这里写下大纲内容..."
            rows={10}
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