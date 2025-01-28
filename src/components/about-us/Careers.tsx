"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Briefcase, Users, Award, Globe2 } from 'lucide-react'
import Image from "next/image"

const benefits = [
  {
    icon: <Award className="w-8 h-8 text-accentPrimary" />,
    title: "Professional Growth",
    description: "Continuous learning programs, mentorship, and career advancement opportunities"
  },
  {
    icon: <Globe2 className="w-8 h-8 text-accentPrimary" />,
    title: "Global Impact",
    description: "Work on projects that reach millions of viewers across 190+ countries"
  },
  {
    icon: <Users className="w-8 h-8 text-accentPrimary" />,
    title: "Inclusive Culture",
    description: "Be part of a diverse team that values different perspectives and ideas"
  },
  {
    icon: <Briefcase className="w-8 h-8 text-accentPrimary" />,
    title: "Competitive Package",
    description: "Comprehensive benefits, flexible work arrangements, and equity options"
  }
]

const openings = [
  {
    title: "Senior Producer",
    department: "Production",
    location: "Los Angeles",
    type: "Full-time",
    level: "Senior"
  },
  {
    title: "Lead VFX Artist",
    department: "Creative",
    location: "Remote",
    type: "Full-time",
    level: "Senior"
  },
  {
    title: "Content Marketing Manager",
    department: "Marketing",
    location: "New York",
    type: "Full-time",
    level: "Mid-Senior"
  },
  {
    title: "Technical Director",
    department: "Technology",
    location: "London",
    type: "Full-time",
    level: "Senior"
  }
]

export default function Careers() {
  return (
    <section id="careers" className="scroll-mt-16 space-y-12">
      <div className="space-y-4">
        <motion.h2 
          className="text-4xl font-semibold text-textPrimary-light dark:text-textPrimary-dark"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Join Our Vision
        </motion.h2>
        <motion.p
          className="text-xl text-textSecondary-light dark:text-textSecondary-dark max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Shape the future of entertainment with us. We're looking for exceptional talent who share our passion for storytelling and innovation.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {benefits.map((benefit, index) => (
          <Card key={benefit.title} className="bg-backgroundSecondary-light dark:bg-backgroundSecondary-dark border-none hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-textPrimary-light dark:text-textPrimary-dark">{benefit.title}</h3>
              <p className="text-sm text-textSecondary-light dark:text-textSecondary-dark">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-backgroundSecondary-light dark:bg-backgroundSecondary-dark border-none">
          <CardHeader>
            <CardTitle className="text-2xl text-textPrimary-light dark:text-textPrimary-dark flex items-center justify-between">
              Current Openings
              <Button variant="outline" className="text-sm">
                View All Positions <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {openings.map((job, index) => (
                <div
                  key={job.title}
                  className="p-4 rounded-lg bg-backgroundPrimary-light dark:bg-backgroundPrimary-dark hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-2">
                        {job.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-textSecondary-light dark:text-textSecondary-dark">
                        <span>{job.department}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{job.type}</Badge>
                      <Badge variant="outline">{job.level}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative h-[400px] rounded-xl overflow-hidden"
      >
        <Image
          src="/placeholder.svg?height=800&width=1600"
          alt="Team collaboration at Nalevel Empire"
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h3 className="text-3xl font-bold mb-4">Build Your Future With Us</h3>
          <p className="text-lg mb-6 max-w-2xl">Join a team of innovators, storytellers, and technologists shaping the future of entertainment.</p>
          <Button size="lg" className="bg-white text-accentPrimary hover:bg-white/90">
            Explore Opportunities
          </Button>
        </div>
      </motion.div>
    </section>
  )
}