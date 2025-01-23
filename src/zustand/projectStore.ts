import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

interface ProjectMember {
    id: string;
    name: string;
    role: string;
    avatar?: string;
}
interface Project {
    id: string;
    name: string;
    description: string;
    type: string;
    startDate: string;
    endDate: string;
    status: string;
    members: ProjectMember[];
    createdAt?: string;
    updatedAt?: string;
}

interface ProjectStore {
    projects: Project[];
    createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateProject: (id: string, updatedProject: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    getProject: (id: string) => Project | undefined;
    addProjectMember: (projectId: string, member: Omit<ProjectMember, 'id'>) => void
    removeProjectMember: (projectId: string, memberId: string) => void
    updateProjectMember: (projectId: string, memberId: string, updateMember: Partial<ProjectMember>) => void
}

const useProjectStore = create<ProjectStore>((set, get) => ({
    projects: [],
    createProject: (project) => {
        const newProject: Project = {
            ...project,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        set((state) => ({ projects: [...state.projects, newProject] }));
    },
    updateProject: (id, updatedProject) => {
        set((state) => ({
            projects: state.projects.map((project) =>
                project.id === id ? {...project, ...updatedProject, updatedAt: new Date().toISOString() } : project
            )
        }));
    },
    deleteProject: (id) => {
        set((state) => ({
            projects: state.projects.filter((project) => project.id !== id)
        }));
    },
    getProject: (id) => get().projects.find((project) => project.id === id),
    addProjectMember: (projectId, member) => {
        set((state) => ({
            projects: state.projects.map((project) =>
                project.id === projectId ? {
                    ...project,
                    members: [...project.members, {id: uuidv4(), ...member}]
                    } : project
            )
        }))
    },
    removeProjectMember: (projectId, memberId) => {
        set((state) => ({
            projects: state.projects.map(project =>
                project.id === projectId ? {
                    ...project,
                    members: project.members.filter(member => member.id !== memberId)
                    } : project
            )
        }))
    },
    updateProjectMember: (projectId, memberId, updateMember) => {
         set((state) => ({
            projects: state.projects.map(project =>
                project.id === projectId ? {
                    ...project,
                    members: project.members.map(member => member.id === memberId ? {...member, ...updateMember}: member)
                } : project
            )
        }))
    },
}));

export default useProjectStore;