'use client';

import { useNGOProject } from '@/hooks/useNGOProject';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statusConfig: Record<string, { title: string; color: string }> = {
  total: { title: 'Total Projects', color: 'bg-blue-500' },
  ongoing: { title: 'Active', color: 'bg-green-500' },
  completed: { title: 'Completed', color: 'bg-purple-500' },
  planned: { title: 'Planned', color: 'bg-yellow-500' },
  on_hold: { title: 'On Hold', color: 'bg-orange-500' },
};

export const StatsCards = () => {
  const { projects, getProjectsByStatus, isLoading } = useNGOProject();
  
  const stats = {
    total: projects.length,
    ongoing: getProjectsByStatus('ongoing').length,
    completed: getProjectsByStatus('completed').length,
    planned: getProjectsByStatus('planned').length,
    on_hold: getProjectsByStatus('on_hold').length,
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {Object.entries(stats).map(([key, value]) => (
        <Card key={key} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {statusConfig[key].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${statusConfig[key].color}`} />
              <span className="text-2xl font-bold">{value}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};