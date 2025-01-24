import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Film } from 'lucide-react';

export default function EmptyProjects({ onCreateClick, canCreate = false }) {
  return (
    <div className="text-center py-20">
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-primary/10 p-4">
          <Film className="w-8 h-8 text-primary" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
      
      <div className="max-w-md mx-auto space-y-4">
        <p className="text-muted-foreground">
          {canCreate 
            ? "Get started by creating your first project. Track progress, manage team members, and collaborate effectively."
            : "Projects will appear here once they are created. Contact a project owner to get started."}
        </p>
        
        {canCreate && (
          <Button size="lg" onClick={onCreateClick}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Project
          </Button>
        )}
      </div>
    </div>
  );
}