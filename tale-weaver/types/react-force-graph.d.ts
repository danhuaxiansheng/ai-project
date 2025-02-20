declare module "react-force-graph" {
  import { FC } from "react";

  export interface NodeObject<T = any> {
    id: string;
    x?: number;
    y?: number;
    name?: string;
    val?: number;
    [key: string]: T;
  }

  export interface LinkObject<T = any> {
    source: string | NodeObject;
    target: string | NodeObject;
    type?: string;
    strength?: number;
    [key: string]: T;
  }

  export interface GraphData<N = any, L = any> {
    nodes: Array<NodeObject<N>>;
    links: Array<LinkObject<L>>;
  }

  export interface ForceGraphProps<N = any, L = any> {
    graphData: GraphData<N, L>;
    nodeLabel?: string | ((node: NodeObject<N>) => string);
    nodeColor?: string | ((node: NodeObject<N>) => string);
    nodeVal?: number | ((node: NodeObject<N>) => number);
    nodeRelSize?: number;
    linkSource?: string;
    linkTarget?: string;
    linkColor?: string | ((link: LinkObject<L>) => string);
    linkWidth?: number | ((link: LinkObject<L>) => number);
    linkDirectionalParticles?: number;
    linkDirectionalParticleSpeed?: number;
    linkDirectionalParticleWidth?: number;
    onNodeClick?: (node: NodeObject<N>) => void;
    onLinkClick?: (link: LinkObject<L>) => void;
    onNodeHover?: (node: NodeObject<N> | null) => void;
    onLinkHover?: (link: LinkObject<L> | null) => void;
    cooldownTicks?: number;
    cooldownTime?: number;
    d3AlphaDecay?: number;
    d3VelocityDecay?: number;
    warmupTicks?: number;
    width?: number;
    height?: number;
    backgroundColor?: string;
    ref?: any;
  }

  export const ForceGraph2D: FC<ForceGraphProps>;
  export const ForceGraph3D: FC<ForceGraphProps>;
}

declare module 'react-force-graph-2d' {
  import { Component } from 'react';

  export interface NodeObject<T = any> {
    id: string;
    name?: string;
    val?: number;
    [key: string]: T;
  }

  export interface LinkObject<T = any> {
    source: string | NodeObject;
    target: string | NodeObject;
    type?: string;
    strength?: number;
    [key: string]: T;
  }

  export interface GraphData<N = any, L = any> {
    nodes: Array<NodeObject<N>>;
    links: Array<LinkObject<L>>;
  }

  export interface ForceGraphProps<N = any, L = any> {
    graphData: GraphData<N, L>;
    nodeLabel?: string | ((node: NodeObject<N>) => string);
    nodeColor?: string | ((node: NodeObject<N>) => string);
    nodeVal?: number | ((node: NodeObject<N>) => number);
    nodeRelSize?: number;
    nodeId?: string;
    linkSource?: string;
    linkTarget?: string;
    linkColor?: string | ((link: LinkObject<L>) => string);
    linkWidth?: number | ((link: LinkObject<L>) => number);
    linkDirectionalParticles?: number;
    linkDirectionalParticleSpeed?: number;
    linkDirectionalParticleWidth?: number;
    onNodeClick?: (node: NodeObject<N>) => void;
    onLinkClick?: (link: LinkObject<L>) => void;
    onNodeHover?: (node: NodeObject<N> | null) => void;
    onLinkHover?: (link: LinkObject<L> | null) => void;
    cooldownTicks?: number;
    cooldownTime?: number;
    d3AlphaDecay?: number;
    d3VelocityDecay?: number;
    warmupTicks?: number;
    width?: number;
    height?: number;
    backgroundColor?: string;
    ref?: any;
  }

  export default class ForceGraph2D<N = any, L = any> extends Component<ForceGraphProps<N, L>> {}
}
