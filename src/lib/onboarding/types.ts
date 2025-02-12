import { z } from "zod";
import { basicInfoSchema, roleDetailsSchema, verificationSchema } from "./validations";

// src/lib/onboarding/types.ts
export interface OnboardingStatus {
  stage: OnboardingStage;
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}

// Onboarding
export interface Onboarding {
  stage: OnboardingStage;
  completed: OnboardingStage[];
  data?: Record<string, any>;
  startedAt?: Date;
  completedAt?: Date;
}

export const onboardingStages = [
  'setup', 
  'role-selection', 
  'basic-info', 
  'role-details', 
  // 'portfolio', 
  'verification', 
  'completed'
] as const;

export const onboardingSchema = z.object({
  stage: z.enum(onboardingStages),
  completed: z.array(z.enum(onboardingStages)),
  data: z.record(z.any()).optional()
});

// src/lib/types/onboarding.ts
export type OnboardingStage = 
  | 'setup'
  | 'role-selection'
  | 'basic-info'
  | 'role-details'
  | 'verification'
  | 'completed';

export interface OnboardingState {
  currentStage: OnboardingStage;
  completed: OnboardingStage[];
  data: {
    basicInfo?: z.infer<typeof basicInfoSchema>;
    roleDetails?: z.infer<typeof roleDetailsSchema>;
    verification?: z.infer<typeof verificationSchema>;
  };
}

export interface OnboardingStatus {
  stage: OnboardingStage;
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}


export interface BasicInfoForm {
  firstName: string;
  lastName: string;
  location: string;
  phone: string;
  dateOfBirth: Date;
  bio?: string;
}

export interface RoleDetailsForm {
  primaryRole: string;
  secondaryRoles?: string[];
  skills: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
}

export interface VerificationData {
  documentType: 'id_card' | 'passport' | 'drivers_license';
  documentFrontUrl: string;
  documentBackUrl?: string;
  selfieUrl: string;
}

export interface OnboardingStatusType {
  stage: OnboardingStage;
  completed: boolean;
  // startedAt: string;
  completedAt?: string;
}

export interface StartOnboardingRequestType {
  roles: string[];
}

export interface OnboardingDataType {
  firstName?: string;
  lastName?: string;
  location?: string;
  phone?: string;
  dateOfBirth?: Date;
  bio?: string;
  primaryRole?: string;
  secondaryRoles?: string[];
  skills?: string[];
  experienceLevel?: 'beginner' | 'intermediate' | 'expert';
  documentType?: 'id_card' | 'passport' | 'drivers_license';
  documentFrontUrl?: string;
  documentBackUrl?: string;
  selfieUrl?: string;
}