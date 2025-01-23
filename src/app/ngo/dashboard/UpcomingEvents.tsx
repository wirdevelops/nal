
// src/ngo/dashboard/UpcomingEvents.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';

export function UpcomingEvents() {
  const events = [
    {
      id: 1,
      title: 'Community Outreach Day',
      date: '2024-02-15',
      time: '10:00 AM',
      location: 'Central Park',
      type: 'volunteer'
    },
    {
      id: 2,
      title: 'Annual Fundraiser Gala',
      date: '2024-03-01',
      time: '7:00 PM',
      location: 'Grand Hotel',
      type: 'fundraiser'
    },
    // Add more events...
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex-none w-14 text-center">
                <div className="font-bold">{new Date(event.date).getDate()}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleString('default', { month: 'short' })}
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{event.title}</h4>
                  <Badge variant="outline">
                    {event.type}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  {event.time}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {event.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
