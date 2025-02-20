"use client";

import { useEffect, useRef, useState } from "react";
import { Character } from "@/types/character";
import ForceGraph2D from "react-force-graph-2d";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CharacterNetworkProps {
  characters: Character[];
  onCharacterClick?: (characterId: string) => void;
}

export default function CharacterNetwork({ characters, onCharacterClick }: CharacterNetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 构建图数据
  const graphData = {
    nodes: characters.map(char => ({
      id: char.id,
      name: char.name,
      role: char.role,
      val: char.relationships.length + 1, // 节点大小基于关系数量
    })),
    links: characters.flatMap(char =>
      char.relationships.map(rel => ({
        source: char.id,
        target: rel.targetId,
        type: rel.type,
        strength: rel.strength,
        bidirectional: rel.bidirectional,
      }))
    ),
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = isFullscreen ? window.innerHeight - 100 : 400;
        containerRef.current.style.height = `${height}px`;
        graphRef.current?.width(width);
        graphRef.current?.height(height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  const handleZoomIn = () => {
    const currentZoom = graphRef.current.zoom();
    graphRef.current.zoom(currentZoom * 1.2, 400);
  };

  const handleZoomOut = () => {
    const currentZoom = graphRef.current.zoom();
    graphRef.current.zoom(currentZoom * 0.8, 400);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = '角色关系网络图.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <Card className={`p-4 ${isFullscreen ? 'fixed inset-4 z-50 bg-background' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">关系网络图</h3>
        <TooltipProvider>
          <div className="flex gap-2">
            <div className="text-sm text-muted-foreground">
              {characters.length} 个角色，{graphData.links.length} 个关系
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>放大</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>缩小</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleFullscreen}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>全屏</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>下载图片</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
      <div ref={containerRef} className="w-full">
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          nodeLabel="name"
          nodeColor={node => 
            node.role === 'protagonist' ? '#3b82f6' :
            node.role === 'antagonist' ? '#ef4444' :
            '#6b7280'
          }
          nodeRelSize={6}
          linkColor={link => {
            switch (link.type) {
              case 'friend': return '#22c55e';
              case 'enemy': return '#ef4444';
              case 'family': return '#3b82f6';
              case 'lover': return '#ec4899';
              default: return '#6b7280';
            }
          }}
          linkWidth={link => (link.strength || 1) * 0.5}
          linkDirectionalParticles={link => link.bidirectional ? 4 : 0}
          linkDirectionalParticleWidth={2}
          onNodeClick={node => onCharacterClick?.(node.id as string)}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const size = ((node.val as number || 1) * 5) / globalScale;
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, size, 0, 2 * Math.PI);
            ctx.fillStyle = node.role === 'protagonist' ? '#3b82f6' :
                           node.role === 'antagonist' ? '#ef4444' :
                           '#6b7280';
            ctx.fill();
            
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1 / globalScale;
            ctx.stroke();
            
            const label = node.name as string;
            ctx.font = `${12/globalScale}px Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#888';
            ctx.fillText(label, node.x!, node.y! + size + 3);
          }}
          cooldownTicks={100}
          d3Force={force => {
            force.center = null;
            force.charge = -100;
            force.link.distance = link => 100 / (link.strength || 1);
          }}
        />
      </div>
    </Card>
  );
} 