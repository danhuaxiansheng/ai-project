export interface WorldSetting {
  id: string;
  storyId: string;
  geography?: {
    regions: Region[];
    climate: string;
    terrain: string;
  };
  society?: {
    politics: string;
    economy: string;
    culture: string;
    technology: string;
  };
  powerSystem?: {
    name: string;
    description: string;
    rules: string[];
    levels: PowerLevel[];
  };
  createdAt: number;
  updatedAt: number;
}

export interface Region {
  id: string;
  name: string;
  description: string;
  features: string[];
}

export interface PowerLevel {
  id: string;
  name: string;
  description: string;
  requirements: string[];
}

interface Culture {
  id: string;
  name: string;
  description: string;
  values: string[];
  customs: string[];
  languages: string[];
  regions: string[]; // 关联的地区ID
}

interface PowerRule {
  id: string;
  name: string;
  description: string;
  effects: string[];
  costs: string[];
  limitations: string[];
}

interface Artifact {
  id: string;
  name: string;
  description: string;
  type: string;
  powers: string[];
  origin: string;
  currentLocation?: string;
  relatedRules: string[]; // 关联的规则ID
}

// ... 其他接口定义

// 导出所有接口
export type {
  WorldSetting,
  Region,
  Culture,
  PowerRule,
  Artifact,
  ClimateSystem,
  Resource,
  PoliticalSystem,
  EconomicSystem,
  Religion,
};
