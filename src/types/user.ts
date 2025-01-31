import { Type, Static, TObject } from '@sinclair/typebox';
import { UUID_PATTERN } from './store/common';
import * as z from 'zod';


// Define a simple type for common profile roles
export type ProfileRole = 'actor' | 'crew' | 'vendor' | 'producer';

// Define schemas with 'Schema' suffix for clarity
export const UserRoleSchema = Type.Union([
  Type.Literal('actor'),
  Type.Literal('producer'),
  Type.Literal('crew'),
  Type.Literal('project-owner'),
  Type.Literal('vendor'),
  Type.Literal('ngo'),
  Type.Literal('admin')
]);

export const OnboardingStageSchema = Type.Union([
  Type.Literal('role-selection'),
  Type.Literal('basic-info'),
  Type.Literal('role-details'),
  Type.Literal('portfolio'),
  Type.Literal('verification'),
  Type.Literal('completed')
]);

// Derive types from schemas
export type UserRole = Static<typeof UserRoleSchema>;
export type OnboardingStage = Static<typeof OnboardingStageSchema>;


// Define the schema for the verification data
const verificationSchema = z.object({
    identificationType: z.string().min(2, "Identification type is required").optional(),
    identificationNumber: z.string().min(2, "Identification Number is required").optional(),
    issuingAuthority: z.string().min(2, "Issuing Authority is required").optional(),
    dateOfIssue: z.string().min(2, "Date of Issue is required").optional(),
    expiryDate: z.string().min(2, "Expiry date is required").optional(),
    proofOfAddress: z.string().url("Must be a valid URL").optional().or(z.literal(''))
  });


export type VerificationData = z.infer<typeof verificationSchema>;

// Base profile structure
export const BaseProfile = Type.Object({
  skills: Type.Array(Type.String()),
  experience: Type.Array(Type.Object({
      title: Type.String(),
      role: Type.String(),
      duration: Type.String(),
      description: Type.Optional(Type.String())
  })),
  portfolio: Type.Array(Type.String({ format: 'uri' })),
  availability: Type.Optional(Type.String({ format: 'date' })),
    // Add these to the Base Profile
  location: Type.Optional(Type.String()),
  bio: Type.Optional(Type.String()),
  website: Type.Optional(Type.String({format: 'uri'})),
    socialMedia: Type.Optional(
        Type.Object({
            linkedin: Type.Optional(Type.String({format: 'uri'})),
            twitter: Type.Optional(Type.String()),
            instagram: Type.Optional(Type.String({format: 'uri'}))
        })
    ),
    phone: Type.Optional(Type.String()),
    verificationData: Type.Optional(Type.Any())
});

// Create a new type that intersects the BaseProfile with other profiles
export type FullProfile<T extends TObject> = Static<typeof BaseProfile> & Static<T>;


// Actor-specific profile
export const ActorProfile = Type.Composite([
  BaseProfile,
  Type.Object({
    actingStyles: Type.Array(Type.String()),
    reels: Type.Array(Type.String({ format: 'uri' })),
    unionStatus: Type.Optional(Type.String())
  })
]);

// Crew-specific profile
export const CrewProfile = Type.Composite([
  BaseProfile,
  Type.Object({
    department: Type.String(),
    certifications: Type.Array(Type.String()),
    equipment: Type.Array(Type.String())
  })
]);

// Vendor-specific profile
export const VendorProfile = Type.Object({
  businessName: Type.String(),
  services: Type.Array(Type.String()),
  paymentMethods: Type.Array(Type.String()),
  inventory: Type.Array(Type.Object({
    category: Type.String(),
    items: Type.Array(Type.String())
  })),
  experience: Type.Array(Type.String())
});


// Producer-specific profile
export const ProducerProfile = Type.Composite([
  BaseProfile,
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
          Type.Literal('theater')
        ]),
        status: Type.Union([
          Type.Literal('development'),
          Type.Literal('pre-production'),
          Type.Literal('production'),
          Type.Literal('post-production'),
          Type.Literal('released')
        ]),
        budgetRange: Type.Optional(Type.String()),
        filmingLocations: Type.Array(Type.String())
      })
    ),
    collaborations: Type.Array(
      Type.Object({
        collaboratorId: Type.String({ format: 'uuid' }),
        role: Type.String(),
        projectId: Type.String({ format: 'uuid' })
      })
    ),
    unionAffiliations: Type.Array(Type.String()),
    insuranceInformation: Type.Optional(Type.String())
  })
]);

// Project-owner-specific profile
export const ProjectOwnerProfile = Type.Composite([
  BaseProfile,
  Type.Object({
    organization: Type.String(),
    currentProjects: Type.Array(
      Type.Object({
        id: Type.String({ format: 'uuid' }),
        title: Type.String(),
        description: Type.String(),
        startDate: Type.String({ format: 'date' }),
        endDate: Type.Optional(Type.String({ format: 'date' })),
        requiredResources: Type.Array(Type.String())
      })
    ),
    pastProjects: Type.Array(
      Type.Object({
        id: Type.String({ format: 'uuid' }),
        title: Type.String(),
        outcome: Type.String(),
        impactMetrics: Type.Record(Type.String(), Type.Number())
      })
    ),
    fundingSources: Type.Array(Type.String())
  })
]);

// NGO-specific profile
export const NgoProfile = Type.Composite([
  BaseProfile,
  Type.Object({
    organizationName: Type.String(),
    registrationNumber: Type.String(),
    focusAreas: Type.Array(
      Type.Union([
        Type.Literal('education'),
        Type.Literal('environment'),
        Type.Literal('healthcare'),
        Type.Literal('human-rights'),
        Type.Literal('community-development')
      ])
    ),
    partners: Type.Array(
      Type.Object({
        name: Type.String(),
        type: Type.Union([
          Type.Literal('corporate'),
          Type.Literal('government'),
          Type.Literal('non-profit')
        ]),
        partnershipLevel: Type.Union([
          Type.Literal('strategic'),
          Type.Literal('financial'),
          Type.Literal('operational')
        ])
      })
    ),
    impactMetrics: Type.Record(Type.String(), Type.Number()),
    website: Type.Optional(Type.String({ format: 'uri' })),
    annualBudget: Type.Optional(Type.Number())
  })
]);

// Admin-specific profile
export const AdminProfile = Type.Object({
  accessLevel: Type.Union([
    Type.Literal('super-admin'),
    Type.Literal('content-admin'),
    Type.Literal('user-admin'),
    Type.Literal('financial-admin')
  ]),
  managedSections: Type.Array(
    Type.Union([
      Type.Literal('users'),
      Type.Literal('content'),
      Type.Literal('projects'),
      Type.Literal('financial')
    ])
  ),
  lastAudit: Type.Optional(Type.String({ format: 'date-time' })),
  permissions: Type.Record(
    Type.String(),
    Type.Union([
      Type.Literal('read'),
      Type.Literal('write'),
      Type.Literal('delete'),
      Type.Literal('manage')
    ])
  )
});

// Top-level user schema
export const User = Type.Object({
  id: Type.RegExp(UUID_PATTERN),
  email: Type.String({ format: 'email' }),
  isVerified: Type.Boolean(),
  name: Type.Object({
    first: Type.String(),
    last: Type.String()
  }),
  avatar: Type.Optional(Type.String({ format: 'uri' })),
  roles: Type.Array(UserRoleSchema),
  profiles: Type.Object({
    actor: Type.Optional(ActorProfile),
    crew: Type.Optional(CrewProfile),
    vendor: Type.Optional(VendorProfile),
    producer: Type.Optional(ProducerProfile),
    'project-owner': Type.Optional(ProjectOwnerProfile),
    ngo: Type.Optional(NgoProfile),
    admin: Type.Optional(AdminProfile)
  }),
  onboarding: Type.Object({
    stage: OnboardingStageSchema,
    completed: Type.Array(OnboardingStageSchema),
    data: Type.Record(Type.String(), Type.Any())
  }),
  settings: Type.Object({
    notifications: Type.Object({
      email: Type.Boolean(),
      projects: Type.Boolean(),
      messages: Type.Boolean()
    }),
    privacy: Type.Object({
      profile: Type.Union([
        Type.Literal('public'),
        Type.Literal('private'),
        Type.Literal('connections')
      ]),
      contactInfo: Type.Boolean()
    })
  }),
  location: Type.Optional(Type.String()),
  activeRole: Type.Optional(UserRoleSchema),
  status: Type.Union([
    Type.Literal('active'),
    Type.Literal('inactive'),
    Type.Literal('pending')
  ]),
  metadata: Type.Object({
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    lastActive: Type.Optional(Type.String({ format: 'date-time' })),
    failedAttempts: Type.Optional(Type.Integer())
  })
});

// Export types
export type User = Static<typeof User>;
export type BaseProfile = Static<typeof BaseProfile>;
export type ActorProfile = FullProfile<typeof ActorProfile>;
export type CrewProfile = FullProfile<typeof CrewProfile>;
export type VendorProfile = FullProfile<typeof VendorProfile>;
export type ProducerProfile = FullProfile<typeof ProducerProfile>;
export type ProjectOwnerProfile = FullProfile<typeof ProjectOwnerProfile>;
export type NgoProfile = FullProfile<typeof NgoProfile>;
export type AdminProfile = FullProfile<typeof AdminProfile>;

// Validation helpers using schema values
export const validateUserRole = (role: unknown): role is UserRole => {
  const validRoles = UserRoleSchema.anyOf.map(s => s.const as UserRole);
  return typeof role === 'string' && validRoles.includes(role as UserRole);
};

export const validateOnboardingStage = (stage: unknown): stage is OnboardingStage => {
  const validStages = OnboardingStageSchema.anyOf.map(s => s.const as OnboardingStage);
  return typeof stage === 'string' && validStages.includes(stage as OnboardingStage);
};

type ProfileInitializers = {
  [K in UserRole]: K extends 'admin' ? AdminProfile :
    K extends 'project-owner' ? ProjectOwnerProfile :
    K extends 'producer' ? ProducerProfile :
    K extends 'ngo' ? NgoProfile :
    K extends 'actor' ? ActorProfile :
    K extends 'crew' ? CrewProfile :
    K extends 'vendor' ? VendorProfile : never;
};

// Provides default values for profiles
export const PROFILE_INITIALIZERS: ProfileInitializers = {
  actor: {
    actingStyles: [],
    reels: [],
    unionStatus: '',
    portfolio: [],
    skills: [],
    experience: []
  },
  producer: {
    companyName: '',
    projects: [],
    collaborations: [],
    unionAffiliations: [],
    insuranceInformation: '',
    skills: [],
    experience: [],
    portfolio: []
  },
  'project-owner': {
    organization: '',
    currentProjects: [],
    pastProjects: [],
    fundingSources: [],
    skills: [],
    experience: [],
    portfolio: [],
    availability: undefined,
  },
   crew: {
    department: '',
    certifications: [],
    equipment: [],
    skills: [],
    experience: [],
    portfolio: [],
    availability: undefined,
   },
  ngo: {
    organizationName: '',
    registrationNumber: '',
    focusAreas: [],
    partners: [],
    impactMetrics: {},
    website: '',
    annualBudget: 0,
    skills: [],
    experience: [],
    portfolio: []
  },
  vendor: {
    businessName: '',
    services: [],
    paymentMethods: [],
    inventory: [],
    experience: [],
     skills: [],
    portfolio: []
  },
  admin: {
    accessLevel: 'content-admin',
    managedSections: [],
    permissions: {},
     skills: [],
    experience: [],
    portfolio: []
  },
};