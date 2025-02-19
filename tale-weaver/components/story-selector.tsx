"use client";

import { useState } from "react";
import { useStory } from "@/contexts/story-context";
import { Story } from "@/types/story";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { database } from "@/services/db";
import { useToast } from "@/components/ui/use-toast";

export function StorySelector() {
  const { stories, currentStory, setCurrentStory, refreshStories } = useStory();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const { toast } = useToast();

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "错误",
        description: "故事标题不能为空",
        variant: "destructive",
      });
      return;
    }

    try {
      const newStory: Story = {
        id: crypto.randomUUID(),
        title: title.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await database.createStory(newStory);
      await refreshStories();
      setCurrentStory(newStory);
      setIsOpen(false);
      setTitle("");

      toast({
        title: "成功",
        description: "故事创建成功",
      });
    } catch (error) {
      console.error("Failed to create story:", error);
      toast({
        title: "错误",
        description: "故事创建失败",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">故事</div>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          新建
        </Button>
      </div>

      <Select
        value={currentStory?.id}
        onValueChange={(value) => {
          const story = stories.find((s) => s.id === value);
          if (story) setCurrentStory(story);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="选择一个故事" />
        </SelectTrigger>
        <SelectContent>
          {stories.map((story) => (
            <SelectItem key={story.id} value={story.id}>
              {story.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>创建新故事</DialogTitle>
            <DialogDescription>
              为你的新故事起一个名字，开始创作之旅。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateStory} className="space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="故事标题"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                取消
              </Button>
              <Button type="submit">创建</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
