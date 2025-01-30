export interface SeriesData {
    numberOfSeasons?: number;
    episodesPerSeason?: number;
    episodeDuration?: number;
    platform?: string;
    format?: 'scripted' | 'unscripted' | 'documentary';
    targetAudience?: string;
  }
  