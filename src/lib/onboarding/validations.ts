// src/lib/onboarding/validations.ts
import { z } from 'zod';

export const basicInfoSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  location: z.string().min(2).max(100),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  dateOfBirth: z.date().refine(dob => {
    const age = new Date().getFullYear() - dob.getFullYear();
    return age >= 18;
  }, 'Must be at least 18 years old'),
  bio: z.string().max(500).optional()
});

export const roleDetailsSchema = z.object({
  primaryRole: z.string().min(1),
  secondaryRoles: z.array(z.string()).optional(),
  skills: z.array(z.string()).min(3).max(15),
  experienceLevel: z.enum(['beginner', 'intermediate', 'expert'])
});

export const verificationSchema = z.object({
  documentType: z.enum(['id_card', 'passport', 'drivers_license']),
  documentFrontUrl: z.string().url(),
  documentBackUrl: z.string().url().optional(),
  selfieUrl: z.string().url()
});