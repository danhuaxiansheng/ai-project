"use client";

import { useEffect, useRef } from "react";
import { Character } from "@/types/character";
import ForceGraph2D from "react-force-graph-2d";
import { Card } from "@/components/ui/card";
import { CharacterNetworkExport } from "./character-network-export";

interface CharacterNetworkProps {
  characters: Character[];
  onNodeClick?: (characterId: string) => void;
}

interface Node {
  id: string;
  name: string;
  role: Character['role'];
  val: number; // 节点大小
}

interface Link {
  source: string;
  target: string;
  type: string;
  strength: number;
}

export function CharacterNetwork({ characters, onNodeClick }: CharacterNetworkProps) {
  const graphRef = useRef<any>();

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
        strength: r.strength
      }))
    )
  };

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force('link').distance(link => 100 / (link.strength || 1));
      graphRef.current.d3Force('charge').strength(-100);
    }
  }, [characters]);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">关系网络</h3>
        <CharacterNetworkExport graphRef={graphRef} />
      </div>
      <div className="h-[500px] w-full">
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          nodeLabel={node => `${(node as Node).name}`}
          nodeColor={node => 
            (node as Node).role === 'protagonist' ? '#3b82f6' :
            (node as Node).role === 'antagonist' ? '#ef4444' :
            '#6b7280'
          }
          linkColor={link => 
            (link as Link).type === 'friend' ? '#22c55e' :
            (link as Link).type === 'enemy' ? '#ef4444' :
            (link as Link).type === 'family' ? '#3b82f6' :
            (link as Link).type === 'lover' ? '#ec4899' :
            '#6b7280'
          }
          linkWidth={link => ((link as Link).strength || 1) * 0.5}
          onNodeClick={(node) => onNodeClick?.((node as Node).id)}
          cooldownTicks={100}
          nodeRelSize={6}
        />
      </div>
    </Card>
  );
} 