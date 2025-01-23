import { NGOProject, ProjectStatus } from '@/types/ngo/project';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Heart, Users, ExternalLink } from 'lucide-react';
import { formatDate, formatCurrency, formatDistance } from '@/lib/utils';

const statusVariant: Record<ProjectStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  [ProjectStatus.PLANNED]: 'secondary',
  [ProjectStatus.ONGOING]: 'default',
  [ProjectStatus.COMPLETED]: 'default',
  [ProjectStatus.ON_HOLD]: 'outline',
  [ProjectStatus.CANCELLED]: 'destructive',
};

interface ProjectCardProps {
  project: NGOProject;
  onDonate?: () => void;
  onVolunteer?: () => void;
  onClick?: () => void;
}

export const ProjectCard = ({ project, onDonate, onVolunteer, onClick }: ProjectCardProps) => {
  const {
    name,
    description,
    status,
    location,
    budget,
    beneficiaries,
    timeline,
    media
  } = project;

  const progress = (budget.used / budget.total) * 100;
  const hasActions = onDonate || onVolunteer;

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-video bg-muted">
          {media[0] && (
            <img
              src={media[0].url}
              alt={name}
              className="object-cover w-full h-full rounded-t-lg"
            />
          )}
          <Badge 
            variant={statusVariant[status]}
            className="absolute top-2 right-2 capitalize"
          >
            {status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{formatCurrency(budget.used)} used</span>
            <span>{formatCurrency(budget.total)} total</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Location</p>
            <p>{location.city}, {location.country}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Beneficiaries</p>
            <p>{beneficiaries.length.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Started</p>
            <p>{formatDate(timeline.startDate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Duration</p>
            <p>{formatDistance(new Date(timeline.startDate), new Date())}</p>
          </div>
        </div>
      </CardContent>

      {hasActions && (
        <CardFooter className="flex gap-2 p-4 pt-0">
          {onDonate && (
            <Button onClick={onDonate} className="flex-1">
              <Heart className="w-4 h-4 mr-2" />
              Donate
            </Button>
          )}
          {onVolunteer && (
            <Button variant="outline" onClick={onVolunteer} className="flex-1">
              <Users className="w-4 h-4 mr-2" />
              Volunteer
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};