// utils/blog.ts
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  username: z.string().optional(),
  fullName: z.string().optional(),
  avatar: z.string().optional(),
})

// Media schema
export const mediaSchema = z.object({
    id: z.string(),
    url: z.string(),
    type: z.enum(['image', 'video', 'audio', 'document']),
    altText: z.string().optional(),
    caption: z.string().optional(),
    uploadedBy: z.string(),
    uploadDate: z.string(),
    metadata: z.record(z.any()).optional(),
  });

export const contentSectionSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'image', 'video', 'code', 'quote', 'embed', 'gallery']),
  content: z.string(),
  metadata: z.object({
    caption: z.string().optional(),
    alt: z.string().optional(),
    language: z.string().optional(),
    citation: z.string().optional(),
    attributes: z.record(z.string()).optional(),
  }).optional(),
});

export const blogPostSchema = z.object({
  projectId: z.string(),
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().max(500).optional(),
  content: z.array(contentSectionSchema),
  status: z.enum(['draft', 'published', 'archived', 'scheduled']),
  visibility: z.enum(['public', 'private', 'team']),
  featuredImage: mediaSchema.optional(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  author: userSchema.pick({id: true, username: true, fullName: true, avatar: true}),
    coAuthors: z.array(userSchema.pick({id: true, username: true, fullName: true, avatar: true})).optional(),
  publishedAt: z.string().datetime().optional(),
  scheduledFor: z.string().datetime().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(500).optional(),
  parentId: z.string().optional(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
  coverImage: z.string().url().optional(),
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(2000),
  parentId: z.string().optional(),
   author: userSchema.pick({id: true, username: true, fullName: true, avatar: true})
});

export const postMetadataSchema = z.object({
    wordCount: z.number().optional(),
    readingTime: z.number().optional(),
    revision: z.number().optional(),
    lastEditedBy: z.string().optional(),
    customFields: z.record(z.any()).optional()
  }).optional()

export const postAnalyticsSchema = z.object({
   views: z.number().optional(),
   uniqueVisitors: z.number().optional(),
   averageTimeOnPage: z.number().optional(),
    bounceRate: z.number().optional(),
   shares: z.object({
     facebook: z.number().optional(),
     twitter: z.number().optional(),
      linkedin: z.number().optional(),
   }).optional(),
    deviceBreakdown: z.object({
      desktop: z.number().optional(),
     mobile: z.number().optional(),
      tablet: z.number().optional(),
   }).optional(),
  geoData: z.record(z.number()).optional(),
  }).optional()