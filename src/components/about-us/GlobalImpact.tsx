import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FilmIcon, GlobeIcon, UsersIcon, SparklesIcon, 
  TrendingUpIcon, TrophyIcon,
  PlayCircleIcon
} from 'lucide-react';

const impactCategories = [
  {
    id: 'content',
    icon: FilmIcon,
    title: 'Content Innovation',
    stats: [
      { label: 'Original Productions', value: '500+' },
      { label: 'Languages', value: '45+' },
      { label: 'Genres', value: '20+' },
      { label: 'Awards', value: '125+' }
    ],
    achievements: [
      'First AI-Enhanced Production Studio',
      'Virtual Production Innovation Award 2024',
      'Revolutionary Motion Capture Technology'
    ]
  },
  {
    id: 'cultural',
    icon: GlobeIcon,
    title: 'Cultural Impact',
    stats: [
      { label: 'Cultural Programs', value: '200+' },
      { label: 'Local Partnerships', value: '150+' },
      { label: 'Countries Reached', value: '190+' },
      { label: 'Cultural Events', value: '75+' }
    ],
    achievements: [
      'UNESCO Cultural Heritage Partner',
      'Global Storytelling Initiative Lead',
      'Cross-Cultural Excellence Award'
    ]
  },
  {
    id: 'talent',
    icon: UsersIcon,
    title: 'Talent Development',
    stats: [
      { label: 'Artists Supported', value: '10,000+' },
      { label: 'Training Programs', value: '50+' },
      { label: 'Mentorship Hours', value: '25,000+' },
      { label: 'Success Stories', value: '500+' }
    ],
    achievements: [
      'Industry Leading Training Academy',
      'Emerging Talent Incubator Program',
      'Digital Arts Education Pioneer'
    ]
  }
];

const creativeHighlights = [
  {
    title: "Revolutionary Storytelling",
    description: "Pioneering AI-enhanced narrative development and virtual production",
    metric: "2.5x",
    context: "faster production time",
    trend: "+45% YoY"
  },
  {
    title: "Global Collaboration",
    description: "Connected creative teams across 6 continents",
    metric: "24/7",
    context: "creative workflow",
    trend: "+60% YoY"
  },
  {
    title: "Cultural Resonance",
    description: "Stories that transcend borders and connect cultures",
    metric: "95%",
    context: "audience engagement",
    trend: "+30% YoY"
  },
  {
    title: "Innovation Impact",
    description: "Setting new standards in entertainment technology",
    metric: "300+",
    context: "tech innovations",
    trend: "+80% YoY"
  }
];

export default function GlobalImpact() {
  const [selectedCategory, setSelectedCategory] = useState(impactCategories[0]);

  return (
    <section className="space-y-12">
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl font-bold">Global Impact & Innovation</h2>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Transforming entertainment through technological innovation and cultural connection.
        </p>
      </motion.div>

      {/* Creative Impact Highlights */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {creativeHighlights.map((highlight, index) => (
          <motion.div
            key={highlight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 bg-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{highlight.title}</h3>
                    <span className="text-sm text-green-500 flex items-center">
                      <TrendingUpIcon className="w-4 h-4 mr-1" />
                      {highlight.trend}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{highlight.description}</p>
                  <div className="pt-2">
                    <div className="text-3xl font-bold text-primary">{highlight.metric}</div>
                    <div className="text-sm text-muted-foreground">{highlight.context}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Impact Categories */}
      <Card className="border-none bg-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Impact Areas</CardTitle>
            <div className="flex gap-2">
              {impactCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory.id === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.title}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {selectedCategory.stats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className="p-4 rounded-lg bg-muted"
                    >
                      <div className="text-2xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Key Achievements</h4>
                  {selectedCategory.achievements.map((achievement, index) => (
                    <div
                      key={achievement}
                      className="flex items-center gap-2 text-sm"
                    >
                      <TrophyIcon className="w-4 h-4 text-primary" />
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative rounded-lg overflow-hidden h-[300px]">
                <img
                  src="/api/placeholder/800/600"
                  alt={selectedCategory.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-semibold mb-2">{selectedCategory.title}</h3>
                    <Button variant="secondary" size="sm">
                      Learn More
                      <PlayCircleIcon className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Innovation Showcase */}
      <div className="relative h-[400px] rounded-xl overflow-hidden">
        <img
          src="/api/placeholder/1600/800"
          alt="Innovation showcase"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent">
          <div className="relative h-full flex items-center p-12">
            <div className="max-w-2xl space-y-6">
              <h3 className="text-3xl font-bold text-white">Pioneering the Future</h3>
              <p className="text-lg text-gray-200">
                From AI-powered storytelling to revolutionary production techniques,
                we're pushing the boundaries of what's possible in entertainment.
              </p>
              <div className="flex gap-4">
                <Button>
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Explore Innovations
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/20">
                  <GlobeIcon className="w-4 h-4 mr-2" />
                  View Global Impact
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}