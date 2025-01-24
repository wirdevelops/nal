// components/project-analytics.tsx
import { useNGOProject } from '@/hooks/useNGOProject';
import { AnalyticCard } from './AnalyticCard';
import { ProjectMetrics } from '@/types/ngo/project';

export const ProjectMetricsDashboard = ({ projectId }: { projectId?: string }) => {
  const { 
    calculateMetrics, 
    getProjectMetrics,
    isLoading,
    error 
  } = useNGOProject();

  // Get metrics based on context (global vs project-specific)
  const metrics = projectId ? getProjectMetrics(projectId) : calculateMetrics();
  const trendData = metrics.correlationData;

  // Common configuration for metric cards
  const metricConfigs: {
    key: keyof ProjectMetrics;
    title: string;
    formatter: (value: number) => string;
    chartType: 'line' | 'bar' | 'area';
    color: string;
  }[] = [
    {
      key: 'donations',
      title: 'Total Donations',
      formatter: (val) => `$${val.toLocaleString()}`,
      chartType: 'bar',
      color: '#2563eb'
    },
    {
      key: 'volunteers',
      title: 'Active Volunteers',
      formatter: (val) => val.toLocaleString(),
      chartType: 'line',
      color: '#16a34a'
    },
    {
      key: 'impactScore',
      title: 'Impact Score',
      formatter: (val) => `${Math.round(val)} pts`,
      chartType: 'area',
      color: '#9333ea'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metricConfigs.map((config) => (
        <AnalyticCard
          key={config.key}
          title={config.title}
          value={config.formatter(metrics[config.key] as number)}
          data={trendData}
          chartType={config.chartType}
          isLoading={isLoading}
          error={error}
          config={{
            xKey: 'date',
            yKey: config.key === 'donations' ? 'donations' : 'volunteerHours',
            color: config.color,
            tooltip: (value) => config.formatter(value)
          }}
          trend={calculateTrend(trendData, config.key)}
        />
      ))}
    </div>
  );
};

// Helper to calculate trend percentage from correlation data
function calculateTrend(data: ProjectMetrics['correlationData'], metricKey: string): number {
  if (data.length < 2) return 0;
  
  const first = data[0][metricKey as keyof (typeof data)[0]] as number;
  const last = data[data.length - 1][metricKey as keyof (typeof data)[0]] as number;
  
  if (first === 0) return last > 0 ? 100 : 0;
  return ((last - first) / first) * 100;
}