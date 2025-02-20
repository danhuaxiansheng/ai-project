"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useStory } from "@/contexts/story-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorldBuilder } from "@/components/worldbuilding/world-builder";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { CharacterList } from "@/components/character/character-list";
import { ChapterList } from "@/components/chapter/chapter-list";
import { OutlineList } from "@/components/chapter/outline-list";
import { Chapter, Outline } from "@/types/story";
import * as db from "@/lib/db";
import { Character } from "@/types/character";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function StoryDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'overview';
  const router = useRouter();
  const { currentStory, setCurrentStory, stories, deleteStory, updateStory } = useStory();
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [outlines, setOutlines] = useState<Outline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const story = stories.find(s => s.id === id);
    if (story) {
      setCurrentStory(story);
    } else {
      // 如果故事不存在，返回首页
      router.push('/');
    }
  }, [id, stories, setCurrentStory, router]);

  // 加载章节和大纲数据
  useEffect(() => {
    const loadData = async () => {
      if (!currentStory) return;
      
      try {
        const [loadedChapters, loadedOutlines] = await Promise.all([
          db.getChaptersByStoryId(currentStory.id),
          db.getOutlinesByStoryId(currentStory.id)
        ]);
        
        setChapters(loadedChapters);
        setOutlines(loadedOutlines);
      } catch (error) {
        console.error('Failed to load story data:', error);
        toast({
          title: "错误",
          description: "加载故事数据失败",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentStory]);

  const handleDelete = async () => {
    if (!currentStory || isDeleting) return;
    
    try {
      setIsDeleting(true);
      await deleteStory(currentStory.id);
      toast({
        title: "成功",
        description: "故事已删除",
      });
      setShowDeleteDialog(false);
      router.push('/');
    } catch (error) {
      console.error('Failed to delete story:', error);
      toast({
        title: "错误",
        description: "删除故事失败",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // 更新章节
  const handleChaptersUpdate = async (updatedChapters: Chapter[]) => {
    if (!currentStory) return;
    
    try {
      await db.updateChapters(currentStory.id, updatedChapters);
      setChapters(updatedChapters);
      
      // 更新故事进度
      const progress = Math.round(
        (updatedChapters.filter(c => c.status === 'published').length / updatedChapters.length) * 100
      ) || 0;
      
      await updateStory(currentStory.id, { progress });
      
      toast({
        title: "成功",
        description: "章节信息已更新",
      });
    } catch (error) {
      console.error('Failed to update chapters:', error);
      toast({
        title: "错误",
        description: "更新章节信息失败",
        variant: "destructive",
      });
    }
  };

  // 更新大纲
  const handleOutlinesUpdate = async (updatedOutlines: Outline[]) => {
    if (!currentStory) return;
    
    try {
      await db.updateOutlines(currentStory.id, updatedOutlines);
      setOutlines(updatedOutlines);
      
      await updateStory(currentStory.id, {
        settings: {
          ...currentStory.settings,
          outlines: updatedOutlines,
        },
      });
      
      toast({
        title: "成功",
        description: "大纲已更新",
      });
    } catch (error) {
      console.error('Failed to update outlines:', error);
      toast({
        title: "错误",
        description: "更新大纲失败",
        variant: "destructive",
      });
    }
  };

  const handleCharactersUpdate = async (characters: Character[]) => {
    if (!currentStory) return;
    
    try {
      // 确保所有角色都有必要的字段
      const updatedCharacters = characters.map(character => ({
        ...character,
        storyId: currentStory.id,
        createdAt: character.createdAt || Date.now(),
        updatedAt: Date.now(),
      }));

      await updateStory(currentStory.id, {
        settings: {
          ...currentStory.settings,
          characters: updatedCharacters,
        },
      });

      toast({
        title: "成功",
        description: "角色信息已更新",
      });
    } catch (error) {
      console.error('Failed to update characters:', error);
      toast({
        title: "错误",
        description: "更新角色信息失败",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (!currentStory) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px]">
          <p className="text-muted-foreground mb-4">故事不存在或已被删除</p>
          <Button onClick={() => router.push('/')}>返回首页</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{currentStory?.title}</h1>
        </div>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          disabled={isDeleting}
        >
          {isDeleting ? "删除中..." : "删除故事"}
        </Button>
      </div>

      <Tabs defaultValue={tab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="worldbuilding">世界观</TabsTrigger>
          <TabsTrigger value="characters">角色</TabsTrigger>
          <TabsTrigger value="outline">大纲</TabsTrigger>
          <TabsTrigger value="chapters">章节</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">故事简介</h2>
              <p className="text-muted-foreground">{currentStory.excerpt}</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">创作进度</h2>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${currentStory.progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                当前进度：{currentStory.progress}%
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="worldbuilding">
          <WorldBuilder storyId={currentStory.id} />
        </TabsContent>

        <TabsContent value="characters">
          <CharacterList
            storyId={currentStory.id}
            characters={currentStory.settings?.characters || []}
            onUpdate={handleCharactersUpdate}
          />
        </TabsContent>

        <TabsContent value="outline">
          <OutlineList
            outlines={outlines}
            chapters={chapters.map(c => ({
              id: c.id,
              title: c.title,
            }))}
            onUpdate={handleOutlinesUpdate}
          />
        </TabsContent>

        <TabsContent value="chapters">
          <ChapterList
            storyId={currentStory.id}
            chapters={chapters}
            onUpdate={handleChaptersUpdate}
          />
        </TabsContent>
      </Tabs>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定要删除这个故事吗？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将永久删除"{currentStory?.title}"及其所有相关内容，包括章节、大纲等。此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "删除中..." : "删除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 