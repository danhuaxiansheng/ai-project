"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

interface CharacterNetworkExportProps {
  graphRef: React.RefObject<any>;
}

export function CharacterNetworkExport({ graphRef }: CharacterNetworkExportProps) {
  const handleExport = async (format: 'png' | 'svg') => {
    if (!graphRef.current) return;

    try {
      let url: string;
      let filename: string;

      if (format === 'png') {
        // 导出为PNG
        const canvas = graphRef.current.canvas;
        url = canvas.toDataURL('image/png');
        filename = 'character-network.png';
      } else {
        // 导出为SVG
        const svgData = graphRef.current.graph.svg();
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        url = URL.createObjectURL(blob);
        filename = 'character-network.svg';
      }

      // 创建下载链接
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (format === 'svg') {
        URL.revokeObjectURL(url);
      }

      toast({
        title: "成功",
        description: "关系图已导出",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "错误",
        description: "导出失败",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          导出关系图
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('png')}>
          导出为PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('svg')}>
          导出为SVG
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 