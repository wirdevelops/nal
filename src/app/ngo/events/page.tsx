'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  Clock,
  Filter,
  ChevronRight
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  type: 'volunteer' | 'fundraiser' | 'workshop' | 'community';
  capacity: number;
  registered: number;
  image?: string;
}

// Mock data - replace with actual data fetching
const events: Event[] = [
  {
    id: '1',
    title: 'Community Clean-up Drive',
    description: 'Join us for our monthly community clean-up initiative.',
    date: new Date('2024-02-15'),
    time: '09:00 AM',
    location: 'Central Park',
    type: 'volunteer',
    capacity: 50,
    registered: 32,
  },
  // Add more events...
];

export default function EventsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredEvents = events.filter(event => {
    if (selectedType !== 'all' && event.type !== selectedType) return false;
    if (selectedDate && event.date.toDateString() !== selectedDate.toDateString()) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join us at our upcoming events and be part of the change.
        </p>
      </div>

      {/* Calendar and Events Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar & Filters */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <CardTitle>Filters</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedType}
                onValueChange={setSelectedType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="fundraiser">Fundraiser</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <div className="lg:col-span-2 space-y-6">
          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No events found for the selected date.</p>
              </CardContent>
            </Card>
          ) : (
            filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="grid md:grid-cols-3 gap-6">
                  {event.image && (
                    <div className="relative aspect-video md:aspect-square">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className={event.image ? 'md:col-span-2' : 'md:col-span-3'}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{event.title}</h3>
                          <p className="text-muted-foreground mt-1">
                            {event.description}
                          </p>
                        </div>
                        <Badge>{event.type}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="w-4 h-4 text-muted-foreground" />
                          <span>{event.date.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{event.registered} / {event.capacity} registered</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          {event.capacity - event.registered} spots remaining
                        </div>
                        <Button>
                          Register Now
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Create Event CTA */}
      <Card className="mt-12">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Host an Event</h2>
              <p className="text-muted-foreground">
                Have an idea for a community event? We'd love to help you organize it!
              </p>
            </div>
            <div className="flex justify-end">
              <Button size="lg">
                Propose Event
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}