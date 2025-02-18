"use client";

import dynamic from "next/dynamic";
import { useStory } from "@/contexts/story-context";
import { useTheme } from "next-themes";
import { memorySystem } from "@/services/memory";
import { useState, useEffect } from "react";
import type { GraphData as ForceGraphData } from "react-force-graph";

interface MemoryNode {
  id: string;
  label: string;
  type: "story" | "dialogue" | "plot";
}

interface GraphData {
  nodes: MemoryNode[];
  links: Array<{
    source: string;
    target: string;
    value: number;
  }>;
}

// 动态导入 ForceGraph2D 组件
const ForceGraph2D = dynamic(
  () => import("react-force-graph").then((mod) => mod.ForceGraph2D),
  {
    ssr: false, // 禁用服务端渲染
  }
);

export function MemoryGraph() {
  const { state } = useStory();
  const { theme } = useTheme();
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });

  useEffect(() => {
    async function loadMemoryGraph() {
      if (!state.currentStory) return;

      const memories = await memorySystem.searchMemories("", 100);

      const nodes = memories.map((memory) => ({
        id: memory.reference_id,
        label: memory.text.slice(0, 30) + "...",
        type: memory.type as "story" | "dialogue" | "plot",
      }));

      const links = memories.flatMap((memory, i) =>
        memories.slice(i + 1).map((other) => ({
          source: memory.reference_id,
          target: other.reference_id,
          value: memory.score || 0.5,
        }))
      );

      setGraphData({ nodes, links });
    }

    loadMemoryGraph();
  }, [state.currentStory]);

  // 转换为 ForceGraph 需要的数据格式
  const forceGraphData: ForceGraphData = {
    nodes: graphData.nodes,
    links: graphData.links,
  };

  return (
    <div className="w-full h-[400px] border rounded-lg">
      <ForceGraph2D
        graphData={forceGraphData}
        nodeLabel="label"
        nodeColor={(node) => {
          const memoryNode = node as MemoryNode;
          return memoryNode.type === "story"
            ? "#ff6b6b"
            : memoryNode.type === "dialogue"
            ? "#4ecdc4"
            : "#45b7d1";
        }}
        linkColor={() => (theme === "dark" ? "#666" : "#ddd")}
        backgroundColor={theme === "dark" ? "#1a1a1a" : "#ffffff"}
      />
    </div>
  );
}
