// components/project-chart.tsx
import { useNGOProject } from '@/hooks/useNGOProject';
import { ProjectMetrics } from '@/types/ngo/project';
import ChartElement from './ChartElement';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectChartProps {
  projectId?: string;
  metricKey: keyof ProjectMetrics;
  chartType: 'line' | 'bar' | 'area';
  className?: string;
}

export const ProjectMetricChart = ({
  projectId,
  metricKey,
  chartType,
  className
}: ProjectChartProps) => {
  const { getProjectMetrics, calculateMetrics, isLoading, error } = useNGOProject();
  
  // Get appropriate metrics source
  const metrics = projectId ? getProjectMetrics(projectId) : calculateMetrics();
  const correlationData = metrics.correlationData;

  // Transform metrics data for chart
  const chartData = correlationData.map(entry => ({
    date: entry.date,
    value: entry[metricKey === 'donations' ? 'donations' : 'volunteerHours']
  }));

  if (error) {
    return (
      <div className={className}>
        <div className="text-destructive p-4 border rounded-lg">
          Error loading chart data: {error}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={className}>
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <ChartElement
      data={chartData}
      type={chartType}
      className={className}
      color={getChartColor(metricKey)}
      strokeWidth={2}
    />
  );
};

// Helper function for consistent metric colors
function getChartColor(metricKey: keyof ProjectMetrics): string {
  const colors: Record<keyof ProjectMetrics, string> = {
    impactScore: '#9333ea',
    volunteers: '#16a34a',
    donations: '#2563eb',
    socialShares: '#ca8a04',
    costPerBeneficiary: '#dc2626',
    volunteerImpactRatio: '#0891b2',
    fundingUtilization: '#4f46e5',
    correlationData: '#64748b' // This won't be used directly
  };

  return colors[metricKey] || '#8884d8';
}