import { z } from 'zod';

// SCHEMAS
export const ProjectLocationSchema = z.object({
  address: z.string(),
  city: z.string(),
  country: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

export const ProjectBudgetSchema = z.object({
  allocated: z.number(),
  used: z.number(),
  total: z.number(),
  currency: z.string().length(3),
  lastUpdated: z.string().datetime(),
  breakdown: z.array(z.object({
    category: z.string(),
    amount: z.number(),
  })),
});

export enum ProjectCategory {
  EDUCATION = "education",
  HEALTH = "health",
  ENVIRONMENT = "environment",
  COMMUNITY_DEVELOPMENT = "community_development",
  EMERGENCY_RELIEF = "emergency_relief",
  OTHER = "other",
}

export enum ProjectStatus {
  PLANNED = "planned",
  ONGOING = "ongoing",
  COMPLETED = "completed",
  ON_HOLD = "on_hold",
  CANCELLED = "cancelled",
}

// CORE TYPES
export interface ProjectLocation extends z.infer<typeof ProjectLocationSchema> {}
export interface ProjectBudget extends z.infer<typeof ProjectBudgetSchema> {}

export interface ProjectMetrics {
  impactScore: number;
  volunteers: number;
  donations: number;
  socialShares: number;
  costPerBeneficiary: number;
  volunteerImpactRatio: number;
  fundingUtilization: number;
  correlationData: Array<{
    date: string;
    volunteerHours: number;
    beneficiaryOutcomes: number;
  }>;
}

export interface ProjectMedia {
  id: string;
  url: string;
  type: 'image' | 'video' | 'document';
  caption?: string;
}

export interface Beneficiary {
  type: 'individual' | 'community';
  count: number;
  description: string;
}

export interface Volunteer {
  userId: string;
  role: string;
  joinDate: string;
  skills: string[];
  availability: string[];
  trainingCompleted: boolean;
  hoursContributed: number;
}

export interface NGOProject {
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  timeline: {
    startDate: string;
    endDate?: string;
    milestones: Milestone[];
  };
  budget: ProjectBudget;
  location: ProjectLocation;
  team: Volunteer[];
  beneficiaries: Beneficiary[];
  media: ProjectMedia[];
  createdAt: string;
  updatedAt: string;
  metrics: ProjectMetrics;
}

interface Milestone {
  name: string;
  date: string;
  description: string;
  completed: boolean;
  media: ProjectMedia[];
  teamMembers: string[];
  notes?: string;
  attachments?: string[];
  dependencies?: string[];
}

export interface Donation {
  id: string;
  amount: number;
  currency: string;
  date: string;
  donor: {
    name: string;
    email: string;
    anonymous: boolean;
  };
  allocation: Array<{
    projectId: string;
    percentage: number;
  }>;
}