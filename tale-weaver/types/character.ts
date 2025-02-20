export interface Character {
  id: string;
  storyId: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting';
  description: string;
  background: string;
  relationships: CharacterRelationship[];
  createdAt: number;
  updatedAt: number;
}

export interface CharacterRelationship {
  targetId: string;
  type: 'friend' | 'enemy' | 'family' | 'lover' | 'other';
  description: string;
} 