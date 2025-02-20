"use client";

import { Outline } from "@/types/story";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OutlinePreviewProps {
  outline: Outline;
  chapters?: { id: string; title: string }[];
  onClose: () => void;
}

export function OutlinePreview({ outline, chapters, onClose }: OutlinePreviewProps) {
  const chapter = chapters?.find(c => c.id === outline.chapterId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{outline.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={
              outline.type === 'plot' ? 'default' :
              outline.type === 'scene' ? 'secondary' : 'outline'
            }>
              {outline.type === 'plot' ? '情节' : outline.type === 'scene' ? '场景' : '笔记'}
            </Badge>
            {chapter && (
              <Badge variant="outline">关联章节：{chapter.title}</Badge>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Card className="p-4">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="prose dark:prose-invert max-w-none">
            {outline.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
} 