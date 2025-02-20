export interface QualityReview {
  id: string;
  storyId: string;
  chapterId?: string;
  metrics: QualityMetrics;
  suggestions: QualitySuggestion[];
  timestamp: number;
}

export interface QualityMetrics {
  consistency: {
    score: number;
    plotConsistency: number;
    characterConsistency: number;
    worldBuildingConsistency: number;
    details: string[];
  };
  style: {
    score: number;
    toneMatching: number;
    vocabularyUsage: number;
    narrativeFlow: number;
    details: string[];
  };
  engagement: {
    score: number;
    pacing: number;
    tension: number;
    emotionalImpact: number;
    details: string[];
  };
}

export interface QualitySuggestion {
  id: string;
  type: 'plot' | 'character' | 'style' | 'pacing';
  content: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt?: number;
}

export type QualityReviewCreateInput = Omit<QualityReview, 'id' | 'timestamp'>;
export type QualityReviewUpdateInput = Partial<Omit<QualityReview, 'id' | 'storyId'>>; 