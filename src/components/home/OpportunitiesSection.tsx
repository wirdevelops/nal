interface Opportunity {
    type: 'job' | 'casting' | 'volunteer';
    title: string;
    description: string;
    deadline: string;
    requirements: string[];
    location: string;
  }