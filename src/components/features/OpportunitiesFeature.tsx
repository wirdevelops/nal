import React from 'react';
import { Briefcase } from 'lucide-react';

const OpportunitiesFeature = () => {
  return (
    <div className="flex flex-col items-center p-6 rounded-lg shadow-md bg-card">
      <div className="p-4 rounded-full bg-primary-foreground text-primary mb-4">
        <Briefcase className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-center">Opportunities</h3>
      <p className="text-center text-muted-foreground">
        Explore job boards, casting calls, and NGO projects.
      </p>
    </div>
  );
};

export default OpportunitiesFeature;
