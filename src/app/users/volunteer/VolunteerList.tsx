import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Calendar, Scale } from 'lucide-react';
import type { TimeLog, Volunteer } from '@/types/ngo/volunteer';
import { BackgroundCheck} from '@/types/ngo/volunteer';
import { Checkbox } from '@/components/ui/checkbox';

interface VolunteerListProps {
  volunteers: Volunteer[];
  onVolunteerSelect?: (volunteerId: string) => void;
  onVolunteerToggle?: (volunteerId: string) => void;
  selectedVolunteers?: string[];
}

export function VolunteerList({ 
  volunteers, 
  onVolunteerSelect,
  onVolunteerToggle,
  selectedVolunteers = []
}: VolunteerListProps) {
  const getInitials = (userId: string) => userId.slice(0, 2).toUpperCase();

  const getTotalHours = (logs: TimeLog[]) => 
    logs.reduce((sum, log) => sum + log.hours, 0);

  const formatDate = (isoDate: string) => 
    new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  const handleToggle = (e: React.MouseEvent, volunteerId: string) => {
    e.stopPropagation();
    onVolunteerToggle?.(volunteerId);
  };

  return (
    <div className="space-y-4">
      {volunteers.map((volunteer) => (
        <Card
          key={volunteer.id}
          className="cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => onVolunteerSelect?.(volunteer.id)}
        >
          <CardContent className="flex items-start gap-4 p-4">
            {onVolunteerToggle && (
              <Checkbox
                checked={selectedVolunteers.includes(volunteer.id)}
                onClick={(e) => handleToggle(e, volunteer.id)}
                className="mt-1"
              />
            )}
            
            <Avatar className="h-10 w-10">
              <AvatarFallback>{getInitials(volunteer.userId)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Volunteer #{volunteer.userId.slice(0, 6)}</h3>
                  <p className="text-sm text-muted-foreground">
                    Joined {formatDate(volunteer.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    volunteer.background === BackgroundCheck.APPROVED ? 'default' : 'destructive'
                  }>
                    {volunteer.background.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{getTotalHours(volunteer.hours)}h</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{volunteer.projects.length} projects</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{volunteer.availability.days.length} days</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Scale className="h-4 w-4" />
                  <span>{volunteer.skills.length} skills</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {volunteer.skills.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary"
                    className="capitalize"
                  >
                    {skill.toLowerCase().replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}