// @/lib/user/types.ts
import { ObjectId } from 'mongodb';
import { Onboarding } from '@/lib/onboarding/types';
import { z } from 'zod';


export interface UserUpdateInput {
  name?: string;
  location?: string;
}

export interface ActiveRoleInput {
  role: string;
}

export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status: string;
  activeRole?: string;
  location?: string;
}

// src/lib/user/types.ts
export interface User {
  id?: ObjectId;
  name: string;
  email: string;
  isVerified: boolean;
  roles: UserRole[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
  activeRole?: UserRole;
  status: UserStatus;
  onboarding: Onboarding;
  settings?: UserSettings;
  metadata: UserMetadata;
  location?: string;
  phone?: string;
  hasCompletedOnboarding: boolean; // This is the correct property name
  age?: number;
  sex?: 'male' | 'female' | 'other';
}

export type UserRole = 
  | 'actor' 
  | 'app-user' 
  | 'crew' 
  | 'project-owner' 
  | 'vendor' 
  | 'ngo' 
  | 'admin' 
  | 'volunteer' 
  | 'beneficiary' 
  | 'donor' 
  | 'partner' 

export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface UserSettings {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}


// Notification Settings
export interface NotificationSettings {
  email: boolean;
  projects: boolean;
  messages: boolean;
  system?: boolean;
}

export const notificationSettingsSchema = z.object({
  email: z.boolean(),
  projects: z.boolean(),
  messages: z.boolean(),
  system: z.boolean().optional()
});

// Privacy Settings
export interface PrivacySettings {
  profile: 'public' | 'private' | 'connections';
  contactInfo: boolean;
  searchable?: boolean;
}

export const privacySettingsSchema = z.object({
  profile: z.enum(['public', 'private', 'connections']),
  contactInfo: z.boolean(),
  searchable: z.boolean().optional()
});

// User Metadata
export interface UserMetadata {
  createdAt: Date;
  updatedAt: Date;
  lastActive?: Date;
  failedAttempts?: number;
}

export const userMetadataSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  lastActive: z.date().optional(),
  failedAttempts: z.number().int().optional()
});

// User Settings - Combining Notification and Privacy Settings
export interface UserSettings {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export const userSettingsSchema = z.object({
  notifications: notificationSettingsSchema,
  privacy: privacySettingsSchema
});

// Default User Settings
export const defaultUserSettings: UserSettings = {
  notifications: {
    email: true,
    projects: true,
    messages: true,
    system: false
  },
  privacy: {
    profile: 'connections',
    contactInfo: false,
    searchable: true
  }
};

// Utility type for converting ObjectId to string in frontend
export type Id = string;
// Types for easier type inference
export type NotificationSettingsInput = z.infer<typeof notificationSettingsSchema>;
export type PrivacySettingsInput = z.infer<typeof privacySettingsSchema>;
export type UserSettingsInput = z.infer<typeof userSettingsSchema>;

// // @/lib/user/types.ts
// import { z } from 'zod';

// // --- Constants (for enums) ---

// // Roles
// export const RoleActor = "actor";
// export const RoleProducer = "producer";
// export const RoleCrew = "crew";
// export const RoleProjectOwner = "project-owner";
// export const RoleVendor = "vendor";
// export const RoleNGO = "ngo";
// export const RoleAdmin = "admin";
// export const RoleVolunteer = "volunteer";
// export const RoleBeneficiary = "beneficiary";
// export const RoleDonor = "donor";
// export const RolePartner = "partner";
// export const RoleSeller = "seller";
// export const RoleEmployee = "employee";

// export const Roles = [
//     RoleActor, RoleProducer, RoleCrew, RoleProjectOwner, RoleVendor,
//     RoleNGO, RoleAdmin, RoleVolunteer, RoleBeneficiary, RoleDonor,
//     RolePartner, RoleSeller, RoleEmployee
// ] as const;

// // Onboarding Stages
// export const StageSetup = "setup";
// export const StageRoleSelection = "role-selection";
// export const StageBasicInfo = "basic-info";
// export const StageRoleDetails = "role-details";
// export const StagePortfolio = "portfolio";
// export const StageVerification = "verification";
// export const StageCompleted = "completed";

// export const OnboardingStages = [
//     StageSetup, StageRoleSelection, StageBasicInfo, StageRoleDetails,
//     StagePortfolio, StageVerification, StageCompleted
// ] as const;

// // Project Statuses (and User Status)
// export const StatusActive = "active";
// export const StatusInactive = "inactive";
// export const StatusPending = "pending";
// export const StatusSuspended = "suspended";

// export const UserStatuses = [
//   StatusActive, StatusInactive, StatusPending, StatusSuspended
// ] as const;

// // Privacy Settings
// export const PrivacyPublic = "public";
// export const PrivacyPrivate = "private";
// export const PrivacyConnections = "connections";

// export const PrivacySettingsOptions = [
//   PrivacyPublic, PrivacyPrivate, PrivacyConnections
// ] as const;

// //Verification Types
// export const VerificationTypeIDCard = "id-card";
// export const VerificationTypePassport = "passport";
// export const VerificationTypeDriverLicense = "driver-license";

// export const VerificationTypes = [
//     VerificationTypeIDCard,
//     VerificationTypePassport,
//     VerificationTypeDriverLicense
// ] as const;

// // --- Zod Schemas ---

// const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// // Base Zod schema for ObjectIDs
// const ZodObjectId = z.string().regex(objectIdRegex, { message: "Invalid ObjectId" });

// const ExperienceSchema = z.object({
//     title: z.string(),
//     role: z.string(),
//     duration: z.string(),
//     description: z.string().optional(),
// });

// const SocialMediaSchema = z.object({
//     linkedin: z.string().url().optional(),
//     twitter: z.string().url().optional(),
//     instagram: z.string().url().optional(),
//     facebook: z.string().url().optional(),
// });
// export type SocialMediaType = z.infer<typeof SocialMediaSchema>;

// const VerificationDataSchema = z.object({
//     identificationType: z.enum(VerificationTypes).optional(),
//     identificationNumber: z.string().optional(),
//     issuingAuthority: z.string().optional(),
//     dateOfIssue: z.string().optional(), //  z.date()  if you control the format
//     expiryDate: z.string().optional(),   //  z.date()
//     proofOfAddress: z.string().optional(),
// });
// export type VerificationDataType = z.infer<typeof VerificationDataSchema>

// export const BaseProfileSchema = z.object({
//     id: ZodObjectId.optional(),
//     userId: ZodObjectId,
//     role: z.enum(Roles),
//     skills: z.string().array().optional(),
//     experience: ExperienceSchema.array().optional(),
//     portfolio: z.string().url().array().optional(),
//     availability: z.string().datetime().optional(),  // Or just z.string()
//     location: z.string().optional(),
//     bio: z.string().optional(),
//     website: z.string().url().optional(),
//     socialMedia: SocialMediaSchema.optional(),
//     phone: z.string().optional(),
//     verificationData: VerificationDataSchema.optional()
// });

// export type BaseProfileType = z.infer<typeof BaseProfileSchema>

// const NotificationSettingsSchema = z.object({
//     email: z.boolean(),
//     projects: z.boolean(),
//     messages: z.boolean(),
//     system: z.boolean().optional(),
// });
// export type NotificationSettingsType = z.infer<typeof NotificationSettingsSchema>

// const PrivacySettingsSchema = z.object({
//     profile: z.enum(PrivacySettingsOptions),
//     showEmail: z.boolean().optional(),        //  new fields
//     showPhone: z.boolean().optional(),        //
//     showLocation: z.boolean().optional(),     //
//     searchable: z.boolean().optional(),
// });
// export type PrivacySettingsType = z.infer<typeof PrivacySettingsSchema>

// const OnboardingSchema = z.object({
//     stage: z.enum(OnboardingStages),
//     completed: z.enum(OnboardingStages).array(),
//     data: z.record(z.any()).optional(), // Flexible data
// });
// export type OnboardingType = z.infer<typeof OnboardingSchema>

// const UserMetadataSchema = z.object({
//     createdAt: z.string().datetime(), // Changed to string
//     updatedAt: z.string().datetime(), // Changed to string
//     lastActive: z.string().datetime().optional(), // Changed to string
//     failedAttempts: z.number().optional(),
// });
// export type UserMetaDataType = z.infer<typeof UserMetadataSchema>

// const RefreshTokenSchema = z.object({
//     token: z.string(),
//     expiresAt: z.string().datetime(), // Changed to string
// });
// export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>

// const ResetTokenSchema = z.object({
//     token: z.string(),
//     expiresAt: z.string().datetime(), // Changed to string
// });
// export type ResetTokenType = z.infer<typeof ResetTokenSchema>

// const VerificationTokenSchema = z.object({
//     token: z.string(),
//     expiresAt: z.string().datetime(),// Changed to string
// });
// export type VerificationTokenType = z.infer<typeof VerificationTokenSchema>


// const FailedLoginSchema = z.object({
// 	attempts: z.number(),
// 	lastTry: z.string().datetime(), // Changed to string
// 	lockUntil: z.string().datetime().optional(), // Changed to string
// });
// export type FailedLoginType = z.infer<typeof FailedLoginSchema>

// export const UserSchema = z.object({
//     id: ZodObjectId.optional(),
//     name: z.string(),
//     email: z.string().email(),
//     password: z.string().min(8).optional(), // Optional because it's not sent in responses
//     isVerified: z.boolean(),
//     roles: z.enum(Roles).array(),
//     lastLogin: z.string().datetime().optional(), // Changed to string
//     createdAt: z.string().datetime(), // Changed to string
//     updatedAt: z.string().datetime(), // Changed to string
//     ipAddress: z.string().optional(),
//     failedAttempts: z.number().optional(),
//     lockUntil: z.string().datetime().optional(), // Changed to string
//     failedLogin: FailedLoginSchema.optional(),
//     refreshToken: RefreshTokenSchema.optional(),
//     resetToken: ResetTokenSchema.optional(),
//     verificationToken: VerificationTokenSchema.optional(),
//     avatar: z.string().url().optional(),
//     activeRole: z.enum(Roles).optional(),
//     status: z.enum(UserStatuses),
//     onboarding: OnboardingSchema,
//     settings: z.object({
//         notifications: NotificationSettingsSchema,
//         privacy: PrivacySettingsSchema,
//     }).optional(),
//     metadata: UserMetadataSchema,
//     location: z.string().optional(),
//     phone: z.string().optional(),
//     hasCompletedOnboarding: z.boolean(),
//     age: z.number().optional(),
//     sex: z.enum(["male", "female", "other"]).optional(),
// });

// export type User = z.infer<typeof UserSchema>;

// // --- Request/Response Types ---

// export const RegistrationRequestSchema = z.object({
//     firstName: z.string().min(2).max(50),
//     lastName: z.string().min(2).max(50),
//     email: z.string().email(),
//     password: z.string().min(8),
//     confirmPassword: z.string(),
//     ip: z.string().optional()
// }).refine(data => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"]
// });

// export type RegistrationRequest = z.infer<typeof RegistrationRequestSchema>;

// export const LoginRequestSchema = z.object({
//     email: z.string().email(),
//     password: z.string(),
// });
// export type LoginRequest = z.infer<typeof LoginRequestSchema>

// export const PasswordResetRequestSchema = z.object({
//     email: z.string().email(),
// });

// export const PasswordResetConfirmRequestSchema = z.object({
//     token: z.string(),
//     newPassword: z.string().min(8),
// });

// export const AuthTokensSchema = z.object({
//     accessToken: z.string(),
//     refreshToken: z.string(),
// });

// export const RoleSchema = z.object({
//   name: z.string(),
//   permissions: z.string().array(),
//   isActive: z.boolean()
// })
// export type RoleType = z.infer<typeof RoleSchema>;

// export const AuditLogSchema = z.object({
//   id: ZodObjectId.optional(),
// 	userId: ZodObjectId.optional(),
// 	action: z.string(),
// 	details: z.string().optional(),
// 	ipAddress: z.string(),
// 	timestamp: z.string().datetime(),
// })
// export type AuditLogType = z.infer<typeof AuditLogSchema>;

// //Verification
// export const VerificationSchema = z.object({
//   id: ZodObjectId.optional(),
// 	userId: ZodObjectId,
// 	email: z.string().email(),
// 	token: z.string(),
// 	expiresAt: z.string().datetime(),
// 	createdAt: z.string().datetime(),
// })
// export type VerificationType = z.infer<typeof VerificationSchema>

// // --- Other Types (if needed) ---

// // Example: If you had a separate function to validate just the email
// export const EmailSchema = z.string().email();

// // Combined UserSettings type
// export type UserSettingsType = {
//   notifications: NotificationSettingsType;
//   privacy: PrivacySettingsType;
// };

// // Update User Schema
// export const UpdateUserSchema = UserSchema.partial(); // Makes all fields optional
// export type UpdateUserType = z.infer<typeof UpdateUserSchema>;