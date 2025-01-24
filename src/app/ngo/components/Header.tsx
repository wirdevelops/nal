// src/components/project-header.tsx
import { useNGOProject } from '@/hooks/useNGOProject';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Heart, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { NGOProject } from '@/types/ngo/project';

interface ProjectHeaderProps {
  projectId: string;
  onEdit?: () => void;
  onDonate?: () => void;
  onVolunteer?: () => void;
}

export function ProjectHeader({ projectId, onEdit, onDonate, onVolunteer }: ProjectHeaderProps) {
  const { getProjectById, isLoading } = useNGOProject();
  const project = getProjectById(projectId);

  if (isLoading) return <ProjectHeader.Skeleton />;

  if (!project) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <Badge 
              variant="outline"
              className={getStatusBadgeStyle(project.status)}
            >
              {project.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl">
            {project.description}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>📍 {project.location.city}, {project.location.country}</span>
            <span>•</span>
            <span>🕒 {formatProjectDuration(project)}</span>
          </div>
        </div>
        
        <div className="flex gap-2 flex-shrink-0">
          {onDonate && (
            <Button onClick={onDonate} size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Support Project
            </Button>
          )}
          {onVolunteer && (
            <Button variant="outline" onClick={onVolunteer} size="sm">
              <Users className="w-4 h-4 mr-2" />
              Join Team
            </Button>
          )}
          {onEdit && (
            <Button variant="outline" onClick={onEdit} size="sm">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Status badge styling
const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case 'ongoing':
      return 'border-green-600 text-green-600';
    case 'completed':
      return 'border-blue-600 text-blue-600';
    case 'on_hold':
      return 'border-yellow-600 text-yellow-600';
    default:
      return '';
  }
};

// Duration formatting
const formatProjectDuration = (project: NGOProject) => {
  const start = new Date(project.startDate);
  const end = project.endDate ? new Date(project.endDate) : null;
  
  if (end) {
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  }
  return `Started ${start.toLocaleDateString()}`;
};

ProjectHeader.Skeleton = function ProjectHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-6 w-[100px]" />
          </div>
          <Skeleton className="h-5 w-full max-w-3xl" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-[140px]" />
          <Skeleton className="h-9 w-[100px]" />
        </div>
      </div>
    </div>
  );
};