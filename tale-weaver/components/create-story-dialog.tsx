"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStory } from "@/contexts/story-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Textarea,
  Label,
} from "@/components/ui";
import { toast } from "@/components/ui/use-toast";

interface CreateStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStoryDialog({ open, onOpenChange }: CreateStoryDialogProps) {
  const router = useRouter();
  const { createStory } = useStory();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    try {
      setIsLoading(true);
      const story = await createStory({
        title: form.title,
        excerpt: form.excerpt,
        content: "",
        status: "draft",
        progress: 0,
        tags: [],
      });
      
      onOpenChange(false);
      router.push(`/story/${story.id}`);
    } catch (error) {
      console.error('Failed to create story:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>创建新故事</DialogTitle>
            <DialogDescription>
              开始一个新的故事创作。你可以随时编辑故事的详细信息。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">故事标题</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="输入故事标题"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">故事简介</Label>
              <Textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="简单描述一下你的故事..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "创建中..." : "创建故事"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 