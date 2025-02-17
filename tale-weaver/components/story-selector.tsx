"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useStory } from "@/contexts/story-context";
import { storyDB } from "@/lib/db";
import { nanoid } from "nanoid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StorySelector() {
  const { state, dispatch } = useStory();
  const [stories, setStories] = React.useState<Story[]>([]);
  const [newStoryTitle, setNewStoryTitle] = React.useState("");

  React.useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    const loadedStories = await storyDB.getStories();
    setStories(loadedStories);
  };

  const createNewStory = async () => {
    if (!newStoryTitle.trim()) return;

    const newStory: Story = {
      id: nanoid(),
      title: newStoryTitle.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await storyDB.createStory(newStory);
    setNewStoryTitle("");
    loadStories();
  };

  const handleStorySelect = async (story: Story) => {
    dispatch({ type: "SET_STORY", payload: story });
    dispatch({ type: "SET_SESSION", payload: null });
    dispatch({ type: "SET_MESSAGES", payload: [] });
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={state.currentStory?.id}
        onValueChange={(id) => {
          const story = stories.find((s) => s.id === id);
          if (story) handleStorySelect(story);
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="选择故事..." />
        </SelectTrigger>
        <SelectContent>
          {stories.map((story) => (
            <SelectItem key={story.id} value={story.id}>
              {story.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            新建故事
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>创建新故事</DialogTitle>
            <DialogDescription>
              为你的新故事起一个名字，开始创作之旅。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="故事标题"
                value={newStoryTitle}
                onChange={(e) => setNewStoryTitle(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={createNewStory}>创建</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
