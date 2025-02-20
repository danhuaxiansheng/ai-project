"use client";

import { Chapter } from "@/types/story";
import { Card } from "@/components/ui/card";
import { FileText, BookOpen, Clock } from "lucide-react";

interface ChapterStatsProps {
  chapters: Chapter[];
}

export function ChapterStats({ chapters }: ChapterStatsProps) {
  const totalWords = chapters.reduce((sum, chapter) => sum + chapter.wordCount, 0);
  const publishedChapters = chapters.filter(c => c.status === 'published').length;
  const avgWordsPerChapter = Math.round(totalWords / (chapters.length || 1));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">总字数</p>
            <p className="text-2xl font-semibold">{totalWords}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">已发布章节</p>
            <p className="text-2xl font-semibold">{publishedChapters}/{chapters.length}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">平均章节字数</p>
            <p className="text-2xl font-semibold">{avgWordsPerChapter}</p>
          </div>
        </div>
      </Card>
    </div>
  );
} 