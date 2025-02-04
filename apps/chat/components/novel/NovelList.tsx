"use client";

import { useEffect, useState } from "react";
import { Novel } from "@/types/novel";
import { novelAPI } from "@/lib/api/novel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon, PlusIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { NovelForm } from "./NovelForm";

const statusConfig: Record<
  Novel["status"],
  { label: string; variant: string }
> = {
  draft: { label: "草稿", variant: "secondary" },
  creating: { label: "创作中", variant: "success" },
  paused: { label: "已暂停", variant: "warning" },
  completed: { label: "已完成", variant: "info" },
};

interface NovelListProps {
  novels: Novel[];
  onStart: (novel: Novel) => void;
  onPause: (novel: Novel) => void;
  onCreateNew: () => void;
}

export function NovelList() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadNovels();
  }, []);

  const loadNovels = async () => {
    try {
      const data = await novelAPI.getAllNovels();
      setNovels(data);
    } catch (error) {
      toast({
        title: "加载失败",
        description:
          error instanceof Error ? error.message : "获取小说列表失败",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    loadNovels(); // 刷新列表
  };

  const handleStart = async (novel: Novel) => {
    try {
      const updatedNovel = await novelAPI.startNovel(novel.id);
      setNovels((prev) =>
        prev.map((n) => (n.id === novel.id ? updatedNovel : n))
      );
      toast({
        title: "开始创作",
        description: `《${novel.title}》已开始创作`,
      });
    } catch (error) {
      toast({
        title: "操作失败",
        description: error instanceof Error ? error.message : "开始创作失败",
        variant: "destructive",
      });
    }
  };

  const handlePause = async (novel: Novel) => {
    try {
      const updatedNovel = await novelAPI.pauseNovel(novel.id);
      setNovels((prev) =>
        prev.map((n) => (n.id === novel.id ? updatedNovel : n))
      );
      toast({
        title: "已暂停",
        description: `《${novel.title}》已暂停创作`,
        variant: "warning",
      });
    } catch (error) {
      toast({
        title: "操作失败",
        description: error instanceof Error ? error.message : "暂停创作失败",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">我的小说</h2>
          <Button onClick={handleCreateNew}>
            <PlusIcon className="w-4 h-4 mr-2" />
            新建小说
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {novels.map((novel) => (
            <Card key={novel.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{novel.title}</CardTitle>
                  <Badge variant={statusConfig[novel.status].variant}>
                    {statusConfig[novel.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {novel.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>进度</span>
                      <span>
                        {novel.currentChapter}/{novel.totalChapters} 章
                      </span>
                    </div>
                    <Progress value={novel.progress} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {novel.settings.genre.map((genre) => (
                      <Badge key={genre} variant="outline">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-end space-x-2">
                    {novel.status === "creating" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePause(novel)}
                      >
                        <PauseIcon className="w-4 h-4 mr-2" />
                        暂停
                      </Button>
                    ) : novel.status !== "completed" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStart(novel)}
                      >
                        <PlayIcon className="w-4 h-4 mr-2" />
                        开始创作
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <NovelForm open={showForm} onClose={handleFormClose} />
    </>
  );
}
