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
import { Download } from "lucide-react";
import { useStory } from "@/contexts/story-context";

export function ExportDialog() {
  const { state } = useStory();

  const handleExport = () => {
    const content = state.messages
      .map((msg) => `${msg.role === "assistant" ? "AI" : "你"}: ${msg.content}`)
      .join("\n\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tale-weaver-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={state.messages.length === 0}
        >
          <Download className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>导出对话历史</DialogTitle>
          <DialogDescription>
            将当前的对话历史导出为文本文件，方便保存和分享。
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
