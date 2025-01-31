'use client'
import React, { useState, useMemo } from 'react';
import { ImpactStory } from '@/types/ngo/impactStory';
import { ProjectMetrics } from '@/types/ngo/project';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { Download, Share2, TrendingUp, Users, Clock, Target } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { AnalyticCard } from './AnalyticCard'; // Fixed import name
import { useImpact } from 'others/useImpact';
import { exportToJson } from '@/lib/export';
import { ImpactMetrics } from './ImpactMetrics';
import { ImpactStories } from './ImpactStories';
import { calculateTrendPercentage } from '@/utils/trend';
import { DateRange } from 'react-day-picker';

interface ImpactDashboardProps {
  metrics: ProjectMetrics;
  stories: ImpactStory[];
  projectId: string;
  className?: string;
}

export function ImpactDashboard({ 
  metrics,
  stories, 
  projectId, 
  className = '' 
}: ImpactDashboardProps) {
  const { getProjectImpactSummary, isLoading } = useImpact();

  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined
  });
  const summary = useMemo(() => 
    getProjectImpactSummary(projectId), 
    [projectId, dateRange]
  );

  const trendData = useMemo(() => 
    summary.measurements.map(m => ({
      date: m.date,
      value: m.value,
      target: m.target
    })),
    [summary.measurements]
  );

  const correlationData = useMemo(() => 
    summary.measurements.map(m => ({
      date: m.date,
      volunteerHours: m.volunteerHours,
      beneficiaryOutcomes: m.beneficiaryOutcomes,
      efficiency: m.beneficiaryOutcomes / (m.volunteerHours || 1)
    })),
    [summary.measurements]
  );

  const handleExport = () => {
    exportToJson({
      summary,
      correlationData,
      trendData
    }, `impact_data_${projectId}`);
  };

  const metricCards = [
    {
      title: 'Total Impact',
      value: summary.totalImpact,
      icon: Users,
      trend: summary.impactTrend // Ensure this is a number
    },
    {
      title: 'Volunteer Hours',
      value: summary.volunteerHours,
      icon: Clock,
      trend: summary.volunteerTrend // Ensure this is a number
    },
    {
      title: 'Goals Progress',
      value: `${summary.goalsProgress}%`,
      icon: Target,
      trend: null
    },
    {
      title: 'Efficiency Rate',
      value: summary.efficiency.toFixed(1),
      icon: TrendingUp,
      trend: summary.efficiencyTrend // Ensure this is a number
    }
  ];

  if (isLoading) {
    return <ImpactMetrics.Skeleton />;
  }

  return (
    <div className={`space-y-6 ${className}`}>
  <div className="flex justify-between items-center">
    <h1 className="text-3xl font-bold">Impact Dashboard</h1>
    <div className="flex gap-4">
    <DateRangePicker 
        dateRange={dateRange}
        onChange={(range) => setDateRange(range ?? { from: undefined, to: undefined })}
      />
      <Button onClick={handleExport} variant="outline">
        <Download className="mr-2 h-4 w-4" /> Export
      </Button>
      <Button variant="outline">
        <Share2 className="mr-2 h-4 w-4" /> Share
      </Button>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {metricCards.map((card, idx) => (
      <MetricCard 
        key={idx}
        title={card.title}
        value={card.value}
        icon={card.icon}
        trend={card.trend}  // Should now receive number|null
        className="min-h-[120px]"
      />
    ))}
  </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="stories">Impact Stories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <AnalyticCard 
              title="Impact Progress"
              value={summary.totalImpact}
              data={trendData}
              chartType="line"
              config={{
                xKey: 'date',
                yKey: 'value',
                color: '#10b981',
                tooltip: (value) => `${value} beneficiaries`
              }}
              trend={calculateTrendPercentage(trendData)}
            />
            <AnalyticCard
              title="Volunteer Hours"
              value={summary.volunteerHours}
              data={correlationData}
              chartType="bar"
              config={{
                xKey: 'date',
                yKey: 'volunteerHours',
                color: '#3b82f6',
                tooltip: (value) => `${value} hours`
              }}
              trend={calculateTrendPercentage(trendData)}
            />
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <AnalyticCard
              title="Beneficiary Outcomes"
              value={summary.totalImpact}
              data={correlationData}
              chartType="area"
              config={{
                xKey: 'date',
                yKey: 'beneficiaryOutcomes',
                color: '#8b5cf6',
                tooltip: (value) => `${value} people helped`
              }}
            />
            <AnalyticCard
              title="Operational Efficiency"
              value={`${summary.efficiency.toFixed(1)}x`}
              data={correlationData}
              chartType="line"
              config={{
                xKey: 'date',
                yKey: 'efficiency',
                color: '#f59e0b',
                tooltip: (value) => `${value.toFixed(2)} efficiency ratio`
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="stories">
        <ImpactStories 
  stories={stories.map(story => ({
    ...story,
    location: `${story.location.city}, ${story.location.country}`
  }))} 
/>
        </TabsContent>
      </Tabs>
    </div>
  );
}