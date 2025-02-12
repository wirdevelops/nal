'use client'
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Calendar, HandHeart, Send } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { useNGOProjectStore } from "@/stores/useNGOProjectStore";
import { useImpactStore } from "@/stores/useImpactStore";
import { useDonationStore } from "@/stores/useDonationStore";
import { useState } from "react";

export default function GetInvolvedPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { projects, getUpcomingEvents } = useNGOProjectStore();
  const { calculateSummary } = useImpactStore();
  const { getDonationStats } = useDonationStore();

  const impactSummary = calculateSummary();
  const donationStats = getDonationStats();
  const events = getUpcomingEvents();

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Subscribe:', email);
  };

  const stats = {
    volunteers: impactSummary.volunteerHours,
    projects: projects.length,
    impact: impactSummary.totalImpact,
    donations: donationStats.totalAmount
  };

  const cards = [
    {
      icon: Heart,
      title: "Donate",
      description: "Support our projects through monetary donations. Every contribution makes a difference.",
      action: () => router.push('/ngo/donations'),
      buttonIcon: HandHeart,
      buttonText: "Donate Now"
    },
    {
      icon: Users,
      title: "Volunteer",
      description: "Join our team of dedicated volunteers and help make a direct impact in our community.",
      action: () => router.push('/ngo/volunteers/join'),
      buttonIcon: Users,
      buttonText: "Join as Volunteer"
    },
    {
      icon: Calendar,
      title: "Events",
      description: `Join any of our ${events.length} upcoming events and help us create positive change.`,
      action: () => router.push('/ngo/events'),
      buttonIcon: Calendar,
      buttonText: "View Events"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <PageHeader 
          title="Get Involved" 
          subtitle={`Join ${stats.volunteers.toLocaleString()} volunteers making a difference`} 
        />
        
        <div className="text-center mb-12 py-3">
          <h1 className="text-4xl font-bold mb-4">Make a Difference Today</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            There are many ways to contribute to our cause and help create positive change in our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {cards.map((card, index) => (
            <Card key={index}>
              <CardHeader>
                <card.icon className="w-8 h-8 text-primary mb-2" />
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">{card.description}</p>
                <Button className="w-full" onClick={card.action}>
                  <card.buttonIcon className="mr-2 h-4 w-4" />
                  {card.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
                <p className="text-muted-foreground">
                  Subscribe to our newsletter for updates about projects and events.
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                />
                <Button type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  Subscribe
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(stats).map(([key, value]) => (
            <Card key={key}>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {key === 'donations' ? `$${(value/1000000).toFixed(1)}M+` : 
                   value > 1000 ? `${(value/1000).toFixed(1)}K+` : value}
                </div>
                <p className="text-sm text-muted-foreground">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}