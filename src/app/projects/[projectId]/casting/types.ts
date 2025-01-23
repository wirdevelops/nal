export interface CastMember {
    id: string;
    name: string;
    role: string;
    status: 'Confirmed' | 'In Consideration' | 'Pending';
    imageUrl: string;
    contactInfo?: string;
    notes?: string;
  }
  
  export interface CrewMember {
    id: string;
    name: string;
    role: string;
    department: string;
    imageUrl: string;
    contactInfo?: string;
    status: 'Active' | 'On Leave' | 'Completed';
  }
  
  export interface Audition {
    id: string;
    role: string;
    date: string;
    time: string;
    location: string;
    applicants: number;
    status: 'Scheduled' | 'In Progress' | 'Completed';
    notes?: string;
  }
  
  export interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
  }