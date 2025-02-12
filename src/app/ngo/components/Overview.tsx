import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, DollarSign, Users, Clock } from 'lucide-react';
import type { NGOProject } from '@/types/ngo';

interface OverviewProps {
  project: NGOProject;
}

export function Overview({ project }: OverviewProps) {
  const progress = (project.budget.allocated / project.budget.total) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Allocated</p>
              <p className="text-2xl font-bold">
                ${project.budget.allocated.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold">
                ${project.budget.total.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground">
                <Users className="w-4 h-4 mr-2" />
                Beneficiaries
              </div>
              <p className="text-2xl font-bold">
                {project.beneficiaries.length.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground">
                <CalendarDays className="w-4 h-4 mr-2" />
                Duration
              </div>
              <p className="text-2xl font-bold">
                {project.duration} days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
