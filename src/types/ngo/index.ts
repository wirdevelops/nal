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
    used?: number;
}


interface Milestone {
    id: string;
    title: string;
    description: string;
    dueDate: string; // ISO Date String
    status: string;
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
  role: string;
  joinDate: string;
  trainingCompleted: boolean;
  hoursContributed: number;
}

interface Training {
  id: string;
  name: string;
  completed: boolean;
  expirationDate?: string; // ISO Date
}


export interface ProjectMedia {
  id: string;
  url: string;
  type: 'image' | 'video' | 'document';
  caption?: string;
}