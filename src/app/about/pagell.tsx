'use client'

// import { Metadata } from 'next';
import HeroSection from '@/components/about-us/HeroSection';
import CompanyOverview from '@/components/about-us/CompanyOverview';
import MissionVision from '@/components/about-us/MissionVision';
import GlobalImpact from '@/components/about-us/GlobalImpact';
import TeamMembers from '@/components/about-us/TeamMembers';
import Careers from '@/components/about-us/Careers';
import PressMedia from '@/components/about-us/PressMedia';

// export const metadata: Metadata = {
//   title: 'About Us | Nalevel Empire',
//   description: 'Learn about our mission, vision, and the team behind Nalevel Empire.',
// };

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Company Overview Section */}
      <section className="py-20">
        <div className="container">
          <CompanyOverview />
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <MissionVision />
        </div>
      </section>

      {/* Global Impact Section */}
      <section className="py-20">
        <div className="container">
          <GlobalImpact />
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <TeamMembers />
        </div>
      </section>

      {/* Careers Section */}
      <section className="py-20">
        <div className="container">
          <Careers />
        </div>
      </section>

      {/* Press & Media Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <PressMedia />
        </div>
      </section>
    </main>
  );
}

// 'use client'

// import React, { useRef } from 'react';
// import { motion, useScroll, useSpring } from 'framer-motion';
// import HeroSection from '@/components/about-us/HeroSection';
// import CompanyOverview from '@/components/about-us/CompanyOverview';
// import MissionVision from '@/components/about-us/MissionVision';
// import GlobalImpact from '@/components/about-us/GlobalImpact';
// import TeamMembers from '@/components/about-us/TeamMembers';
// import PressMedia from '@/components/about-us/PressMedia';
// import Careers from '@/components/about-us/Careers';

// export default function AboutPage() {
//   const scrollRef = useRef(null);
//   const { scrollYProgress } = useScroll({
//     target: scrollRef,
//     offset: ["start start", "end end"]
//   });

//   const scaleX = useSpring(scrollYProgress, {
//     stiffness: 100,
//     damping: 30,
//     restDelta: 0.001
//   });

//   return (
//     <div ref={scrollRef} className="relative">
//       {/* Progress Bar */}
//       <motion.div
//         className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
//         style={{ scaleX }}
//       />

//       {/* Hero Section */}
//       <HeroSection />

//       {/* Main Content */}
//       <main className="container mx-auto px-4">
//         <div className="max-w-7xl mx-auto divide-y divide-border">
//           <section className="py-16" id="overview">
//             <CompanyOverview />
//           </section>

//           <section className="py-16" id="mission">
//             <MissionVision />
//           </section>

//           <section className="py-16" id="impact">
//             <GlobalImpact />
//           </section>

//           <section className="py-16" id="team">
//             <TeamMembers />
//           </section>

//           <section className="py-16" id="press">
//             <PressMedia />
//           </section>

//           <section className="py-16" id="careers">
//             <Careers />
//           </section>
//         </div>
//       </main>

//       {/* Quick Navigation */}
//       <nav className="fixed right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 z-40">
//         {[
//           { id: 'overview', label: 'Overview' },
//           { id: 'mission', label: 'Mission' },
//           { id: 'impact', label: 'Impact' },
//           { id: 'team', label: 'Team' },
//           { id: 'press', label: 'Press' },
//           { id: 'careers', label: 'Careers' }
//         ].map((item) => (
//           <a
//             key={item.id}
//             href={`#${item.id}`}
//             className="w-2 h-2 rounded-full bg-muted hover:bg-primary transition-colors group relative"
//           >
//             <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-primary text-primary-foreground text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//               {item.label}
//             </span>
//           </a>
//         ))}
//       </nav>
//     </div>
//   );
// }

// "use client"

// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { HeroSection } from '@/components/about/hero-section'
// import { CompanyOverview } from '@/components/about/company-overview'
// import { MissionVisionSection } from '@/components/about/mission-vision'
// import { TeamMembers } from '@/components/about/team-members'
// import { PressMedia } from '@/components/about/press-media'
// import { Careers } from '@/components/about/careers'
// import { GlobalReach } from '@/components/about/global-reach'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ChevronDown } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet"

// const tabs = [
//   { id: 'company-overview', label: 'Overview', component: CompanyOverview },
//   { id: 'mission-vision', label: 'Mission & Vision', component: MissionVisionSection },
//   { id: 'team-members', label: 'Team', component: TeamMembers },
//   { id: 'global-reach', label: 'Global Impact', component: GlobalReach },
//   { id: 'press-media', label: 'Press', component: PressMedia },
//   { id: 'careers', label: 'Careers', component: Careers },
// ]

// export default function AboutPage() {
//   const [activeTab, setActiveTab] = useState('company-overview')
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   if (!mounted) return null

//   return (
//     <div className="min-h-screen bg-backgroundPrimary-light dark:bg-backgroundPrimary-dark">
//       <HeroSection />
      
//       <div className="container mx-auto px-4 py-16 space-y-16">
//         <div className="space-y-8">
//           <motion.h1 
//             className="text-4xl md:text-5xl font-bold text-center text-textPrimary-light dark:text-textPrimary-dark"
//             initial={{ opacity: 0, y: -30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             About Nalevel Empire
//           </motion.h1>
          
//           <motion.p
//             className="text-xl text-center text-textSecondary-light dark:text-textSecondary-dark max-w-3xl mx-auto"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//           >
//             A global leader in entertainment innovation, combining cutting-edge technology with masterful storytelling.
//           </motion.p>
//         </div>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <div className="md:hidden">
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button variant="outline" className="w-full justify-between">
//                   {tabs.find(tab => tab.id === activeTab)?.label}
//                   <ChevronDown className="ml-2 h-4 w-4" />
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="bottom" className="full">
//                 <SheetHeader>
//                   <SheetTitle>Navigation</SheetTitle>
//                 </SheetHeader>
//                 <div className="grid gap-4 py-4">
//                   {tabs.map((tab) => (
//                     <Button
//                       key={tab.id}
//                       variant={activeTab === tab.id ? "default" : "ghost"}
//                       className="w-full justify-start"
//                       onClick={() => {
//                         setActiveTab(tab.id)
//                       }}
//                     >
//                       {tab.label}
//                     </Button>
//                   ))}
//                 </div>
//               </SheetContent>
//             </Sheet>
//           </div>

//           <TabsList className="hidden md:flex justify-center mb-8 bg-transparent">
//             {tabs.map((tab) => (
//               <TabsTrigger
//                 key={tab.id}
//                 value={tab.id}
//                 className="data-[state=active]:bg-backgroundSecondary-light dark:data-[state=active]:bg-backgroundSecondary-dark px-6 py-2"
//               >
//                 {tab.label}
//               </TabsTrigger>
//             ))}
//           </TabsList>

//           <AnimatePresence mode="wait">
//             {tabs.map((tab) => (
//               <TabsContent key={tab.id} value={tab.id}>
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <tab.component />
//                 </motion.div>
//               </TabsContent>
//             ))}
//           </AnimatePresence>
//         </Tabs>
//       </div>
//     </div>
//   )
// }