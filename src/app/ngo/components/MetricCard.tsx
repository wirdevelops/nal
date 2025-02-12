import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number | null;
  className?: string;
}

export function MetricCard({ title, value, icon: Icon, trend, className }: MetricCardProps) {

  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <Icon className="h-5 w-5 text-muted-foreground" />
          {trend !== null && trend !== undefined && (
            <div className={cn(
              "flex items-center text-sm font-medium",
              trend > 0 ? "text-green-600" : "text-red-600"
            )}>
              {trend > 0 ? "+" : ""}{trend}%
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
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="mt-1 h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
};