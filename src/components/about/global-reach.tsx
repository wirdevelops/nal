"use client"

import { useEffect, useRef, MutableRefObject } from 'react'
import { motion } from 'framer-motion'
import Globe, { GlobeMethods } from 'react-globe.gl'
import { Globe2, Play } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Star, Award, TrendingUp } from 'lucide-react'
import Image from 'next/image'

const globeData = [
  { lat: 40.7128, lng: -74.0060, size: 25, color: '#E31837', label: 'New York', viewers: '20M+' },
  { lat: 51.5074, lng: -0.1278, size: 20, color: '#B30C28', label: 'London', viewers: '15M+' },
  { lat: 35.6762, lng: 139.6503, size: 22, color: '#FF4D6A', label: 'Tokyo', viewers: '18M+' },
  { lat: -33.8688, lng: 151.2093, size: 18, color: '#E31837', label: 'Sydney', viewers: '12M+' },
  { lat: 28.6139, lng: 77.2090, size: 20, color: '#B30C28', label: 'New Delhi', viewers: '15M+' },
  { lat: 19.4326, lng: -99.1332, size: 19, color: '#FF4D6A', label: 'Mexico City', viewers: '14M+' },
  { lat: -23.5505, lng: -46.6333, size: 21, color: '#E31837', label: 'São Paulo', viewers: '16M+' },
  { lat: 1.3521, lng: 103.8198, size: 17, color: '#B30C28', label: 'Singapore', viewers: '10M+' }
]

const stats = [
  {
    title: "Global Markets",
    value: "190+",
    subtext: "Countries with active viewers",
    icon: <Globe2 className="w-6 h-6" />,
    trend: "+15% YoY"
  },
  {
    title: "Monthly Viewers",
    value: "120M+",
    subtext: "Active monthly engagement",
    icon: <Users className="w-6 h-6" />,
    trend: "+25% YoY"
  },
  {
    title: "Content Hours",
    value: "10K+",
    subtext: "Hours of original content",
    icon: <Play className="w-6 h-6" />,
    trend: "+40% YoY"
  },
  {
    title: "Global Awards",
    value: "50+",
    subtext: "International recognitions",
    icon: <Award className="w-6 h-6" />,
    trend: "+30% YoY"
  }
]

const regions = [
  { name: "North America", share: 35 },
  { name: "Europe", share: 25 },
  { name: "Asia Pacific", share: 20 },
  { name: "Latin America", share: 12 },
  { name: "Middle East & Africa", share: 8 }
]

export function GlobalReach() {
  const globeEl = useRef<GlobeMethods | null>(null) as MutableRefObject<GlobeMethods>;

  useEffect(() => {
    const controls = globeEl.current?.controls()
    if (controls) {
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.5
    }
    globeEl.current?.pointOfView({ lat: 0, lng: 0, altitude: 2.5 })
  }, [])

  return (
    <section id="global-reach" className="scroll-mt-16 space-y-12">
      <div className="space-y-4">
        <motion.h2 
          className="text-4xl font-semibold text-textPrimary-light dark:text-textPrimary-dark"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Global Impact
        </motion.h2>
        <motion.p
          className="text-xl text-textSecondary-light dark:text-textSecondary-dark max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Reaching audiences and creating impact across continents.
        </motion.p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <Card className="bg-backgroundSecondary-light dark:bg-backgroundSecondary-dark border-none h-full">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-lg bg-accentPrimary/10">
                    {stat.icon}
                  </div>
                  <div className="flex items-center text-sm text-green-500">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.trend}
                  </div>
                </div>
                <h3 className="text-3xl font-bold mt-4 mb-2 text-textPrimary-light dark:text-textPrimary-dark">
                  {stat.value}
                </h3>
                <p className="text-lg font-medium mb-1 text-textPrimary-light dark:text-textPrimary-dark">
                  {stat.title}
                </p>
                <p className="text-sm text-textSecondary-light dark:text-textSecondary-dark">
                  {stat.subtext}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="bg-backgroundSecondary-light dark:bg-backgroundSecondary-dark border-none">
          <CardHeader>
            <CardTitle className="text-2xl text-textPrimary-light dark:text-textPrimary-dark">
              Worldwide Presence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] w-full bg-backgroundPrimary-light dark:bg-backgroundPrimary-dark rounded-lg">
              <Globe
                ref={globeEl}
                globeImageUrl="/placeholder.svg?height=1000&width=2000"
                pointsData={globeData}
                pointAltitude={0.1}
                pointColor="color"
                pointRadius="size"
                pointLabel="label"
                pointsMerge={true}
                backgroundColor="rgba(0,0,0,0)"
                atmosphereColor="#ffffff"
                atmosphereAltitude={0.1}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="bg-backgroundSecondary-light dark:bg-backgroundSecondary-dark border-none h-full">
            <CardHeader>
              <CardTitle className="text-2xl text-textPrimary-light dark:text-textPrimary-dark">
                Regional Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regions.map((region) => (
                  <div key={region.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-textSecondary-light dark:text-textSecondary-dark">
                        {region.name}
                      </span>
                      <span className="font-medium text-textPrimary-light dark:text-textPrimary-dark">
                        {region.share}%
                      </span>
                    </div>
                    <div className="h-2 bg-backgroundPrimary-light dark:bg-backgroundPrimary-dark rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-accentPrimary"
                        initial={{ width: 0 }}
                        animate={{ width: `${region.share}%` }}
                        transition={{ duration: 1, delay: 1 }}
                      />
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
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="bg-gradient-to-br from-accentPrimary to-accentSecondary text-white border-none h-full">
            <CardHeader>
              <CardTitle className="text-2xl">Our Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Cultural Resonance</h4>
                <p className="opacity-90">
                  Creating content that celebrates diversity and connects cultures across borders.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Local Partnerships</h4>
                <p className="opacity-90">
                  Collaborating with local talent and studios to bring authentic stories to life.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Global Recognition</h4>
                <p className="opacity-90">
                  Earning accolades and audience love across international markets.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}