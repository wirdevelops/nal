export interface DocumentaryData {
    subject?: string;
    researchStatus?: 'not-started' | 'in-progress' | 'completed';
    intervieweeCount?: number;
    style?: 'observational' | 'participatory' | 'expository' | 'reflexive';
    archivalFootage?: boolean;
    locations?: string[];
    expectedDuration?: number;
    subjectMatter?: string;
  }