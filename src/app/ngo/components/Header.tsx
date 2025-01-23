import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Share2, Heart, Users } from 'lucide-react';
import type { NGOProject } from '@/types/ngo';

interface HeaderProps {
  project: NGOProject;
  onEdit?: () => void;
  onDonate?: () => void;
  onVolunteer?: () => void;
}

export function Header({ project, onEdit, onDonate, onVolunteer }: HeaderProps) {
  return (
    <Card>
      <CardContent className="py-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <Badge variant="outline">{project.status}</Badge>
            </div>
            <p className="text-muted-foreground text-lg">
              {project.description}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {project.location.city}, {project.location.country}
            </p>
          </div>
          <div className="flex gap-2">
            {onDonate && (
              <Button onClick={onDonate}>
                <Heart className="w-4 h-4 mr-2" />
                Donate
              </Button>
            )}
            {onVolunteer && (
              <Button variant="outline" onClick={onVolunteer}>
                <Users className="w-4 h-4 mr-2" />
                Volunteer
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" onClick={onEdit}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}