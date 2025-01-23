// components/ChartElement.tsx
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
  } from 'recharts';
  import { cn } from '@/lib/utils';
  import { calculateTrendPercentage, calculateTrend } from '@/utils/trend';
  
  interface ChartElementProps {
    data: Array<{ date: string; value: number }>;
    type: 'line' | 'bar' | 'area';
    color?: string;
    strokeWidth?: number;
    showTrend?: boolean;
    className?: string;
  }
  
  export const ChartElement = ({
    data,
    type,
    color = '#8884d8',
    strokeWidth = 2,
    showTrend = true,
    className
  }: ChartElementProps) => {
    const currentValue = data[data.length - 1]?.value || 0;
    const trend = showTrend ? calculateTrend(data) : null;
  
    const renderChart = () => {
      switch (type) {
        case 'line':
          return (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={date => new Date(date).toLocaleDateString('en-US', { month: 'short' })}
              />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={strokeWidth}
                dot={false}
              />
            </LineChart>
          );
        
        case 'bar':
          return (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={date => new Date(date).toLocaleDateString('en-US', { month: 'short' })}
              />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                fill={color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          );
        
        case 'area':
          return (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={date => new Date(date).toLocaleDateString('en-US', { month: 'short' })}
              />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill="url(#colorValue)"
                strokeWidth={strokeWidth}
              />
            </AreaChart>
          );
        
        default:
          return null;
      }
    };
  
    return (
      <div className={cn("h-[300px] w-full", className)}>
        <div className="flex items-center gap-2 mb-4">
          <div className="text-2xl font-bold">{currentValue.toLocaleString()}</div>
          {showTrend && trend !== null && (
            <div className={cn(
              "flex items-center text-sm",
              trend >= 0 ? 'text-green-500' : 'text-red-500'
            )}>
              {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
            </div>
          )}
        </div>
        <ResponsiveContainer width="100%" height="80%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    );
  };
  
  // Usage example:
  // <ChartElement 
  //   data={impactData} 
  //   type="line" 
  //   color="#10b981"
  //   strokeWidth={2}
  // />