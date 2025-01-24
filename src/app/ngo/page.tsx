import React from 'react';
import { Suspense } from 'react';
import { 
  BarChart, Users, Heart, Target, 
  ArrowRight, CalendarDays, BookOpen 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricsOverview } from './dashboard/MetricsOverview';
import { ProjectsSummary } from './dashboard/ProjectsSummary';
import { UpcomingEvents } from './dashboard/UpcomingEvents';
import { ImpactDashboard } from './components/ImpactDashBoard';

const QuickActionCard = ({ icon: Icon, title, description, href }) => (
  <Card className="hover:shadow-lg transition-all cursor-pointer">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </CardContent>
  </Card>
);

export default function NGODashboard() {
  const quickActions = [
    {
      icon: Users,
      title: "Manage Volunteers",
      description: "Coordinate and track volunteer activities",
      href: "/ngo/volunteers"
    },
    {
      icon: Heart,
      title: "Donations",
      description: "Track and manage donations",
      href: "/ngo/donations"
    },
    {
      icon: BookOpen,
      title: "Success Stories",
      description: "Share impact stories",
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
      {/* Hero Section */}
      <div className="relative bg-primary/5 pb-20 pt-10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                Making a Difference Together
              </h1>
              <p className="text-xl text-muted-foreground">
                Track your impact, manage projects, and coordinate volunteers all in one place.
              </p>
              <div className="flex gap-4">
                <Button size="lg">Create Project</Button>
                <Button size="lg" variant="outline">View Impact</Button>
              </div>
            </div>
            
            <div className="lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl" />
                <Card className="bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Impact Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImpactDashboard 
                      metrics={{
                        impactScore: 85,
                        volunteers: 250,
                        donations: 50000,
                        socialShares: 1200,
                        costPerBeneficiary: 45,
                        volunteerImpactRatio: 2.5,
                        fundingUtilization: 80,
                        correlationData: []
                      }}
                      stories={[]}
                      projectId="overview"
                      className="h-64"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 -mt-10">
        <div className="grid gap-6">
          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <QuickActionCard key={i} {...action} />
            ))}
          </div>

          {/* Metrics Overview */}
          <Suspense fallback={<div className="h-[120px] bg-muted animate-pulse rounded-lg" />}>
            <MetricsOverview />
          </Suspense>

          {/* Project Summary and Events */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Suspense fallback={<div className="h-[400px] bg-muted animate-pulse rounded-lg" />}>
              <ProjectsSummary projects={[]} />
            </Suspense>
            
            <Suspense fallback={<div className="h-[400px] bg-muted animate-pulse rounded-lg" />}>
              <UpcomingEvents />
            </Suspense>
          </div>

          {/* Success Stories Preview */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Success Stories</CardTitle>
                <Button variant="ghost">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Story previews would go here */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}