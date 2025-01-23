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
  focusAreas: string[];
  additionalParams?: Record<string, any>;
}

export interface WorldData {
  id: string;
  version: string;
  timestamp: string;
  data: {
    geography: any;
    civilization: any;
    history: any[];
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
};
