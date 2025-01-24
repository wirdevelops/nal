// @types/ngo/impactStory.ts
export type ImpactCategoryType = 
  | 'education'
  | 'health'
  | 'environment'
  | 'poverty'
  | 'gender-equality'
  | 'economic-development'
  | 'disaster-relief'
  | 'community';

export interface ImpactStory {
  id: string;
  title: string;
  description: string;
  image: string;
  category: ImpactCategoryType;
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

export interface ImpactCategory {
  id: string;
  name:ImpactCategoryType; 
  description: string;
  unit: string;
  icon?: string;
}

export interface ImpactMeasurement {
  id: string;
  categoryId: string;
  category: ImpactCategory;
  projectId: string;
  value: number;
  date: string;
  description?: string;
  evidence?: string[];
  volunteerHours?: number;
  beneficiaryOutcomes?: number;
  target?: number;
}

export interface ImpactGoal {
  id: string;
  categoryId: string;
  projectId: string;
  targetValue: number;
  deadline: string;
  progress: number;
  status: 'pending' | 'in-progress' | 'achieved' | 'missed';
}

export interface ImpactSummary {
  measurements: ImpactMeasurement[];
  goals: ImpactGoal[];
  progress: Record<string, number>;
  totalImpact: number;
  volunteerHours: number;
  goalsProgress: number;
  efficiency: number;
  impactTrend: number; // Should be number
  volunteerTrend: number; // Should be number
  efficiencyTrend: number; // Should be number
}