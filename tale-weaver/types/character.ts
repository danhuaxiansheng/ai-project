export interface Character {
  id: string;
  storyId: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting';
  description: string;
  background: string;
  tags: string[];
  attributes: {
    age?: string;
    gender?: string;
    occupation?: string;
    birthplace?: string;
  };
  relationships: CharacterRelationship[];
  personality?: {
    extraversion: number;      // 外向性 (0-10)
    openness: number;          // 开放性
    conscientiousness: number;   // 尽责性
    agreeableness: number;      // 亲和性
    neuroticism: number;        // 情绪稳定性
    analysis?: string;          // 性格分析
  };
  createdAt: number;
  updatedAt: number;
}

export interface CharacterRelationship {
  targetId: string;
  type: 'friend' | 'enemy' | 'family' | 'lover' | 'other';
  description: string;
  strength: number;
  bidirectional: boolean;
}

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  progress: number;
  settings?: {
    characters?: Character[];
    worldbuilding?: any; // 根据需要定义具体类型
    outlines?: any; // 根据需要定义具体类型
  };
  createdAt: number;
  updatedAt: number;
} 