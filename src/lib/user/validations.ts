// @/lib/user/validations.ts
import * as z from 'zod';
import { userRoles } from './types';

export const userUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters").optional(),
  location: z.string().max(200, "Location cannot exceed 200 characters").optional()
});

export const activeRoleSchema = z.object({
  role: z.enum(userRoles, {
    errorMap: () => ({ message: "Invalid role selected" })
  })
});

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type ActiveRoleInput = z.infer<typeof activeRoleSchema>;

// // @/lib/user/validations.ts
// import * as z from 'zod';
// import { 
//   notificationSettingsSchema, 
//   privacySettingsSchema, 
//   onboardingSchema, 
//   userMetadataSchema 
// } from '../types';

// const userRoles = [
//   'actor', 'producer', 'crew', 'project-owner', 'vendor', 
//   'ngo', 'admin', 'volunteer', 'beneficiary', 
//   'donor', 'partner', 'seller', 'employee'
// ] as const;

// const userStatuses = ['active', 'inactive', 'pending', 'suspended'] as const;

// export const userSettingsSchema = z.object({
//   notifications: notificationSettingsSchema,
//   privacy: privacySettingsSchema
// });

// export const userSchema = z.object({
//   id: z.string().optional(),
//   name: z.string().min(2).max(100),
//   email: z.string().email(),
//   isVerified: z.boolean(),
//   roles: z.array(z.enum(userRoles)).min(1),
//   lastLogin: z.date().optional(),
//   createdAt: z.date(),
//   updatedAt: z.date(),
//   avatar: z.string().url().optional(),
//   activeRole: z.enum(userRoles).optional(),
//   status: z.enum(userStatuses),
//   onboarding: onboardingSchema,
//   settings: userSettingsSchema.optional(),
//   metadata: userMetadataSchema,
//   location: z.string().optional(),
//   phone: z.string().optional(),
//   hasCompletedOnboarding: z.boolean(),
//   age: z.number().int().positive().optional(),
//   sex: z.enum(['male', 'female', 'other']).optional()
// });