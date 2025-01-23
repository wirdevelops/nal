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
} from '../app/projects/components/CreateIndex';
import { validateProject } from '../app/projects/components/projectValidation';
import { getTemplateById, type ProjectTemplate } from '../app/projects/components/projectTemplates';
import { getToolsByType, type ProjectTool } from '../app/config/projectTools';
import { getRequiredToolsForPhase } from '../app/config/projectTools';

export type ProjectType = 
  | 'feature'
  | 'series'
  | 'documentary'
  | 'commercial'
  | 'music_video'
  | 'web_series'
  | 'animation';

export type ProjectStatus = 
  | 'draft'
  | 'active'
  | 'on-hold'
  | 'completed'
  | 'archived';

export type ProjectPhase = 
  | 'Development'
  | 'Pre-Production'
  | 'Production'
  | 'Post-Production'
  | 'Distribution';

export type ProjectVisibility = 
  | 'private'
  | 'team'
  | 'public';

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

// Base project interface
interface BaseProject {
  id: string;
  title: string;
  type: ProjectType;
  description: string;
  phase: ProjectPhase;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  team: {
    members: string[];
    roles: Record<string, string>;
  };
  progress: number;
  startDate: string;
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
  primaryTool: string;
  template?: string;
  tools: string[];
  metadata: {
    tags: string[];
    category?: string;
    customFields: Record<string, any>;
  };
}

// Combined project type with type-specific data
export type Project<T extends ProjectType = ProjectType> = BaseProject & {
  typeData?: Partial<TypeSpecificData[T]>;
};

interface ProjectStore {
  projects: Project[];
  activeProject?: string;
  
  // Core project operations
  addProject: <T extends ProjectType>(
    project: Omit<Project<T>, 'id' | 'createdAt' | 'updatedAt'>
  ) => Project<T>;
  updateProject: <T extends ProjectType>(
    id: string, 
    updates: Partial<Project<T>>
  ) => void;
  deleteProject: (id: string) => void;
  
  // Project data access
  getProject: <T extends ProjectType>(id: string) => Project<T> | undefined;
  getProjectsByType: <T extends ProjectType>(type: T) => Project<T>[];
  getProjectTypeData: <T extends ProjectType>(
    project: Project,
    type: T
  ) => TypeSpecificData[T] | undefined;
  
  // Template operations
  createFromTemplate: (templateId: string, overrides?: Partial<Project>) => Project;
  
  // Project status operations
  setProjectStatus: (id: string, status: ProjectStatus) => void;
  setProjectPhase: (id: string, phase: ProjectPhase) => void;
  updateProjectProgress: (id: string, progress: number) => void;
  
  // Team operations
  addTeamMember: (projectId: string, userId: string, role?: string) => void;
  removeTeamMember: (projectId: string, userId: string) => void;
  updateTeamMemberRole: (projectId: string, userId: string, role: string) => void;
  
  // Tools and metadata operations
  enableTool: (projectId: string, toolId: string) => void;
  disableTool: (projectId: string, toolId: string) => void;
  updateMetadata: (projectId: string, metadata: Partial<Project['metadata']>) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  
  // Core project operations
  addProject: (projectData) => {
    const validatedData = validateProject(projectData.type, projectData);
    const availableTools = getToolsByType(projectData.type);
    
    const newProject: Project = {
      id: uuidv4(),
      ...projectData,
      status: projectData.status || 'draft',
      visibility: projectData.visibility || 'private',
      team: projectData.team || { members: [], roles: {} },
      tools: availableTools.flatMap(category => 
        category.tools.map(tool => tool.id)
      ),
      metadata: {
        tags: [],
        customFields: {},
        ...projectData.metadata,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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

  // Project data access
  getProject: (id) => {
    return get().projects.find((project) => project.id === id);
  },

  getProjectsByType: (type) => {
    return get().projects.filter((project) => project.type === type) as any[];
  },

  getProjectTypeData: (project, type) => {
    if (project.type !== type) return undefined;
    return project.typeData as TypeSpecificData[typeof type];
  },

  // Template operations
  createFromTemplate: (templateId, overrides = {}) => {
    const template = getTemplateById(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const projectData = {
      title: template.name,
      type: template.type,
      description: template.description,
      phase: 'Development' as ProjectPhase,
      template: templateId,
      typeData: template.defaultData,
      tools: template.tools,
      metadata: {
        tags: [],
        customFields: {},
      },
      ...overrides,
    };

    return get().addProject(projectData);
  },

  // Project status operations
  setProjectStatus: (id, status) => {
    get().updateProject(id, { status });
  },

  setProjectPhase: (id, phase) => {
    const project = get().getProject(id);
    if (!project) return;

    // Get required tools for the new phase
    const requiredTools = getRequiredToolsForPhase(project.type, phase);
    const newTools = [...new Set([
      ...project.tools,
      ...requiredTools.map(tool => tool.id)
    ])];

    get().updateProject(id, { 
      phase,
      tools: newTools,
      updatedAt: new Date().toISOString()
    });
  },

  updateProjectProgress: (id, progress) => {
    const normalizedProgress = Math.max(0, Math.min(100, progress));
    get().updateProject(id, { progress: normalizedProgress });
  },

  // Team operations
  addTeamMember: (projectId, userId, role) => {
    const project = get().getProject(projectId);
    if (!project) return;

    const updatedTeam = {
      members: [...new Set([...project.team.members, userId])],
      roles: role 
        ? { ...project.team.roles, [userId]: role }
        : project.team.roles
    };

    get().updateProject(projectId, { team: updatedTeam });
  },

  removeTeamMember: (projectId, userId) => {
    const project = get().getProject(projectId);
    if (!project) return;

    const updatedTeam = {
      members: project.team.members.filter(id => id !== userId),
      roles: { ...project.team.roles }
    };
    delete updatedTeam.roles[userId];

    get().updateProject(projectId, { team: updatedTeam });
  },

  updateTeamMemberRole: (projectId, userId, role) => {
    const project = get().getProject(projectId);
    if (!project) return;

    const updatedTeam = {
      ...project.team,
      roles: { ...project.team.roles, [userId]: role }
    };

    get().updateProject(projectId, { team: updatedTeam });
  },

  // Tools and metadata operations
  enableTool: (projectId, toolId) => {
    const project = get().getProject(projectId);
    if (!project) return;

    if (!project.tools.includes(toolId)) {
      get().updateProject(projectId, {
        tools: [...project.tools, toolId]
      });
    }
  },

  disableTool: (projectId, toolId) => {
    const project = get().getProject(projectId);
    if (!project) return;

    get().updateProject(projectId, {
      tools: project.tools.filter(id => id !== toolId)
    });
  },

  updateMetadata: (projectId, metadata) => {
    const project = get().getProject(projectId);
    if (!project) return;

    get().updateProject(projectId, {
      metadata: {
        ...project.metadata,
        ...metadata
      }
    });
  },

  // Additional utility methods
  getProjectProgress: (projectId) => {
    const project = get().getProject(projectId);
    if (!project) return 0;

    const availableTools = getToolsByType(project.type)
      .flatMap(category => category.tools);
    const totalTools = availableTools.length;
    const enabledTools = project.tools.length;

    return Math.round((enabledTools / totalTools) * 100);
  },

  getProjectPhaseHistory: (projectId) => {
    const project = get().getProject(projectId);
    if (!project) return [];

    // This would typically come from a separate history store
    // For now, we'll return a mock history
    return [{
      phase: project.phase,
      startedAt: project.createdAt,
      completedAt: null
    }];
  },

  // Persistence methods (these would typically integrate with your backend)
  persistProject: async (projectId) => {
    const project = get().getProject(projectId);
    if (!project) return;

    try {
      // Here you would typically make an API call to save the project
      console.log('Persisting project:', project);
      return true;
    } catch (error) {
      console.error('Failed to persist project:', error);
      return false;
    }
  },

  loadProject: async (projectId) => {
    try {
      // Here you would typically make an API call to load the project
      console.log('Loading project:', projectId);
      return get().getProject(projectId);
    } catch (error) {
      console.error('Failed to load project:', error);
      return undefined;
    }
  },
}));

// Export type helper
export type ProjectStoreType = ReturnType<typeof useProjectStore>;