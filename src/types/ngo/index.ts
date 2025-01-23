// src/types/ngo/index.ts

import { ProjectMetrics } from "./project";

// Enums for defined choices

enum ProjectCategory {
  EDUCATION = "education",
  HEALTH = "health",
  ENVIRONMENT = "environment",
  COMMUNITY_DEVELOPMENT = "community_development",
  EMERGENCY_RELIEF = "emergency_relief",
  OTHER = "other",
}

enum ProjectStatus {
  PLANNED = "planned",
  ONGOING = "ongoing",
  COMPLETED = "completed",
  ON_HOLD = "on_hold",
  CANCELLED = "cancelled",
}

enum DonationFrequency {
    ONE_TIME = "one_time",
    MONTHLY = "monthly",
    ANNUALLY = "annually",
    QUARTERLY = "quarterly",
}

enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded"
}

enum BackgroundCheck {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    IN_PROGRESS = "in_progress"
}

enum Skill {
  TEACHING = "teaching",
  ORGANIZATION = "organization",
  LEADERSHIP = "leadership",
  MEDICAL = "medical",
  LANGUAGE = "language",
  ART_DESIGN = "art_design",
    FILMING = "filming",
    EDITING = "editing",
    PROJECT_MANAGEMENT = "project_management",
    FUNDRAISING = "fundraising",
    COMMUNITY_OUTREACH = "community_outreach",
    DATA_ANALYSIS = "data_analysis",
    VOLUNTEER_COORDINATION = "volunteer_coordination",
    MARKETING_COMMUNICATIONS = "marketing_communications",
    OTHER = "other"
}

enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

// ----- Shared interfaces --------

interface Location {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
}

interface Budget {
    allocated: number;
    total: number;
    amount: number;
    currency: string;
    details?: string;
}

interface TeamMember {
    userId: string;
    name: string;
    role: string; // Example: Project Manager, Field Coordinator
    avatar?: string;
    department?: string;
}

interface Beneficiary {
    id: string;
    name: string;
    demographic?: string; // E.g., age range, location
    details?: string;
}

interface Milestone {
    id: string;
    title: string;
    description: string;
    dueDate: string; // ISO Date String
    status: string;
}

interface Media {
    type: MediaType;
    url: string;
    caption?: string;
    altText?:string;
  }

interface Update {
  id: string;
  date: string; // ISO Date String
  content: string;
  media?: Media[];
  authorId: string;
}

interface Report {
    id: string;
    title: string;
    date: string; // ISO Date String
    authorId: string;
    url: string;
    type: string;
  }
interface ImpactMetric {
  metric: string; // e.g. "People Served", "Trees Planted"
  value: number;
  date: string; //ISO Date String
  details?: string;
}

interface Schedule {
  days: string[]; // e.g., ["Monday", "Wednesday", "Friday"]
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
}

interface TimeLog {
    id: string; // Add ID for better data management
    projectId?: string; // Associate hours with specific projects
    verified: boolean; // Track approval status
    date: string; //ISO Date String
    hours: number;
    notes?: string;
  }

  interface Reference {
    id: string;
    name: string;
    relationship: string;
    contact: string;
    status: 'pending' | 'verified';
  }

interface Receipt {
    id: string;
    date: string; //ISO Date String
    url: string;
    details?: string;
}


// ---- Core NGO interfaces -----

interface NGOProject {
    metrics: ProjectMetrics;
    impactStories: ImpactStory[];
    media: NGOProject[];
    id: string;
    name: string;
    description: string;
    category: ProjectCategory;
    status: ProjectStatus;
    startDate: string; // ISO Date String
    endDate?: string;  // ISO Date String
    location: Location;
    budget: Budget;
    team: TeamMember[];
    beneficiaries: Beneficiary[];
    milestones: Milestone[];
    gallery: Media[];
    updates: Update[];
    reports: Report[];
    impact: ImpactMetric[];
    createdAt: string;  // ISO Date String
    updatedAt: string;  // ISO Date String
    duration: number;
    donors: Donor[];
}

export interface Donor {
  id: string;
  name: string;
  avatar?: string;
  amount: number;
  donatedAt: string;
  isAnonymous: boolean;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  message?: string;
}


interface Volunteer {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: Location;
  projects: string[];
  skills: Skill[];
  availability: Schedule;
  hours: TimeLog[];
  references: Reference[];
  background: BackgroundCheck;
  trainings: Training[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Training {
  id: string;
  name: string;
  completed: boolean;
  expirationDate?: string; // ISO Date
}

interface Donation {
    id: string;
    donorId: string; // Assuming you have a user ID system
    projectId?: string;  // Optional, if the donation is project-specific
    amount: number;
    frequency: DonationFrequency;
    status: PaymentStatus;
    receipt?: Receipt;
    impact?: ImpactMetric[];
    donationDate: string; // ISO Date String
    paymentMethod: string;
    createdAt: string;  // ISO Date String
    updatedAt: string;  // ISO Date String
}

export interface ImpactStory {
  id: string;
  title: string;
  description: string;
  image: string;
  category: ImpactCategory;
  location: {
    city: string;
    country: string;
  };
  beneficiary: {
    name: string;
    avatar?: string;
    quote: string;
    age?: number;
    background?: string;
  };
  stats: {
    peopleHelped: number;
    volunteersInvolved: number;
    duration: string;
    investmentAmount?: number;
    returnOnInvestment?: number;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    verified: boolean;
    status: 'draft' | 'published' | 'archived';
    tags: string[];
  };
}

export type ImpactCategory = 
  | 'education'
  | 'health'
  | 'environment'
  | 'poverty'
  | 'gender-equality'
  | 'economic-development'
  | 'disaster-relief'
  | 'community';

export interface ImpactMeasurement {
  date: string;
  value: number;
  target: number;
  volunteerHours: number;
  beneficiaryOutcomes: number;
  category: ImpactCategory;
  notes?: string;
}

export interface ImpactSummary {
  totalImpact: number;
  volunteerHours: number;
  goalsProgress: number;
  efficiency: number;
  impactTrend: number;
  volunteerTrend: number;
  efficiencyTrend: number;
  measurements: ImpactMeasurement[];
}

export type {NGOProject, Volunteer, Donation, Location, Budget, TeamMember, Beneficiary, Milestone, Media, Update, Report, ImpactMetric, Schedule, TimeLog, Reference, Receipt}
export {ProjectCategory, ProjectStatus, DonationFrequency, PaymentStatus, BackgroundCheck, Skill, MediaType}
