import { z } from 'zod';

import type { ValidationResult, ProjectCreationData } from '@/types/validation';
import type { ProjectType } from '@/types/project';

const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateProjectCreation(data: ProjectCreationData): ValidationResult {
  const errors: ValidationResult['errors'] = [];

  // Validate required fields
  if (!data.title?.trim()) {
    errors.push({
      field: 'title',
      message: 'Title is required'
    });
  }

  if (!data.type) {
    errors.push({
      field: 'type',
      message: 'Project type is required'
    });
  }

  // Validate thumbnail if present
  if (data.thumbnailFile) {
    if (data.thumbnailFile.size > MAX_THUMBNAIL_SIZE) {
      errors.push({
        field: 'thumbnailFile',
        message: 'Thumbnail must be less than 2MB'
      });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(data.thumbnailFile.type)) {
      errors.push({
        field: 'thumbnailFile',
        message: 'Thumbnail must be a JPEG, PNG, or WebP image'
      });
    }
  }

  // Validate dates
  if (data.startDate && data.targetDate) {
    if (data.targetDate < data.startDate) {
      errors.push({
        field: 'targetDate',
        message: 'Target date must be after start date'
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validator for type-specific data
export function validateTypeSpecificData(
  type: ProjectType,
  data: Record<string, any>
): ValidationResult {
  const errors: ValidationResult['errors'] = [];

  switch (type) {
    case 'feature':
      if (data.runtime && (data.runtime < 1 || data.runtime > 999)) {
        errors.push({
          field: 'runtime',
          message: 'Runtime must be between 1 and 999 minutes'
        });
      }
      break;

    case 'series':
      if (data.numberOfSeasons && data.numberOfSeasons < 1) {
        errors.push({
          field: 'numberOfSeasons',
          message: 'Number of seasons must be at least 1'
        });
      }
      break;

    case 'commercial':
      if (!data.client?.trim()) {
        errors.push({
          field: 'client',
          message: 'Client name is required'
        });
      }
      break;

    // Add validation for other project types
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Helper to format validation errors for toast/display
export function formatValidationErrors(errors: ValidationResult['errors']): string {
  return errors
    .map(error => `${error.field}: ${error.message}`)
    .join('\n');
}

// Common validation schema for all project types
const commonValidation = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  startDate: z.date().optional(),
  targetDate: z.date().optional(),
});

// Feature Film validation
export const featureFilmValidation = commonValidation.extend({
  scriptStage: z.enum(['concept', 'treatment', 'first-draft', 'final-draft']).optional(),
  genre: z.string().optional(),
  runtime: z.number().min(1).max(999).optional(),
  targetMarket: z.enum(['domestic', 'international', 'both']).optional(),
  distributionStrategy: z.enum(['theatrical', 'streaming', 'festival', 'hybrid']).optional(),
  rights: z.object({
    scriptRights: z.boolean(),
    musicRights: z.boolean(),
    distributionRights: z.boolean(),
  }).optional(),
});

// TV Series validation
export const seriesValidation = commonValidation.extend({
  numberOfSeasons: z.number().min(1).optional(),
  episodesPerSeason: z.number().min(1).optional(),
  episodeDuration: z.number().min(1).max(180).optional(),
  platform: z.string().optional(),
  format: z.enum(['scripted', 'unscripted', 'documentary']).optional(),
});

// Documentary validation
export const documentaryValidation = commonValidation.extend({
  subject: z.string().optional(),
  researchStatus: z.enum(['not-started', 'in-progress', 'completed']).optional(),
  intervieweeCount: z.number().min(0).optional(),
  style: z.enum(['observational', 'participatory', 'expository', 'reflexive']).optional(),
  archivalFootage: z.boolean().optional(),
  locations: z.array(z.string()).optional(),
});

// Commercial validation
export const commercialValidation = commonValidation.extend({
  client: z.string().min(1, 'Client name is required'),
  brand: z.string().optional(),
  duration: z.number().min(5).max(120),
  platform: z.array(z.string()).optional(),
  budget: z.number().min(0).optional(),
  format: z.enum(['tv', 'digital', 'social', 'hybrid']).optional(),
});

// Music Video validation
export const musicVideoValidation = commonValidation.extend({
  artist: z.string().min(1, 'Artist name is required'),
  songTitle: z.string().min(1, 'Song title is required'),
  duration: z.number().min(30).optional(),
  performanceType: z.enum(['lip-sync', 'live', 'narrative', 'conceptual']).optional(),
  specialEffects: z.boolean().optional(),
});

// Web Series validation
export const webSeriesValidation = commonValidation.extend({
  episodeCount: z.number().min(1).optional(),
  episodeDuration: z.number().min(1).optional(),
  releaseSchedule: z.enum(['all-at-once', 'weekly', 'bi-weekly', 'monthly']).optional(),
  format: z.enum(['scripted', 'vlog', 'educational', 'entertainment']).optional(),
});

// Animation validation
export const animationValidation = commonValidation.extend({
  style: z.enum(['2d', '3d', 'stop-motion', 'mixed-media']).optional(),
  frameRate: z.number().min(12).max(60).optional(),
  resolution: z.string().optional(),
  renderEngine: z.string().optional(),
});

// Function to validate project data based on type
export function validateProject(type: string, data: any) {
  const validationSchemas = {
    feature: featureFilmValidation,
    series: seriesValidation,
    documentary: documentaryValidation,
    commercial: commercialValidation,
    music_video: musicVideoValidation,
    web_series: webSeriesValidation,
    animation: animationValidation,
  };

  const schema = validationSchemas[type as keyof typeof validationSchemas];
  if (!schema) {
    throw new Error(`No validation schema found for project type: ${type}`);
  }

  return schema.parse(data);
}