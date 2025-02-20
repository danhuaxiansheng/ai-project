export interface Character {
  id: string;
  storyId: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting';
  description: string;
  background: string;
  relationships: CharacterRelationship[];
  tags: string[];
  attributes: {
    age?: string;
    gender?: string;
    occupation?: string;
    birthplace?: string;
  };
  createdAt: number;
  updatedAt: number;
  personality?: {
    extraversion: number;      // 外向性 (0-10)
    openness: number;          // 开放性
    conscientiousness: number; // 尽责性
    agreeableness: number;     // 亲和性
    neuroticism: number;       // 情绪稳定性
    analysis?: string;         // 性格分析
  };
  development?: {
    stages: Array<{
      phase: string;
      timeframe: string;
      title: string;
      description: string;
    }>;
  };
}

export interface CharacterRelationship {
  targetId: string;
  type: 'friend' | 'enemy' | 'family' | 'lover' | 'other';
  description: string;
  strength: number;
  bidirectional: boolean;
} 