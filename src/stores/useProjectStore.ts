// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { v4 as uuidv4 } from 'uuid';
// import { validateProjectCreation, validateTypeSpecificData } from '@/utils/validation';
// import type { Project, ProjectType } from '@/types/project';
// import type { ProjectCreationData, ValidationResult } from '@/types/validation';
// import { useFileStore } from './useFileStore';  // Import useFileStore

// interface ProjectStore {
//   projects: Project[];
  
//   // Core project operations
//   addProject: (data: ProjectCreationData) => Promise<{
//     success: boolean;
//     project?: Project;
//     validationResult?: ValidationResult;
//   }>;

//   updateProject: (id: string, updates: Partial<Project>) => void;
//   deleteProject: (id: string) => void;
//   getProject: <T extends ProjectType>(id: string) => Project<T> | undefined;
 
//   // Tool management
//   enableTool: (projectId: string, toolId: string) => void;
//   disableTool: (projectId: string, toolId: string) => void;
  
//   // Thumbnail management
//   setProjectThumbnail: (projectId: string, fileId: string) => void;
//   removeProjectThumbnail: (projectId: string) => void;
// }

// export const useProjectStore = create<ProjectStore>()(
//   persist(
//     (set, get) => ({
//       projects: [],

//       addProject: async (data) => {
//         // Validate project data
//         const validationResult = validateProjectCreation(data);
//         if (!validationResult.isValid) {
//           return { success: false, validationResult };
//         }
    
//         // Validate type-specific data if present
//         if (data.typeData) {
//           const typeValidation = validateTypeSpecificData(data.type, data.typeData);
//           if (!typeValidation.isValid) {
//             return { success: false, validationResult: typeValidation };
//           }
//         }
    
//         try {
//           // Handle thumbnail upload if present
//           let thumbnailFileId: string | undefined;
//           const { addFile } = useFileStore.getState();
          
//           if (data.thumbnailFile) {
//             const newFile = addFile({
//               projectId: '', // Will be updated after project creation
//               name: data.thumbnailFile.name,
//               type: 'image',
//               mimeType: data.thumbnailFile.type,
//               size: data.thumbnailFile.size,
//               url: URL.createObjectURL(data.thumbnailFile),
//               status: 'ready',
//               metadata: {
//                 isThumbnail: true
//               },
//               uploadedBy: 'current-user' // Replace with actual user ID when auth is implemented
//             });
            
//             thumbnailFileId = newFile.id;
//           }
          
//           // Create the project
//           const newProject: Project = {
//             id: crypto.randomUUID(),
//             title: data.title,
//             description: data.description || '',
//             type: data.type,
//             phase: 'Development',
//             status: 'active',
//             team: 0,
//             progress: 0,
//             startDate: data.startDate?.toISOString() || new Date().toISOString(),
//             targetDate: data.targetDate?.toISOString(),
//             thumbnailFileId,
//             primaryTool: data.primaryTool || 'overview',
//             typeData: data.typeData,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//             tools: []
//           };

//           set((state) => ({
//             projects: [...state.projects, newProject]
//           }));

//           // Update the file's projectId if we created one
//           if (thumbnailFileId) {
//             const { updateFile } = useFileStore.getState();
//             updateFile(thumbnailFileId, { projectId: newProject.id });
//           }

//           return { success: true, project: newProject };
//         } catch (error) {
//           console.error('Failed to create project:', error);
//           return {
//             success: false,
//             validationResult: {
//               isValid: false,
//               errors: [{ field: 'system', message: 'Failed to create project' }]
//             }
//           };
//         }
//       },

//       updateProject: (id, updates) => {
//         set((state) => ({
//           projects: state.projects.map((project) =>
//             project.id === id
//               ? {
//                   ...project,
//                   ...updates,
//                   updatedAt: new Date().toISOString(),
//                 }
//               : project
//           ),
//         }));
//       },

//       deleteProject: (id) => {
//         set((state) => ({
//           projects: state.projects.filter((project) => project.id !== id),
//         }));
//       },

//       getProject: <T extends ProjectType>(id: string) => {
//         const project = get().projects.find(p => p.id === id);
//         return project ? project as Project<T> : undefined;
//       },

//       enableTool: (projectId, toolId) => {
//         set((state) => ({
//           projects: state.projects.map((project) =>
//             project.id === projectId
//               ? {
//                   ...project,
//                   tools: [...(project.tools || []), toolId],
//                   updatedAt: new Date().toISOString(),
//                 }
//               : project
//           ),
//         }));
//       },

//       disableTool: (projectId, toolId) => {
//         set((state) => ({
//           projects: state.projects.map((project) =>
//             project.id === projectId
//               ? {
//                   ...project,
//                   tools: (project.tools || []).filter(t => t !== toolId),
//                   updatedAt: new Date().toISOString(),
//                 }
//               : project
//           ),
//         }));
//       },

//       setProjectThumbnail: (projectId, fileId) => {
//         set((state) => ({
//           projects: state.projects.map((project) =>
//             project.id === projectId
//               ? {
//                   ...project,
//                   thumbnailFileId: fileId,
//                   updatedAt: new Date().toISOString(),
//                 }
//               : project
//           ),
//         }));
//       },

//       removeProjectThumbnail: (projectId) => {
//         set((state) => ({
//           projects: state.projects.map((project) =>
//             project.id === projectId
//               ? {
//                   ...project,
//                   thumbnailFileId: undefined,
//                   updatedAt: new Date().toISOString(),
//                 }
//               : project
//           ),
//         }));
//       },
//     }),
//     {
//       name: 'project-storage',
//     }
//   )
// );

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
import { ProjectCategory } from '@/types/ngo';

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