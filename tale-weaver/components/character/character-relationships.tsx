"use client";

import { useEffect, useRef } from "react";
import { Character, CharacterRelationship } from "@/types/character";
import ForceGraph2D from "react-force-graph-2d";

interface CharacterRelationshipsProps {
  characters: Character[];
}

interface Node {
  id: string;
  name: string;
  role: Character['role'];
}

interface Link {
  source: string;
  target: string;
  type: CharacterRelationship['type'];
}

export function CharacterRelationships({ characters }: CharacterRelationshipsProps) {
  const graphData = {
    nodes: characters.map(c => ({
      id: c.id,
      name: c.name,
      role: c.role,
    })),
    links: characters.flatMap(c =>
      c.relationships.map(r => ({
        source: c.id,
        target: r.targetId,
        type: r.type,
      }))
    ),
  };

  return (
    <div className="w-full h-[400px] border rounded-lg overflow-hidden">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="name"
        nodeColor={node => 
          node.role === 'protagonist' ? '#3b82f6' :
          node.role === 'antagonist' ? '#ef4444' :
          '#6b7280'
        }
        linkColor={link => 
          link.type === 'friend' ? '#22c55e' :
          link.type === 'enemy' ? '#ef4444' :
          link.type === 'family' ? '#3b82f6' :
          link.type === 'lover' ? '#ec4899' :
          '#6b7280'
        }
        width={800}
        height={400}
      />
    </div>
  );
} 