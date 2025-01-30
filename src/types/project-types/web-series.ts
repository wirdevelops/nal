export interface WebSeriesData {
    platform?: string[];
    episodeCount?: number;
    episodeDuration?: number;
    releaseSchedule?: 'all-at-once' | 'weekly' | 'bi-weekly' | 'monthly';
    targetDemographic?: string;
    genre?: string;
    format?: 'scripted' | 'vlog' | 'educational' | 'entertainment';
    monetizationStrategy?: 'ads' | 'sponsorship' | 'subscription' | 'mixed';
    interactiveElements?: boolean;
    socialMediaStrategy?: string;
    distributionPlatforms?: string[];
    seasonPlanned?: number;
    contentRating?: string;
  }
  