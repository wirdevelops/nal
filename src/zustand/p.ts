import { create } from 'zustand'

export interface ProjectMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  email: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignees: string[];
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'on-hold';
  budget: {
    planned: number;
    actual: number;
  };
  members: ProjectMember[];
  tasks: ProjectTask[];
  milestones: Milestone[];
}

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  addProjectMember: (projectId: string, member: ProjectMember) => void;
  removeProjectMember: (projectId: string, memberId: string) => void;
  updateProjectMember: (projectId: string, memberId: string, updates: Partial<ProjectMember>) => void;
}

// export const useProjectStore = create<ProjectStore>((set) => ({
//   projects: [],
//   currentProject: null,
//   setCurrentProject: (project) => set({ currentProject: project }),
//   addProject: (project) => 
//     set((state) => ({ projects: [...state.projects, project] })),
//   updateProject: (projectId, updates) =>
//     set((state) => ({
//       projects: state.projects.map((p) =>
//         p.id === projectId ? { ...p, ...updates } : p
//       ),
//       currentProject: state.currentProject?.id === projectId 
//         ? { ...state.currentProject, ...updates }
//         : state.currentProject
//     })),
//   addProjectMember: (projectId, member) =>
//     set((state) => ({
//       projects: state.projects.map((p) =>
//         p.id === projectId
//           ? { ...p, members: [...p.members, member] }
//           : p
//       ),
//       currentProject: state.currentProject?.id === projectId
//         ? { ...state.currentProject, members: [...state.currentProject.members, member] }
//         : state.currentProject
//     })),
//   removeProjectMember: (projectId, memberId) =>
//     set((state) => ({
//       projects: state.projects.map((p) =>
//         p.id === projectId
//           ? { ...p, members: p.members.filter((m) => m.id !== memberId) }
//           : p
//       ),
//       currentProject: state.currentProject?.id === projectId
//         ? { ...state.currentProject, members: state.currentProject.members.filter((m) => m.id !== memberId) }
//         : state.currentProject
//     })),
//   updateProjectMember: (projectId, memberId, updates) =>
//     set((state) => ({
//       projects: state.projects.map((p) =>
//         p.id === projectId
//           ? {
//               ...p,
//               members: p.members.map((m) =>
//                 m.id === memberId ? { ...m, ...updates } : m
//               ),
//             }
//           : p
//       ),
//       currentProject: state.currentProject?.id === projectId
//         ? {
//             ...state.currentProject,
//             members: state.currentProject.members.map((m) =>
//               m.id === memberId ? { ...m, ...updates } : m
//             ),
//           }
//         : state.currentProject
//     })),
// }));


import { v4 as uuidv4 } from 'uuid';

// Helper function to generate a random date within the next year
const getRandomDate = () => {
    const now = new Date();
    const future = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    const randomTime = now.getTime() + Math.random() * (future.getTime() - now.getTime());
    return new Date(randomTime).toISOString().split('T')[0];
  };

  const getRandomStatus = () => {
      const statuses = ['active', 'completed', 'on-hold'];
      return statuses[Math.floor(Math.random() * statuses.length)];
  }

const dummyProjectMembers: ProjectMember[] = [
  {
    id: uuidv4(),
    name: "John Doe",
    role: "Developer",
    email: "john.doe@example.com",
    avatar: "https://placekitten.com/50/50",
  },
    {
        id: uuidv4(),
        name: "Jane Smith",
        role: "Designer",
        email: "jane.smith@example.com",
        avatar: "https://placekitten.com/50/51",
    },
    {
        id: uuidv4(),
        name: "Alice Brown",
        role: "Project Manager",
        email: "alice.brown@example.com",
        avatar: "https://placekitten.com/50/52",
    }
];

const dummyProjectTasks: ProjectTask[] = [
  {
    id: uuidv4(),
    title: "Design mockups",
    status: "todo",
    assignees: [dummyProjectMembers[1].id],
    dueDate: getRandomDate(),
    priority: "high",
  },
  {
    id: uuidv4(),
    title: "Develop API",
    status: "in-progress",
    assignees: [dummyProjectMembers[0].id],
      dueDate: getRandomDate(),
    priority: "medium",
  },
  {
    id: uuidv4(),
    title: "Test application",
    status: "completed",
    assignees: [dummyProjectMembers[0].id, dummyProjectMembers[1].id],
      dueDate: getRandomDate(),
    priority: "low",
  },
];

const dummyMilestones: Milestone[] = [
  {
    id: uuidv4(),
    title: "Initial Design",
      dueDate: getRandomDate(),
    description: "Complete the initial design mockups",
    status: "completed",
  },
    {
        id: uuidv4(),
        title: "API Implementation",
        dueDate: getRandomDate(),
        description: "Implement all API endpoints",
        status: "in-progress",
    },
    {
        id: uuidv4(),
        title: "User Acceptance Testing",
        dueDate: getRandomDate(),
        description: "Conduct user testing before launch",
        status: "pending",
    },
];

const dummyProjects: Project[] = [
  {
    id: uuidv4(),
    name: "E-commerce Platform",
    description: "Build a complete e-commerce platform.",
    type: "Web Application",
    startDate: "2024-01-15",
      endDate: getRandomDate(),
    status: getRandomStatus(),
    budget: { planned: 50000, actual: 45000 },
    members: dummyProjectMembers,
    tasks: dummyProjectTasks,
    milestones: dummyMilestones,
  },
    {
        id: uuidv4(),
        name: "Mobile Game Development",
        description: "Develop an engaging mobile game.",
        type: "Mobile App",
        startDate: "2024-02-01",
        endDate: getRandomDate(),
        status: getRandomStatus(),
        budget: { planned: 75000, actual: 80000 },
        members: [dummyProjectMembers[0], dummyProjectMembers[2]],
        tasks: [dummyProjectTasks[0], dummyProjectTasks[1]],
        milestones: [dummyMilestones[0], dummyMilestones[1]],
    },
    {
        id: uuidv4(),
        name: "Internal Tool Development",
        description: "Create a tool to improve team efficiency.",
        type: "Web Tool",
        startDate: "2024-03-01",
        endDate: getRandomDate(),
        status: getRandomStatus(),
        budget: { planned: 30000, actual: 28000 },
        members: [dummyProjectMembers[1], dummyProjectMembers[2]],
        tasks: [dummyProjectTasks[2]],
        milestones: [dummyMilestones[2]],
    }
];

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: dummyProjects, // Load dummy data here
  currentProject: null,
   setCurrentProject: (project) => set({ currentProject: project }),
addProject: (project) => 
  set((state) => ({ projects: [...state.projects, project] })),
updateProject: (projectId, updates) =>
  set((state) => ({
    projects: state.projects.map((p) =>
      p.id === projectId ? { ...p, ...updates } : p
    ),
    currentProject: state.currentProject?.id === projectId 
      ? { ...state.currentProject, ...updates }
      : state.currentProject
  })),
addProjectMember: (projectId, member) =>
  set((state) => ({
    projects: state.projects.map((p) =>
      p.id === projectId
        ? { ...p, members: [...p.members, member] }
        : p
    ),
    currentProject: state.currentProject?.id === projectId
      ? { ...state.currentProject, members: [...state.currentProject.members, member] }
      : state.currentProject
  })),
removeProjectMember: (projectId, memberId) =>
  set((state) => ({
    projects: state.projects.map((p) =>
      p.id === projectId
        ? { ...p, members: p.members.filter((m) => m.id !== memberId) }
        : p
    ),
    currentProject: state.currentProject?.id === projectId
      ? { ...state.currentProject, members: state.currentProject.members.filter((m) => m.id !== memberId) }
      : state.currentProject
  })),
updateProjectMember: (projectId, memberId, updates) =>
  set((state) => ({
    projects: state.projects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            members: p.members.map((m) =>
              m.id === memberId ? { ...m, ...updates } : m
            ),
          }
        : p
    ),
    currentProject: state.currentProject?.id === projectId
      ? {
          ...state.currentProject,
          members: state.currentProject.members.map((m) =>
            m.id === memberId ? { ...m, ...updates } : m
          ),
        }
      : state.currentProject
  })),
}));