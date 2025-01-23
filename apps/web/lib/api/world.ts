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
  files?: Record<string, string>;
  data: {
    geography: {
      terrain: string;
      climate: string;
      // ... 其他地理属性
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
};
