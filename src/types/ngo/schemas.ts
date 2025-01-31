// schemas/ngo/schemas.ts
import { Static, Type } from '@sinclair/typebox';
import { MediaType } from './project';
import { UUID_PATTERN } from '../common';


export const NGO_PROJECT_SCHEMA = Type.Object({
  id: Type.String({ format: 'uuid' }),
  url: Type.String(),
  impactStories: Type.Array(Type.Any()),
  media: Type.Array(Type.Any()),
  // ... rest of the schema definition
  gallery: Type.Array(
    Type.Object({
      id: Type.String({ format: 'uuid' }),
      url: Type.String(),
      type: Type.Enum(MediaType),
      caption: Type.Optional(Type.String())
    })
  ),
  // ... rest of the schema definition
  
});


export const IMPACT_CATEGORY_SCHEMA = Type.Object({
  id: Type.RegExp(UUID_PATTERN),
  name: Type.String(),
  description: Type.String(),
  unit: Type.String(),
  icon: Type.Optional(Type.String())
});

export const ImpactStorySchema = Type.Object({
  id: Type.RegExp(UUID_PATTERN),
  title: Type.String(),
  description: Type.String(),
  image: Type.String(),
  category: Type.Union([
    Type.Literal('education'),
    Type.Literal('health'),
    Type.Literal('environment'),
    Type.Literal('poverty'),
    Type.Literal('gender-equality'),
    Type.Literal('economic-development'),
    Type.Literal('disaster-relief'),
    Type.Literal('community')
  ]),
  location: Type.Object({
    city: Type.String(),
    country: Type.String()
  }),
  beneficiary: Type.Object({
    name: Type.String(),
    avatar: Type.Optional(Type.String()),
    quote: Type.String(),
    age: Type.Optional(Type.Number()),
    background: Type.Optional(Type.String())
  }),
  stats: Type.Object({
    peopleHelped: Type.Number(),
    volunteersInvolved: Type.Number(),
    duration: Type.String(),
    investmentAmount: Type.Optional(Type.Number()),
    returnOnInvestment: Type.Optional(Type.Number())
  }),
  engagement: Type.Object({
    likes: Type.Number(),
    comments: Type.Number(),
    shares: Type.Number()
  }),
  metadata: Type.Object({
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    verified: Type.Boolean(),
    status: Type.Union([
      Type.Literal('draft'),
      Type.Literal('published'),
      Type.Literal('archived')
    ]),
    tags: Type.Array(Type.String())
  })
});

export const ImpactMeasurementSchema = Type.Object({
  id: Type.RegExp(UUID_PATTERN),
  categoryId: Type.RegExp(UUID_PATTERN),
  projectId: Type.RegExp(UUID_PATTERN),
  value: Type.Number({ minimum: 0 }),
  date: Type.String({ format: 'date-time' }),
  description: Type.Optional(Type.String()),
  evidence: Type.Optional(Type.Array(Type.String())),
  volunteerHours: Type.Optional(Type.Number()),
  beneficiaryOutcomes: Type.Optional(Type.Number()),
  target: Type.Optional(Type.Number())
});

export const ImpactGoalSchema = Type.Object({
  id: Type.RegExp(UUID_PATTERN),
  categoryId: Type.RegExp(UUID_PATTERN),
  projectId: Type.RegExp(UUID_PATTERN),
  targetValue: Type.Number({ minimum: 0 }),
  deadline: Type.String({ format: 'date-time' }),
  progress: Type.Number({ minimum: 0, maximum: 100 }),
  status: Type.Union([
    Type.Literal('pending'),
    Type.Literal('in-progress'),
    Type.Literal('achieved'),
    Type.Literal('missed')
  ])
});

// Re-export types for convenience
export type ImpactCategory = Static<typeof IMPACT_CATEGORY_SCHEMA>;
export type ImpactStory = Static<typeof ImpactStorySchema>;
export type ImpactMeasurement = Static<typeof ImpactMeasurementSchema>;
export type ImpactGoal = Static<typeof ImpactGoalSchema>;