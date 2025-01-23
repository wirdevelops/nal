// types/user.ts
export type UserRole = 'user' | 'creator' | 'seller' | 'admin';
export type CreatorSpecialty = 'director' | 'cinematographer' | 'editor' | 'writer' | 'producer' | 'sound' | 'colorist';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  
  // Professional Info
  specialties?: CreatorSpecialty[];
  yearsOfExperience?: number;
  portfolio?: {
    website?: string;
    showreel?: string;
    socialLinks?: {
      vimeo?: string;
      youtube?: string;
      instagram?: string;
      linkedin?: string;
    }
  };

  // Project Related
  projects: string[]; // Project IDs user is involved in
  ownedProjects: string[]; // Project IDs user has created
  collaborations?: {
    projectId: string;
    role: string;
    status: 'active' | 'completed' | 'pending';
  }[];

  // Creator/Professional Details
  professionalDetails?: {
    equipment?: string[]; // Equipment they own/operate
    skills?: string[];
    certificates?: {
      name: string;
      issuer: string;
      year: number;
    }[];
    languages?: string[];
    locations?: string[]; // Areas they work in
    ratePerDay?: number;
    availability?: {
      status: 'available' | 'busy' | 'contact';
      nextAvailable?: string;
    };
  };

  // Seller Features (when user is also a seller)
  sellerProfile?: {
    isVerified: boolean;
    rating: number;
    totalSales: number;
    joinedAsSellerDate: string;
    shopName?: string;
    products: string[]; // Product IDs
    paymentDetails?: {
      type: 'paypal' | 'bank' | 'stripe';
      email?: string;
      accountDetails?: string;
    };
    policies?: {
      returns?: string;
      shipping?: string;
      warranty?: string;
    };
  };

  // Activity & Stats
  stats?: {
    completedProjects: number;
    totalCollaborations: number;
    averageRating: number;
    reviewCount: number;
    successRate: number;
  };

  // Preferences & Settings
  preferences?: {
    projectTypes: string[]; // Types of projects they're interested in
    notificationSettings: {
      email: boolean;
      push: boolean;
      projectUpdates: boolean;
      messages: boolean;
    };
    visibility: {
      profile: 'public' | 'private' | 'connections';
      portfolio: 'public' | 'private' | 'connections';
      contact: 'public' | 'private' | 'connections';
    };
  };
}

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    projectUpdates: boolean;
    messages: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'connections';
    showEmail: boolean;
    showPhone: boolean;
  };
  communication: {
    emailFrequency: 'daily' | 'weekly' | 'important';
    emailTypes: string[];
  };
}