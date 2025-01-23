import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend,
  } from 'recharts';
  
  interface AxisConfig {
    label?: string;
    tickFormatter?: (value: any) => string;
    hide?: boolean;
    angle?: number;
    interval?: number | 'preserveStart' | 'preserveEnd' | 'preserveStartEnd';
  }
  
  interface TooltipConfig<T> {
    formatter?: (value: any, name: string, entry: T) => [string, string];
    labelFormatter?: (label: string) => string;
    customContent?: (props: any) => React.ReactNode;
    showTotal?: boolean;
  }
  
  interface BarConfig {
    color?: string;
    radius?: [number, number, number, number];
    maxBarSize?: number;
  }
  
  export interface BarChartProps<T extends Record<string, any>> {
    data: T[];
    config: {
      xKey: keyof T;
      yKey: keyof T | Array<keyof T>;
      xAxis?: AxisConfig;
      yAxis?: AxisConfig;
      tooltip?: TooltipConfig<T>;
      bars?: BarConfig | BarConfig[];
      height?: number;
      margin?: { top?: number; right?: number; bottom?: number; left?: number };
      grid?: boolean;
      legend?: boolean;
      stackBars?: boolean;
      colorScheme?: string[];
      getBarColor?: (entry: T) => string;
    };
  }
  
  export const BarChart = <T extends Record<string, any>>({
    data,
    config,
  }: BarChartProps<T>) => {
    const defaultColorScheme = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];
    const {
      xKey,
      yKey,
      xAxis = {},
      yAxis = {},
      tooltip = {},
      bars = {},
      height = 400,
      margin = { top: 20, right: 30, bottom: 40, left: 40 },
      grid = true,
      legend = true,
      stackBars = false,
      colorScheme = defaultColorScheme,
      getBarColor,
    } = config;
  
    // Handle single or multiple bars
    const yKeys = Array.isArray(yKey) ? yKey : [yKey];
    const barConfigs = Array.isArray(bars) ? bars : yKeys.map(() => bars);
  
    const defaultTooltipFormatter = (value: number) => [
      value.toLocaleString(),
      typeof yKey === 'string' ? String(yKey) : '',
    ];
  
    const renderBars = () =>
      yKeys.map((key, index) => (
        <Bar
          key={String(key)}
          dataKey={key as string}
          fill={barConfigs[index]?.color || colorScheme[index % colorScheme.length]}
          radius={barConfigs[index]?.radius || [4, 4, 0, 0]}
          maxBarSize={barConfigs[index]?.maxBarSize || 100}
          stackId={stackBars ? 'stack' : undefined}
        >
          {getBarColor &&
            data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={getBarColor(entry)} />
            ))}
        </Bar>
      ));
  
    return (
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart
            data={data}
            margin={margin}
          >
            {grid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.2}
              />
            )}
            
            <XAxis
              dataKey={xKey as string}
              label={xAxis.label && {
                value: xAxis.label,
                position: 'bottom',
                offset: -10,
              }}
              tickFormatter={xAxis.tickFormatter}
              hide={xAxis.hide}
              angle={xAxis.angle}
              interval={xAxis.interval}
              tick={{ fill: '#6b7280' }}
            />
            
            <YAxis
              label={yAxis.label && {
                value: yAxis.label,
                angle: -90,
                position: 'insideLeft',
                offset: -10,
              }}
              tickFormatter={yAxis.tickFormatter || (value => value.toLocaleString())}
              hide={yAxis.hide}
              tick={{ fill: '#6b7280' }}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={tooltip.formatter || defaultTooltipFormatter}
              labelFormatter={tooltip.labelFormatter}
              content={tooltip.customContent}
            />
            
            {legend && <Legend wrapperStyle={{ paddingTop: '1rem' }} />}
            
            {renderBars()}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    );
  };