import { useCallback } from 'react';
import { useProject } from './useProject';
import type {
  SeriesData,
  DocumentaryData,
  CommercialData,
  MusicVideoData,
  WebSeriesData,
  AnimationData
} from '@/types/project-types';

// Series hook
export function useTVSeries(projectId: string) {
  const { project, thumbnail, updateProject, updateTypeData } = useProject<'series'>(projectId);

  const updateSeriesData = useCallback(
    (data: Partial<SeriesData>) => {
      updateTypeData<'series'>(data);
    },
    [updateTypeData]
  );

  return {
    project,
    thumbnail,
    updateProject,
    seriesData: project?.typeData as SeriesData | undefined,
    updateSeriesData,
  };
}

// Documentary hook
export function useDocumentary(projectId: string) {
  const { project, thumbnail, updateProject, updateTypeData } = useProject<'documentary'>(projectId);

  const updateDocumentaryData = useCallback(
    (data: Partial<DocumentaryData>) => {
      updateTypeData<'documentary'>(data);
    },
    [updateTypeData]
  );

  return {
    project,
    thumbnail,
    updateProject,
    documentaryData: project?.typeData as DocumentaryData | undefined,
    updateDocumentaryData,
  };
}

// Commercial hook
export function useCommercial(projectId: string) {
  const { project, thumbnail, updateProject, updateTypeData } = useProject<'commercial'>(projectId);

  const updateCommercialData = useCallback(
    (data: Partial<CommercialData>) => {
      updateTypeData<'commercial'>(data);
    },
    [updateTypeData]
  );

  return {
    project,
    thumbnail,
    updateProject,
    commercialData: project?.typeData as CommercialData | undefined,
    updateCommercialData,
  };
}

// Music Video hook
export function useMusicVideo(projectId: string) {
  const { project, thumbnail, updateProject, updateTypeData } = useProject<'music_video'>(projectId);

  const updateMusicVideoData = useCallback(
    (data: Partial<MusicVideoData>) => {
      updateTypeData<'music_video'>(data);
    },
    [updateTypeData]
  );

  return {
    project,
    thumbnail,
    updateProject,
    musicVideoData: project?.typeData as MusicVideoData | undefined,
    updateMusicVideoData,
  };
}

// Web Series hook
export function useWebSeries(projectId: string) {
  const { project, thumbnail, updateProject, updateTypeData } = useProject<'web_series'>(projectId);

  const updateWebSeriesData = useCallback(
    (data: Partial<WebSeriesData>) => {
      updateTypeData<'web_series'>(data);
    },
    [updateTypeData]
  );

  return {
    project,
    thumbnail,
    updateProject,
    webSeriesData: project?.typeData as WebSeriesData | undefined,
    updateWebSeriesData,
  };
}

// Animation hook
export function useAnimation(projectId: string) {
  const { project, thumbnail, updateProject, updateTypeData } = useProject<'animation'>(projectId);

  const updateAnimationData = useCallback(
    (data: Partial<AnimationData>) => {
      updateTypeData<'animation'>(data);
    },
    [updateTypeData]
  );

  return {
    project,
    thumbnail,
    updateProject,
    animationData: project?.typeData as AnimationData | undefined,
    updateAnimationData,
  };
}