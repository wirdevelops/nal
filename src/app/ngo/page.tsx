import { Suspense } from 'react';

import { MetricsOverview } from './dashboard/MetricsOverview';
import { ProjectsSummary } from './dashboard/ProjectsSummary';
import { UpcomingEvents } from './dashboard/UpcomingEvents';
import { NewsPreview } from './dashboard/NewsPreview';
import { ImpactDashboard } from './components/ImpactDashBoard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';


export default function NGODashboardPage() {
  const defaultMetrics = {
    impactScore: 0,
    volunteers: 0,
    donations: 0,
    socialShares: 0,
    costPerBeneficiary: 0,
    volunteerImpactRatio: 0,
    fundingUtilization: 0,
    correlationData: []
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your organization's projects, impact, and activities
        </p>
      </div>

      <Suspense fallback={<MetricsSkeleton />}>
        <MetricsOverview />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<ComponentSkeleton />}>
          <ProjectsSummary projects={[]} />
        </Suspense>

        <Suspense fallback={<ComponentSkeleton />}>
          <UpcomingEvents />
        </Suspense>
      </div>

      <Suspense fallback={<ComponentSkeleton />}>
        <Card>
          <CardHeader>
            <CardTitle>Impact Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ImpactDashboard 
              metrics={defaultMetrics}
              stories={[]}
              projectId="overview"
              className="h-96"
            />
          </CardContent>
        </Card>
      </Suspense>

      <Suspense fallback={<ComponentSkeleton />}>
        <NewsPreview />
      </Suspense>
    </div>
  );
}

function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ComponentSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-48 w-full" />
      </CardContent>
    </Card>
  );
}