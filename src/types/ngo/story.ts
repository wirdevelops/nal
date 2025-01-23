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
    id: string;
    title: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    category: StoryCategory;
    author: StoryAuthor;
    date: string;
    readTimeMinutes: number;
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    isFeatured: boolean;
    beneficiary?: StoryBeneficiary;
    projectId?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export type StoryCreateDTO = Omit<Story, 'id' | 'createdAt' | 'updatedAt' | 'likesCount' | 'commentsCount' | 'sharesCount'>;
  export type StoryUpdateDTO = Partial<StoryCreateDTO>;