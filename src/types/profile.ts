// src/types/profile.ts
// Profile-related types.

import { Type, Static, TObject } from '@sinclair/typebox';
import { UUID_PATTERN } from './user'; // Assuming this is defined


// Base profile structure (COMMON to ALL profiles)
export const BaseProfileSchema = Type.Object({
  skills: Type.Array(Type.String()),
  experience: Type.Array(Type.Object({
    title: Type.String(),
    role: Type.String(),
    duration: Type.String(),
    description: Type.Optional(Type.String()),
  })),
  portfolio: Type.Array(Type.String({ format: 'uri' })),
  availability: Type.Optional(Type.String({ format: 'date' })),
  location: Type.Optional(Type.String()),
  bio: Type.Optional(Type.String()),
  website: Type.Optional(Type.String({ format: 'uri' })),
  socialMedia: Type.Optional(
    Type.Object({
      linkedin: Type.Optional(Type.String({ format: 'uri' })),
      twitter: Type.Optional(Type.String()),
      instagram: Type.Optional(Type.String({ format: 'uri' })),
    })
  ),
  phone: Type.Optional(Type.String()),
  verificationData: Type.Optional(Type.Any()) // Keep as Any, validated separately
});

export type BaseProfile = Static<typeof BaseProfileSchema>;

// --- Role-Specific Profiles (using Type.Composite for clean extension) ---

// Actor
export const ActorProfileSchema = Type.Composite([
  BaseProfileSchema,
  Type.Object({
    actingStyles: Type.Array(Type.String()),
    reels: Type.Array(Type.String({ format: 'uri' })),
    unionStatus: Type.Optional(Type.String()),
  }),
]);
export type ActorProfile = Static<typeof ActorProfileSchema>;

// Crew
export const CrewProfileSchema = Type.Composite([
  BaseProfileSchema,
  Type.Object({
    department: Type.String(),
    certifications: Type.Array(Type.String()),
    equipment: Type.Array(Type.String()),
  }),
]);
export type CrewProfile = Static<typeof CrewProfileSchema>;

// Vendor
export const VendorProfileSchema = Type.Composite([
  BaseProfileSchema,
  Type.Object({
    businessName: Type.String(),
    storeName: Type.Optional(Type.String()),
    sellerRating: Type.Optional(Type.Number()),
    services: Type.Array(Type.String()),
    paymentMethods: Type.Array(Type.String()),
    inventory: Type.Array(Type.Object({
      category: Type.String(),
      items: Type.Array(Type.String()),
    })),
  }),
]);

export type VendorProfile = Static<typeof VendorProfileSchema>;


// Producer
export const ProducerProfileSchema = Type.Composite([
  BaseProfileSchema,
  Type.Object({
    companyName: Type.String(),
    projects: Type.Array(
      Type.Object({
        id: Type.String({ format: 'uuid' }),
        title: Type.String(),
        genre: Type.String(),
        productionType: Type.Union([
          Type.Literal('film'),
          Type.Literal('tv'),
          Type.Literal('commercial'),
          Type.Literal('theater'),
        ]),
        status: Type.Union([
          Type.Literal('development'),
          Type.Literal('pre-production'),
          Type.Literal('production'),
          Type.Literal('post-production'),
          Type.Literal('released'),
        ]),
        budgetRange: Type.Optional(Type.String()),
        filmingLocations: Type.Array(Type.String()),
      })
    ),
    collaborations: Type.Array(
      Type.Object({
        collaboratorId: Type.String({ format: 'uuid' }),
        role: Type.String(),
        projectId: Type.String({ format: 'uuid' }),
      }),
    ),
    unionAffiliations: Type.Array(Type.String()),
    insuranceInformation: Type.Optional(Type.String()),
  }),
]);

export type ProducerProfile = Static<typeof ProducerProfileSchema>
// Project Owner
export const ProjectOwnerProfileSchema = Type.Composite([
  BaseProfileSchema,
  Type.Object({
    organization: Type.String(),
    specialties: Type.Array(Type.String()),
    imdbLink: Type.Optional(Type.String({ format: 'uri' })),
    currentProjects: Type.Array(
      Type.Object({
        id: Type.String({ format: 'uuid' }),
        title: Type.String(),
        description: Type.String(),
        startDate: Type.String({ format: 'date' }),
        endDate: Type.Optional(Type.String({ format: 'date' })),
        requiredResources: Type.Array(Type.String()),
      }),
    ),
    pastProjects: Type.Array(
      Type.Object({
        id: Type.String({ format: 'uuid' }),
        title: Type.String(),
        outcome: Type.String(),
        impactMetrics: Type.Record(Type.String(), Type.Number()),
      }),
    ),
    fundingSources: Type.Array(Type.String()),
  }),
]);
export type ProjectOwnerProfile = Static<typeof ProjectOwnerProfileSchema>
// NGO
export const NgoProfileSchema = Type.Composite([
  BaseProfileSchema,
  Type.Object({
    organizationName: Type.String(),
    registrationNumber: Type.String(),
    focusAreas: Type.Array(
      Type.Union([
        Type.Literal('education'),
        Type.Literal('environment'),
        Type.Literal('healthcare'),
        Type.Literal('human-rights'),
        Type.Literal('community-development'),
      ]),
    ),
    partners: Type.Array(
      Type.Object({
        name: Type.String(),
        type: Type.Union([
          Type.Literal('corporate'),
          Type.Literal('government'),
          Type.Literal('non-profit'),
        ]),
        partnershipLevel: Type.Union([
          Type.Literal('strategic'),
          Type.Literal('financial'),
          Type.Literal('operational'),
        ]),
      }),
    ),
    impactMetrics: Type.Record(Type.String(), Type.Number()),
    hoursLogged: Type.Number(),
    background: Type.Union([
      Type.Literal('PENDING'),
      Type.Literal('APPROVED'),
      Type.Literal('REJECTED'),
    ]),
    website: Type.Optional(Type.String({ format: 'uri' })),
    annualBudget: Type.Optional(Type.Number()),
  }),
]);
export type NgoProfile = Static<typeof NgoProfileSchema>;

// Admin
export const AdminProfileSchema = Type.Object({ // No BaseProfile for Admin
  accessLevel: Type.Union([
    Type.Literal('super-admin'),
    Type.Literal('content-admin'),
    Type.Literal('user-admin'),
    Type.Literal('financial-admin'),
  ]),
  managedSections: Type.Array(
    Type.Union([
      Type.Literal('users'),
      Type.Literal('content'),
      Type.Literal('projects'),
      Type.Literal('financial'),
    ]),
  ),
  lastAudit: Type.Optional(Type.String({ format: 'date-time' })),
  permissions: Type.Record(
    Type.String(),
    Type.Union([
      Type.Literal('read'),
      Type.Literal('write'),
      Type.Literal('delete'),
      Type.Literal('manage'),
    ]),
  ),
});
export type AdminProfile = Static<typeof AdminProfileSchema>

// --- API Request/Response Types (DTOs) ---
// Create a generic Profile interface
export interface Profile {
	profileID: string;
	userID: string;
	role: string; //keep for query and display in the profile
	// other profile details
}
// Create Profile (POST)
export const CreateProfileRequestSchema = Type.Object({
    role: Type.String(),
    // Include ONLY the *required* fields for *initial* profile creation.
    // Other fields can be updated later.  This keeps the creation simple.
    // Example:
    // skills: Type.Optional(Type.Array(Type.String())), // If skills are required for ALL roles
    // ... other *required* initial fields
});

export type CreateProfileRequest = Static<typeof CreateProfileRequestSchema>;


// Get Profile (GET)
// The backend might return different profile shapes based on the role.
// Use a union type for this:

export const GetProfileResponseSchema = Type.Union([
  Type.Object({ profileID: Type.String({format: 'uuid'}), userID: Type.String({format: 'uuid'}), role: Type.Literal('actor'), ...ActorProfileSchema.properties }),
  Type.Object({ profileID: Type.String({format: 'uuid'}), userID: Type.String({format: 'uuid'}), role: Type.Literal('crew'), ...CrewProfileSchema.properties }),
  Type.Object({ profileID: Type.String({format: 'uuid'}), userID: Type.String({format: 'uuid'}), role: Type.Literal('vendor'), ...VendorProfileSchema.properties }),
  Type.Object({ profileID: Type.String({format: 'uuid'}), userID: Type.String({format: 'uuid'}), role: Type.Literal('producer'), ...ProducerProfileSchema.properties }),
  Type.Object({ profileID: Type.String({format: 'uuid'}), userID: Type.String({format: 'uuid'}), role: Type.Literal('project-owner'), ...ProjectOwnerProfileSchema.properties }),
  Type.Object({ profileID: Type.String({format: 'uuid'}), userID: Type.String({format: 'uuid'}), role: Type.Literal('ngo'), ...NgoProfileSchema.properties }),
  Type.Object({ profileID: Type.String({format: 'uuid'}), userID: Type.String({format: 'uuid'}), role: Type.Literal('admin'), ...AdminProfileSchema.properties }),
]);

export type GetProfileResponse = Static<typeof GetProfileResponseSchema>;



// Update Profile (PUT) - Allow partial updates
export const UpdateProfileRequestSchema = Type.Partial(Type.Union([
     Type.Object({ role: Type.Literal('actor'), ...ActorProfileSchema.properties }),
    Type.Object({ role: Type.Literal('crew'), ...CrewProfileSchema.properties }),
    Type.Object({ role: Type.Literal('vendor'), ...VendorProfileSchema.properties }),
    Type.Object({ role: Type.Literal('producer'), ...ProducerProfileSchema.properties }),
    Type.Object({ role: Type.Literal('project-owner'), ...ProjectOwnerProfileSchema.properties }),
    Type.Object({ role: Type.Literal('ngo'), ...NgoProfileSchema.properties }),
    Type.Object({ role: Type.Literal('admin'), ...AdminProfileSchema.properties }),
    ]));

export type UpdateProfileRequest = Static<typeof UpdateProfileRequestSchema>;

// List Profiles (GET /profiles) -  response
export const ListProfilesResponseSchema = Type.Array(GetProfileResponseSchema);
export type ListProfilesResponse = Static<typeof ListProfilesResponseSchema>;

// Profile Filters for GET /profiles (query params)
export const ProfileFiltersSchema = Type.Object({
  role: Type.Optional(Type.String()),
  skill: Type.Optional(Type.String()),
    // Add other filterable properties as needed
});
export type ProfileFilters = Static<typeof ProfileFiltersSchema>