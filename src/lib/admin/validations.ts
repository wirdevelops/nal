// @/lib/admin/validations.ts
import * as z from 'zod';

const adminAccessLevels = [
  'super-admin', 
  'content-admin', 
  'user-admin', 
  'financial-admin'
] as const;

const adminManagedSections = [
  'users', 
  'content', 
  'projects', 
  'financial', 
  'marketplace', 
  'blog', 
  'podcast'
] as const;

export const roleSchema = z.object({
  name: z.string(),
  permissions: z.array(z.string()),
  isActive: z.boolean()
});

export const adminAccessLevelSchema = z.enum(adminAccessLevels);
export const adminManagedSectionSchema = z.enum(adminManagedSections);