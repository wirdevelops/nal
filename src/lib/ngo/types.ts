// @/lib/ngo/types.ts
import { z } from 'zod';
import {BaseProfileSchema} from '@/lib/user/types'

// --- Constants (for enums) ---
// NGO Focus Areas
export const FocusAreaEducation            = "education";
export const FocusAreaEnvironment          = "environment";
export const FocusAreaHealthcare           = "healthcare";
export const FocusAreaHumanRights          = "human-rights";
export const FocusAreaCommunityDevelopment = "community-development";
export const FocusAreaTechnology           = "technology";
export const FocusAreaEmergency            = "emergency";
export const FocusAreaWomenEmpowering      = "women-empowering";
export const FocusAreaChild                = "child";
export const NGOFocusAreas = [
    FocusAreaEducation,
    FocusAreaEnvironment,
    FocusAreaHealthcare,
    FocusAreaHumanRights,
    FocusAreaCommunityDevelopment,
    FocusAreaTechnology,
    FocusAreaEmergency,
    FocusAreaWomenEmpowering,
    FocusAreaChild
] as const;

// Partner Types (for NGO and general)
export const PartnerTypeCorporate  = "corporate";
export const PartnerTypeGovernment = "government";
export const PartnerTypeNonProfit  = "non-profit";
export const PartnerTypeIndividual = "individual";
export const PartnerTypes = [
    PartnerTypeCorporate,
    PartnerTypeGovernment,
    PartnerTypeNonProfit,
    PartnerTypeIndividual
] as const;

// Partnership Levels (for NGO)
export const PartnershipLevelStrategic   = "strategic";
export const PartnershipLevelFinancial   = "financial";
export const PartnershipLevelOperational = "operational";
export const PartnershipLevels = [
    PartnershipLevelStrategic,
    PartnershipLevelFinancial,
    PartnershipLevelOperational
] as const;

// --- Zod Schemas ---
const PartnerSchema = z.object({
    name: z.string(),
    type: z.enum(PartnerTypes),
    partnershipLevel: z.enum(PartnershipLevels).optional(),
    contactPerson: z.string().optional(),
    contactEmail: z.string().email().optional(),
});
export type PartnerType = z.infer<typeof PartnerSchema>

export const NgoProfileSchema = BaseProfileSchema.extend({
    organizationName: z.string(),
    registrationNumber: z.string(),
    focusAreas: z.enum(NGOFocusAreas).array().optional(),
    partners: PartnerSchema.array().optional(),
    impactMetrics: z.record(z.number()).optional(),
    hoursLogged: z.number().optional(),
    background: z.string().optional(),
    website: z.string().url().optional(),
    annualBudget: z.number().optional(),
});
export type NgoProfileType = z.infer<typeof NgoProfileSchema>;
// --- Other Types (if needed) ---