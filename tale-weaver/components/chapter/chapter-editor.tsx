"use client";

import { useState, useEffect } from "react";
import { Chapter } from "@/types/story";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateUUID } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "@/components/ui/use-toast";

interface ChapterEditorProps {
  chapter?: Chapter | null;
  onSave: (chapter: Chapter) => void;
  onCancel: () => void;
}

export function ChapterEditor({ chapter, onSave, onCancel }: ChapterEditorProps) {
  const [form, setForm] = useState<Chapter>({
    id: chapter?.id || generateUUID(),
    storyId: chapter?.storyId || "",
    title: chapter?.title || "",
    content: chapter?.content || "",
    order: chapter?.order || 0,
    status: chapter?.status || "draft",
    wordCount: chapter?.wordCount || 0,
    createdAt: chapter?.createdAt || Date.now(),
    updatedAt: Date.now(),
  });
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const debouncedForm = useDebounce(form, 1000);

  useEffect(() => {
    if (isDirty && !isSaving) {
      const timer = setTimeout(async () => {
        try {
          setIsSaving(true);
          const wordCount = form.content.trim().length;
          await onSave({ ...form, wordCount, updatedAt: Date.now() });
          setIsDirty(false);
          setLastSaved(new Date());
          toast({
            title: "已自动保存",
            description: "章节内容已自动保存",
          });
        } catch (error) {
          console.error('Auto-save failed:', error);
          toast({
            title: "错误",
            description: "自动保存失败",
            variant: "destructive",
          });
        } finally {
          setIsSaving(false);
        }
      }, 2000); // 2秒后自动保存

      return () => clearTimeout(timer);
    }
  }, [form, isDirty, isSaving]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    try {
      setIsSaving(true);
      const wordCount = form.content.trim().length;
      await onSave({ ...form, wordCount, updatedAt: Date.now() });
      setIsDirty(false);
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (updates: Partial<Chapter>) => {
    setForm(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {chapter ? "编辑章节" : "新建章节"}
        </h3>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {isSaving ? "保存中..." : isDirty ? "有未保存的更改" : lastSaved ? `上次保存: ${lastSaved.toLocaleTimeString()}` : "已保存"}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">章节标题</label>
            <Input
              value={form.title}
              onChange={e => handleChange({ title: e.target.value })}
              placeholder="输入章节标题"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">状态</label>
            <Select
              value={form.status}
              onValueChange={value => handleChange({ status: value as Chapter['status'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="published">已发布</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">章节内容</label>
          <Textarea
            value={form.content}
            onChange={e => handleChange({ content: e.target.value })}
            placeholder="在这里开始写作..."
            rows={20}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          字数：{form.content.trim().length}
        </div>
      </div>
    </form>
  );
} 