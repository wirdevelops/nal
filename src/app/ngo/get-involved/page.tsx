'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Calendar, HandHeart, Send } from "lucide-react";
import { DonationForm } from "./components/DonationForm";
import { VolunteerSignup } from "./components/VolunteerSignup";

export default function GetInvolvedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Make a Difference Today</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          There are many ways to contribute to our cause and help create positive change in our community.
          Choose how you'd like to get involved.
        </p>
      </div>

      {/* Involvement Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <Heart className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Donate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Support our projects through monetary donations. Every contribution makes a difference.
            </p>
            <Button className="w-full">
              <HandHeart className="mr-2 h-4 w-4" />
              Donate Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Volunteer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Join our team of dedicated volunteers and help make a direct impact in our community.
            </p>
            <Button className="w-full">
              <Users className="mr-2 h-4 w-4" />
              Join as Volunteer
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Calendar className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Participate in our upcoming events and help us create positive change.
            </p>
            <Button className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              View Events
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Newsletter Signup */}
      <Card className="mb-12">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
              <p className="text-muted-foreground">
                Subscribe to our newsletter to receive updates about our projects,
                upcoming events, and ways to get involved.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">2.5K+</div>
            <p className="text-sm text-muted-foreground">Volunteers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">100+</div>
            <p className="text-sm text-muted-foreground">Active Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">50K+</div>
            <p className="text-sm text-muted-foreground">Lives Impacted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">$1M+</div>
            <p className="text-sm text-muted-foreground">Funds Raised</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}