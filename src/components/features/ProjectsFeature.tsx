import React from 'react';
import { Film } from 'lucide-react';

const ProjectsFeature = () => {
  return (
    <div className="flex flex-col items-center p-6 rounded-lg shadow-md bg-card">
      <div className="p-4 rounded-full bg-primary-foreground text-primary mb-4">
        <Film className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-center">Projects</h3>
      <p className="text-center text-muted-foreground">
        Manage film projects, ideas, teams, and more.
      </p>
    </div>
  );
};

export default ProjectsFeature;
