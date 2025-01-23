import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, Users, Camera, Clock, MapPin, 
  DollarSign, Calendar, ArrowRight 
} from 'lucide-react';

interface Opportunity {
  id: string;
  type: 'job' | 'casting' | 'volunteer';
  title: string;
  description: string;
  deadline: string;
  requirements: string[];
  location: string;
  compensation?: string;
  duration?: string;
  category: string;
}

interface OpportunitiesProps {
  opportunities: Opportunity[];
  className?: string;
}

export function OpportunitiesSection({ opportunities = [], className }: OpportunitiesProps) {
  const groupedOpportunities = {
    job: opportunities.filter(opp => opp.type === 'job'),
    casting: opportunities.filter(opp => opp.type === 'casting'),
    volunteer: opportunities.filter(opp => opp.type === 'volunteer')
  };

  return (
    <section className={cn("py-16", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Join Our Creative Community</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover exciting opportunities in film, television, and digital media
          </p>
        </div>

        <Tabs defaultValue="job" className="w-full">
          <TabsList className="grid w-full max-w-[600px] grid-cols-3 mx-auto mb-8">
            <TabsTrigger value="job" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="casting" className="gap-2">
              <Camera className="h-4 w-4" />
              Casting
            </TabsTrigger>
            <TabsTrigger value="volunteer" className="gap-2">
              <Users className="h-4 w-4" />
              Volunteer
            </TabsTrigger>
          </TabsList>

          {Object.entries(groupedOpportunities).map(([type, items]) => (
            <TabsContent key={type} value={type}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(opportunity => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const typeIcon = {
    job: Briefcase,
    casting: Camera,
    volunteer: Users
  }[opportunity.type];

  return (
    <Card className="group hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {React.createElement(typeIcon, { className: "w-5 h-5" })}
          </div>
          <Badge variant="outline">{opportunity.category}</Badge>
        </div>

        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {opportunity.title}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {opportunity.description}
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            {opportunity.location}
          </div>
          {opportunity.compensation && (
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <DollarSign className="h-4 w-4 flex-shrink-0" />
              {opportunity.compensation}
            </div>
          )}
          {opportunity.duration && (
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <Clock className="h-4 w-4 flex-shrink-0" />
              {opportunity.duration}
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            Deadline: {opportunity.deadline}
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm font-medium">Requirements:</div>
          <ul className="text-sm text-muted-foreground space-y-1">
            {opportunity.requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="rounded-full w-1.5 h-1.5 bg-primary mt-1.5 flex-shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        <Button className="w-full mt-6 group">
          Apply Now
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
}