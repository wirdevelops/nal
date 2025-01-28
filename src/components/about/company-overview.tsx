"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Timeline } from '@/components/ui/timeline'
import { Trophy, Users, Film, Globe, Play, Star } from 'lucide-react'
import Image from "next/image"

const milestones = [
  {
    year: 2010,
    title: "Foundation",
    description: "Established with a vision to revolutionize digital entertainment",
    icon: <Users className="w-5 h-5" />,
    stats: { employees: 5, projects: 1 }
  },
  {
    year: 2015,
    title: "Global Expansion",
    description: "Opened studios in London and Tokyo, expanding our global footprint",
    icon: <Globe className="w-5 h-5" />,
    stats: { employees: 100, projects: 15 }
  },
  {
    year: 2018,
    title: "Innovation Era",
    description: "Launched proprietary AI-powered production platform",
    icon: <Star className="w-5 h-5" />,
    stats: { employees: 250, projects: 45 }
  },
  {
    year: 2020,
    title: "Streaming Success",
    description: "Reached 50 million viewers with breakthrough series",
    icon: <Play className="w-5 h-5" />,
    stats: { employees: 500, projects: 75 }
  },
  {
    year: 2024,
    title: "Industry Leader",
    description: "Recognized as leading entertainment innovator",
    icon: <Trophy className="w-5 h-5" />,
    stats: { employees: 1000, projects: 150 }
  }
]

const achievements = [
  { number: "150+", label: "Productions", icon: <Film className="w-6 h-6" /> },
  { number: "1000+", label: "Team Members", icon: <Users className="w-6 h-6" /> },
  { number: "50M+", label: "Global Viewers", icon: <Globe className="w-6 h-6" /> },
  { number: "25+", label: "Industry Awards", icon: <Trophy className="w-6 h-6" /> }
]

export function CompanyOverview() {
  const [selectedMilestone, setSelectedMilestone] = useState(milestones[milestones.length - 1])

  return (
    <section id="company-overview" className="scroll-mt-16 space-y-12">
      <div className="space-y-4">
        <motion.h2 
          className="text-4xl font-semibold text-textPrimary-light dark:text-textPrimary-dark"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Story
        </motion.h2>
        <motion.p
          className="text-xl text-textSecondary-light dark:text-textSecondary-dark max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          From innovative startup to global entertainment leader.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-backgroundSecondary-light dark:bg-backgroundSecondary-dark border-none">
          <CardHeader>
            <CardTitle className="text-2xl text-textPrimary-light dark:text-textPrimary-dark">Growth Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-5 gap-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="text-center p-6 rounded-lg bg-backgroundPrimary-light dark:bg-backgroundPrimary-dark"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accentPrimary/10 text-accentPrimary mb-4">
                    {achievement.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-textPrimary-light dark:text-textPrimary-dark mb-2">
                    {achievement.number}
                  </h3>
                  <p className="text-sm text-textSecondary-light dark:text-textSecondary-dark">
                    {achievement.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-backgroundSecondary-light dark:bg-backgroundSecondary-dark border-none h-full">
            <CardHeader>
              <CardTitle className="text-2xl text-textPrimary-light dark:text-textPrimary-dark">Key Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-0 w-0.5 bg-accentPrimary h-full rounded-full" />
                <div className="space-y-8">
                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.year}
                      className={`ml-6 cursor-pointer relative ${selectedMilestone.year === milestone.year ? 'opacity-100' : 'opacity-70'}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      onClick={() => setSelectedMilestone(milestone)}
                    >
                      <div className="absolute -left-9 mt-1.5">
                        <div className="w-6 h-6 rounded-full bg-accentPrimary flex items-center justify-center text-white">
                          {milestone.icon}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-accentPrimary">{milestone.year}</span>
                        <h3 className="text-lg font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-1">{milestone.title}</h3>
                        <p className="text-textSecondary-light dark:text-textSecondary-dark">{milestone.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="bg-backgroundSecondary-light dark:bg-backgroundSecondary-dark border-none h-full">
            <CardHeader>
              <CardTitle className="text-2xl text-textPrimary-light dark:text-textPrimary-dark">
                {selectedMilestone.year} Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-backgroundPrimary-light dark:bg-backgroundPrimary-dark">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-textSecondary-light dark:text-textSecondary-dark">Team Size</span>
                    <span className="text-2xl font-bold text-textPrimary-light dark:text-textPrimary-dark">
                      {selectedMilestone.stats.employees}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-textSecondary-light dark:text-textSecondary-dark">Projects Completed</span>
                    <span className="text-2xl font-bold text-textPrimary-light dark:text-textPrimary-dark">
                      {selectedMilestone.stats.projects}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="relative h-[400px] rounded-xl overflow-hidden"
      >
        <Image
          src="/placeholder.svg?height=800&width=1600"
          alt="Company growth journey"
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h3 className="text-3xl font-bold mb-4">Looking to the Future</h3>
          <p className="text-lg mb-6 max-w-2xl">Continuing to push boundaries and redefine entertainment excellence.</p>
        </div>
      </motion.div>
    </section>
  )
}