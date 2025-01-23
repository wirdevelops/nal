
'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectStatus } from '@/types/ngo';

interface StatsCardsProps {
  stats: {
    total: number;
    ongoing: number;
    completed: number;
    planned: number;
  };
  isLoading: boolean;
}

const statusConfig: Record<string, { title: string; color: string }> = {
  total: { title: 'Total Projects', color: 'bg-blue-500' },
  ongoing: { title: 'Active', color: 'bg-green-500' },
  completed: { title: 'Completed', color: 'bg-purple-500' },
  planned: { title: 'Planned', color: 'bg-yellow-500' },
};

export const StatsCards = ({ stats, isLoading }: StatsCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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