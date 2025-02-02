import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Value } from '@sinclair/typebox/value';
import type {
  NGOProject,
  ProjectCategory,
  ProjectStatus,
  Location,
  Budget,
  Milestone,
  Update,
  Report,
  ProjectMedia,
  TeamMember,
  ProjectMetrics,
  MediaType
} from '@/types/ngo/project';
import { NGO_PROJECT_SCHEMA } from '@/types/ngo/schemas';

interface ProjectState {
  projects: NGOProject[];
  isLoading: boolean;
  error: string | null;
}

interface NGOProjectActions {
  // Core CRUD
  initializeProject: (baseData: { name: string; category: ProjectCategory }) => NGOProject;
  createProject: (data: Omit<NGOProject, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>) => void;
  updateProject: (id: string, updates: Partial<NGOProject>) => void;
  deleteProject: (id: string) => void;
  
  // Project Components
  addMilestone: (projectId: string, milestone: Omit<Milestone, 'id'>) => void;
  updateBudget: (projectId: string, budgetUpdates: Partial<Budget>) => void;
  addUpdate: (projectId: string, update: Omit<Update, 'id'>) => void;
  addReport: (projectId: string, report: Omit<Report, 'id'>) => void;

  // Media Management
  addProjectMedia: (projectId: string, media: File[]) => void;
  removeProjectMedia: (projectId: string, mediaId: string) => void;
  
  // Beneficiary Management
  updateBeneficiaryCount: (projectId: string, newCount: number) => void;
  
  // Volunteer Management
  addVolunteer: (
    projectId: string, 
    volunteer: Omit<TeamMember, 'userId' | 'joinDate' | 'hoursContributed'>
  ) => void;
  updateVolunteerHours: (projectId: string, userId: string, hours: number) => void;
  
  // Metrics
  calculateMetrics: () => ProjectMetrics;
  getProjectMetrics: (projectId: string) => NGOProject['metrics'];
  
  // Queries
  getProjectById: (id: string) => NGOProject | undefined;
  getProjectsByStatus: (status: ProjectStatus) => NGOProject[];
  getProjectsByLocation: (location: Partial<Location>) => NGOProject[];

  // Async Operations
  fetchProjects: () => Promise<void>;

  getUpcomingEvents: () => {
      id: string;
      title: string;
      date: string;
      projectId: string;
      projectName: string;
      location: string;
      description: string;
    }[];
}

const DEFAULT_METRICS = {
  impactScore: 0,
  volunteers: 0,
  donations: 0,
  socialShares: 0,
  costPerBeneficiary: 0,
  volunteerImpactRatio: 0,
  fundingUtilization: 0,
  correlationData: []
};

export const useNGOProjectStore = create<ProjectState & NGOProjectActions>()(
  persist(
    (set, get) => ({
      projects: [],
      isLoading: false,
      error: null,

initializeProject: (baseData) => ({
  id: uuidv4(),
  ...baseData,
  // Add missing properties
  url: '',
  impactStories: [],
  media: [],
  // Rest of the existing properties
  status: 'planned',
  description: '',
  startDate: new Date().toISOString(),
  endDate: undefined,
  location: {} as Location,
  budget: {
    allocated: 0,
    total: 0,
    amount: 0,
    currency: 'USD',
    used: 0
  },
  team: [],
  beneficiaries: [],
  milestones: [],
  gallery: [],
  updates: [],
  reports: [],
  impact: [],
  metrics: DEFAULT_METRICS,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  duration: 0,
  donors: [],
  donations: [], // Add this line
  timeline: {
    startDate: new Date().toISOString(),
    milestones: [],
    media: []
  }
}),

createProject: (projectData) => {
  try {
    const baseProject = get().initializeProject(projectData);
    const fullProject = {
      ...baseProject,
      ...projectData,
      // Ensure media types are properly set
      media: projectData.media?.map(m => ({
        ...m,
        type: m.type as MediaType
      })) || []
    };
    
    if (!Value.Check(NGO_PROJECT_SCHEMA, fullProject)) {
      throw new Error('Invalid project data');
    }

    set(state => ({
      projects: [...state.projects, fullProject],
      error: null
    }));
  } catch (error) {
    set({ error: error instanceof Error ? error.message : 'Invalid project data' });
  }
},

updateProject: (id, updates) => {
  set(state => ({
    projects: state.projects.map(project => {
      if (project.id === id) {
        const updated = Value.Encode(NGO_PROJECT_SCHEMA, { 
          ...project, 
          ...updates,
          updatedAt: new Date().toISOString()
        });
        
        // Add type assertion and missing properties
        return {
          ...(updated as unknown as NGOProject),
          // Ensure required properties are maintained
          metrics: updates.metrics || project.metrics,
          timeline: updates.timeline || project.timeline
        };
      }
      return project;
    })
  }));
},

    deleteProject: (id) => {
      set(state => ({
        projects: state.projects.filter(project => project.id !== id)
      }));
    },

    // Project Components
    addMilestone: (projectId, milestone) => {
      set(state => ({
        projects: state.projects.map(project => {
          if (project.id === projectId) {
            const newMilestone = {
              ...milestone,
              id: uuidv4(),
              status: 'planned'
            };
            return {
              ...project,
              milestones: [...project.milestones, newMilestone],
              updatedAt: new Date().toISOString()
            };
          }
          return project;
        })
      }));
    },

    updateBudget: (projectId, budgetUpdates) => {
      set(state => ({
        projects: state.projects.map(project => {
          if (project.id === projectId) {
            return {
              ...project,
              budget: { ...project.budget, ...budgetUpdates },
              updatedAt: new Date().toISOString()
            };
          }
          return project;
        })
      }));
    },

    addUpdate: (projectId, update) => {
      set(state => ({
        projects: state.projects.map(project => {
          if (project.id === projectId) {
            const newUpdate = {
              ...update,
              id: uuidv4(),
              date: new Date().toISOString()
            };
            return {
              ...project,
              updates: [...project.updates, newUpdate],
              updatedAt: new Date().toISOString()
            };
          }
          return project;
        })
      }));
    },

    addReport: (projectId, report) => {
      set(state => ({
        projects: state.projects.map(project => {
          if (project.id === projectId) {
            const newReport = {
              ...report,
              id: uuidv4(),
              date: new Date().toISOString()
            };
            return {
              ...project,
              reports: [...project.reports, newReport],
              updatedAt: new Date().toISOString()
            };
          }
          return project;
        })
      }));
    },

    // Update in useNGOProjectStore.ts
    addProjectMedia: (projectId: string, files: File[]) => {
      set(state => ({
        projects: state.projects.map(project => 
          project.id === projectId 
            ? {
                ...project,
                media: [
                  ...project.media,
                  ...files.map(file => ({
                    id: uuidv4(),
                    url: URL.createObjectURL(file),
                    type: file.type.startsWith('image/') ? 'image' :
                          file.type.startsWith('video/') ? 'video' : 'document',
                    caption: ''
                  })) as ProjectMedia[]
                ]
              }
            : project
        )
      }));
    },

    removeProjectMedia: (projectId, mediaId) => {
      set(state => ({
        projects: state.projects.map(project => {
          if (project.id === projectId) {
            return {
              ...project,
              gallery: project.gallery.filter(media => media.url !== mediaId),
              updatedAt: new Date().toISOString()
            };
          }
          return project;
        })
      }));
    },

    // Beneficiary Management
    updateBeneficiaryCount: (projectId, newCount) => {
      set(state => ({
        projects: state.projects.map(project => {
          if (project.id === projectId) {
            return {
              ...project,
              beneficiaries: project.beneficiaries.map(b => ({
                ...b,
                count: newCount
              })),
              updatedAt: new Date().toISOString()
            };
          }
          return project;
        })
      }));
    },

    // Volunteer Management
    addVolunteer: (projectId, volunteer) => {
      set(state => ({
        projects: state.projects.map(project => {
          if (project.id === projectId) {
            const newVolunteer: TeamMember = {
              ...volunteer,
              userId: uuidv4(),
              joinDate: new Date().toISOString(),
              hoursContributed: 0
            };
            return {
              ...project,
              team: [...project.team, newVolunteer],
              updatedAt: new Date().toISOString()
            };
          }
          return project;
        })
      }));
    },

    updateVolunteerHours: (projectId, userId, hours) => {
      set(state => ({
        projects: state.projects.map(project => {
          if (project.id === projectId) {
            return {
              ...project,
              team: project.team.map(member => 
                member.userId === userId
                  ? { ...member, hoursContributed: hours }
                  : member
              ),
              updatedAt: new Date().toISOString()
            };
          }
          return project;
        })
      }));
    },

    // Metrics
    // Metrics Calculations
calculateMetrics: (): ProjectMetrics => {
  const projects = get().projects;
  const totals = projects.reduce((acc, project) => {
    const beneficiaries = project.beneficiaries.reduce((sum, b) => sum + b.count, 0);
    return {
      totalImpact: acc.totalImpact + project.metrics.impactScore,
      totalVolunteers: acc.totalVolunteers + project.metrics.volunteers,
      totalDonations: acc.totalDonations + project.metrics.donations,
      totalSocialShares: acc.totalSocialShares + project.metrics.socialShares,
      totalAllocated: acc.totalAllocated + project.budget.allocated,
      totalBeneficiaries: acc.totalBeneficiaries + beneficiaries,
      totalVolunteerHours: acc.totalVolunteerHours + project.metrics.volunteerImpactRatio,
      totalFundingUsed: acc.totalFundingUsed + (project.budget.used || 0),
      correlationData: [...acc.correlationData, ...project.metrics.correlationData]
    };
  }, {
    totalImpact: 0,
    totalVolunteers: 0,
    totalDonations: 0,
    totalSocialShares: 0,
    totalAllocated: 0,
    totalBeneficiaries: 0,
    totalVolunteerHours: 0,
    totalFundingUsed: 0,
    correlationData: [] as ProjectMetrics['correlationData']
  });

  return {
    impactScore: totals.totalImpact,
    volunteers: totals.totalVolunteers,
    donations: totals.totalDonations,
    socialShares: totals.totalSocialShares,
    costPerBeneficiary: totals.totalBeneficiaries > 0 
      ? totals.totalAllocated / totals.totalBeneficiaries 
      : 0,
    volunteerImpactRatio: totals.totalVolunteerHours > 0 
      ? totals.totalImpact / totals.totalVolunteerHours 
      : 0,
    fundingUtilization: totals.totalAllocated > 0 
      ? (totals.totalFundingUsed / totals.totalAllocated) * 100 
      : 0,
    correlationData: totals.correlationData
  };
},

getProjectMetrics: (projectId) => {
  const project = get().projects.find(p => p.id === projectId);
  return project?.metrics || DEFAULT_METRICS;
},

// Query Methods
getProjectById: (id) => {
  return get().projects.find(project => project.id === id);
},

getProjectsByStatus: (status) => {
  return get().projects.filter(project => project.status === status);
},

    getProjectsByLocation: (location) => {
      return get().projects.filter(project => 
        Object.entries(location).every(([key, value]) => 
          project.location[key as keyof Location] === value
        )
      );
    },

    // Async Operations
    fetchProjects: async () => {
      set({ isLoading: true });
      try {
        // Simulated API call
        const response = await fetch('/api/projects');
        const data = await response.json();
        set({ projects: data, isLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch projects',
          isLoading: false 
        });
      }
    },
    
    getUpcomingEvents: () => {
        const now = new Date();
        return get().projects.flatMap(project => 
        project.timeline.milestones
            .filter(m => !m.completed && new Date(m.date) > now)
            .map(milestone => ({
            id: milestone.id,
            title: `${project.name}: ${milestone.name}`,
            date: milestone.date,
            projectId: project.id,
            projectName: project.name,
            location: `${project.location.city}, ${project.location.country}`,
            description: milestone.description
            }))
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }
      }),
      {
        name: 'ngo-projects',
        partialize: (state) => ({ projects: state.projects })
      }
    )
  );