import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { projectTypes } from '../config/projectTypes';

interface FilteredCreateButtonProps {
  activeFilters: string[];
  onClick: (projectType: string) => void;
}

export function FilteredCreateButton({ activeFilters, onClick }: FilteredCreateButtonProps) {
  const typeFilter = activeFilters.find(filter => filter.startsWith('type:'));
  
  if (!typeFilter) return null;
  
  const projectTypeId = typeFilter.split(':')[1].toLowerCase().replace(' ', '_');
  const projectType = projectTypes.find(type => type.id === projectTypeId);
  
  if (!projectType) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
      <span className="text-sm text-muted-foreground">
        Looking to create a new {projectType.label}?
      </span>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onClick(projectTypeId)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Create {projectType.label}
      </Button>
    </div>
  );
}