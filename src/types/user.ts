// types/user.ts
import { Type, Static } from '@sinclair/typebox';
import { UUID_PATTERN } from './store/common';

export type AuthMethod = 'email' | 'google' | 'github' | 'apple';
export type SubscriptionPlan = 'basic' | 'pro' | 'enterprise';

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  deviceId?: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  backupCodes?: string[];
  recentDevices: Array<{
    id: string;
    name: string;
    lastUsed: Date;
    location?: string;
  }>;
}

export interface NotificationSettings {
  email: {
    promotions: boolean;
    security: boolean;
    updates: boolean;
  };
  push: {
    messages: boolean;
    reminders: boolean;
  };
  sms: {
    alerts: boolean;
  };
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'connections-only';
  dataSharing: {
    analytics: boolean;
    marketing: boolean;
  };
}

export interface UserPreferences {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
  };
}

export interface UserLimits {
  maxProjects: number;
  storage: {
    total: number;
    used: number;
  };
}

export interface UserSubscription {
  plan: SubscriptionPlan;
  status: 'active' | 'expired' | 'canceled';
  renewalDate: Date;
  paymentMethod?: string;
}

export interface User extends BaseUser {
  // Auth and security
  authMethod: AuthMethod;
  sessions: AuthSession[];
  security: SecuritySettings;
  
  // Preferences
  preferences: UserPreferences;
  notifications: NotificationSettings;
  privacy: PrivacySettings;

  // Subscription and limits
  subscription?: UserSubscription;
  limits: UserLimits;

  // Relationships
  connections: string[];
  blockedUsers: string[];

  // Metadata
  lastActive: Date;
  deletedAt?: Date;
}

export const UserRole = Type.Union([
  Type.Literal('buyer'),
  Type.Literal('seller'),
  Type.Literal('creator'),
  Type.Literal('volunteer'),
  Type.Literal('admin'),
  Type.Literal('project-owner')
]);
export type UserRole = Static<typeof UserRole>;

export const CreatorSpecialty = Type.Union([
  Type.Literal('director'),
  Type.Literal('cinematographer'),
  Type.Literal('editor'),
  Type.Literal('sound-engineer'),
  Type.Literal('vfx-artist')
]);
export type CreatorSpecialty = Static<typeof CreatorSpecialty>;

export const VolunteerSkill = Type.Union([
  Type.Literal('first-aid'),
  Type.Literal('teaching'),
  Type.Literal('construction'),
  Type.Literal('translation'),
  Type.Literal('it-support')
]);
export type VolunteerSkill = Static<typeof VolunteerSkill>;

export const OnboardingStage = Type.Union([
  Type.Literal('role-selection'),
  Type.Literal('basic-info'),
  Type.Literal('role-specific-info'),
  Type.Literal('verification'),
  Type.Literal('completed')
]);
export type OnboardingStage = Static<typeof OnboardingStage>;

export const BaseUser = Type.Object({
  id: Type.RegExp(UUID_PATTERN),
  email: Type.String({ format: 'email' }),
  phone: Type.Optional(Type.String({ pattern: '^\\+?[0-9]{7,15}$' })),
  avatar: Type.Optional(Type.String({ format: 'uri' })),
  roles: Type.Array(UserRole, { minItems: 1 }),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  onboarding: Type.Object({
    currentStage: OnboardingStage,
    completedStages: Type.Array(OnboardingStage),
    roleSpecificStages: Type.Partial(
      Type.Record(UserRole, Type.Array(OnboardingStage))
    )
  }),
  isVerified: Type.Boolean()
});

export const SellerProfile = Type.Object({
  storeName: Type.Optional(Type.String({ maxLength: 50 })),
  businessLicense: Type.Optional(Type.String()),
  paymentMethods: Type.Array(Type.String(), { minItems: 1 }),
  totalSales: Type.Number({ minimum: 0 }),
  sellerRating: Type.Number({ minimum: 0, maximum: 5 }),
  taxInfo: Type.Optional(Type.Object({
    ein: Type.Optional(Type.String({ pattern: '^\\d{2}-\\d{7}$' })),
    vat: Type.Optional(Type.String({ pattern: '^[A-Z]{2}\\d{8,12}$' }))
  }))
});

export const CreatorProfile = Type.Object({
  specialties: Type.Array(CreatorSpecialty, { minItems: 1 }),
  portfolio: Type.Optional(Type.Array(Type.String({ format: 'uri' }))),
  imdbLink: Type.Optional(Type.String({ pattern: 'imdb\\.com' })),
  unionMemberships: Type.Optional(Type.Array(Type.String())),
  equipmentList: Type.Optional(Type.Array(Type.String()))
});

export const ProjectOwnerProfile = Type.Object({
  currentProjects: Type.Array(Type.String()),
  pastProjects: Type.Array(Type.String()),
  organization: Type.Optional(Type.String())
});


export const Schedule = Type.Object({
  availability: Type.Array(
    Type.Object({
      day: Type.Union([
        Type.Literal('monday'),
        Type.Literal('tuesday'),
        Type.Literal('wednesday'),
        Type.Literal('thursday'),
        Type.Literal('friday'),
        Type.Literal('saturday'),
        Type.Literal('sunday')
      ]),
      startTime: Type.String({ pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$' }),
      endTime: Type.String({ pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$' }),
      available: Type.Boolean()
    }),
    { minItems: 1 }
  ),
  timezone: Type.String({ pattern: '^[A-Za-z_]+/[A-Za-z_]+$' }), // IANA timezone format
  recurring: Type.Boolean(),
  exceptions: Type.Optional(
    Type.Array(
      Type.Object({
        date: Type.String({ format: 'date' }),
        available: Type.Boolean(),
        reason: Type.Optional(Type.String({ maxLength: 100 }))
      })
    )
  )
});
export type Schedule = Static<typeof Schedule>;

export const BackgroundCheck = Type.Object({
  checkDate: Type.String({ format: 'date-time' }),
  status: Type.Union([
    Type.Literal('pending'),
    Type.Literal('approved'),
    Type.Literal('rejected'),
    Type.Literal('expired')
  ]),
  expirationDate: Type.String({ format: 'date-time' }),
  documentId: Type.Optional(Type.RegExp(UUID_PATTERN)),
  verificationMethod: Type.Union([
    Type.Literal('automated'),
    Type.Literal('manual-review'),
    Type.Literal('third-party')
  ]),
  notes: Type.Optional(Type.String({ maxLength: 500 }))
});
export type BackgroundCheck = Static<typeof BackgroundCheck>;

export const VolunteerProfile = Type.Object({
  skills: Type.Array(VolunteerSkill, { minItems: 1 }),
  availability: Schedule,
  backgroundCheck: Type.Optional(BackgroundCheck),
  hoursLogged: Type.Number({ minimum: 0 }),
  certifications: Type.Array(Type.String())
});

export const User = Type.Composite([
  BaseUser,
  Type.Object({
    firstName: Type.String({ maxLength: 50 }),
    lastName: Type.String({ maxLength: 50 }),
    location: Type.Optional(Type.String()),
    bio: Type.Optional(Type.String({ maxLength: 500 })),
    website: Type.Optional(Type.String({ format: 'uri' })),
    socialMedia: Type.Optional(Type.Record(Type.String(), Type.String({ format: 'uri' }))),
    
    sellerProfile: Type.Optional(SellerProfile),
    creatorProfile: Type.Optional(CreatorProfile),
    volunteerProfile: Type.Optional(VolunteerProfile),
    projectOwnerProfile: Type.Optional(ProjectOwnerProfile),

    settings: Type.Object({
      notifications: Type.Object({
        email: Type.Boolean(),
        sms: Type.Boolean(),
        push: Type.Boolean()
      }),
      theme: Type.Union([
        Type.Literal('light'),
        Type.Literal('dark'),
        Type.Literal('system')
      ]),
      language: Type.String({ pattern: '^[a-z]{2,3}(-[A-Z]{2})?$' }) // BCP 47 pattern
    })
  })
]);
export type User = Static<typeof User>;

export const OnboardingPayload = Type.Object({
  role: UserRole,
  userData: Type.Partial(User),
  stepComplete: Type.Boolean()
});
export type OnboardingPayload = Static<typeof OnboardingPayload>;

export const RoleSpecificFormState = Type.Object({
  role: UserRole,
  data: Type.Record(Type.String(), Type.Any())
});
export type RoleSpecificFormState = Static<typeof RoleSpecificFormState>;
