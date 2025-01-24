'use client'
import React, { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Heart, BookOpen, CalendarDays, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNGOProjectStore } from '@/stores/useNGOProjectStore';
import { useImpactStore } from '@/stores/useImpactStore';
import { useStoryStore } from '@/stores/useStoryStore';
import { useDonationStore } from '@/stores/useDonationStore';
import { MetricsOverview } from './dashboard/MetricsOverview';
import { UpcomingEvents } from './dashboard/UpcomingEvents';
import { ProjectsSummary } from './dashboard/ProjectSummary';

const QuickActionCard = ({ icon: Icon, title, description, href }) => {
  const router = useRouter();
  return (
    <Card 
      className="hover:shadow-lg transition-all cursor-pointer"
      onClick={() => router.push(href)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function NGODashboard() {
  const router = useRouter();
  const { projects, calculateMetrics, isLoading } = useNGOProjectStore();
  const { stories } = useStoryStore();
  const { getDonationStats } = useDonationStore();
  const { calculateSummary } = useImpactStore();

  const impactSummary = calculateSummary();
  const donationStats = getDonationStats();

  const quickActions = [
    {
      icon: Users,
      title: "Manage Volunteers",
      description: "Coordinate volunteer activities",
      href: "/ngo/volunteers"
    },
    {
      icon: Heart,
      title: "Donations",
      description: `Track ${donationStats.totalDonations} donations`,
      href: "/ngo/donations"
    },
    {
      icon: BookOpen,
      title: "Success Stories",
      description: `Share ${stories.length} impact stories`,
      href: "/ngo/stories"
    },
    {
      icon: CalendarDays,
      title: "Events",
      description: "Manage upcoming events",
      href: "/ngo/events"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-primary/5 pb-20 pt-10">
        <div className="container mx-auto px-6">
          <div className="absolute top-4 right-6 w-72">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Search projects..."
                className="pl-8"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                Making a Difference Together
              </h1>
              <p className="text-xl text-muted-foreground">
                Managing {projects.length} projects with {impactSummary.totalImpact.toLocaleString()} lives impacted
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  onClick={() => router.push('/ngo/get-involved')}
                  disabled={isLoading}
                >
                  Get Involved
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => router.push('/ngo/sucess-stories')}
                >
                  View Succes Stories
                </Button>
              </div>
            </div>
            
            <div className="lg:block relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl" />
                <Card className="bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Impact Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Impact</p>
                        <p className="text-2xl font-bold">{impactSummary.totalImpact}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Volunteer Hours</p>
                        <p className="text-2xl font-bold">{impactSummary.volunteerHours}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Donations</p>
                        <p className="text-2xl font-bold">${donationStats.totalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Success Stories</p>
                        <p className="text-2xl font-bold">{stories.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Card className="w-full lg:col-span-2">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Help Us Create More Impact</h2>
                <p className="text-muted-foreground">
                  Join us in our mission to create positive change. Every contribution
                  makes a difference.
                </p>
              </div>
              <div className="flex justify-end gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/ngo/volunteers/join')}
                >
                  Volunteer
                </Button>
                <Button onClick={() => router.push('/ngo/donations/new')}>
                  Donate Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>

      {/* <div className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="grid gap-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <QuickActionCard key={i} {...action} />
            ))}
          </div>
        </div>
      </div> */}

      <div className="container px-6">
          {/* Metrics Overview */}
          <div className="pb-6">
          <Suspense fallback={<div className="h-[120px] bg-muted animate-pulse rounded-lg" />}>
            <MetricsOverview />
          </Suspense>
          </div>

          {/* Project Summary and Events */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Suspense fallback={<div className="h-[400px] bg-muted animate-pulse rounded-lg" />}>
              <ProjectsSummary projects={[]} />
            </Suspense>
            
            <Suspense fallback={<div className="h-[400px] bg-muted animate-pulse rounded-lg" />}>
              <UpcomingEvents />
            </Suspense>
          </div>

  
          </div >
    </div>
  );
}