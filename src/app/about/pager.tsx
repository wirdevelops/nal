'use client'

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

import {HeroSection} from '@/components/about/hero-section';
import {CompanyOverview} from '@/components/about/company-overview';
import {MissionVisionSection} from '@/components/about/mission-vision';
import {TeamMembers} from '@/components/about/team-members';
import {GlobalReach} from '@/components/about/global-reach';
import {PressMedia} from '@/components/about/press-media';
import {Careers} from '@/components/about/careers';
import React from 'react';

const tabList = [
    { id: 'overview', label: 'Overview', component: CompanyOverview },
    { id: 'mission', label: 'Mission & Vision', component: MissionVisionSection },
    { id: 'team-members', label: 'Team', component: TeamMembers },
    { id: 'global-reach', label: 'Global Impact', component: GlobalReach },
    { id: 'press-media', label: 'Press', component: PressMedia },
    { id: 'careers', label: 'Careers', component: Careers },
  ];
  
  export default function AboutPageLayout() {
    const [activeTab, setActiveTab] = React.useState('overview');
//     const [mounted, setMounted] = useState(false)
  
//     useEffect(() => {
//       setMounted(true)
//     }, [])

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   if (!mounted) return null
  
    return (
      <div className="container mx-auto px-4 py-16">
        <HeroSection />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-16"
        >

          {/* Page Title */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">About Nalevel Empire</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A global leader in entertainment innovation, combining cutting-edge 
              technology with masterful storytelling.
            </p>
          </div>
  
          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Mobile Sheet Navigation */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    {tabList.find(tab => tab.id === activeTab)?.label}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[50vh]">
                  <div className="grid gap-4 py-4">
                    {tabList.map((tab) => (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => {
                          setActiveTab(tab.id);
                        }}
                      >
                        {tab.label}
                      </Button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
  
            {/* Desktop Tabs */}
            <TabsList className="hidden md:flex justify-center mb-8">
              {tabList.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="px-6 py-2"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
  
            {/* Tab Content */}
            {tabList.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <tab.component />
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    );
  }

// 'use client'

// import React , { useState, useEffect } from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { ChevronDown } from 'lucide-react';
// import { motion } from 'framer-motion';

// import HeroSection from '@/components/about-us/HeroSection';
// import CompanyOverview from '@/components/about-us/CompanyOverview';
// import MissionVisionSection from '@/components/about-us/MissionVision';
// import TeamMembers from '@/components/about-us/TeamMembers';
// import GlobalReach from '@/components/about-us/GlobalImpact';
// import PressMedia from '@/components/about-us/PressMedia';
// import Careers from '@/components/about-us/Careers';

// const tabs = [
//   { id: 'overview', label: 'Overview', component: CompanyOverview },
//   { id: 'mission', label: 'Mission & Vision', component: MissionVisionSection },
//   { id: 'team-members', label: 'Team', component: TeamMembers },
//   { id: 'global-reach', label: 'Global Impact', component: GlobalReach },
//   { id: 'press-media', label: 'Press', component: PressMedia },
//   { id: 'careers', label: 'Careers', component: Careers },
// ]

// export default function AboutPage() {
//   const [activeTab, setActiveTab] = React.useState('overview');
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   if (!mounted) return null

//   return (
//     <div className="min-h-screen bg-background">
//       <HeroSection />
      
//       <div className="container mx-auto px-4 py-16">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="space-y-16"
//         >
//           {/* Page Title */}
//           <div className="text-center space-y-4">
//             <h1 className="text-4xl font-bold">About Nalevel Empire</h1>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               A global leader in entertainment innovation, combining cutting-edge 
//               technology with masterful storytelling.
//             </p>
//           </div>

//           {/* Navigation Tabs */}
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             {/* Mobile Sheet Navigation */}
//             <div className="md:hidden">
//               <Sheet>
//                 <SheetTrigger asChild>
//                   <Button variant="outline" className="w-full flex justify-between items-center">
//                     {tabs.find(tab => tab.id === activeTab)?.label}
//                     <ChevronDown className="ml-2 h-4 w-4" />
//                   </Button>
//                 </SheetTrigger>
//                 <SheetContent side="bottom" className="h-[50vh]">
//                   <div className="grid gap-4 py-4">
//                     {tabs.map((tab) => (
//                       <Button
//                         key={tab.id}
//                         variant={activeTab === tab.id ? "default" : "ghost"}
//                         className="w-full justify-start"
//                         onClick={() => {
//                           setActiveTab(tab.id);
//                         }}
//                       >
//                         {tab.label}
//                       </Button>
//                     ))}
//                   </div>
//                 </SheetContent>
//               </Sheet>
//             </div>

//             {/* Desktop Tabs */}
//             <TabsList className="hidden md:flex justify-center mb-8">
//               {tabs.map((tab) => (
//                 <TabsTrigger
//                   key={tab.id}
//                   value={tab.id}
//                   className="px-6 py-2"
//                 >
//                   {tab.label}
//                 </TabsTrigger>
//               ))}
//             </TabsList>

//             {/* Tab Content */}
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
//           </Tabs>
//         </motion.div>
//       </div>
//     </div>
//   );
// }


// return (
//   <div className="min-h-screen bg-backgroundPrimary-light dark:bg-backgroundPrimary-dark">
//     <HeroSection />
    
//     <div className="container mx-auto px-4 py-16 space-y-16">
//       <div className="space-y-8">
//         <motion.h1 
//           className="text-4xl md:text-5xl font-bold text-center text-textPrimary-light dark:text-textPrimary-dark"
//           initial={{ opacity: 0, y: -30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           About Nalevel Empire
//         </motion.h1>
        
//         <motion.p
//           className="text-xl text-center text-textSecondary-light dark:text-textSecondary-dark max-w-3xl mx-auto"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           A global leader in entertainment innovation, combining cutting-edge technology with masterful storytelling.
//         </motion.p>
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <div className="md:hidden">
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="outline" className="w-full justify-between">
//                 {tabs.find(tab => tab.id === activeTab)?.label}
//                 <ChevronDown className="ml-2 h-4 w-4" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="bottom" className="full">
//               <SheetHeader>
//                 <SheetTitle>Navigation</SheetTitle>
//               </SheetHeader>
//               <div className="grid gap-4 py-4">
//                 {tabs.map((tab) => (
//                   <Button
//                     key={tab.id}
//                     variant={activeTab === tab.id ? "default" : "ghost"}
//                     className="w-full justify-start"
//                     onClick={() => {
//                       setActiveTab(tab.id)
//                     }}
//                   >
//                     {tab.label}
//                   </Button>
//                 ))}
//               </div>
//             </SheetContent>
//           </Sheet>
//         </div>

//         <TabsList className="hidden md:flex justify-center mb-8 bg-transparent">
//           {tabs.map((tab) => (
//             <TabsTrigger
//               key={tab.id}
//               value={tab.id}
//               className="data-[state=active]:bg-backgroundSecondary-light dark:data-[state=active]:bg-backgroundSecondary-dark px-6 py-2"
//             >
//               {tab.label}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         <AnimatePresence mode="wait">
//           {tabs.map((tab) => (
//             <TabsContent key={tab.id} value={tab.id}>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <tab.component />
//               </motion.div>
//             </TabsContent>
//           ))}
//         </AnimatePresence>
//       </Tabs>
//     </div>
//   </div>
// )
// }