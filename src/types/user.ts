import { Type, Static } from '@sinclair/typebox';
import { UUID_PATTERN } from './store/common';

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
  availability: Type.Optional(Type.String({ format: 'date' }))
});

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
export type ActorProfile = Static<typeof ActorProfile>;
export type CrewProfile = Static<typeof CrewProfile>;
export type VendorProfile = Static<typeof VendorProfile>;
export type ProducerProfile = Static<typeof ProducerProfile>;
export type ProjectOwnerProfile = Static<typeof ProjectOwnerProfile>;
export type NgoProfile = Static<typeof NgoProfile>;
export type AdminProfile = Static<typeof AdminProfile>;

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
    experience: []
  },
  admin: {
    accessLevel: 'content-admin',
    managedSections: [],
    permissions: {}
  },
};


// import { Type, Static } from '@sinclair/typebox';
// import { UUID_PATTERN } from './common';

// // Additional specialized profiles
// export interface CreatorProfile extends BaseProfile {
//   type: 'Content' | 'Blog' | 'Podcast';
//   specialization: string[];
//   publications: Array<{
//     title: string;
//     url: string;
//     date: Date;
//     type: 'Article' | 'Blog' | 'Podcast' | 'Video';
//   }>;
//   stats: {
//     views: number;
//     followers: number;
//     engagement: number;
//   };
// }

// export interface ProjectManagerProfile extends BaseProfile {
//   type: 'Production' | 'PostProduction' | 'Event';
//   projectTypes: ('Feature' | 'Short' | 'Documentary' | 'Commercial' | 'Series')[];
//   budgetRange: {
//     min: number;
//     max: number;
//     currency: string;
//   };
//   teamSize: {
//     min: number;
//     max: number;
//   };
//   expertise: {
//     software: string[];
//     methodologies: string[];
//     certifications: string[];
//   };
// }

// export interface ProducerProfile extends BaseProfile {
//   producerType: ('Executive' | 'Line' | 'Associate' | 'Co')[];
//   investments: Array<{
//     projectType: string;
//     amount: number;
//     year: number;
//   }>;
//   connections: {
//     investors: string[];
//     distributors: string[];
//     studios: string[];
//   };
// }

// // Enhanced role and permission configurations
// export const FilmProjectRoles = {
//   PRE_PRODUCTION: [
//     'ScriptWriter',
//     'StoryboardArtist',
//     'CastingDirector',
//     'LocationScout',
//     'ProductionDesigner'
//   ],
//   PRODUCTION: [
//     'Director',
//     'Producer',
//     'LineProducer',
//     'ProductionManager',
//     'FirstAD'
//   ],
//   POST_PRODUCTION: [
//     'Editor',
//     'SoundDesigner',
//     'Colorist',
//     'VFXSupervisor',
//     'Compositor'
//   ],
//   DISTRIBUTION: [
//     'DistributionManager',
//     'MarketingManager',
//     'SalesAgent',
//     'FestivalCoordinator'
//   ]
// } as const;

// export type ProjectRole = typeof FilmProjectRoles[keyof typeof FilmProjectRoles][number];

// export const ProjectPermissions = {
//   ADMIN: [
//     'manage:all',
//     'delete:project',
//     'manage:team',
//     'manage:budget'
//   ],
//   MANAGER: [
//     'edit:project',
//     'manage:team',
//     'view:budget',
//     'create:tasks'
//   ],
//   MEMBER: [
//     'view:project',
//     'edit:tasks',
//     'upload:files',
//     'comment:all'
//   ],
//   GUEST: [
//     'view:project',
//     'comment:limited'
//   ]
// } as const;

// // Enhanced user system types
// export interface ExtendedUser extends User {
//   subscription: {
//     plan: 'free' | 'pro' | 'enterprise';
//     features: string[];
//     limits: {
//       storage: number;
//       teamSize: number;
//       projectsCount: number;
//     };
//     billing: {
//       status: 'active' | 'past_due' | 'canceled';
//       interval: 'monthly' | 'yearly';
//       nextBilling?: Date;
//     };
//   };
//   profiles: {
//     creative?: CreativeProfile;
//     talent?: TalentProfile;
//     ngo?: NGOProfile;
//     creator?: CreatorProfile;
//     manager?: ProjectManagerProfile;
//     producer?: ProducerProfile;
//   };
//   professional: {
//     reel?: string;
//     resume?: string;
//     portfolio?: string[];
//     recommendations: Array<{
//       from: string;
//       role: string;
//       text: string;
//       date: Date;
//     }>;
//     achievements: Array<{
//       title: string;
//       description: string;
//       date: Date;
//       verified: boolean;
//     }>;
//   };
//   network: {
//     connections: string[];
//     following: string[];
//     followers: string[];
//     blocked: string[];
//   };
//   activity: {
//     lastProjects: string[];
//     contributions: Array<{
//       projectId: string;
//       role: string;
//       hours: number;
//       date: Date;
//     }>;
//     engagements: Array<{
//       type: 'comment' | 'review' | 'collaboration';
//       targetId: string;
//       date: Date;
//     }>;
//   };
// }

// // Project-specific types
// export interface ProjectMember {
//   userId: string;
//   role: ProjectRole;
//   permissions: string[];
//   joinedAt: Date;
//   status: 'active' | 'inactive' | 'pending';
//   availability: {
//     startDate: Date;
//     endDate?: Date;
//     hoursPerWeek?: number;
//   };
// }

// export interface ProjectBudget {
//   total: number;
//   allocated: Record<string, number>;
//   spent: Record<string, number>;
//   currency: string;
//   lastUpdated: Date;
//   approvedBy?: string;
// }

// export interface ProjectTimeline {
//   start: Date;
//   end: Date;
//   milestones: Array<{
//     title: string;
//     date: Date;
//     completed: boolean;
//   }>;
//   phases: Array<{
//     name: string;
//     start: Date;
//     end: Date;
//     progress: number;
//   }>;
// }

// // types/user.ts
// import { Type, Static } from '@sinclair/typebox';
// import { UUID_PATTERN } from './store/common';

// export const UserRole = Type.Union([
//   Type.Literal('buyer'),
//   Type.Literal('seller'),
//   Type.Literal('creator'),
//   Type.Literal('volunteer'),
//   Type.Literal('admin'),
//   Type.Literal('project-owner')
// ]);
// export type UserRole = Static<typeof UserRole>;

// export const CreatorSpecialty = Type.Union([
//   Type.Literal('director'),
//   Type.Literal('cinematographer'),
//   Type.Literal('editor'),
//   Type.Literal('sound-engineer'),
//   Type.Literal('vfx-artist')
// ]);
// export type CreatorSpecialty = Static<typeof CreatorSpecialty>;

// export const VolunteerSkill = Type.Union([
//   Type.Literal('first-aid'),
//   Type.Literal('teaching'),
//   Type.Literal('construction'),
//   Type.Literal('translation'),
//   Type.Literal('it-support')
// ]);
// export type VolunteerSkill = Static<typeof VolunteerSkill>;

// export const OnboardingStage = Type.Union([
//   Type.Literal('role-selection'),
//   Type.Literal('basic-info'),
//   Type.Literal('role-specific-info'),
//   Type.Literal('verification'),
//   Type.Literal('completed')
// ]);
// export type OnboardingStage = Static<typeof OnboardingStage>;

// export const BaseUser = Type.Object({
//   id: Type.RegExp(UUID_PATTERN),
//   email: Type.String({ format: 'email' }),
//   phone: Type.Optional(Type.String({ pattern: '^\\+?[0-9]{7,15}$' })),
//   avatar: Type.Optional(Type.String({ format: 'uri' })),
//   roles: Type.Array(UserRole, { minItems: 1 }),
//   createdAt: Type.String({ format: 'date-time' }),
//   updatedAt: Type.String({ format: 'date-time' }),
//   onboarding: Type.Object({
//     currentStage: OnboardingStage,
//     completedStages: Type.Array(OnboardingStage),
//     roleSpecificStages: Type.Partial(
//       Type.Record(UserRole, Type.Array(OnboardingStage))
//     )
//   }),
//   isVerified: Type.Boolean()
// });

// export const SellerProfile = Type.Object({
//   storeName: Type.Optional(Type.String({ maxLength: 50 })),
//   businessLicense: Type.Optional(Type.String()),
//   paymentMethods: Type.Array(Type.String(), { minItems: 1 }),
//   totalSales: Type.Number({ minimum: 0 }),
//   sellerRating: Type.Number({ minimum: 0, maximum: 5 }),
//   taxInfo: Type.Optional(Type.Object({
//     ein: Type.Optional(Type.String({ pattern: '^\\d{2}-\\d{7}$' })),
//     vat: Type.Optional(Type.String({ pattern: '^[A-Z]{2}\\d{8,12}$' }))
//   }))
// });

// export const CreatorProfile = Type.Object({
//   specialties: Type.Array(CreatorSpecialty, { minItems: 1 }),
//   portfolio: Type.Optional(Type.Array(Type.String({ format: 'uri' }))),
//   imdbLink: Type.Optional(Type.String({ pattern: 'imdb\\.com' })),
//   unionMemberships: Type.Optional(Type.Array(Type.String())),
//   equipmentList: Type.Optional(Type.Array(Type.String()))
// });

// export const ProjectOwnerProfile = Type.Object({
//   currentProjects: Type.Array(Type.String()),
//   pastProjects: Type.Array(Type.String()),
//   organization: Type.Optional(Type.String())
// });


// export const Schedule = Type.Object({
//   availability: Type.Array(
//     Type.Object({
//       day: Type.Union([
//         Type.Literal('monday'),
//         Type.Literal('tuesday'),
//         Type.Literal('wednesday'),
//         Type.Literal('thursday'),
//         Type.Literal('friday'),
//         Type.Literal('saturday'),
//         Type.Literal('sunday')
//       ]),
//       startTime: Type.String({ pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$' }),
//       endTime: Type.String({ pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$' }),
//       available: Type.Boolean()
//     }),
//     { minItems: 1 }
//   ),
//   timezone: Type.String({ pattern: '^[A-Za-z_]+/[A-Za-z_]+$' }), // IANA timezone format
//   recurring: Type.Boolean(),
//   exceptions: Type.Optional(
//     Type.Array(
//       Type.Object({
//         date: Type.String({ format: 'date' }),
//         available: Type.Boolean(),
//         reason: Type.Optional(Type.String({ maxLength: 100 }))
//       })
//     )
//   )
// });
// export type Schedule = Static<typeof Schedule>;

// export const BackgroundCheck = Type.Object({
//   checkDate: Type.String({ format: 'date-time' }),
//   status: Type.Union([
//     Type.Literal('pending'),
//     Type.Literal('approved'),
//     Type.Literal('rejected'),
//     Type.Literal('expired')
//   ]),
//   expirationDate: Type.String({ format: 'date-time' }),
//   documentId: Type.Optional(Type.RegExp(UUID_PATTERN)),
//   verificationMethod: Type.Union([
//     Type.Literal('automated'),
//     Type.Literal('manual-review'),
//     Type.Literal('third-party')
//   ]),
//   notes: Type.Optional(Type.String({ maxLength: 500 }))
// });
// export type BackgroundCheck = Static<typeof BackgroundCheck>;



// export const VolunteerProfile = Type.Object({
//   skills: Type.Array(VolunteerSkill, { minItems: 1 }),
//   availability: Schedule,
//   backgroundCheck: Type.Optional(BackgroundCheck),
//   hoursLogged: Type.Number({ minimum: 0 }),
//   certifications: Type.Array(Type.String())
// });

// export const User = Type.Composite([
//   BaseUser,
//   Type.Object({
//     firstName: Type.String({ maxLength: 50 }),
//     lastName: Type.String({ maxLength: 50 }),
//     location: Type.Optional(Type.String()),
//     bio: Type.Optional(Type.String({ maxLength: 500 })),
//     website: Type.Optional(Type.String({ format: 'uri' })),
//     socialMedia: Type.Optional(Type.Record(Type.String(), Type.String({ format: 'uri' }))),
    
//     sellerProfile: Type.Optional(SellerProfile),
//     creatorProfile: Type.Optional(CreatorProfile),
//     volunteerProfile: Type.Optional(VolunteerProfile),
//     projectOwnerProfile: Type.Optional(ProjectOwnerProfile),

//     settings: Type.Object({
//       notifications: Type.Object({
//         email: Type.Boolean(),
//         sms: Type.Boolean(),
//         push: Type.Boolean()
//       }),
//       theme: Type.Union([
//         Type.Literal('light'),
//         Type.Literal('dark'),
//         Type.Literal('system')
//       ]),
//       language: Type.String({ pattern: '^[a-z]{2,3}(-[A-Z]{2})?$' }) // BCP 47 pattern
//     })
//   })
// ]);
// export type User = Static<typeof User>;

// export const OnboardingPayload = Type.Object({
//   role: UserRole,
//   userData: Type.Partial(User),
//   stepComplete: Type.Boolean()
// });
// export type OnboardingPayload = Static<typeof OnboardingPayload>;

// export const RoleSpecificFormState = Type.Object({
//   role: UserRole,
//   data: Type.Record(Type.String(), Type.Any())
// });
// export type RoleSpecificFormState = Static<typeof RoleSpecificFormState>;
