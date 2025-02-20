"use client";

import { useStory } from "@/contexts/story-context";
import { StoryCard } from "@/components/story-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { CreateStoryDialog } from "@/components/create-story-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HomePage() {
  const { stories, isLoading } = useStory();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'completed' | 'draft'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // 过滤故事列表
  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || story.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">我的故事</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          新建故事
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索故事..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="状态筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="ongoing">连载中</SelectItem>
            <SelectItem value="completed">已完结</SelectItem>
            <SelectItem value="draft">草稿</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map(story => (
          <StoryCard key={story.id} story={story} />
        ))}
        {filteredStories.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Plus className="h-12 w-12 mb-4" />
            <p>还没有创建任何故事</p>
            <Button 
              variant="link" 
              className="mt-2"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              立即创建
            </Button>
          </div>
        )}
      </div>

      <CreateStoryDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
