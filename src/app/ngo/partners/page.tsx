'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Briefcase, Mail } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  type: 'corporate' | 'ngo' | 'academic';
  website: string;
  projectCount: number;
  yearJoined: number;
}

// Mock data - replace with actual data fetching
const partners: Partner[] = [
  {
    id: '1',
    name: 'Tech Corp',
    logo: '/partners/tech-corp.png',
    description: 'Leading technology company supporting digital education initiatives.',
    type: 'corporate',
    website: 'https://techcorp.com',
    projectCount: 12,
    yearJoined: 2020,
  },
  // Add more partners...
];

export default function PartnersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Partners & Sponsors</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We work with organizations that share our vision of creating positive change.
          Together, we make a bigger impact.
        </p>
      </div>

      {/* Partner Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <Briefcase className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Corporate Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Organizations that support our mission through funding, resources, and expertise.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Globe className="w-8 h-8 text-primary mb-2" />
            <CardTitle>NGO Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Fellow non-profits who collaborate with us on joint initiatives.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Mail className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Academic Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Educational institutions that help us develop and implement programs.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <Card key={partner.id}>
            <CardContent className="p-6">
              <div className="aspect-video relative mb-4">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="object-contain w-full h-full"
                />
              </div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{partner.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Partner since {partner.yearJoined}
                  </p>
                </div>
                <Badge variant="outline">{partner.type}</Badge>
              </div>

              <p className="text-muted-foreground mb-4">
                {partner.description}
              </p>

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {partner.projectCount} Projects
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={partner.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4 mr-2" />
                    Visit Website
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Become a Partner CTA */}
      <Card className="mt-12">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Become a Partner</h2>
              <p className="text-muted-foreground">
                Join us in making a difference. Partner with us and help create lasting positive change in our communities.
              </p>
            </div>
            <div className="flex justify-end">
              <Button size="lg">Contact Us</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}