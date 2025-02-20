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
}

export interface CharacterRelationship {
  targetId: string;
  type: 'friend' | 'enemy' | 'family' | 'lover' | 'other';
  description: string;
  strength: number;
  bidirectional: boolean;
} 