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
import { Dialog } from "@/components/ui/dialog";
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
      const newStory = {
        id: crypto.randomUUID(),
        title: title.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await database.createStory(newStory);
      await refreshStories();
      setCurrentStory(newStory);
      setTitle("");
      setIsOpen(false);

      toast({
        title: "成功",
        description: "故事创建成功",
      });
    } catch (error) {
      console.error("Failed to create story:", error);
      toast({
        title: "错误",
        description: "创建故事失败",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">故事</h2>
        <Button variant="outline" size="icon" onClick={() => setIsOpen(true)}>
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>

      <Select
        value={currentStory?.id}
        onValueChange={(id) => {
          const story = stories.find((s) => s.id === id);
          if (story) setCurrentStory(story);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="选择故事" />
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
        <form onSubmit={handleCreateStory} className="space-y-4 p-4">
          <h2 className="text-lg font-semibold">创建新故事</h2>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="为你的新故事起一个名字，开始创作之旅。"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
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
      </Dialog>
    </div>
  );
}
