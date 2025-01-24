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