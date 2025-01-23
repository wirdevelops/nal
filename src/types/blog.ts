import { z } from 'zod';

// Blog post status
export type PostStatus = 'draft' | 'published' | 'archived' | 'scheduled';

// Blog post visibility
export type PostVisibility = 'public' | 'private' | 'team';

// User type
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  role: "admin" | "editor" | "author" | "contributor";
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    github?: string;
    website?: string
  };
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  // Add other relevant user properties here
}

// Post category type
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  color?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

// Post tag type
export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

// Comment type with threading support
export interface Comment {
  id: string;
  postId: string;
  author: Pick<User, 'id'| 'username' | 'fullName' | 'avatar'>;
  parentId?: string; // For nested comments
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'deleted';
  createdAt: string;
  updatedAt: string;
  likes: number;
  metadata?: {
    editHistory?: {
      content: string;
      editedAt: string;
    }[];
    reports?: {
      userId: string;
      reason: string;
      timestamp: string;
    }[];
  };
}

// Rich content section type
export interface ContentSection {
  id: string;
  type: 'text' | 'image' | 'video' | 'code' | 'quote' | 'embed' | 'gallery';
  content: string;
  metadata?: {
    caption?: string;
    alt?: string;
    language?: string; // For code blocks
    citation?: string; // For quotes
    attributes?: Record<string, string>;
  };
}

// Media type
export interface Media {
    id: string;
    url: string;
    type: 'image' | 'video' | 'audio' | 'document';
    altText?: string;
    caption?: string;
    uploadedBy: string;
    uploadDate: string;
    metadata?: Record<string, unknown>;
}

// SEO metadata
export interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  robots?: string;
  structuredData?: Record<string, unknown>;
}

// Analytics data
export interface PostAnalytics {
  views: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  bounceRate: number;
  shares: {
    facebook: number;
    twitter: number;
    linkedin: number;
  };
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  geoData: Record<string, number>; // Country code -> visit count
}

// Main BlogPost interface
export interface BlogPost {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: ContentSection[];
  status: PostStatus;
  visibility: PostVisibility;
  featuredImage?: Media;
  categories: string[]; // Category IDs
  tags: string[]; // Tag IDs
  author: Pick<User, 'id'| 'username'| 'fullName' | 'avatar'>;
  coAuthors?: Pick<User, 'id'| 'username'| 'fullName' | 'avatar'>[];
  publishedAt?: string;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    wordCount: number;
    readingTime: number;
    revision: number;
    lastEditedBy: string;
    customFields?: Record<string, unknown>;
  };
  seo?: SEOMetadata;
  analytics?: PostAnalytics;
}

// Types for creating/updating posts
export type CreatePostData = Omit<BlogPost,
    'id' | 'createdAt' | 'updatedAt' | 'metadata' | 'analytics'
    >;

export type UpdatePostData = Partial<Omit<BlogPost,
    'id' | 'createdAt' | 'updatedAt'
    >>;