// utils/trend.ts
export const calculateTrendPercentage = (trend: { value: number }[]) => {
    if (trend.length < 2) return 0;
    const current = trend[trend.length - 1].value;
    const previous = trend[trend.length - 2].value;
    return ((current - previous) / previous) * 100;
  };

  export const calculateTrend = (
    data: Array<{ value: number }>, 
    period = 1
  ): number => {
    if (data.length < period + 1) return 0;
    const current = data[data.length - 1].value;
    const previous = data[data.length - 1 - period].value;
    return ((current - previous) / previous) * 100;
  };