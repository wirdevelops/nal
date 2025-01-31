import { useCallback } from 'react';
import { useProjectStore, type Project, type ProjectType } from '@/stores/useProjectStore';
import type {
  FeatureFilmData,
  SeriesData,
  DocumentaryData,
  CommercialData,
  MusicVideoData,
  WebSeriesData,
  AnimationData
} from '@/app/projects/components/exports';

// Generic project hook
export function useProject<T extends ProjectType>(projectId: string) {
  const project = useProjectStore(useCallback(
    state => state.getProject<T>(projectId),
    [projectId]
  ));
  const updateProject = useProjectStore(state => state.updateProject);

  return {
    project,
    updateProject: useCallback(
      (updates: Partial<Project<T>>) => updateProject(projectId, updates),
      [projectId, updateProject]
    ),
  };
}

// Feature Film specific hook
export function useFeatureFilm(projectId: string) {
  const { project, updateProject } = useProject<'feature'>(projectId);

  const updateFeatureData = useCallback(
    (updates: Partial<FeatureFilmData>) => {
      updateProject({
        typeData: {
          ...project?.typeData,
          ...updates,
        },
      });
    },
    [project, updateProject]
  );

  return {
    project,
    featureData: project?.typeData as FeatureFilmData | undefined,
    updateFeatureData,
  };
}

// TV Series specific hook
export function useTVSeries(projectId: string) {
  const { project, updateProject } = useProject<'series'>(projectId);

  const updateSeriesData = useCallback(
    (updates: Partial<SeriesData>) => {
      updateProject({
        typeData: {
          ...project?.typeData,
          ...updates,
        },
      });
    },
    [project, updateProject]
  );

  return {
    project,
    seriesData: project?.typeData as SeriesData | undefined,
    updateSeriesData,
  };
}

// Documentary specific hook
export function useDocumentary(projectId: string) {
  const { project, updateProject } = useProject<'documentary'>(projectId);

  const updateDocumentaryData = useCallback(
    (updates: Partial<DocumentaryData>) => {
      updateProject({
        typeData: {
          ...project?.typeData,
          ...updates,
        },
      });
    },
    [project, updateProject]
  );

  return {
    project,
    documentaryData: project?.typeData as DocumentaryData | undefined,
    updateDocumentaryData,
  };
}

// Commercial specific hook
export function useCommercial(projectId: string) {
  const { project, updateProject } = useProject<'commercial'>(projectId);

  const updateCommercialData = useCallback(
    (updates: Partial<CommercialData>) => {
      updateProject({
        typeData: {
          ...project?.typeData,
          ...updates,
        },
      });
    },
    [project, updateProject]
  );

  return {
    project,
    commercialData: project?.typeData as CommercialData | undefined,
    updateCommercialData,
  };
}

// Music Video specific hook
export function useMusicVideo(projectId: string) {
  const { project, updateProject } = useProject<'music_video'>(projectId);

  const updateMusicVideoData = useCallback(
    (updates: Partial<MusicVideoData>) => {
      updateProject({
        typeData: {
          ...project?.typeData,
          ...updates,
        },
      });
    },
    [project, updateProject]
  );

  return {
    project,
    musicVideoData: project?.typeData as MusicVideoData | undefined,
    updateMusicVideoData,
  };
}

// Web Series specific hook
export function useWebSeries(projectId: string) {
  const { project, updateProject } = useProject<'web_series'>(projectId);

  const updateWebSeriesData = useCallback(
    (updates: Partial<WebSeriesData>) => {
      updateProject({
        typeData: {
          ...project?.typeData,
          ...updates,
        },
      });
    },
    [project, updateProject]
  );

  return {
    project,
    webSeriesData: project?.typeData as WebSeriesData | undefined,
    updateWebSeriesData,
  };
}

// Animation specific hook
export function useAnimation(projectId: string) {
  const { project, updateProject } = useProject<'animation'>(projectId);

  const updateAnimationData = useCallback(
    (updates: Partial<AnimationData>) => {
      updateProject({
        typeData: {
          ...project?.typeData,
          ...updates,
        },
      });
    },
    [project, updateProject]
  );

  return {
    project,
    animationData: project?.typeData as AnimationData | undefined,
    updateAnimationData,
  };
}

// Project Tools hook
export function useProjectTools(projectId: string) {
  const project = useProjectStore(useCallback(
    state => state.getProject(projectId),
    [projectId]
  ));
  const enableTool = useProjectStore(state => state.enableTool);
  const disableTool = useProjectStore(state => state.disableTool);

  return {
    enabledTools: project?.tools || [],
    enableTool: useCallback(
      (toolId: string) => enableTool(projectId, toolId),
      [projectId, enableTool]
    ),
    disableTool: useCallback(
      (toolId: string) => disableTool(projectId, toolId),
      [projectId, disableTool]
    ),
  };
}