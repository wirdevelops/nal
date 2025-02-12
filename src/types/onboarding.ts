// src/types/onboarding.ts
// Types specifically for the onboarding process.
import { Type, Static } from '@sinclair/typebox';
import { UserRoleSchema } from './user'; // Import for role selection
import * as z from "zod";
// Basic Info
export const BasicInfoSchema = Type.Object({
  firstName: Type.String({ minLength: 1 }),
  lastName: Type.String({ minLength: 1 }),
    phone: Type.Optional(Type.String()), // add phone here
});
export type BasicInfo = Static<typeof BasicInfoSchema>;

// Role Details
export const RoleDetailsSchema = Type.Object({
  roles: Type.Array(UserRoleSchema, { minItems: 1 }), // Enforce at least one role
  // Add other role-specific details *as needed* here.  Avoid premature optimization.
  // Example:  IF a role *requires* skills, add it here. Otherwise, handle in Profile.
  // skills: Type.Optional(Type.Array(Type.String())),
});
export type RoleDetails = Static<typeof RoleDetailsSchema>;

// Verification Data.  Use Zod for more complex optional validation.
export const VerificationDataSchema = z.object({
  identificationType: z.string().min(2, "Identification type is required").optional(),
  identificationNumber: z.string().min(2, "Identification Number is required").optional(),
  issuingAuthority: z.string().min(2, "Issuing Authority is required").optional(),
  dateOfIssue: z.string().min(2, "Date of Issue is required").optional(),
  expiryDate: z.string().min(2, "Expiry date is required").optional(),
  proofOfAddress: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

export type VerificationData = z.infer<typeof VerificationDataSchema>;
export const validateVerificationData = (data: unknown): data is VerificationData => {
  return VerificationDataSchema.safeParse(data).success;
};


// API Request/Response Types (DTOs)
export const StartOnboardingRequestSchema = Type.Object({});//Empty
export type StartOnboardingRequest = Static<typeof StartOnboardingRequestSchema>;

export const SetBasicInfoRequestSchema = BasicInfoSchema; // Re-use
export type SetBasicInfoRequest = BasicInfo;

export const SetRoleDetailsRequestSchema = RoleDetailsSchema;
export type SetRoleDetailsRequest = RoleDetails;

export const SetVerificationDataRequestSchema = Type.Any() //because it's Zod schema; // Re-use
export type SetVerificationDataRequest = VerificationData;

export const CompleteOnboardingRequestSchema = Type.Object({}); // No data needed
export type CompleteOnboardingRequest = Static<typeof CompleteOnboardingRequestSchema>;


export const GetOnboardingStatusResponseSchema = Type.Object({
  status: Type.Union([
    Type.Literal('incomplete'),
    Type.Literal('basic'),
    Type.Literal('role'),
    Type.Literal('verification'),
    Type.Literal('complete'),
  ]),
});
export type GetOnboardingStatusResponse = Static<typeof GetOnboardingStatusResponseSchema>;