import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type  NGOProject  from '@/types/ngo';

interface ProjectsSummaryProps {
  projects: NGOProject[];
}

export function ProjectsSummary({ projects }: ProjectsSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.slice(0, 5).map((project) => {
            const progress = (project.budget.allocated / project.budget.total) * 100;

            return (
              <div key={project.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {project.location.city}, {project.location.country}
                    </p>
                  </div>
                  <Badge variant="outline">{project.status}</Badge>
                </div>
                <Progress value={progress} />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${project.budget.allocated.toLocaleString()}</span>
                  <span>${project.budget.total.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
