import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Calendar,
  DollarSign,
  Clock,
  BarChart,
  CheckSquare,
  AlertCircle
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn} from '@/lib/utils';

// Timeline Overview Card
export function TimelineOverviewCard({ 
  startDate,
  targetDate,
  phase,
  progress 
}: any) {
  const start = new Date(startDate);
  const end = targetDate ? new Date(targetDate) : null;
  const today = new Date();

  const totalDays = end ? 
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) : 
    0;
  
  const daysElapsed = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Timeline</CardTitle>
          <Badge variant="outline">{phase}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Start Date</span>
              <p className="font-medium">{format(start, 'MMM d, yyyy')}</p>
            </div>
            {end && (
              <div>
                <span className="text-sm text-muted-foreground">Target Date</span>
                <p className="font-medium">{format(end, 'MMM d, yyyy')}</p>
              </div>
            )}
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Days Elapsed</span>
              <span className="font-medium">{daysElapsed} / {totalDays}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Budget Overview Card
export function BudgetOverviewCard({ budget, expenses }: any) {
  const totalBudget = budget || 0;
  const totalExpenses = expenses?.reduce((acc: number, exp: any) => acc + exp.amount, 0) || 0;
  const remainingBudget = totalBudget - totalExpenses;
  const budgetProgress = totalBudget ? (totalExpenses / totalBudget) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Budget</CardTitle>
          <Button variant="ghost" size="sm">
            <DollarSign className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Spent</span>
              <span className="font-medium">{budgetProgress.toFixed(1)}%</span>
            </div>
            <Progress value={budgetProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Total Budget</span>
              <p className="font-medium">${totalBudget.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Remaining</span>
              <p className="font-medium">${remainingBudget.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Tasks Overview Card
export function TasksOverviewCard({ tasks }: any) {
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((task: any) => task.status === 'completed').length || 0;
  const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  const upcomingTasks = tasks?.filter((task: any) => 
    task.status !== 'completed' && new Date(task.dueDate) > new Date()
  ).slice(0, 3) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Tasks</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{completedTasks}/{totalTasks}</Badge>
            <Button variant="ghost" size="sm">
              <CheckSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {upcomingTasks.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Upcoming</span>
              {upcomingTasks.map((task: any, index: number) => (
                <div 
                  key={task.id} 
                  className={cn(
                    "flex items-center justify-between py-1",
                    index !== upcomingTasks.length - 1 && "border-b"
                  )}
                >
                  <span className="text-sm truncate">{task.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(task.dueDate), 'MMM d')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Issues Overview Card
export function IssuesOverviewCard({ issues }: any) {
  const openIssues = issues?.filter((issue: any) => issue.status === 'open') || [];
  const criticalIssues = openIssues.filter((issue: any) => issue.priority === 'critical');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Issues</CardTitle>
          <div className="flex items-center gap-2">
            {criticalIssues.length > 0 && (
              <Badge variant="destructive">{criticalIssues.length}</Badge>
            )}
            <Button variant="ghost" size="sm">
              <AlertCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Open</span>
              <p className="font-medium">{openIssues.length}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Critical</span>
              <p className="font-medium text-destructive">
                {criticalIssues.length}
              </p>
            </div>
          </div>

          {openIssues.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Recent Issues</span>
              {openIssues.slice(0, 3).map((issue: any, index: number) => (
                <div 
                  key={issue.id} 
                  className={cn(
                    "flex items-center justify-between py-1",
                    index !== 2 && "border-b"
                  )}
                >
                  <span className="text-sm truncate">{issue.title}</span>
                  <Badge 
                    variant={issue.priority === 'critical' ? 'destructive' : 'secondary'}
                  >
                    {issue.priority}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}