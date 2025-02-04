export interface World {
  id: string;
  name: string;
  created_at: string;
  description: string;
  seed: string;
  complexity: number;
  focus_areas?: string[];
  metadata?: {
    generated_at: string;
    version: string;
    prompt: string;
  };
  project?: string;
  project_name?: string;
  geography?: {
    description: string;
    terrain: {
      types: Array<{
        name: string;
        description: string;
      }>;
      summary: string;
      description: string;
    };
    climate: {
      zones: Array<{
        type: string;
        features: string[];
        description: string;
      }>;
      summary: string;
    };
    resources: {
      items: Array<{
        type: string;
        name: string;
        abundance: string;
        distribution: string;
      }>;
      summary: string;
    };
  };
  culture?: {
    description: string;
    civilizations: Array<{
      type: string;
      name: string;
      characteristics: string[];
      development_level: string;
    }>;
    beliefs: string[];
    customs: string[];
    arts: string[];
    social_structure: {
      system: string;
      classes: string;
      mobility: string;
    };
  };
}

export interface WorldGenerationParams {
  seed?: string;
  complexity: number;
  focus_areas: string[];
  additional_params?: Record<string, any>;
  project_name?: string;
}

export interface WorldResponse {
  data: World;
  message?: string;
}
