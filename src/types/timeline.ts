export type ProjectType = 'Feature Film' | 'Short Film' | 'TV Series' | 'Documentary' | 'Commercial' | 'Music Video';

export interface ProjectColors {
  [key: string]: {
    primary: string;
    secondary: string;
  };
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  assignee?: string;
  dueDate?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
}

// const initialTeamMembers: TeamMember[] = [
//   { 
//     id: '1', 
//     name: 'Sarah Director', 
//     role: 'Director',
//     department: 'Production', // Added required department field
//     avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
//   },
//   { 
//     id: '2', 
//     name: 'Mike Producer', 
//     role: 'Producer',
//     department: 'Production', // Added required department field
//     avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100'
//   },
//   { 
//     id: '3', 
//     name: 'Alex Writer', 
//     role: 'Lead Writer',
//     department: 'Creative', // Added required department field
//     avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
//   }
// ];

export interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  description?: string;
  subTasks: SubTask[];
  teamMembers: string[]; // Array of TeamMember IDs
  notes?: string;
  attachments?: string[];
  dependencies?: string[]; // Array of other Milestone IDs
}

export interface TimelinePhase {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'upcoming';
  startDate: string;
  endDate: string;
  milestones: Milestone[];
  color?: string;
  projectType: ProjectType;
}