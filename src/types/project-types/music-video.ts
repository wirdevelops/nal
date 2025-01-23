export interface MusicVideoData {
    artist?: string;
    songTitle?: string;
    genre?: string;
    duration?: number;
    concept?: string;
    visualStyle?: string;
    recordLabel?: string;
    performanceType?: 'lip-sync' | 'live' | 'narrative' | 'conceptual';
    location?: 'studio' | 'outdoor' | 'multiple' | 'virtual';
    specialEffects?: boolean;
    choreoRequired?: boolean;
    releaseStrategy?: string;
  }