// types/volunteer.ts
import { Type, Static } from '@sinclair/typebox';
import { UUID_PATTERN } from '@/types/common';

export enum BackgroundCheck {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    IN_PROGRESS = "in_progress"
}

export enum Skill {
  TEACHING = "teaching",
  ORGANIZATION = "organization",
  LEADERSHIP = "leadership",
  MEDICAL = "medical",
  LANGUAGE = "language",
  ART_DESIGN = "art_design",
    FILMING = "filming",
    EDITING = "editing",
    PROJECT_MANAGEMENT = "project_management",
    FUNDRAISING = "fundraising",
    COMMUNITY_OUTREACH = "community_outreach",
    DATA_ANALYSIS = "data_analysis",
    VOLUNTEER_COORDINATION = "volunteer_coordination",
    MARKETING_COMMUNICATIONS = "marketing_communications",
    OTHER = "other"
}

export const VolunteerStatusSchema = Type.Union([
  Type.Literal('active'),
  Type.Literal('inactive'),
  Type.Literal('on_break'),
  Type.Literal('pending')
]);

export const TimeLogSchema = Type.Object({
  id: Type.RegExp(UUID_PATTERN),
  projectId: Type.Optional(Type.RegExp(UUID_PATTERN)),
  verified: Type.Boolean(),
  date: Type.String({ format: 'date-time' }),
  hours: Type.Number(),
  notes: Type.Optional(Type.String())
});

export const VolunteerProfileSchema = Type.Object({
    skills: Type.Array(Type.Enum(Skill)),
    availability: Type.Object({
      days: Type.Array(Type.String()),
      startTime: Type.String(),
      endTime: Type.String()
    }),
    hours: Type.Array(TimeLogSchema),
    references: Type.Array(
      Type.Object({
        id: Type.RegExp(UUID_PATTERN),
        name: Type.String(),
        relationship: Type.String(),
        contact: Type.String(),
        status: Type.Enum(BackgroundCheck)
      })
    ),
    trainings: Type.Array(
      Type.Object({
        id: Type.RegExp(UUID_PATTERN),
        name: Type.String(),
        completed: Type.Boolean(),
        expirationDate: Type.Optional(Type.String({ format: 'date-time' }))
      })
    )
});
  
export const VolunteerSchema = Type.Object({
    id: Type.String(),
    userId: Type.String(),
    firstName: Type.String(),
    lastName: Type.String(),
    email: Type.String(),
    phone: Type.Optional(Type.String()),
     location: Type.Optional(Type.Object({
         latitude: Type.Number(),
         longitude: Type.Number()
     })),
    projects: Type.Array(Type.String()),
    skills: Type.Array(Type.Enum(Skill)),
    availability:  Type.Object({
         days: Type.Array(Type.String()),
          startTime: Type.String(),
          endTime: Type.String()
    }),
    hours: Type.Array(TimeLogSchema),
    references: Type.Array(
        Type.Object({
          id: Type.RegExp(UUID_PATTERN),
          name: Type.String(),
          relationship: Type.String(),
          contact: Type.String(),
          status: Type.Enum(BackgroundCheck)
        })
      ),
    background: Type.Enum(BackgroundCheck),
    trainings: Type.Array(
      Type.Object({
        id: Type.RegExp(UUID_PATTERN),
        name: Type.String(),
        completed: Type.Boolean(),
        expirationDate: Type.Optional(Type.String({ format: 'date-time' }))
      })
    ),
     notes: Type.Optional(Type.String()),
    createdAt: Type.String(),
    updatedAt: Type.String(),
     role: Type.String(),
    joinDate: Type.String(),
     trainingCompleted: Type.Boolean(),
     hoursContributed: Type.Number(),
    profile: VolunteerProfileSchema
});

export interface Reference {
    id: string;
    name: string;
    relationship: string;
    contact: string;
    status: BackgroundCheck;
}

export  interface Training {
    id: string;
    name: string;
    completed: boolean;
    expirationDate?: string; // ISO Date
}


export interface ProjectMedia {
    id: string;
    url: string;
    type: 'image' | 'video' | 'document';
    caption?: string;
}

export interface Schedule {
    days: string[]; // e.g., ["Monday", "Wednesday", "Friday"]
    startTime: string; // "HH:MM"
    endTime: string; // "HH:MM"
}
// Derived Types
export type VolunteerStatus = Static<typeof VolunteerStatusSchema>;
export type TimeLog = Static<typeof TimeLogSchema>;
export type VolunteerProfile = Static<typeof VolunteerProfileSchema>;
export type Volunteer = Static<typeof VolunteerSchema>