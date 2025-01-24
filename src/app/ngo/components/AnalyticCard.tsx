import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, LucideIcon } from 'lucide-react';

interface ChartConfig {
  xKey: string;
  yKey: string;
  color?: string;
  strokeWidth?: number;
  tooltip?: (value: number) => string;
}

interface AnalyticCardProps {
  title: string;
  value: string | number;
  data: Array<Record<string, any>>;
  chartType: 'line' | 'bar' | 'area';
  config: ChartConfig;
  trend?: number;
  className?: string;
  isLoading?: boolean;
  error?: string | null;
}

const TrendIndicator = ({ value }: { value: number }) => {
  const isPositive = value >= 0;
  const Icon = isPositive ? ArrowUp : ArrowDown;
  
  return (
    <div className={cn(
      "flex items-center gap-1 text-sm font-medium",
      isPositive ? "text-green-600" : "text-red-600"
    )}>
      <Icon className="h-4 w-4" />
      {Math.abs(value).toFixed(1)}%
    </div>
  );
};

export const AnalyticCard = ({
  title,
  value,
  data,
  chartType,
  config,
  trend,
  className,
  isLoading = false,
  error = null
}: AnalyticCardProps) => {
  const ChartComponent = {
    line: LineChart,
    bar: BarChart,
    area: AreaChart
  }[chartType];

  const ChartElement: React.ElementType = {
    line: Line,
    bar: Bar,
    area: Area
  }[chartType];

  if (error) {
    return (
      <Card className={cn("border-destructive", className)}>
        <CardContent className="p-6 text-destructive">
          Error: {error}
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <AnalyticCard.Skeleton />;
  }

  return (
    <Card className={cn("hover:shadow-md transition-all", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {typeof trend === 'number' && <TrendIndicator value={trend} />}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-bold">{value}</div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={config.xKey} 
                tick={{ fontSize: 12 }}
                tickFormatter={value => 
                  new Date(value).toLocaleDateString('en-US', { month: 'short' })
                }
              />
              <YAxis width={80} />
              <Tooltip
  content={({ active, payload }) => {
    if (!active || !payload?.length) return null;
    
    // Safely parse the numeric value
    const rawValue = payload[0].value;
    const numericValue = typeof rawValue === 'number' 
      ? rawValue 
      : parseFloat(String(rawValue));

    return (
      <div className="bg-background p-4 rounded-lg shadow-lg border">
        <p className="font-medium">
          {new Date(payload[0].payload[config.xKey]).toLocaleDateString()}
        </p>
        <p className="text-sm">
          {config.tooltip 
            ? config.tooltip(numericValue)
            : numericValue.toLocaleString()}
        </p>
      </div>
    );
  }}
/>
              <ChartElement
                type="monotone"
                dataKey={config.yKey}
                stroke={config.color || '#8884d8'}
                fill={config.color || '#8884d8'}
                strokeWidth={config.strokeWidth || 2}
              />
              {chartType === 'area' && (
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.color || '#8884d8'} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={config.color || '#8884d8'} stopOpacity={0}/>
                </linearGradient>
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

AnalyticCard.Skeleton = function AnalyticCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-[120px]" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-6 w-[80px]" />
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
    </Card>
  );
};