// src/app/ngo/dashboard/MetricsOverview.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Heart, Target, Landmark } from 'lucide-react';
import { useNGOProjectStore } from '@/stores/useNGOProjectStore';
import { Skeleton } from '@/components/ui/skeleton';

export function MetricsOverview() {
  const { calculateMetrics, isLoading, error } = useNGOProjectStore();
  const metrics = calculateMetrics();

  if (error) {
    return (
        <div className="text-red-500">
          Error loading metrics: {error}
        </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-6 w-[80px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Volunteers</p>
              <h3 className="text-2xl font-bold">{metrics.volunteers.toLocaleString()}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
{/* 
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Donations</p>
              <h3 className="text-2xl font-bold">${metrics.donations.toLocaleString()}</h3>
            </div>
          </div>
        </CardContent>
      </Card> */}
{/* 
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Impact Goals Met</p>
              <h3 className="text-2xl font-bold">{metrics.fundingUtilization.toFixed(0)}%</h3>
            </div>
          </div>
        </CardContent>
      </Card> */}

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Landmark className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <h3 className="text-2xl font-bold">{useNGOProjectStore.getState().projects.length}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}