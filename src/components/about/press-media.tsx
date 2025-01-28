"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, ArrowUpRight, Calendar, Award, ExternalLink } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"

const pressReleases = [
  {
    title: "Nalevel Empire Announces Groundbreaking AI-Powered Production Platform",
    date: "January 15, 2025",
    category: "Technology",
    link: "#"
  },
  {
    title: "Partnership with Leading Streaming Platform Expands Global Reach",
    date: "December 20, 2024",
    category: "Business",
    link: "#"
  },
  {
    title: "Latest Original Series Breaks Streaming Records",
    date: "December 5, 2024",
    category: "Entertainment",
    link: "#"
  }
]

const mediaHighlights = [
  {
    source: "The Hollywood Reporter",
    title: "Nalevel Empire: Redefining Entertainment in the Digital Age",
    quote: "A masterclass in combining technological innovation with storytelling excellence",
    date: "2024"
  },
  {
    source: "Variety",
    title: "Industry Game-Changers: The Rise of Nalevel Empire",
    quote: "Setting new standards for content creation and distribution",
    date: "2024"
  },
  {
    source: "Forbes",
    title: "The Future of Entertainment: Nalevel Empire's Vision",
    quote: "Pioneering the next generation of immersive storytelling",
    date: "2024"
  }
]

export function PressMedia() {
  return (
    <section id="press-media" className="scroll-mt-16 space-y-12">
      <div className="space-y-4">
        <motion.h2 
          className="text-4xl font-semibold text-textPrimary-light dark:text-textPrimary-dark"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Press & Media
        </motion.h2>
        <motion.p
          className="text-xl text-textSecondary-light dark:text-textSecondary-dark max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Stay updated with our latest news, announcements, and media coverage.
        </motion.p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-backgroundSecondary-light dark:bg-backgroundSecondary-dark border-none h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">Latest News</CardTitle>
              <Button variant="outline" size="sm">
                All News <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {pressReleases.map((release) => (
                  <Link 
                    key={release.title}
                    href={release.link}
                    className="block group"
                  >
                    <div className="p-4 rounded-lg bg-backgroundPrimary-light dark:bg-backgroundPrimary-dark hover:shadow-md transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-sm text-textSecondary-light dark:text-textSecondary-dark">
                            <Calendar className="h-4 w-4" />
                            {release.date}
                            <span className="px-2 py-1 rounded-full bg-accentPrimary/10 text-accentPrimary text-xs">
                              {release.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-medium text-textPrimary-light dark:text-textPrimary-dark group-hover:text-accentPrimary transition-colors">
                            {release.title}
                          </h3>
                        </div>
                        <ExternalLink className="h-5 w-5 text-textSecondary-light dark:text-textSecondary-dark group-hover:text-accentPrimary transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-backgroundSecondary-light dark:bg-backgroundSecondary-dark border-none h-full">
            <CardHeader>
              <CardTitle className="text-2xl">Media Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-backgroundPrimary-light dark:bg-backgroundPrimary-dark">
                <h3 className="text-lg font-medium mb-3">Media Kit</h3>
                <p className="text-sm text-textSecondary-light dark:text-textSecondary-dark mb-4">
                  Download our comprehensive media kit including logos, brand guidelines, and executive headshots.
                </p>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" /> Download Media Kit
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-backgroundPrimary-light dark:bg-backgroundPrimary-dark">
                <h3 className="text-lg font-medium mb-3">Press Contact</h3>
                <p className="text-sm text-textSecondary-light dark:text-textSecondary-dark mb-2">
                  For media inquiries:
                </p>
                <a 
                  href="mailto:press@nalevelempire.com"
                  className="text-accentPrimary hover:underline"
                >
                  press@nalevelempire.com
                </a>
              </div>
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
            <CardTitle className="text-2xl">Media Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {mediaHighlights.map((highlight) => (
                <div 
                  key={highlight.title}
                  className="p-4 rounded-lg bg-backgroundPrimary-light dark:bg-backgroundPrimary-dark"
                >
                  <Award className="h-6 w-6 text-accentPrimary mb-4" />
                  <div className="flex items-center gap-2 text-sm text-textSecondary-light dark:text-textSecondary-dark mb-2">
                    <span>{highlight.source}</span>
                    <span>•</span>
                    <span>{highlight.date}</span>
                  </div>
                  <h3 className="font-medium mb-2 text-textPrimary-light dark:text-textPrimary-dark">
                    {highlight.title}
                  </h3>
                  <p className="text-sm italic text-textSecondary-light dark:text-textSecondary-dark">
                    "{highlight.quote}"
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="relative h-[400px] rounded-xl overflow-hidden"
      >
        <Image
          src="/placeholder.svg?height=800&width=1600"
          alt="Nalevel Empire press event"
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h3 className="text-3xl font-bold mb-4">Making Headlines</h3>
          <p className="text-lg mb-6 max-w-2xl">Leading the conversation in entertainment innovation and storytelling excellence.</p>
        </div>
      </motion.div>
    </section>
  )
}