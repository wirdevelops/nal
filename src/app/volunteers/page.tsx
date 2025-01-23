'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VolunteerFilters } from './volunteer/VolunteerFilters';
import { VolunteerList } from './volunteer/VolunteerList';
import { useVolunteer } from '@/hooks/useVolunteer';
import { Plus, Download, Filter } from 'lucide-react';
import { BackgroundCheck, Skill } from '@/types/ngo';
import { VolunteerShiftManager } from './volunteer/VolunteerSchedule';
import { VolunteerPerformanceDashboard } from './volunteer/VolunteerPerformanceDashboard';
import { VolunteerTrainingManager } from './volunteer/VolunteerTrainingManager';
import { VolunteerCommsCenter } from './volunteer/VolunteerCommsCenter';
import { Skeleton } from '@/components/ui/skeleton';

export default function VolunteersPage() {
  const router = useRouter();
  const { volunteers, isLoading } = useVolunteer();
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    backgroundStatus: 'all' as BackgroundCheck | 'all',
    skills: [] as Skill[],
    availability: [] as string[]
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleVolunteerSelect = (volunteerId: string) => {
    router.push(`/volunteers/${volunteerId}`);
  };

  const handleVolunteerSelectToggle = (volunteerId: string) => {
    setSelectedVolunteers(prev => 
      prev.includes(volunteerId)
        ? prev.filter(id => id !== volunteerId)
        : [...prev, volunteerId]
    );
  };

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.userId.toLowerCase().includes(filters.search.toLowerCase());
    const matchesBackground = filters.backgroundStatus === 'all' || 
      volunteer.background === filters.backgroundStatus;
    const matchesSkills = filters.skills.length === 0 || 
      filters.skills.some(skill => volunteer.skills.includes(skill));
    const matchesAvailability = filters.availability.length === 0 ||
      filters.availability.some(day => volunteer.availability.days.includes(day));

    return matchesSearch && matchesBackground && matchesSkills && matchesAvailability;
  });

  const totalHours = volunteers.reduce((sum, volunteer) => {
    return sum + volunteer.hours.reduce((hoursSum, log) => hoursSum + log.hours, 0);
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Volunteer Management Platform</h1>
          <p className="text-muted-foreground">
            Comprehensive volunteer engagement and performance management
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <VolunteerCommsCenter volunteerIds={selectedVolunteers} />
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={() => router.push('/volunteers/signup')}>
            <Plus className="w-4 h-4 mr-2" />
            New Volunteer
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Volunteers</p>
              <p className="text-2xl font-bold">{volunteers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active Shifts</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <p className="text-2xl font-bold">{totalHours}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Training Compliance</p>
              <p className="text-2xl font-bold">92%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Filters */}
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <CardTitle>Advanced Filters</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <VolunteerFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </CardContent>
          </Card>

          {/* Volunteer List */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-[92px] w-full" />
              ))}
            </div>
          ) : (
            <VolunteerList
              volunteers={filteredVolunteers}
              onVolunteerSelect={handleVolunteerSelect}
              onVolunteerToggle={handleVolunteerSelectToggle}
              selectedVolunteers={selectedVolunteers}
            />
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <VolunteerPerformanceDashboard />
          <VolunteerTrainingManager />
        </div>
      </div>

      {/* Shift Management Section */}
      <VolunteerShiftManager projectId="current-project" />

      {/* Data Visualization Section */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Analytics</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-4">Hours Distribution</h3>
              {/* Add Hours Chart */}
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-4">Skill Matrix</h3>
              {/* Add Skill Matrix */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}