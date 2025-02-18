declare module "react-force-graph" {
  import { FC } from "react";

  export interface NodeObject {
    id: string;
    [key: string]: any;
  }

  export interface LinkObject {
    source: string | NodeObject;
    target: string | NodeObject;
    [key: string]: any;
  }

  export interface GraphData {
    nodes: NodeObject[];
    links: LinkObject[];
  }

  export interface ForceGraphProps {
    graphData: GraphData;
    nodeLabel?: string | ((node: NodeObject) => string);
    nodeColor?: string | ((node: NodeObject) => string);
    linkColor?: string | ((link: LinkObject) => string);
    backgroundColor?: string;
    width?: number;
    height?: number;
    [key: string]: any;
  }

  export const ForceGraph2D: FC<ForceGraphProps>;
  export const ForceGraph3D: FC<ForceGraphProps>;
}
