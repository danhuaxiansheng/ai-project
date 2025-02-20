"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStory } from "@/contexts/story-context";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import { StoryCardMenu } from "./story-card-menu";
import { Story } from "@/types/story";
import { toast } from "@/components/ui/use-toast";

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const router = useRouter();
  const { deleteStory, createStory } = useStory();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    router.push(`/story/${story.id}`);
  };

  // 阻止菜单点击事件冒泡到卡片
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDuplicate = async () => {
    try {
      setIsLoading(true);
      const newStory = await createStory({
        title: `${story.title} (副本)`,
        excerpt: story.excerpt,
        content: "",
        status: "draft",
        progress: 0,
        tags: [],
      });
      toast({
        title: "成功",
        description: "故事已复制",
      });
      router.push(`/story/${newStory.id}`);
    } catch (error) {
      toast({
        title: "错误",
        description: "复制故事失败",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteStory(story.id);
      toast({
        title: "成功",
        description: "故事已删除",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "删除故事失败",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow relative group cursor-pointer" 
      onClick={handleClick}
    >
      <div onClick={handleMenuClick}>
        <StoryCardMenu
          onEdit={() => router.push(`/story/${story.id}?tab=overview`)}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onShare={() => {
            // 复制链接到剪贴板
            navigator.clipboard.writeText(`${window.location.origin}/story/${story.id}`);
            toast({
              title: "成功",
              description: "链接已复制到剪贴板",
            });
          }}
          disabled={isLoading}
        />
      </div>
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">{story.title}</h3>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs",
              story.status === 'ongoing' && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
              story.status === 'completed' && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
              story.status === 'draft' && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            )}>
              {{
                ongoing: '连载中',
                completed: '已完结',
                draft: '草稿'
              }[story.status]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{story.excerpt}</p>
        </div>
        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>进度 {story.progress}%</span>
            <span>最后编辑: {new Date(story.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${story.progress}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
} 