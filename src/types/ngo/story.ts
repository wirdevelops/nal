import { ReactNode } from "react";

export interface StoryAuthor {
    id: string;
    name: string;
    avatar?: string;
    role: string;
    organization: string;
  }
  
  export interface StoryBeneficiary {
    name: string;
    avatar?: string;
    quote: string;
    location: string;
  }
  
  export enum StoryCategory {
    EDUCATION = "Education",
    HEALTH = "Health",
    ENVIRONMENT = "Environment",
    COMMUNITY = "Community",
    EMERGENCY = "Emergency Relief"
  }

  export interface Story {
  imageUrl: string;
  isFeatured: any;
  date: string | number | Date;
  author: any;
  likesCount: ReactNode;
  commentsCount: ReactNode;
  sharesCount: ReactNode;
  readTimeMinutes: ReactNode;
  excerpt: string;
  content: string;
  metadata: any;
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  beneficiary: {
    name: string;
    avatar?: string;
    quote: string;
  };
  stats: {
    peopleHelped: number;
    volunteersInvolved: number;
    duration: string;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

  
  export type StoryCreateDTO = Omit<Story, 'id' | 'createdAt' | 'updatedAt' | 'likesCount' | 'commentsCount' | 'sharesCount'>;
  export type StoryUpdateDTO = Partial<StoryCreateDTO>;