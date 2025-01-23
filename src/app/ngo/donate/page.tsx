'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DonationForm } from ".././components/DonationForm";
import { DonorWall } from ".././components/DonorWall";
import { Heart, Target, Users, Landmark } from "lucide-react";

const mockDonors = [
  {
    id: '1',
    name: 'John Doe',
    amount: 1000,
    donatedAt: new Date().toISOString(),
    isAnonymous: false,
    tier: 'gold',
    message: 'Happy to support this amazing cause!'
  },
  {
    id: '2',
    name: 'Anonymous',
    amount: 500,
    donatedAt: new Date(Date.now() - 86400000).toISOString(),
    isAnonymous: true,
    tier: 'silver'
  },
  // Add more mock donors as needed
];

export default function DonatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Make a Difference Today</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your donation helps us create lasting positive change in our communities.
          Every contribution counts.
        </p>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Donations</p>
                <h3 className="text-2xl font-bold">$1.2M</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Projects Funded</p>
                <h3 className="text-2xl font-bold">48</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lives Impacted</p>
                <h3 className="text-2xl font-bold">50K+</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Landmark className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Communities Served</p>
                <h3 className="text-2xl font-bold">124</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donation Form */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Why Donate?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Transform Lives</h3>
                <p className="text-sm text-muted-foreground">
                  Your donation directly supports programs that make a real difference
                  in people's lives.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Build Communities</h3>
                <p className="text-sm text-muted-foreground">
                  Help us strengthen communities through sustainable development
                  projects.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Create Lasting Change</h3>
                <p className="text-sm text-muted-foreground">
                  Support initiatives that create long-term positive impact in
                  education, health, and community development.
                </p>
              </div>
            </CardContent>
          </Card>

          <DonationForm 
            onSuccess={() => {
              // Handle successful donation
              console.log('Donation successful');
            }}
          />
        </div>

        {/* Donor Wall */}
        <div>
          <DonorWall donors={mockDonors} projectId="global" />
        </div>
      </div>

      {/* Tax Info */}
      <Card className="mt-12">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="mb-4">Tax Deductible</Badge>
            <h2 className="text-xl font-semibold">Your Donation is Tax Deductible</h2>
            <p className="text-muted-foreground">
              Our organization is registered as a 501(c)(3) non-profit. 
              All donations are tax-deductible to the extent allowed by law.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}