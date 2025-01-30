export interface FeatureFilmData {
    scriptStage?: string;
    genre?: string;
    runtime?: number;
    targetMarket?: string;
    distributionStrategy?: 'theatrical' | 'streaming' | 'festival' | 'hybrid';
    rights?: {
      scriptRights: boolean;
      musicRights: boolean;
      distributionRights: boolean;
    };
  }
  