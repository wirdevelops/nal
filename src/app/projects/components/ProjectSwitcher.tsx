'use client';

import { useRouter } from 'next/navigation';
import { ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProjectStore } from '@/stores/useProjectStore';

interface ProjectSwitcherProps {
  currentProjectId: string;
}

export function ProjectSwitcher({ currentProjectId }: ProjectSwitcherProps) {
  const router = useRouter();
  const { projects } = useProjectStore();
  const currentProject = projects.find(p => p.id === currentProjectId);

  if (!currentProject) return null;

  const handleProjectSwitch = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  const handleNewProject = () => {
    router.push('/projects');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          <div className="flex items-center gap-2 truncate">
            <div className="flex flex-col items-start">
              <span className="truncate font-medium">{currentProject.title}</span>
              <span className="text-xs text-muted-foreground truncate">
                {currentProject.type}
              </span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuLabel>Switch Project</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {projects
          .filter(p => p.id !== currentProjectId)
          .map((project) => (
            <DropdownMenuItem
              key={project.id}
              onClick={() => handleProjectSwitch(project.id)}
            >
              <div className="flex flex-col w-full">
                <span className="font-medium">{project.title}</span>
                <span className="text-xs text-muted-foreground">
                  {project.type}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleNewProject}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}