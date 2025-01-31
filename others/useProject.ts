import { useCallback, useMemo } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import { useFileStore } from '@/stores/useFileStore';
import { useFileManagement } from 'others/useFileManagement';

import type { Project, ProjectType, TypeSpecificData } from '@/types/project';
import type {
  FeatureFilmData,
  SeriesData,
  DocumentaryData,
  CommercialData,
  MusicVideoData,
  WebSeriesData,
  AnimationData
} from '@/types/project-types';

// Base project hook
export function useProject<T extends ProjectType>(projectId: string) {
  const project = useProjectStore(useCallback(
    state => state.getProject<T>(projectId),
    [projectId]
  ));
  const updateProject = useProjectStore(state => state.updateProject);
  const { getProjectThumbnail } = useFileStore();
  const { uploadProjectThumbnail } = useFileManagement(projectId);

  const thumbnail = useMemo(
    () => getProjectThumbnail(projectId),
    [projectId, getProjectThumbnail]
  );

  const updateProjectData = useCallback(
    async (updates: Partial<Project<T>>, thumbnailFile?: File) => {
      updateProject(projectId, updates);

      if (thumbnailFile) {
        await uploadProjectThumbnail(thumbnailFile);
      }
    },
    [projectId, updateProject, uploadProjectThumbnail]
  );

  const updateTypeData = useCallback(
    <K extends keyof TypeSpecificData>(data: Partial<TypeSpecificData[K]>) => {
      updateProject(projectId, {
        typeData: {
          ...project?.typeData,
          ...data,
        },
      });
    },
    [project, projectId, updateProject]
  );

  return {
    project,
    thumbnail,
    updateProject: updateProjectData,
    updateTypeData,
  };
}

// Feature Film Hook
export function useFeatureFilm(projectId: string) {
  const { project, thumbnail, updateProject, updateTypeData } = useProject<'feature'>(projectId);

  const updateFeatureData = useCallback(
    (data: Partial<FeatureFilmData>) => {
      updateTypeData<'feature'>(data);
    },
    [updateTypeData]
  );

  return {
    project,
    thumbnail,
    updateProject,
    featureData: project?.typeData as FeatureFilmData | undefined,
    updateFeatureData,
  };
}

// TV Series Hook
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

// Documentary Hook
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

// Commercial Hook
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

// Music Video Hook
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

// Web Series Hook
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

// Animation Hook
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

// Project Selection Hook
export function useProjectSelection() {
  const getAllProjects = useProjectStore(state => state.projects);
  const getProjectById = useProjectStore(state => state.getProject);

  const sortedProjects = useMemo(() => {
    return [...getAllProjects].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [getAllProjects]);

  const filterProjects = useCallback((
    filters: {
      type?: ProjectType;
      status?: Project['status'];
      phase?: Project['phase'];
      search?: string;
    }
  ) => {
    return sortedProjects.filter(project => {
      if (filters.type && project.type !== filters.type) return false;
      if (filters.status && project.status !== filters.status) return false;
      if (filters.phase && project.phase !== filters.phase) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [sortedProjects]);

  return {
    projects: sortedProjects,
    getProject: getProjectById,
    filterProjects,
  };
}
  
// Export other type-specific hooks similarly
export * from './projectTypeHooks';