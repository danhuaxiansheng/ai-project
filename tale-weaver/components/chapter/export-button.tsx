"use client";

import { Chapter } from "@/types/story";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportChapter, exportChapters } from "@/lib/chapter-export";

interface ExportButtonProps {
  chapters: Chapter[];
  selectedChapter?: Chapter | null;
}

export function ExportButton({ chapters, selectedChapter }: ExportButtonProps) {
  const handleExport = async (format: 'txt' | 'md', type: 'single' | 'all') => {
    try {
      let blob: Blob;
      let filename: string;

      if (type === 'single' && selectedChapter) {
        blob = await exportChapter(selectedChapter, format);
        filename = `${selectedChapter.title}.${format}`;
      } else {
        blob = await exportChapters(chapters, format);
        filename = `chapters.${format}`;
      }

      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          导出
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {selectedChapter && (
          <>
            <DropdownMenuItem onClick={() => handleExport('txt', 'single')}>
              导出当前章节 (TXT)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('md', 'single')}>
              导出当前章节 (Markdown)
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={() => handleExport('txt', 'all')}>
          导出全部章节 (TXT)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('md', 'all')}>
          导出全部章节 (Markdown)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 