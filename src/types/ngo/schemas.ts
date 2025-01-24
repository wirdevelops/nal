// schemas/ngo/schemas.ts
import { Type } from '@sinclair/typebox';
import { MediaType } from './project';

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
  // ... other properties
});