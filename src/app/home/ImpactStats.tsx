import { ReactNode } from "react";


import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Film, Users, Star, Award, TrendingUp, 
  Heart, Globe, PlayCircle 
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface ImpactStat {
  label: string;
  value: string;
  description: string;
  icon: keyof typeof icons;
  trend?: number;
}

const icons = {
  Film,
  Users,
  Star,
  Award,
  TrendingUp,
  Heart,
  Globe,
  PlayCircle
};

interface ImpactStatsProps {
  stats?: ImpactStat[];
  className?: string;
}

export function ImpactStats({
  stats = [
    {
      label: "Productions",
      value: "150+",
      description: "Successful film and TV projects",
      icon: "Film",
      trend: 15
    },
    {
      label: "Community",
      value: "10K+",
      description: "Active creative professionals",
      icon: "Users",
      trend: 25
    },
    {
      label: "Awards",
      value: "47",
      description: "Industry recognitions received",
      icon: "Award",
      trend: 30
    },
    {
      label: "Global Reach",
      value: "25+",
      description: "Countries featuring our content",
      icon: "Globe",
      trend: 20
    }
  ],
  className
}: ImpactStatsProps) {
  return (
    <section className={cn("py-16 bg-gradient-to-b from-background to-muted", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Impact in Numbers</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transforming the entertainment industry through collaboration, creativity, and innovation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      {React.createElement(icons[stat.icon], { className: "w-6 h-6" })}
                    </div>
                    {stat.trend && (
                      <div className="text-sm font-medium text-green-600">
                        +{stat.trend}% growth
                      </div>
                    )}
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="mb-2"
                  >
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </motion.div>
                  
                  <div className="space-y-1">
                    <h3 className="font-semibold">{stat.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

