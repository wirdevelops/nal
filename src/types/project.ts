import type {
    FeatureFilmData,
    SeriesData,
    DocumentaryData,
    CommercialData,
    MusicVideoData,
    WebSeriesData,
    AnimationData,
  } from './project-types';
  
  export type ProjectType = 'feature' | 'series' | 'documentary' | 'commercial' | 'music_video' | 'web_series' | 'animation';
  export type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'archived';
  export type ProjectPhase = 'Development' | 'Pre-Production' | 'Production' | 'Post-Production';
  
  export type TypeSpecificData = {
    feature: FeatureFilmData;
    series: SeriesData;
    documentary: DocumentaryData;
    commercial: CommercialData;
    music_video: MusicVideoData;
    web_series: WebSeriesData;
    animation: AnimationData;
  };
  
  export interface Project<T extends ProjectType = ProjectType> {
    id: string;
    title: string;
    type: T;
    description: string;
    phase: ProjectPhase;
    status: ProjectStatus;
    team: number;
    progress: number;
    startDate: string;
    targetDate?: string;
    createdAt: string;
    updatedAt: string;
    primaryTool: string;
    tools?: string[];
    thumbnailFileId?: string;
    typeData?: T extends keyof TypeSpecificData ? TypeSpecificData[T] : Record<string, unknown>;
  }
