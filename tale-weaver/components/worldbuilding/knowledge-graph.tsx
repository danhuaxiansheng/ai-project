"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { WorldSetting } from "@/types/worldbuilding";
import { NodeDetailsDialog } from "./node-details-dialog";

// 动态导入 ForceGraph2D 组件
const ForceGraph2D = dynamic(
  () => import("react-force-graph").then((mod) => mod.ForceGraph2D),
  { ssr: false } // 禁用服务器端渲染
);

interface Node {
  id: string;
  name: string;
  type: "region" | "culture" | "rule" | "artifact";
  color: string;
}

interface Link {
  source: string;
  target: string;
  type: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

const NODE_COLORS = {
  region: "#4f46e5", // 靛蓝色
  culture: "#059669", // 绿色
  rule: "#dc2626", // 红色
  artifact: "#d97706", // 橙色
};

export function KnowledgeGraph({ data }: { data: WorldSetting | null }) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // 构建图数据
  const graphData = useCallback((): GraphData => {
    if (!data) return { nodes: [], links: [] };

    const nodes: Node[] = [];
    const links: Link[] = [];

    // 添加地区节点
    data.geography?.regions?.forEach((region) => {
      nodes.push({
        id: region.id,
        name: region.name,
        type: "region",
        color: NODE_COLORS.region,
      });

      // 添加地区与文化的关联
      region.cultures.forEach((cultureId) => {
        links.push({
          source: region.id,
          target: cultureId,
          type: "has_culture",
        });
      });
    });

    // 添加文化节点
    data.society?.cultures?.forEach((culture) => {
      nodes.push({
        id: culture.id,
        name: culture.name,
        type: "culture",
        color: NODE_COLORS.culture,
      });
    });

    // 添加规则节点
    data.powerSystem?.rules?.forEach((rule) => {
      nodes.push({
        id: rule.id,
        name: rule.name,
        type: "rule",
        color: NODE_COLORS.rule,
      });
    });

    // 添加神器节点
    data.powerSystem?.artifacts?.forEach((artifact) => {
      nodes.push({
        id: artifact.id,
        name: artifact.name,
        type: "artifact",
        color: NODE_COLORS.artifact,
      });
    });

    return { nodes, links };
  }, [data]);

  const handleNodeClick = useCallback((node: Node) => {
    setSelectedNode(node);
    setDialogOpen(true);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">知识图谱</h3>
        <div className="flex gap-4">
          {Object.entries(NODE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[600px] rounded-lg border bg-card/50">
        {typeof window !== "undefined" && ForceGraph2D && (
          <ForceGraph2D
            graphData={graphData()}
            nodeLabel="name"
            nodeColor={(node: any) => node.color}
            linkColor={() => "#94a3b8"}
            linkWidth={1}
            linkDirectionalParticles={2}
            linkDirectionalParticleWidth={2}
            onNodeClick={handleNodeClick}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.name;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = node.color;
              ctx.fillText(label, node.x, node.y);
            }}
          />
        )}
      </div>

      <NodeDetailsDialog
        node={selectedNode}
        worldSetting={data}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
