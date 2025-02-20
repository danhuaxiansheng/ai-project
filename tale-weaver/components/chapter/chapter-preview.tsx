"use client";

import { Chapter } from "@/types/story";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from 'react-markdown';

interface ChapterPreviewProps {
  chapter: Chapter;
  onClose: () => void;
}

export function ChapterPreview({ chapter, onClose }: ChapterPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{chapter.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{chapter.wordCount} 字</span>
            <span>·</span>
            <span>{chapter.status === 'published' ? '已发布' : '草稿'}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">预览</TabsTrigger>
          <TabsTrigger value="markdown">Markdown</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{chapter.content}</ReactMarkdown>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="markdown">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <pre className="p-4 bg-muted rounded-lg">
              <code>{chapter.content}</code>
            </pre>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
} 