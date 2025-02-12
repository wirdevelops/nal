// src/lib/validations/onboarding.ts
import * as z from 'zod';

export const basicInfoSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().min(2, 'Location must be at least 2 characters').optional()
});

export const roleDetailsSchema = z.object({
  primaryRole: z.string(),
  experience: z.enum(['junior', 'mid', 'senior']),
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  interests: z.array(z.string()).optional()
});

export const verificationSchema = z.object({
  idDocument: z.any(), // Replace with proper file validation
  selfie: z.any(), // Replace with proper file validation
  agreement: z.boolean().refine(val => val === true, 'You must agree to the terms')
});
