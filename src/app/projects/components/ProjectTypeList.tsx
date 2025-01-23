'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { projectTypes, ProjectType } from './projectTypes';


interface ProjectTypeListProps {
  selectedType: ProjectType | null; // Allow no selection
  onTypeSelect: (type: ProjectType) => void;
  onClose: () => void;
}

export function ProjectTypeList({
  selectedType,
  onTypeSelect,
  onClose
}: ProjectTypeListProps) {
  return (
    <div className="w-64 border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create New Project</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="py-2">
          {projectTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => onTypeSelect(type)}
                className={cn(
                  "w-full px-4 py-2 flex items-center gap-3 hover:bg-muted transition-colors",
                  selectedType?.id === type.id && "bg-muted"
                )}
              >
                <Icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}