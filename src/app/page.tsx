'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/Icons";

import { Film, Camera, Users, Building, ShoppingBag, Heart } from 'lucide-react';

const features = [
  {
    icon: Film,
    title: "Project Creation",
    description: "Create and manage film projects with ease"
  },
  {
    icon: Camera,
    title: "Crew Networking",
    description: "Connect with talented film professionals"
  },
  {
    icon: Building,
    title: "Resource Management",
    description: "Access and manage production resources"
  },
  {
    icon: Heart,
    title: "Community Impact",
    description: "Connect with NGOs and create meaningful content"
  }
];

const roles = [
  {
    icon: Film,
    title: "Project Owners",
    description: "Create and manage film projects"
  },
  {
    icon: Camera,
    title: "Crew Members",
    description: "Find work and showcase skills"
  },
  {
    icon: Users,
    title: "Actors",
    description: "Discover casting opportunities"
  },
  {
    icon: ShoppingBag,
    title: "Vendors",
    description: "Offer equipment and services"
  }
];

export default function GuestLanding() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900">
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] mix-blend-overlay opacity-20" />
        </div>
        
        <div className="container relative z-10 space-y-8">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Your Film Production Hub
            </h1>
            <p className="text-xl text-gray-300">
              Connect, Create, and Collaborate with film professionals worldwide
            </p>
    
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="space-y-4 p-6 rounded-lg bg-card">
                <feature.icon className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            For Every Role in Film
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roles.map((role, index) => (
              <div key={index} className="space-y-4 p-6 rounded-lg bg-background">
                <role.icon className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">{role.title}</h3>
                <p className="text-muted-foreground">{role.description}</p>
                <Button 
                  variant="link" 
                  onClick={() => router.push('/register')}
                  className="px-0"
                >
                  Join Now
                  <Icons.arrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center space-y-8">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-xl max-w-2xl mx-auto">
            Join our community of film professionals and start creating amazing content
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => router.push('/register')}
          >
            Create Account
            <Icons.arrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

// 'use client';

// import dynamic from 'next/dynamic';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Suspense, useEffect, type ComponentType } from 'react';
// import { useLandingStore } from '@/stores/useLandingStore';

// interface HeroContent {
//   title: string;
//   subtitle: string;
//   backgroundImages: { url: string; alt: string; }[];
//   ctaButtons: { text: string; link: string; variant: 'primary' | 'secondary'; }[];
// }

// const HeroSection = dynamic<{ content: HeroContent }>(
//   () => import('@/app/home/HeroSection').then(mod => mod.HeroSection),
//   { loading: () => <Skeleton className="w-full aspect-[21/9]" /> }
// );

// const ProjectsGrid = dynamic<{ 
//   projects: any[];
//   isLoading: boolean;
//   className?: string;
// }>(
//   () => import('@/app/home/ProjectsGrid').then(mod => mod.ProjectsGrid),
//   { loading: () => <Skeleton className="w-full h-[600px]" /> }
// );

// const ImpactStats = dynamic<{ stats: any[] }>(
//   () => import('@/app/home/ImpactStats').then(mod => mod.ImpactStats),
//   { loading: () => <Skeleton className="w-full h-[300px]" /> }
// );

// const OpportunitiesSection = dynamic<{ opportunities: any[] }>(
//   () => import('@/app/home/OpportunitiesSection').then(mod => mod.OpportunitiesSection),
//   { loading: () => <Skeleton className="w-full h-[600px]" /> }
// );

// const PodcastSection = dynamic<{ episodes: any[] }>(
//   () => import('@/app/home/PodcastGrid').then(mod => mod.PodcastSection),
//   { loading: () => <Skeleton className="w-full h-[500px]" /> }
// );

// const MarketSection = dynamic<{ products: any[] }>(
//   () => import('@/app/home/MarketSection').then(mod => mod.MarketSection),
//   { loading: () => <Skeleton className="w-full h-[600px]" /> }
// );
// export default function Home() {
//   const { 
//     heroContent, 
//     projects, 
//     impactStats, 
//     opportunities, 
//     episodes, 
//     products,
//     isLoading,
//     error,
//     fetchLandingData
//   } = useLandingStore();

//   useEffect(() => {
//     fetchLandingData();
//   }, [fetchLandingData]);

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-destructive">Error loading content: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <main className="flex flex-col min-h-screen">
//       {/* Hero Section */}
//       <Suspense fallback={<Skeleton className="w-full aspect-[21/9]" />}>
//         <HeroSection content={heroContent} />
//       </Suspense>

//       {/* Projects Grid */}
//       <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
//         <ProjectsGrid
//           projects={projects}
//           isLoading={isLoading}
//           className="bg-muted"
//         />
//       </Suspense>

//       {/* Impact Stats */}
//       <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
//         <ImpactStats stats={impactStats} />
//       </Suspense>

//       {/* Opportunities */}
//       <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
//         <OpportunitiesSection opportunities={opportunities} />
//       </Suspense>

//       {/* Podcast Episodes */}
//       <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
//         <PodcastSection episodes={episodes} />
//       </Suspense>

//       {/* Market */}
//       <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
//         <MarketSection products={products} />
//       </Suspense>
//     </main>
//   );
// }


// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { SplitViewLayout } from '@/components/layout/layouts';
// import { CommunicationLayout } from "@/components/layout/CommunicationLayout";

// export default function Home() {
//   return (

//     <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
//       <h1 className="text-6xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
//         Welcome to Nalevel Empire
//       </h1>
//       <p className="text-xl text-center mb-8 max-w-2xl">
//         Empowering filmmakers and TV producers with cutting-edge project management tools and portfolio showcasing.
//       </p>
//       <div className="flex space-x-4">
//         <Button asChild>
//           <Link href="/projects">Explore Film Projects</Link>
//         </Button>
//         <Button asChild variant="outline">
//           <Link href="/casting">See Casting Calls</Link>
//         </Button>
//         <Button asChild variant="outline">
//           <Link href="/jobs">Discover Oppotunitunities</Link>
//         </Button>
//       </div>
//     </div>

//   )
// }