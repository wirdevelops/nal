'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense, useEffect, type ComponentType } from 'react';
import { useLandingStore } from '@/stores/useLandingStore';

interface HeroContent {
  title: string;
  subtitle: string;
  backgroundImages: { url: string; alt: string; }[];
  ctaButtons: { text: string; link: string; variant: 'primary' | 'secondary'; }[];
}

const HeroSection = dynamic<{ content: HeroContent }>(
  () => import('@/app/home/HeroSection').then(mod => mod.HeroSection),
  { loading: () => <Skeleton className="w-full aspect-[21/9]" /> }
);

const ProjectsGrid = dynamic<{ 
  projects: any[];
  isLoading: boolean;
  className?: string;
}>(
  () => import('@/app/home/ProjectsGrid').then(mod => mod.ProjectsGrid),
  { loading: () => <Skeleton className="w-full h-[600px]" /> }
);

const ImpactStats = dynamic<{ stats: any[] }>(
  () => import('@/app/home/ImpactStats').then(mod => mod.ImpactStats),
  { loading: () => <Skeleton className="w-full h-[300px]" /> }
);

const OpportunitiesSection = dynamic<{ opportunities: any[] }>(
  () => import('@/app/home/OpportunitiesSection').then(mod => mod.OpportunitiesSection),
  { loading: () => <Skeleton className="w-full h-[600px]" /> }
);

const PodcastSection = dynamic<{ episodes: any[] }>(
  () => import('@/app/home/PodcastGrid').then(mod => mod.PodcastSection),
  { loading: () => <Skeleton className="w-full h-[500px]" /> }
);

const MarketSection = dynamic<{ products: any[] }>(
  () => import('@/app/home/MarketSection').then(mod => mod.MarketSection),
  { loading: () => <Skeleton className="w-full h-[600px]" /> }
);
export default function Home() {
  const { 
    heroContent, 
    projects, 
    impactStats, 
    opportunities, 
    episodes, 
    products,
    isLoading,
    error,
    fetchLandingData
  } = useLandingStore();

  useEffect(() => {
    fetchLandingData();
  }, [fetchLandingData]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Error loading content: {error}</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Suspense fallback={<Skeleton className="w-full aspect-[21/9]" />}>
        <HeroSection content={heroContent} />
      </Suspense>

      {/* Projects Grid */}
      <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
        <ProjectsGrid
          projects={projects}
          isLoading={isLoading}
          className="bg-muted"
        />
      </Suspense>

      {/* Impact Stats */}
      <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
        <ImpactStats stats={impactStats} />
      </Suspense>

      {/* Opportunities */}
      <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
        <OpportunitiesSection opportunities={opportunities} />
      </Suspense>

      {/* Podcast Episodes */}
      <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
        <PodcastSection episodes={episodes} />
      </Suspense>

      {/* Market */}
      <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
        <MarketSection products={products} />
      </Suspense>
    </main>
  );
}


// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { SplitViewLayout } from '@/components/layout/layouts';
// import { CommunicationLayout } from "@/components/layout/CommunicationLayout";
// import ResponsiveLayout from '@/components/layout/ResponsiveLayout';

// export default function Home() {
//   return (
//     <ResponsiveLayout>
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
//     </ResponsiveLayout>
//   )
// }