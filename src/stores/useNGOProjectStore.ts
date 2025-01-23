// stores/useNGOProjectStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import {
  NGOProject,
  Milestone,
  Budget,
  Update,
  Report,
  ProjectStatus,
  Beneficiary,
  Volunteer,
  ProjectMedia,
   ProjectLocation,
  ProjectBudgetSchema,
  ProjectLocationSchema,
  TeamMember, 
  
} from '@/types/ngo';

interface NGOProjectState {
  projects: NGOProject[];
  loading: boolean;
  error: string | null;
}

interface NGOProjectActions {
  // Core CRUD
  createProject: (data: Omit<NGOProject, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>) => void;
  updateProject: (id: string, updates: Partial<NGOProject>) => void;
  deleteProject: (id: string) => void;
  
  // Project Components
  addMilestone: (projectId: string, milestone: Omit<Milestone, 'id'>) => void;
  updateBudget: (projectId: string, budgetUpdates: Partial<Budget>) => void;
  addUpdate: (projectId: string, update: Omit<Update, 'id'>) => void;
  addReport: (projectId: string, report: Omit<Report, 'id'>) => void;

  // Media Management
  addProjectMedia: (projectId: string, media: Omit<ProjectMedia, 'id'>) => void;
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
  calculateMetrics: () => Record<string, number>;
  getProjectMetrics: (projectId: string) => NGOProject['metrics'];
  
  // Queries
  getProjectById: (id: string) => NGOProject | undefined;
  getProjectsByStatus: (status: ProjectStatus) => NGOProject[];
  getProjectsByLocation: (location: Partial<ProjectLocation>) => NGOProject[];

  // Async Operations
  fetchProjects: () => Promise<void>;
}

export const useNGOProjectStore = create<NGOProjectState & NGOProjectActions>()(
  persist(
    (set, get) => ({
      projects: [],
      loading: false,
      error: null,

      // Core CRUD
      createProject: (data) => {
        try {
          ProjectBudgetSchema.parse(data.budget);
          ProjectLocationSchema.parse(data.location);

          const newProject: NGOProject = {
            ...data,
            id: uuidv4(),
            media: [],
            milestones: [],
            updates: [],
            reports: [],
            beneficiaries: data.beneficiaries || [],
            team: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metrics: {
              impactScore: 0,
              volunteers: 0,
              donations: 0,
              socialShares: 0,
              costPerBeneficiary: 0,
              volunteerImpactRatio: 0,
              fundingUtilization: 0,
              correlationData: [],
            },
          };

          set((state) => ({ projects: [...state.projects, newProject] }));
        } catch (err) {
          if (err instanceof z.ZodError) {
            set({ error: 'Invalid project data: ' + err.errors[0].message });
          }
        }
      },

      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(project =>
          project.id === id ? {
            ...project,
            ...updates,
            updatedAt: new Date().toISOString()
          } : project
        )
      })),

      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(project => project.id !== id)
      })),

      // Project Components
      addMilestone: (projectId, milestone) => set(state => ({
        projects: state.projects.map(p => p.id === projectId ? {
          ...p,
          milestones: [...p.milestones, {
            ...milestone,
            id: uuidv4(),
            createdAt: new Date().toISOString()
          }]
        } : p)
      })),

      updateBudget: (projectId, budgetUpdates) => set(state => ({
        projects: state.projects.map(p => p.id === projectId ? {
          ...p,
          budget: {
            ...p.budget,
            ...budgetUpdates,
            updatedAt: new Date().toISOString()
          }
        } : p)
      })),

      addUpdate: (projectId, update) => set(state => ({
        projects: state.projects.map(p => p.id === projectId ? {
          ...p,
          updates: [...p.updates, {
            ...update,
            id: uuidv4(),
            createdAt: new Date().toISOString()
          }]
        } : p)
      })),

      addReport: (projectId, report) => set(state => ({
        projects: state.projects.map(p => p.id === projectId ? {
          ...p,
          reports: [...p.reports, {
            ...report,
            id: uuidv4(),
            createdAt: new Date().toISOString()
          }]
        } : p)
      })),

      // Async Operations
      fetchProjects: async () => {
        set({ loading: true, error: null });
        try {
          // Simulated API call
          // const response = await fetch('/api/projects');
          // const data = await response.json();
          // set({ projects: data });
          set({ loading: false });
        } catch (err) {
          set({ error: 'Failed to load projects', loading: false });
        }
      },

      // Media Management
      addProjectMedia: (projectId, media) => {
        const newMedia: ProjectMedia = {
          ...media,
          id: uuidv4(),
        };
        
        set(state => ({
          projects: state.projects.map(p => p.id === projectId ? {
            ...p,
          } : p)
        }));
      },
      
      removeProjectMedia: (projectId, mediaId) => set(state => ({
        projects: state.projects.map(p => p.id === projectId ? {
          ...p,
          media: (p.media || []).filter(m => m.id !== mediaId)
        } : p)
      })),

      // Beneficiary Management
      updateBeneficiaryCount: (projectId, newCount) => set(state => ({
        projects: state.projects.map(p => p.id === projectId ? {
          ...p,
          beneficiaries: (p.beneficiaries || []).map(b => ({
            ...b,
            count: newCount
          }))
        } : p)
      })),

      // Volunteer Management
      addVolunteer: (projectId, volunteer) => set(state => ({
        projects: state.projects.map(p => p.id === projectId ? {
          ...p,
          team: [...(p.team || []), {
            ...volunteer,
            userId: uuidv4(),
            joinDate: new Date().toISOString(),
            hoursContributed: 0
          }]
        } : p)
      })),

      updateVolunteerHours: (projectId, userId, hours) => set(state => ({
        projects: state.projects.map(p => p.id === projectId ? {
          ...p,
          team: (p.team || []).map(v => v.userId === userId ? {
            ...v,
            hoursContributed: hours
          } : v)
        } : p)
      })),

      // Metrics
      calculateMetrics: () => {
        const projects = get().projects;
        return {
          totalProjects: projects.length,
          totalBudget: projects.reduce((sum, p) => sum + p.budget.total, 0),
          activeProjects: projects.filter(p => p.status === 'ongoing').length,
          totalBeneficiaries: projects.reduce((sum, p) => sum + 
            (p.beneficiaries || []).reduce((bSum, b) => bSum + b.count, 0), 0),
          completionRate: projects.length > 0 ? 
            (projects.filter(p => p.status === 'completed').length / projects.length) * 100 : 0,
        };
      },

      getProjectMetrics: (projectId) => {
        const project = get().projects.find(p => p.id === projectId);
        if (!project) throw new Error('Project not found');
        
        const totalBeneficiaries = (project.beneficiaries || []).reduce((sum, b) => sum + b.count, 0);
        
        return {
          ...project.metrics,
          costPerBeneficiary: totalBeneficiaries > 0 
            ? project.budget.used / totalBeneficiaries 
            : 0,
          volunteerImpactRatio: totalBeneficiaries > 0 
            ? (project.metrics.volunteers || 0) / totalBeneficiaries 
            : 0,
          fundingUtilization: project.budget.total > 0 
            ? (project.budget.used / project.budget.total) * 100 
            : 0
        };
      },

      // Queries
      getProjectById: (id) => get().projects.find(p => p.id === id),
      getProjectsByStatus: (status) => get().projects.filter(p => p.status === status),
      getProjectsByLocation: (location) => get().projects.filter(p =>
        (!location.country || p.location.country === location.country) &&
        (!location.city || p.location.city === location.city)
      ),
    }),
    {
      name: 'ngo-projects-storage',
      version: 2,
      migrate: (persistedState: any, version) => {
        // Migration from version <2 to 2
        if (version < 2) {
          return {
            ...persistedState,
            projects: (persistedState.projects || []).map((p: any) => ({
              ...p,
              media: p.media || [],
              milestones: p.milestones || [],
              updates: p.updates || [],
              reports: p.reports || [],
              beneficiaries: p.beneficiaries || [],
              team: p.team || [],
              metrics: p.metrics || {
                impactScore: 0,
                volunteers: 0,
                donations: 0,
                socialShares: 0,
                costPerBeneficiary: 0,
                volunteerImpactRatio: 0,
                fundingUtilization: 0,
                correlationData: []
              }
            }))
          };
        }
        return persistedState;
      }
    }
  )
);

// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { v4 as uuidv4 } from 'uuid';
// import {
//   NGOProject,
//   ProjectCategory,
//   ProjectStatus,
//   Milestone,
//   Budget,
//   Update,
//   Report
// } from '../types/ngo';


// interface NGOProjectState {
//   projects: NGOProject[];
//   isLoading: boolean;
//   error: string | null;

//   addProject: (project: Omit<NGOProject, 'id' | 'createdAt' | 'updatedAt'>) => void;
//   updateProject: (id: string, updates: Partial<NGOProject>) => void;
//   deleteProject: (id: string) => void;
//   addMilestone: (projectId: string, milestone: Omit<Milestone, 'id'>) => void;
//   updateMilestone: (projectId: string, milestoneId: string, updates: Partial<Milestone>) => void;
//     addUpdate: (projectId: string, update: { content: string; author: string }) => void;
//   addReport: (projectId: string, report: { title: string; url: string }) => void;
//   updateBudget: (projectId: string, updates: Partial<Budget>) => void;
// }

// export const useNGOProjectStore = create<NGOProjectState>()(
//   persist(
//     (set) => ({
//       projects: [],
//       isLoading: false,
//       error: null,

//       addProject: (projectData) => {
//         const newProject: NGOProject = {
//           id: uuidv4(),
//           ...projectData,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         };

//         set((state) => ({
//           projects: [...state.projects, newProject],
//         }));
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

//       addMilestone: (projectId, milestone) => {
//         set((state) => ({
//           projects: state.projects.map((project) =>
//             project.id === projectId
//               ? {
//                   ...project,
//                   milestones: [
//                     ...project.milestones,
//                     { ...milestone, id: uuidv4() },
//                   ],
//                   updatedAt: new Date().toISOString(),
//                 }
//               : project
//           ),
//         }));
//       },

//       updateMilestone: (projectId, milestoneId, updates) => {
//         set((state) => ({
//           projects: state.projects.map((project) =>
//             project.id === projectId
//               ? {
//                   ...project,
//                   milestones: project.milestones.map((milestone) =>
//                     milestone.id === milestoneId
//                       ? { ...milestone, ...updates }
//                       : milestone
//                   ),
//                   updatedAt: new Date().toISOString(),
//                 }
//               : project
//           ),
//         }));
//       },
//   addUpdate: (projectId, update) => {
//         set((state) => ({
//           projects: state.projects.map((project) =>
//             project.id === projectId
//               ? {
//                   ...project,
//                   updates: [
//                     ...project.updates,
//                     {
//                       id: uuidv4(),
//                       date: new Date().toISOString(),
//                       ...update,
//                       authorId: "default-author" // Or get the actual authorId
//                     } as Update,
//                   ],
//                   updatedAt: new Date().toISOString(),
//                 }
//               : project
//           ),
//         }));
//       },

//        addReport: (projectId, report) => {
//         set((state) => ({
//           projects: state.projects.map((project) =>
//             project.id === projectId
//               ? {
//                   ...project,
//                   reports: [
//                     ...project.reports,
//                     {
//                       id: uuidv4(),
//                       date: new Date().toISOString(),
//                       ...report,
//                       authorId: "default-author", // Or get actual authorId
//                       type: "default-type" // Or get the actual type
//                     } as Report
//                   ],
//                   updatedAt: new Date().toISOString(),
//                 }
//               : project
//           ),
//         }));
//       },
//       updateBudget: (projectId, updates) => {
//         set((state) => ({
//           projects: state.projects.map((project) =>
//             project.id === projectId
//               ? {
//                   ...project,
//                   budget: { ...project.budget, ...updates },
//                   updatedAt: new Date().toISOString(),
//                 }
//               : project
//           ),
//         }));
//       },
//     }),
//     {
//       name: 'ngo-projects-storage',
//     }
//   )
// );