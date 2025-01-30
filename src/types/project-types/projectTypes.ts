// types/project-types/projectTypes.ts
import type { LucideIcon } from 'lucide-react';

// Base type definitions
export interface QuickStartOption {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  primaryTool: string;
}

export interface ProjectTypeConfig {
  id: 'feature' | 'series' | 'documentary' | 'commercial' | 'music_video' | 'web_series' | 'animation';
  label: string;
  icon: LucideIcon;
  description: string;
  quickOptions?: QuickStartOption[];
}

// Type aliases for easier reference
export type ProjectType = ProjectTypeConfig;
export type ProjectTypeId = ProjectType['id'];
export type QuickOption = ProjectType['quickOptions'][number];

// Type guard functions
export function isValidProjectType(type: string): type is ProjectTypeId {
  return ['feature', 'series', 'documentary', 'commercial', 'music_video', 'web_series', 'animation'].includes(type);
}

// Utility type for type-specific data
export type TypeSpecificDataMap = {
  feature: import('./feature-film').FeatureFilmData;
  series: import('./series').SeriesData;
  documentary: import('./documentary').DocumentaryData;
  commercial: import('./commercial').CommercialData;
  music_video: import('./music-video').MusicVideoData;
  web_series: import('./web-series').WebSeriesData;
  animation: import('./animation').AnimationData;
};

// Export all project type interfaces
export * from './feature-film';
export * from './series';
export * from './documentary';
export * from './commercial';
export * from './music-video';
export * from './web-series';
export * from './animation';