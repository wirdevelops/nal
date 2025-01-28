import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Target, Compass, Shield, Heart, Rocket } from 'lucide-react';

const coreValues = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Pushing boundaries in storytelling and technology"
  },
  {
    icon: Target,
    title: "Excellence",
    description: "Delivering unparalleled quality in every project"
  },
  {
    icon: Compass,
    title: "Integrity",
    description: "Upholding the highest ethical standards"
  },
  {
    icon: Shield,
    title: "Trust",
    description: "Building lasting relationships with our audiences"
  },
  {
    icon: Heart,
    title: "Empathy",
    description: "Creating content that resonates and connects"
  },
  {
    icon: Rocket,
    title: "Impact",
    description: "Driving positive change through storytelling"
  }
];

export default function MissionVisionSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-16"
        >
          {/* Mission & Vision Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg opacity-90">
                  To revolutionize entertainment by creating immersive, thought-provoking content 
                  that transcends cultural boundaries and inspires global audiences.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-muted-foreground">
                  To be the world's leading force in entertainment innovation, setting new standards 
                  for creative excellence and technological advancement.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Core Values */}
          <div>
            <h3 className="text-2xl font-bold text-center mb-12">Our Core Values</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full transition-all duration-300 hover:border-primary">
                      <CardContent className="pt-6">
                        <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="text-xl font-semibold mb-2">{value.title}</h4>
                        <p className="text-muted-foreground">{value.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}