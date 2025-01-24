'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImpactMetrics } from "../components/ImpactMetrics";
import { ImpactStories } from "../components/ImpactStories";

// Mock impact stories data
const impactStories = [
  {
    id: '1',
    title: 'Education Initiative Success',
    description: 'Transforming rural education through technology access',
    image: '/impact/education.jpg',
    category: 'Education',
    location: 'Rural Districts',
    beneficiary: {
      name: 'Sarah Mitchell',
      quote: 'The new computer lab has opened up a world of opportunities for our students.'
    },
    stats: {
      peopleHelped: 500,
      volunteersInvolved: 25,
      duration: '12 months'
    },
    engagement: {
      likes: 245,
      comments: 45,
      shares: 78
    }
  },
  // Add more stories as needed
];

export default function ImpactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Impact</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Measuring and celebrating the positive change we create together in our communities.
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stories">Impact Stories</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="space-y-8">
            <ImpactMetrics summary={undefined} categories={[]} />

            {/* Focus Areas */}
            <Card>
              <CardHeader>
                <CardTitle>Focus Areas & Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Education</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>12 schools supported</li>
                        <li>5,000+ students reached</li>
                        <li>85% improvement in literacy</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Healthcare</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>8 medical camps organized</li>
                        <li>10,000+ patients treated</li>
                        <li>90% vaccination coverage</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Community Development</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>15 community centers built</li>
                        <li>500+ local jobs created</li>
                        <li>30% poverty reduction</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stories Tab */}
        <TabsContent value="stories">
          <div className="space-y-8">
            <ImpactStories 
              stories={impactStories}
              onLike={(id) => console.log('Liked:', id)}
              onComment={(id) => console.log('Comment:', id)}
              onShare={(id) => console.log('Shared:', id)}
            />
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Impact Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Annual Impact Report 2023</h3>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive overview of our achievements and impact
                    </p>
                  </div>
                  <Button>Download PDF</Button>
                </div>

                <div className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Q4 2023 Impact Summary</h3>
                    <p className="text-sm text-muted-foreground">
                      Quarterly report of our progress and milestones
                    </p>
                  </div>
                  <Button>Download PDF</Button>
                </div>

                <div className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Project Outcomes Report</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed analysis of individual project impacts
                    </p>
                  </div>
                  <Button>Download PDF</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="mt-12">
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
              <Button variant="outline">Volunteer</Button>
              <Button>Donate Now</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}