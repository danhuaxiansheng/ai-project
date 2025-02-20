export interface TimelineEvent {
  id: string;
  storyId: string;
  title: string;
  description: string;
  date: string;
  relatedCharacters: string[]; // character ids
  relatedLocations: string[]; // location ids
  importance: 'major' | 'minor';
  createdAt: number;
  updatedAt: number;
} 