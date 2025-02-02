import { Type, Static } from '@sinclair/typebox';
import { User } from '../user';
import { ImpactStory } from './impactStory';
import { Donation, ImpactMetric } from './donation';
import { z } from 'zod';
import { UUID_PATTERN } from '@/types/common';

// ===== Enums =====
export const ProjectCategorySchema = Type.Union([
  Type.Literal('education'),
  Type.Literal('health'),
  Type.Literal('environment'),
  Type.Literal('community_development'),
  Type.Literal('emergency_relief'),
  Type.Literal('other')
]);

export const ProjectStatusSchema = Type.Union([
  Type.Literal('planned'),
  Type.Literal('ongoing'),
  Type.Literal('completed'),
  Type.Literal('on_hold'),
  Type.Literal('cancelled')
]);

// ===== Core Types =====
export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Budget {
  allocated: number;
  total: number;
  amount: number;
  currency: string;
  details?: string;
  used?: number;
}

export interface ProjectMedia {
  id: string;
  url: string;
  type: 'image' | 'video' | 'document';
  caption?: string;
}

// ===== Derived Types =====
export type ProjectCategory = Static<typeof ProjectCategorySchema>;
export type ProjectStatus = Static<typeof ProjectStatusSchema>;

// In your types
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

export const MilestoneSchema = Type.Object({
  id: Type.RegExp(UUID_PATTERN),
  name: Type.String(),
  date: Type.String({ format: 'date-time'}),
  description: Type.String(),
  completed: Type.Boolean(),
  media: Type.Array(Type.Object({
    id: Type.RegExp(UUID_PATTERN),
      url: Type.String(),
      type: Type.Union([
          Type.Literal('image'),
        Type.Literal('video'),
        Type.Literal('document'),
      ]),
    caption: Type.Optional(Type.String()),
  })),
  teamMembers: Type.Array(Type.String()),
  notes: Type.Optional(Type.String()),
  attachments: Type.Optional(Type.Array(Type.String())),
  dependencies: Type.Optional(Type.Array(Type.String()))
})

export type Milestone = Static<typeof MilestoneSchema>;

export interface Update {
  id: string;
  date: string; // ISO Date String
  content: string;
  media?: Media[];
  authorId: string;
}

export interface Media {
  type: MediaType;
  url: string;
  caption?: string;
  altText?: string;
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

export interface Report {
  id: string;
  title: string;
  date: string; // ISO Date String
  authorId: string;
  url: string;
  type: string;
}

export interface TeamMember {
  userId: string;
  name: string;
  role: string; // Example: Project Manager, Field Coordinator
  avatar?: string;
  department?: string;
  joinDate: string;
  hoursContributed: number;
  trainingCompleted: boolean;
}

export interface Beneficiary {
  type: 'individual' | 'community';
  count: number;
  description: string;
  id: string;
  name: string;
  demographic?: string; // E.g., age range, location
  details?: string;
}

export interface NGOProject {
  donations: Donation[];
  url: string;
  metrics: ProjectMetrics;
  impactStories: ImpactStory[];
  media: ProjectMedia[];
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  startDate: string; // ISO Date String
  endDate?: string;  // ISO Date String
  location: Location;
  budget: Budget;
  team: TeamMember[];
  beneficiaries: Beneficiary[];
  milestones: Milestone[];
  gallery: Media[];
  updates: Update[];
  reports: Report[];
  impact: ImpactMetric[];
  createdAt: string;  // ISO Date String
  updatedAt: string;  // ISO Date String
  duration: number;
  donors: User[];
    timeline: {
        startDate: string;
        endDate?: string;
        milestones: Milestone[];
        media: ProjectMedia[];
    };
}

export const PROJECT_CATEGORIES = [
  'education',
  'health',
  'environment',
  'community_development',
  'emergency_relief',
  'other'
] as const;

export const CreateProjectSchema = z.object({
  name: z.string().min(3, { message: "Project name must be at least 3 characters." }),
  category: z.enum(PROJECT_CATEGORIES),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
});

export type CreateProjectSchemaType = z.infer<typeof CreateProjectSchema>;