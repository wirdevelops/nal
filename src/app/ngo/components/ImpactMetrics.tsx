import React, { useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart,
  Pie, Cell, Legend 
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, ArrowDown, LucideIcon, Target, Gauge, Activity, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImpactSummary, ImpactCategory, ImpactMeasurement, ImpactCategoryType } from '@/types/ngo/impactStory';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

interface TrendIndicatorProps {
  value: number;
  className?: string;
}

// Trend Indicator Component
const TrendIndicator = ({ value, className }: TrendIndicatorProps) => {
  const isPositive = value >= 0;
  const Icon = isPositive ? ArrowUp : ArrowDown;
  
  return (
    <div className={cn(
      "inline-flex items-center gap-1 text-sm font-medium",
      isPositive ? "text-green-600" : "text-red-600",
      className
    )}>
      <Icon className="h-4 w-4" />
      {Math.abs(value)}%
    </div>
  );
};

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  trendLabel,
  className 
}: MetricCardProps) {
  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <Icon className="h-5 w-5 text-muted-foreground" />
          {typeof trend === 'number' && (
            <div className={cn(
              "flex items-center text-sm font-medium",
              trend > 0 ? "text-green-600" : "text-red-600"
            )}>
              {trend > 0 ? "+" : ""}{trend.toFixed(1)}%
              {trendLabel && ` ${trendLabel}`}
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

MetricCard.Skeleton = function MetricCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>
    </Card>
  );
};

// Chart Card Component
export const ChartCard = ({ 
  title, 
  children, 
  className,
  isLoading = false
}: ChartCardProps) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full rounded-lg" />
        ) : (
          <div className="h-[300px] w-full">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Impact Metrics Component
interface ImpactMetricsProps {
  summary: ImpactSummary;
  categories: ImpactCategory[];
  isLoading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const ImpactMetrics = ({ summary, categories, isLoading }: ImpactMetricsProps) => {
  const calculateTrend = useCallback((data: { value: number }[]) => {
    if (data.length < 2) return 0;
    const current = data[data.length - 1].value;
    const previous = data[data.length - 2].value;
    return ((current - previous) / previous) * 100;
  }, []);

  if (isLoading) return <ImpactMetrics.Skeleton />;

  const processedData = useMemo(() => {
    return summary.impactTrend.map((impactPoint, index) => ({
      date: impactPoint.date,
      value: impactPoint.value,
      volunteers: summary.volunteerTrend[index]?.value || 0
    }));
  }, [summary.impactTrend, summary.volunteerTrend]);

  const categoryData = useMemo(() => {
    return categories.map(category => ({
      name: category.name,
      value: summary.measurements.filter(m => m.categoryId === category.id).length
    }));
  }, [categories, summary.measurements]);

  if (isLoading) return <ImpactMetrics.Skeleton />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Impact"
          value={summary.totalImpact.toLocaleString()}
          icon={Activity}
          trend={calculateTrend(summary.impactTrend)}
          trendLabel="vs previous period"
        />
        <MetricCard
          title="Volunteer Hours"
          value={summary.volunteerHours.toLocaleString()}
          icon={Users}
          trend={calculateTrend(summary.volunteerTrend)}
        />
        <MetricCard
          title="Goals Achieved"
          value={`${summary.goalsProgress}%`}
          icon={Target}
        />
        <MetricCard
          title="Efficiency"
          value={summary.efficiency.toFixed(2)}
          icon={Gauge}
          trend={calculateTrend(summary.efficiencyTrend)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Impact Over Time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={value => new Date(value).toLocaleDateString('en-US', {
                  month: 'short',
                  year: '2-digit'
                })}
              />
              <YAxis />
              <Tooltip
                content={({ payload }) => (
                  <div className="bg-background p-4 rounded-lg shadow-lg border">
                    <p className="font-medium">
                      {new Date(payload?.[0]?.payload.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      Impact: {payload?.[0]?.value.toLocaleString()}
                    </p>
                    <p className="text-sm">
                      Volunteers: {payload?.[0]?.payload.volunteers.toLocaleString()}
                    </p>
                  </div>
                )}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="volunteers"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={false}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground">
                    {value === 'value' ? 'Impact' : 'Volunteers'}
                  </span>
                )}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Impact Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
              >
                {categoryData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Legend 
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground">
                    {value}
                  </span>
                )}
              />
              <Tooltip
                content={({ payload }) => (
                  <div className="bg-background p-2 rounded-lg shadow-lg border text-sm">
                    <p className="font-medium">{payload?.[0]?.name}</p>
                    <p>{payload?.[0]?.value} measurements</p>
                  </div>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

ImpactMetrics.Skeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <MetricCard.Skeleton key={i} />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <ChartCard key={i} title="" isLoading>
          <div />
        </ChartCard>
      ))}
    </div>
  </div>
);