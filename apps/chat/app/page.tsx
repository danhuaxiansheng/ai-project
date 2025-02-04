"use client";

import { useState } from "react";
import { Novel } from "@/types/novel";
import { Header } from "@/components/layout/Header";
import { NovelList } from "@/components/novel/NovelList";
import { NovelForm } from "@/components/novel/NovelForm";
import { CommandPanel } from "@/components/intervention/CommandPanel";
import { toast } from "@/components/ui/use-toast";

// 模拟数据
const mockNovels: Novel[] = [
  {
    id: "1",
    title: "星辰大海",
    description: "一个关于太空探索和人类命运的故事",
    status: "draft",
    progress: 0,
    currentChapter: 0,
    totalChapters: 20,
    settings: {
      genre: ["科幻", "冒险"],
      theme: ["探索", "成长"],
      targetLength: 200000,
      style: ["严谨", "宏大"],
      constraints: ["符合科学原理", "注重人物刻画"],
    },
    createdAt: "2024-03-20T10:00:00Z",
    updatedAt: "2024-03-20T10:00:00Z",
  },
  // 可以添加更多示例小说
];

export default function HomePage() {
  const [novels, setNovels] = useState<Novel[]>(mockNovels);
  const [showForm, setShowForm] = useState(false);
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);

  const handleStart = (novel: Novel) => {
    setNovels((prev) =>
      prev.map((n) => (n.id === novel.id ? { ...n, status: "creating" } : n))
    );
    setSelectedNovel(novel);
    toast({
      title: "开始创作",
      description: `《${novel.title}》已开始创作`,
    });
  };

  const handlePause = (novel: Novel) => {
    setNovels((prev) =>
      prev.map((n) => (n.id === novel.id ? { ...n, status: "paused" } : n))
    );
    setSelectedNovel(null);
    toast({
      title: "已暂停",
      description: `《${novel.title}》已暂停创作`,
      variant: "warning",
    });
  };

  const handleCreateNovel = (
    novelData: Omit<Novel, "id" | "status" | "progress">
  ) => {
    const newNovel: Novel = {
      ...novelData,
      id: `novel-${Date.now()}`,
      status: "draft",
      progress: 0,
    };
    setNovels((prev) => [...prev, newNovel]);
    toast({
      title: "创建成功",
      description: `《${newNovel.title}》已创建`,
      variant: "success",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="space-y-6">
          <NovelList
            novels={novels}
            onStart={handleStart}
            onPause={handlePause}
            onCreateNew={() => setShowForm(true)}
          />
          {selectedNovel && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">
                正在创作：《{selectedNovel.title}》
              </h2>
              <CommandPanel />
            </div>
          )}
        </div>
      </main>
      <NovelForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateNovel}
      />
      <footer className="bg-white border-t">
        <div className="container mx-auto py-4 px-4">
          <p className="text-sm text-gray-600 text-center">
            © 2024 AI小说创作中控系统
          </p>
        </div>
      </footer>
    </div>
  );
}
