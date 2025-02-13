export interface QualityMetrics {
  logicConsistency: number; // 逻辑一致性
  styleMatching: number; // 文风匹配度
  engagement: number; // 观赏度
}

export interface ReviewResult {
  metrics: QualityMetrics;
  suggestions: string[];
  overallScore: number;
}
