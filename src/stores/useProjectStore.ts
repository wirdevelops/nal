import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { 
  FeatureFilmData,
  SeriesData,
  DocumentaryData,
  CommercialData,
  MusicVideoData,
  WebSeriesData,
  AnimationData
} from '@/types/project-types';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Category } from '@/types/blog';
import { ProjectCategory } from '@/types/ngo/project';

export type ProjectType = 'feature' | 'series' | 'documentary' | 'commercial' | 'music_video' | 'web_series' | 'animation';
export type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'archived';
export type ProjectPhase = 'Development' | 'Pre-Production' | 'Production' | 'Post-Production';

// Type-specific data mapping
type TypeSpecificData = {
  feature: FeatureFilmData;
  series: SeriesData;
  documentary: DocumentaryData;
  commercial: CommercialData;
  music_video: MusicVideoData;
  web_series: WebSeriesData;
  animation: AnimationData;
};

export interface Project<T extends ProjectType = ProjectType> {
  location: any;
  category: ProjectCategory;
  name: string;
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
  typeData?: T extends keyof TypeSpecificData ? TypeSpecificData[T] : Record<string, unknown>;
  thumbnailUrl?: string;
}

interface ProjectStore {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: <T extends ProjectType>(id: string) => Project<T> | undefined;
  enableTool: (projectId: string, toolId: string) => void;
  disableTool: (projectId: string, toolId: string) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],

      addProject: (projectData) => {
        const newProject: Project = {
          id: uuidv4(),
          ...projectData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tools: [],
        };

        set((state) => ({
          projects: [...state.projects, newProject],
        }));

        return newProject;
      },
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? {
                  ...project,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : project
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        }));
      },

      getProject: <T extends ProjectType>(id: string) => {
        const project = get().projects.find(project => project.id === id);
        if (!project) return undefined;
        // Only return if the project type matches the requested type
        return (project.type === project.type) ? project as Project<T> : undefined;
      },

      enableTool: (projectId, toolId) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  tools: [...(project.tools || []), toolId],
                  updatedAt: new Date().toISOString(),
                }
              : project
          ),
        }));
      },

      disableTool: (projectId, toolId) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  tools: (project.tools || []).filter(t => t !== toolId),
                  updatedAt: new Date().toISOString(),
                }
              : project
          ),
        }));
      },
    }),
    {
      name: 'project-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);