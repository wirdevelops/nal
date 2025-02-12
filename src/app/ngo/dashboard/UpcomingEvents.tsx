// src/app/ngo/dashboard/UpcomingEvents.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import { useNGOProjectStore } from '@/stores/useNGOProjectStore';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { ProjectCategory } from '@/types/ngo/project';

interface EventData {
  id: string;
  title: string;
  date: string;
  projectId: string;
  projectName: string;
  location: string;
  type: ProjectCategory;
}

const categoryColors: Record<ProjectCategory, string> = {
  education: 'bg-blue-100 text-blue-800',
  health: 'bg-green-100 text-green-800',
  environment: 'bg-emerald-100 text-emerald-800',
  community_development: 'bg-purple-100 text-purple-800',
  emergency_relief: 'bg-red-100 text-red-800',
  other: 'bg-gray-100 text-gray-800'
};

export function UpcomingEvents() {
  const router = useRouter();
  const { getUpcomingEvents, isLoading, error } = useNGOProjectStore();
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    setEvents(getUpcomingEvents() as EventData[]);
  }, [getUpcomingEvents]);

  const formatDate = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      return {
        day: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }),
        time: date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        year: date.getFullYear() !== new Date().getFullYear() ? date.getFullYear() : undefined
      };
    } catch (e) {
      return { day: '??', month: '---', time: '--:--', year: undefined };
    }
  };

  const handleEventClick = (projectId: string) => {
    router.push(`/ngo/projects/${projectId}`);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-red-500">
          Error loading events: {error}
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-14 w-14 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[150px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!events.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-6">
            No upcoming events scheduled
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {events.slice(0, 5).map((event) => {
            const { day, month, time, year } = formatDate(event.date);
            
            return (
              <div 
                key={event.id} 
                className="flex gap-4 group cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                onClick={() => handleEventClick(event.projectId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleEventClick(event.projectId)}
              >
                <div className="flex-none w-14 text-center">
                  <div className="font-bold text-lg">{day}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {month} {year && `'${year.toString().slice(-2)}`}
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium group-hover:text-primary transition-colors">
                      {event.title}
                    </h4>
                    <Badge 
                      className={`${categoryColors[event.type]} hover:${categoryColors[event.type]} capitalize`}
                    >
                      {event.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4 flex-none" />
                    <span>{time}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4 flex-none" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}