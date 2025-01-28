import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Users, Globe, Trophy } from 'lucide-react';

const stats = [
  { 
    icon: Film,
    label: "Productions",
    value: "150+",
    description: "Completed projects"
  },
  {
    icon: Users,
    label: "Team Members",
    value: "1000+",
    description: "Global talent"
  },
  {
    icon: Globe,
    label: "Countries",
    value: "30+",
    description: "Global presence"
  },
  {
    icon: Trophy,
    label: "Awards",
    value: "25+",
    description: "Industry recognition"
  }
];

const timeline = [
  {
    year: "2020",
    title: "Global Expansion",
    description: "Opened new studios in three continents"
  },
  {
    year: "2021",
    title: "Innovation Hub",
    description: "Launched our AI-powered production platform"
  },
  {
    year: "2022",
    title: "Industry Leadership",
    description: "Recognized as top entertainment innovator"
  },
  {
    year: "2023",
    title: "Milestone Achievement",
    description: "Reached 50 million global viewers"
  }
];

export default function CompanyOverview() {
  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-16"
        >
          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:border-primary transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-3xl font-bold">{stat.value}</h3>
                        <p className="text-lg font-medium">{stat.label}</p>
                        <p className="text-sm text-muted-foreground">{stat.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Our Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-8 border-l border-primary/20">
                {timeline.map((event, index) => (
                  <motion.div
                    key={event.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="mb-8 last:mb-0 relative"
                  >
                    <div className="absolute -left-10 mt-1.5">
                      <div className="w-4 h-4 rounded-full bg-primary" />
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-primary">{event.year}</span>
                      <h4 className="text-lg font-semibold">{event.title}</h4>
                      <p className="text-muted-foreground">{event.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Example image using correct placeholder format */}
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src="/api/placeholder/1200/400" 
              alt="Company timeline visualization"
              className="w-full h-auto object-cover"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}