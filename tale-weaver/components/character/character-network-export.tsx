"use client";

import { useRef } from "react";
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import type { ForceGraph2D } from "react-force-graph";

interface CharacterNetworkExportProps {
  graphRef: React.RefObject<ForceGraph2D>;
}

export const CharacterNetworkExport = ({ graphRef }: CharacterNetworkExportProps) => {
  const handleExport = async (format: 'png' | 'svg' | 'json') => {
    if (!graphRef.current) return;

    try {
      let url: string;
      let filename: string;
      let blob: Blob;

      switch (format) {
        case 'png':
          const canvas = graphRef.current.canvas;
          if (!canvas) throw new Error('Canvas not found');
          url = canvas.toDataURL('image/png');
          filename = 'character-network.png';
          blob = await (await fetch(url)).blob();
          break;

        case 'svg':
          const svgData = graphRef.current.graph.svg();
          blob = new Blob([svgData], { type: 'image/svg+xml' });
          url = URL.createObjectURL(blob);
          filename = 'character-network.svg';
          break;

        case 'json':
          const jsonData = JSON.stringify(graphRef.current.graphData(), null, 2);
          blob = new Blob([jsonData], { type: 'application/json' });
          url = URL.createObjectURL(blob);
          filename = 'character-network.json';
          break;

        default:
          throw new Error('Unsupported format');
      }

      // 创建下载链接
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (format !== 'png') {
        URL.revokeObjectURL(url);
      }

      toast({
        title: "成功",
        description: "关系网络已导出",
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
          导出网络图
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('png')}>
          导出为PNG图片
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('svg')}>
          导出为SVG矢量图
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          导出为JSON数据
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CharacterNetworkExport; 