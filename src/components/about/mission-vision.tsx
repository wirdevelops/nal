"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Target, Compass, Shield, Heart, Rocket } from 'lucide-react'

const coreValues = [
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Innovation",
    description: "Pushing boundaries in storytelling and technology"
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Excellence",
    description: "Delivering unparalleled quality in every project"
  },
  {
    icon: <Compass className="w-6 h-6" />,
    title: "Integrity",
    description: "Upholding the highest ethical standards"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Trust",
    description: "Building lasting relationships with our audiences"
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Empathy",
    description: "Creating content that resonates and connects"
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Impact",
    description: "Driving positive change through storytelling"
  }
]

export function MissionVisionSection() {
  return (
    <section id="mission-vision" className="scroll-mt-16 space-y-12">
      <div className="space-y-4">
        <motion.h2 
          className="text-4xl font-semibold text-textPrimary-light dark:text-textPrimary-dark"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Purpose
        </motion.h2>
        <motion.p
          className="text-xl text-textSecondary-light dark:text-textSecondary-dark max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Transforming entertainment through innovation and compelling storytelling.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full bg-gradient-to-br from-accentPrimary to-accentSecondary text-white border-none">
            <CardHeader>
              <CardTitle className="text-3xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed opacity-90">
                To revolutionize global entertainment by creating immersive, thought-provoking content that transcends cultural boundaries. We combine cutting-edge technology with masterful storytelling to deliver experiences that inspire, entertain, and connect audiences worldwide.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full bg-backgroundSecondary-light dark:bg-backgroundSecondary-dark border-none">
            <CardHeader>
              <CardTitle className="text-3xl text-textPrimary-light dark:text-textPrimary-dark">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-textSecondary-light dark:text-textSecondary-dark">
                To be the world's leading force in entertainment innovation, setting new standards for creative excellence and technological advancement. We envision a future where our stories bridge divides, foster understanding, and inspire positive change in society.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="bg-backgroundSecondary-light dark:bg-backgroundSecondary-dark border-none">
          <CardHeader>
            <CardTitle className="text-2xl text-textPrimary-light dark:text-textPrimary-dark">Core Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="p-4 rounded-lg bg-backgroundPrimary-light dark:bg-backgroundPrimary-dark group hover:bg-gradient-to-br hover:from-accentPrimary hover:to-accentSecondary transition-all duration-300"
                >
                  <div className="text-accentPrimary group-hover:text-white transition-colors duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold mt-4 mb-2 text-textPrimary-light dark:text-textPrimary-dark group-hover:text-white transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-sm text-textSecondary-light dark:text-textSecondary-dark group-hover:text-white/90 transition-colors duration-300">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <blockquote className="text-3xl font-light italic text-textPrimary-light dark:text-textPrimary-dark">
          "Transforming imagination into reality, <br />
          one story at a time."
        </blockquote>
      </motion.div>
    </section>
  )
}