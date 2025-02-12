import React from 'react';
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

interface ChartElementProps {
  data: Array<{ date: string; value: number }>;
  type: 'line' | 'bar' | 'area';
  color?: string;
  strokeWidth?: number;
  showTrend?: boolean;
  className?: string;
}

export default function ChartElement({
  data,
  type,
  color = '#8884d8',
  strokeWidth = 2,
  className
}: ChartElementProps) {
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
            <Tooltip 
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-white p-2 border rounded-lg shadow-lg">
                    <p className="font-medium">
                      {new Date(payload[0].payload.date).toLocaleDateString()}
                    </p>
                    <p>{payload[0].value}</p>
                  </div>
                );
              }}
            />
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
    <div className={`h-[300px] w-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}