"use client";

import { useEffect, useRef, useState } from "react";
import { Character } from "@/types/character";
import { ForceGraph2D } from "react-force-graph";
import { Card } from "@/components/ui/card";
import { CharacterNetworkExport } from "./character-network-export";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CharacterNetworkProps {
  characters: Character[];
  onNodeClick?: (characterId: string) => void;
}

interface NodeData {
  name: string;
  role: Character['role'];
  val: number;
}

interface LinkData {
  type: string;
  strength: number;
  bidirectional: boolean;
}

export function CharacterNetwork({ characters, onNodeClick }: CharacterNetworkProps) {
  const graphRef = useRef<ForceGraph2D<NodeData, LinkData>>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeObject<NodeData> | null>(null);
  const [hoveredLink, setHoveredLink] = useState<LinkObject<LinkData> | null>(null);

  const graphData = {
    nodes: characters.map(c => ({
      id: c.id,
      name: c.name,
      role: c.role,
      val: c.relationships.length + 1
    })),
    links: characters.flatMap(c =>
      c.relationships.map(r => ({
        source: c.id,
        target: r.targetId,
        type: r.type,
        strength: r.strength,
        bidirectional: r.bidirectional
      }))
    )
  };

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force('link').distance((link: LinkObject<LinkData>) => 
        100 / (link.strength || 1)
      );
      graphRef.current.d3Force('charge').strength(-100);
    }
  }, [characters]);

  const handleNodeLabel = (node: NodeObject<NodeData>): string => `${node.name}`;
  
  const handleNodeColor = (node: NodeObject<NodeData>): string => 
    node.role === 'protagonist' ? '#3b82f6' :
    node.role === 'antagonist' ? '#ef4444' :
    '#6b7280';

  const handleLinkColor = (link: LinkObject<LinkData>): string => 
    link.type === 'friend' ? '#22c55e' :
    link.type === 'enemy' ? '#ef4444' :
    link.type === 'family' ? '#3b82f6' :
    link.type === 'lover' ? '#ec4899' :
    '#6b7280';

  const handleLinkWidth = (link: LinkObject<LinkData>): number => 
    (link.strength || 1) * 0.5;

  const handleNodeClick = (node: NodeObject<NodeData>) => {
    onNodeClick?.(node.id);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">关系网络</h3>
        <div className="flex items-center gap-2">
          <CharacterNetworkExport graphRef={graphRef} />
        </div>
      </div>
      <TooltipProvider>
        <div className="relative h-[400px] w-full">
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            nodeLabel={handleNodeLabel}
            nodeColor={handleNodeColor}
            linkColor={handleLinkColor}
            linkWidth={handleLinkWidth}
            onNodeClick={handleNodeClick}
            onNodeHover={setHoveredNode}
            onLinkHover={setHoveredLink}
            cooldownTicks={100}
            nodeRelSize={6}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={0.005}
            linkDirectionalParticleWidth={2}
            backgroundColor="transparent"
          />
          {hoveredNode && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute top-0 left-0" style={{
                  transform: `translate(${hoveredNode.x}px, ${hoveredNode.y}px)`
                }} />
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-1">
                  <div className="font-medium">{hoveredNode.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {hoveredNode.role === 'protagonist' ? '主角' :
                     hoveredNode.role === 'antagonist' ? '反派' : '配角'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    关系数: {hoveredNode.val - 1}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
          {hoveredLink && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute top-0 left-0" style={{
                  transform: `translate(${
                    ((hoveredLink.source as NodeObject).x + (hoveredLink.target as NodeObject).x) / 2
                  }px, ${
                    ((hoveredLink.source as NodeObject).y + (hoveredLink.target as NodeObject).y) / 2
                  }px)`
                }} />
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-1">
                  <div className="font-medium">
                    {hoveredLink.type === 'friend' ? '朋友' :
                     hoveredLink.type === 'enemy' ? '敌人' :
                     hoveredLink.type === 'family' ? '家人' :
                     hoveredLink.type === 'lover' ? '恋人' : '其他'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    关系强度: {hoveredLink.strength}
                    {hoveredLink.bidirectional && ' (双向)'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(hoveredLink.source as NodeObject).name} → {(hoveredLink.target as NodeObject).name}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    </Card>
  );
} 