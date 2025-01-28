"use client"

import { useState } from 'react'
import Image from "next/image"
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Twitter, Linkedin, Award, ArrowUpRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

const teamMembers = [
  {
    name: "Alexandra Chen",
    title: "Chief Executive Officer",
    bio: "Former Netflix executive with 15+ years leading content innovation. Pioneered AI-driven production techniques and led multiple Emmy-winning projects.",
    image: "/placeholder.svg?height=400&width=400",
    achievements: ["Emmy Award Winner", "Forbes 40 Under 40", "Time 100 Next"],
    social: {
      twitter: "https://twitter.com/alexchen",
      linkedin: "https://linkedin.com/in/alexchen"
    }
  },
  {
    name: "Marcus Rodriguez",
    title: "Chief Creative Officer",
    bio: "BAFTA-winning director known for groundbreaking storytelling. Previously led creative at HBO and Amazon Studios.",
    image: "/placeholder.svg?height=400&width=400",
    achievements: ["BAFTA Award", "Sundance Fellow", "DGA Award"],
    social: {
      twitter: "https://twitter.com/mrodriguez",
      linkedin: "https://linkedin.com/in/mrodriguez"
    }
  },
  {
    name: "Sarah Patel",
    title: "Head of Technology",
    bio: "AI and immersive tech pioneer. Led development of industry-standard production tools at ILM and Pixar.",
    image: "/placeholder.svg?height=400&width=400",
    achievements: ["Tech Innovation Award", "MIT Tech Review 35 Under 35", "3 Patents"],
    social: {
      twitter: "https://twitter.com/spatel",
      linkedin: "https://linkedin.com/in/spatel"
    }
  },
  {
    name: "David Kim",
    title: "Chief Strategy Officer",
    bio: "Former McKinsey partner specializing in media & entertainment. Led digital transformation for major studios.",
    image: "/placeholder.svg?height=400&width=400",
    achievements: ["WEF Young Global Leader", "Harvard Business Review 40 Under 40"],
    social: {
      twitter: "https://twitter.com/dkim",
      linkedin: "https://linkedin.com/in/dkim"
    }
  }
]

export function TeamMembers() {
  const [selectedMember, setSelectedMember] = useState(null)

  return (
    <section id="team-members" className="scroll-mt-16 space-y-12">
      <div className="space-y-4">
        <motion.h2 
          className="text-4xl font-semibold text-textPrimary-light dark:text-textPrimary-dark"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Leadership Team
        </motion.h2>
        <motion.p
          className="text-xl text-textSecondary-light dark:text-textSecondary-dark max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Industry veterans and innovators shaping the future of entertainment.
        </motion.p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card 
              className="group bg-backgroundSecondary-light dark:bg-backgroundSecondary-dark border-none hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => setSelectedMember(member)}
            >
              <div className="relative h-[300px] overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="outline" className="text-white border-white hover:bg-white/20">
                    View Profile <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-textPrimary-light dark:text-textPrimary-dark mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-textSecondary-light dark:text-textSecondary-dark mb-4">
                  {member.title}
                </p>
                <div className="flex items-center gap-2">
                  {member.achievements.slice(0, 1).map((achievement) => (
                    <span
                      key={achievement}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accentPrimary/10 text-accentPrimary"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Leadership Profile</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{selectedMember.name}</h3>
                  <p className="text-lg text-textSecondary-light dark:text-textSecondary-dark">
                    {selectedMember.title}
                  </p>
                </div>
                <p className="text-textSecondary-light dark:text-textSecondary-dark">
                  {selectedMember.bio}
                </p>
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Award className="h-5 w-5 text-accentPrimary" /> Achievements
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.achievements.map((achievement) => (
                      <span
                        key={achievement}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accentPrimary/10 text-accentPrimary"
                      >
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href={selectedMember.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-textSecondary-light dark:text-textSecondary-dark hover:text-accentPrimary transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href={selectedMember.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-textSecondary-light dark:text-textSecondary-dark hover:text-accentPrimary transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}