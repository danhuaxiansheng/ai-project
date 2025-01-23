import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface WorldGenerationParams {
  seed?: string;
  complexity: number;
  focus_areas: string[];
  additional_params?: Record<string, any>;
}

export interface WorldData {
  id: string;
  seed: string;
  version: string;
  timestamp: string;
  name: string;
  description: string;
  tags: string[];
  created_at: string;
  files?: Record<string, string>;
  data: {
    geography: {
      terrain: string;
      climate: string;
      resources: {
        minerals: string[];
        plants: string[];
        animals: string[];
      };
      features: {
        landmarks: string[];
        waters: string[];
        biomes: string[];
      };
      environment: {
        quality: string;
        challenges: string[];
        phenomena: string[];
      };
    };
    civilization: {
      technology_level: string;
      social_structure: string;
      major_industries: string[];
      population_size: number;
      development_level: number;
      cultural_traits: {
        values: string;
        beliefs: string;
        customs: string;
      };
    };
    history: Array<{
      year: number;
      event: string;
    }>;
  };
}

export interface PromptAnalysisResult {
  suggestedSeed?: string;
  suggestedComplexity?: number;
  suggestedFocusAreas?: string[];
  analysis: {
    worldOrigin?: string;
    geography?: string;
    civilization?: string;
    keyThemes: string[];
  };
}

export interface WorldSummary {
  id?: string;
  name?: string;
  seed: string;
  created_at?: string;
  description?: string;
  tags?: string[];
}

interface Civilization {
  technology: {
    level: string; // 技术水平
    focus_areas: string[]; // 技术重点
    innovations: string[]; // 重要发明
    limitations: string[]; // 技术限制
  };
  society: {
    structure: string; // 社会结构
    classes: string[]; // 阶级划分
    governance: {
      // 统治方式
      type: string; // 政体类型
      institutions: string[]; // 重要机构
      laws: string[]; // 基本法则
    };
    economy: {
      // 经济系统
      system: string; // 经济体制
      currency: string; // 货币形式
      trade: string[]; // 贸易方式
      industries: string[]; // 主要产业
    };
  };
  culture: {
    values: string[]; // 核心价值观
    customs: string[]; // 重要习俗
    arts: {
      // 艺术形式
      forms: string[]; // 艺术类型
      styles: string[]; // 艺术风格
      works: string[]; // 代表作品
    };
    language: {
      // 语言系统
      main: string; // 主要语言
      dialects: string[]; // 方言
      writing: string; // 书写系统
    };
  };
  religion: {
    systems: string[]; // 宗教体系
    beliefs: string[]; // 核心信仰
    practices: string[]; // 宗教活动
    institutions: string[]; // 宗教组织
  };
  knowledge: {
    // 知识体系
    education: string; // 教育方式
    sciences: string[]; // 科学发展
    philosophy: string[]; // 哲学思想
    medicine: string; // 医疗水平
  };
}

interface History {
  eras: Array<{
    // 历史时期
    name: string; // 时代名称
    start_year: number; // 开始年份
    end_year: number; // 结束年份
    description: string; // 时代特征
    events: Array<{
      // 重要事件
      year: number;
      event: string;
      impact: string; // 影响
      key_figures: string[]; // 重要人物
    }>;
  }>;
  conflicts: Array<{
    // 重大冲突
    name: string;
    period: string;
    parties: string[];
    causes: string[];
    outcomes: string[];
  }>;
  developments: Array<{
    // 发展进程
    area: string; // 发展领域
    stages: Array<{
      // 发展阶段
      name: string;
      achievements: string[];
      challenges: string[];
    }>;
  }>;
}

interface Races {
  sentient: Array<{
    // 智慧种族
    name: string;
    traits: string[]; // 种族特征
    society: string; // 社会形态
    relations: string[]; // 种族关系
    habitat: string; // 栖息地
    abilities: string[]; // 特殊能力
  }>;
  creatures: Array<{
    // 生物志
    type: string; // 生物类型
    species: Array<{
      name: string;
      habitat: string;
      behavior: string;
      significance: string; // 文化意义
    }>;
  }>;
}

interface Systems {
  magic?: {
    // 魔法体系
    types: string[]; // 魔法类型
    sources: string[]; // 魔力来源
    principles: string[]; // 基本原理
    limitations: string[]; // 使用限制
    schools: Array<{
      // 流派
      name: string;
      focus: string;
      techniques: string[];
    }>;
  };
  technology?: {
    // 科技体系
    energy: string[]; // 能源形式
    transportation: string[]; // 交通方式
    communication: string[]; // 通讯方式
    weapons: string[]; // 武器系统
    breakthroughs: Array<{
      // 重大突破
      field: string;
      impact: string;
    }>;
  };
}

export const worldApi = {
  async generateWorld(params: WorldGenerationParams): Promise<WorldData> {
    const { data } = await api.post<WorldData>("/api/generate", params);
    return data;
  },

  async checkHealth(): Promise<{ status: string }> {
    const { data } = await api.get("/api/health");
    return data;
  },

  async analyzePrompt(prompt: string): Promise<PromptAnalysisResult> {
    const { data } = await api.post<PromptAnalysisResult>("/api/analyze", {
      prompt,
    });
    return data;
  },

  async getWorld(projectName: string, worldId: string): Promise<WorldData> {
    const { data } = await api.get<WorldData>(
      `/api/worlds/${projectName}/${worldId}`
    );
    return data;
  },

  async updateWorld(
    projectName: string,
    worldId: string,
    updates: Partial<{
      [K in keyof WorldData]: any;
    }>
  ): Promise<{ status: string; files: Record<string, string> }> {
    const { data } = await api.patch(
      `/api/worlds/${projectName}/${worldId}`,
      updates
    );
    return data;
  },

  async listWorlds(projectName: string): Promise<Record<string, WorldSummary>> {
    const { data } = await api.get(`/api/worlds/${projectName}`);
    return data.worlds;
  },

  async deleteWorld(
    projectName: string,
    worldId: string
  ): Promise<{ status: string; message: string }> {
    const { data } = await api.delete(`/api/worlds/${projectName}/${worldId}`);
    return data;
  },
};
