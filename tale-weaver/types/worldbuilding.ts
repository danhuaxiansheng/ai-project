export interface WorldSetting {
  id: string;
  storyId: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;

  // 地理体系
  geography: {
    regions: Region[];
    climate: ClimateSystem;
    resources: Resource[];
  };

  // 社会体系
  society: {
    cultures: Culture[];
    politics: PoliticalSystem;
    economy: EconomicSystem;
    religions: Religion[];
  };

  // 魔法/科技体系
  powerSystem: {
    type: "magic" | "technology" | "hybrid";
    rules: PowerRule[];
    limitations: string[];
    artifacts: Artifact[];
  };
}

interface Region {
  id: string;
  name: string;
  description: string;
  climate: string;
  terrain: string;
  resources: string[];
  cultures: string[]; // 关联的文化ID
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
