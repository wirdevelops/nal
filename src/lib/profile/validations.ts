// @/lib/profile/validations.ts
import * as z from 'zod';
import { ObjectId } from 'mongodb';

// Shared Schemas
const socialMediaSchema = z.object({
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
  instagram: z.string().url().optional(),
  facebook: z.string().url().optional()
});

const experienceSchema = z.object({
  title: z.string().min(1),
  role: z.string().min(1),
  duration: z.string().min(1),
  description: z.string().optional()
});

const verificationDataSchema = z.object({
  identificationType: z.enum(['id-card', 'passport', 'driver-license']).optional(),
  identificationNumber: z.string().optional(),
  issuingAuthority: z.string().optional(),
  dateOfIssue: z.string().optional(),
  expiryDate: z.string().optional(),
  proofOfAddress: z.string().optional()
});

const baseProfileSchema = z.object({
  id: z.instanceof(ObjectId).optional(),
  userId: z.instanceof(ObjectId),
  role: z.string(),
  skills: z.array(z.string()).optional(),
  experience: z.array(experienceSchema).optional(),
  portfolio: z.array(z.string().url()).optional(),
  availability: z.date().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().url().optional(),
  socialMedia: socialMediaSchema.optional(),
  phone: z.string().optional(),
  verificationData: verificationDataSchema.optional()
});

// Specific Profile Schemas
export const actorProfileSchema = baseProfileSchema.extend({
  actingStyles: z.array(z.string()).optional(),
  reels: z.array(z.string().url()).optional(),
  unionStatus: z.string().optional(),
  headshot: z.string().url().optional()
});

export const partnerSchema = z.object({
  name: z.string(),
  type: z.enum(['corporate', 'government', 'non-profit', 'individual']),
  partnershipLevel: z.enum(['strategic', 'financial', 'operational']).optional(),
  contactPerson: z.string().optional(),
  contactEmail: z.string().email().optional()
});

export const projectSchema = z.object({
  id: z.instanceof(ObjectId).optional(),
  title: z.string(),
  genre: z.string(),
  productionType: z.enum(['film', 'tv', 'commercial', 'theater', 'web-series', 'podcast', 'other']),
  status: z.enum(['development', 'pre-production', 'production', 'post-production', 'released']),
  budgetRange: z.string().optional(),
  filmingLocations: z.array(z.string()).optional(),
  synopsis: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional()
});

// Add similar comprehensive schemas for other profile types...
export const ngoProfileSchema = baseProfileSchema.extend({
  organizationName: z.string(),
  registrationNumber: z.string(),
  focusAreas: z.array(z.enum([
    'education', 'environment', 'healthcare', 'human-rights', 
    'community-development', 'technology', 'emergency', 
    'women-empowering', 'child'
  ])).optional(),
  partners: z.array(partnerSchema).optional(),
  impactMetrics: z.record(z.number()).optional(),
  hoursLogged: z.number().optional(),
  background: z.string().optional(),
  annualBudget: z.number().optional()
});

// More profile schemas can follow similar patterns...
export const vendorProfileSchema = baseProfileSchema.extend({
  businessName: z.string(),
  storeName: z.string().optional(),
  sellerRating: z.number().optional(),
  services: z.array(z.string()).optional(),
  paymentMethods: z.array(z.string()).optional(),
  inventory: z.array(z.object({
    category: z.string(),
    items: z.array(z.string()).optional()
  })).optional()
});