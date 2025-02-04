"use client";

import { useState } from "react";
import { Novel, NovelSetting } from "@/types/novel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { novelAPI } from "@/lib/api/novel";
import { toast } from "@/components/ui/use-toast";

interface NovelFormProps {
  open: boolean;
  onClose: () => void;
}

export function NovelForm({ open, onClose }: NovelFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    totalChapters: 1,
    settings: {
      genre: [],
      theme: [],
      targetLength: 50000,
      style: [],
      constraints: [],
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const novel = await novelAPI.createNovel({
        ...formData,
        currentChapter: 0,
      });
      toast({
        title: "创建成功",
        description: `《${novel.title}》已创建`,
        variant: "success",
      });
      onClose();
    } catch (error) {
      toast({
        title: "创建失败",
        description: error instanceof Error ? error.message : "创建小说失败",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>新建小说</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">简介</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="chapters">预计章节数</Label>
            <Input
              id="chapters"
              type="number"
              min={1}
              value={formData.totalChapters}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalChapters: parseInt(e.target.value),
                })
              }
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">创建</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
