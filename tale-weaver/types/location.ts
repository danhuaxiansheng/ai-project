export interface Location {
  id: string;
  storyId: string;
  name: string;
  description: string;
  significance: string;
  connectedLocations: string[]; // location ids
  createdAt: number;
  updatedAt: number;
} 