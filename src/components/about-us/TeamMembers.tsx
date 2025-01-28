import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Linkedin, Twitter, Award, ArrowUpRight, GlobeIcon, 
  BrainCircuit, TrendingUp, Users 
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const teamMembers = [
  {
    name: "Alexandra Chen",
    title: "Chief Executive Officer",
    focus: "Innovation & Strategy",
    bio: "Pioneering AI-driven production techniques with 15+ years of industry leadership. Former Netflix executive with multiple Emmy wins.",
    image: "/api/placeholder/400/400",
    expertise: ["Content Innovation", "Strategic Growth", "AI Integration"],
    achievements: [
      { title: "Emmy Award Winner", year: "2023" },
      { title: "Forbes 40 Under 40", year: "2022" },
      { title: "Time 100 Next", year: "2021" }
    ],
    impact: {
      projects: 50,
      awards: 12,
      innovations: 8
    },
    social: {
      twitter: "https://twitter.com/alexchen",
      linkedin: "https://linkedin.com/in/alexchen"
    }
  },
  {
    name: "Marcus Rodriguez",
    title: "Chief Creative Officer",
    focus: "Creative Excellence",
    bio: "BAFTA-winning director transforming storytelling through technology. Former creative lead at HBO and Amazon Studios.",
    image: "/api/placeholder/400/400",
    expertise: ["Visual Storytelling", "Creative Direction", "Production Innovation"],
    achievements: [
      { title: "BAFTA Award", year: "2023" },
      { title: "Sundance Fellow", year: "2022" },
      { title: "DGA Award", year: "2021" }
    ],
    impact: {
      projects: 35,
      awards: 15,
      innovations: 5
    },
    social: {
      twitter: "https://twitter.com/mrodriguez",
      linkedin: "https://linkedin.com/in/mrodriguez"
    }
  },
  {
    name: "Sarah Patel",
    title: "Head of Technology",
    focus: "Tech Innovation",
    bio: "AI and immersive tech pioneer pushing boundaries in entertainment. Former lead developer at ILM and Pixar.",
    image: "/api/placeholder/400/400",
    expertise: ["AI Development", "Immersive Tech", "Production Tools"],
    achievements: [
      { title: "Tech Innovation Award", year: "2023" },
      { title: "MIT Tech Review 35 Under 35", year: "2022" },
      { title: "3 Patents Granted", year: "2021" }
    ],
    impact: {
      projects: 40,
      awards: 8,
      innovations: 12
    },
    social: {
      twitter: "https://twitter.com/spatel",
      linkedin: "https://linkedin.com/in/spatel"
    }
  },
  {
    name: "David Kim",
    title: "Chief Strategy Officer",
    focus: "Strategic Growth",
    bio: "Digital transformation expert and former McKinsey partner specializing in media & entertainment innovation.",
    image: "/api/placeholder/400/400",
    expertise: ["Digital Strategy", "Market Expansion", "Business Innovation"],
    achievements: [
      { title: "WEF Young Global Leader", year: "2023" },
      { title: "HBR 40 Under 40", year: "2022" },
      { title: "Strategy Excellence Award", year: "2021" }
    ],
    impact: {
      projects: 45,
      awards: 6,
      innovations: 7
    },
    social: {
      twitter: "https://twitter.com/dkim",
      linkedin: "https://linkedin.com/in/dkim"
    }
  }
];

const impactIcons = {
  projects: GlobeIcon,
  awards: Award,
  innovations: BrainCircuit
};

export default function TeamMembers() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [hoveredMember, setHoveredMember] = useState(null);

  return (
    <section className="space-y-12">
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl font-bold">Leadership Team</h2>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Industry pioneers and innovators shaping the future of entertainment.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHoveredMember(member)}
            onMouseLeave={() => setHoveredMember(null)}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Card className="group cursor-pointer h-full overflow-hidden border-none bg-card hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <Button variant="secondary" className="gap-2">
                        View Profile <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.title}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {member.focus}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Leadership Profile</DialogTitle>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-4">
                      {Object.entries(member.impact).map(([key, value], i) => {
                        const Icon = impactIcons[key];
                        return (
                          <div key={key} className="flex-1 p-4 bg-muted rounded-lg text-center">
                            <Icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                            <div className="text-2xl font-bold">{value}</div>
                            <div className="text-xs text-muted-foreground capitalize">{key}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                      <p className="text-lg text-muted-foreground">{member.title}</p>
                    </div>
                    <p className="text-muted-foreground">{member.bio}</p>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Areas of Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" /> Key Achievements
                      </h4>
                      <div className="space-y-2">
                        {member.achievements.map((achievement) => (
                          <div 
                            key={achievement.title}
                            className="flex items-center justify-between py-2 border-b"
                          >
                            <span>{achievement.title}</span>
                            <span className="text-sm text-muted-foreground">{achievement.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="icon" asChild>
                        <a 
                          href={member.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a 
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative h-[400px] rounded-xl overflow-hidden"
      >
        <img
          src="/api/placeholder/1600/800"
          alt="Team collaboration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent">
          <div className="relative h-full flex items-center p-12">
            <div className="max-w-2xl space-y-6">
              <h3 className="text-3xl font-bold text-white">Join Our Vision</h3>
              <p className="text-lg text-gray-200">
                Be part of a team that's pushing the boundaries of entertainment and
                technology. We're always looking for passionate innovators.
              </p>
              <div className="flex gap-4">
                <Button>
                  <Users className="w-4 h-4 mr-2" />
                  View Opportunities
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/20">
                  Learn About Culture
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}