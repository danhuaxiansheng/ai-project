"use client";

import { useState } from "react";
import { useStory } from "@/contexts/story-context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { database } from "@/services/db";

export function ExportDialog() {
  const { currentStory } = useStory();
  const [isExporting, setIsExporting] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const { toast } = useToast();

  const handleExport = async () => {
    if (!currentStory) return;

    try {
      setIsExporting(true);
      // 获取当前故事的所有消息
      const storyMessages = await database.getStoryMessages(currentStory.id);
      setMessages(storyMessages);

      // 准备导出数据
      const exportData = {
        title: currentStory.title,
        createdAt: new Date(currentStory.createdAt).toLocaleString(),
        messages: storyMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp).toLocaleString(),
        })),
      };

      // 创建并下载文件
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentStory.title}-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "成功",
        description: "故事导出成功",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "错误",
        description: "故事导出失败",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={!currentStory || isExporting}
          onClick={handleExport}
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>导出故事</DialogTitle>
          <DialogDescription>
            将当前故事导出为 JSON 文件，包含所有对话记录
          </DialogDescription>
        </DialogHeader>

        {messages.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium">导出预览</div>
            <div className="mt-2 max-h-[300px] overflow-y-auto rounded border p-4">
              <pre className="text-xs">
                {JSON.stringify(
                  {
                    title: currentStory?.title,
                    messageCount: messages.length,
                    preview: messages.slice(0, 3),
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
