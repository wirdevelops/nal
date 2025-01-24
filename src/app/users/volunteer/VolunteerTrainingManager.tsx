'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const trainings = [
  { id: 1, name: 'Safety Training', progress: 85, dueDate: '2024-03-15' },
  { id: 2, name: 'Data Privacy', progress: 45, dueDate: '2024-04-01' },
  { id: 3, name: 'Project Management', progress: 100, dueDate: '2024-02-20' },
];

export function VolunteerTrainingManager() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Training Progress</CardTitle>
        <Button variant="outline">Assign Training</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {trainings.map(training => (
          <div key={training.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{training.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Due: {new Date(training.dueDate).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={training.progress === 100 ? 'default' : 'secondary'}>
                {training.progress}% Complete
              </Badge>
            </div>
            <Progress value={training.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}