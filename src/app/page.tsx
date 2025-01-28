import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Play,
  Users,
  Zap,
  Globe,
  Shield,
  Check,
  Star,
  PlayCircle,
  Download,
  MessageSquare
} from 'lucide-react';

// Platform features
const features = [
  {
    icon: Zap,
    title: "AI-Powered Production",
    description: "Streamline your workflow with intelligent automation and creative assistance"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work seamlessly with your team in real-time, anywhere in the world"
  },
  {
    icon: Globe,
    title: "Global Distribution",
    description: "Reach audiences worldwide with integrated distribution tools"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Keep your content secure with industry-leading protection"
  }
];

// Success metrics
const metrics = [
  { label: "Active Users", value: "100K+" },
  { label: "Countries", value: "150+" },
  { label: "Projects Completed", value: "1M+" },
  { label: "Hours Saved", value: "10M+" }
];

// Client testimonials
const testimonials = [
  {
    quote: "This platform has transformed how we manage our productions. The AI features are game-changing.",
    author: "Sarah Chen",
    role: "Production Director",
    company: "Global Studios",
    image: "/api/placeholder/100/100"
  },
  {
    quote: "The collaboration tools have made remote work seamless for our entire team.",
    author: "Michael Ross",
    role: "Creative Director",
    company: "Digital Arts Co",
    image: "/api/placeholder/100/100"
  },
  {
    quote: "Security and reliability are crucial for us, and this platform delivers on both fronts.",
    author: "Emily Wong",
    role: "Technical Director",
    company: "Innovation Films",
    image: "/api/placeholder/100/100"
  }
];

// Integration partners
const partners = [
  { name: "Adobe", logo: "/api/placeholder/150/50" },
  { name: "Autodesk", logo: "/api/placeholder/150/50" },
  { name: "Unity", logo: "/api/placeholder/150/50" },
  { name: "Unreal", logo: "/api/placeholder/150/50" },
  { name: "DaVinci", logo: "/api/placeholder/150/50" }
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background to-background/50" />
          <img
            src="/api/placeholder/1920/600"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container relative z-10">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full">
              <Badge variant="default">New</Badge>
              <span className="text-sm font-medium">AI-Powered Production Tools</span>
            </div>

            <h1 className="text-5xl font-bold">
              Transform Your Production Workflow
            </h1>

            <p className="text-xl text-muted-foreground">
              Streamline your production process with AI-powered tools and seamless team collaboration.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-12 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need for Modern Production
            </h2>
            <p className="text-muted-foreground">
              Powerful features to streamline your workflow and enhance creativity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="relative group hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold">
                Why Choose Our Platform?
              </h2>
              <div className="space-y-4">
                {[
                  "AI-powered workflow automation",
                  "Real-time team collaboration",
                  "Enterprise-grade security",
                  "24/7 expert support",
                  "Seamless integrations"
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <Button size="lg">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src="/api/placeholder/800/450"
                alt="Platform benefits"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button variant="outline" size="lg" className="gap-2">
                  <PlayCircle className="h-5 w-5" />
                  See it in Action
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-muted-foreground">
              See what our customers have to say about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.author} className="relative">
                <CardContent className="pt-6">
                  <Star className="h-8 w-8 text-primary mb-4" />
                  <blockquote className="text-muted-foreground mb-6">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Partners */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Works With Your Favorite Tools
            </h2>
            <p className="text-muted-foreground">
              Seamless integration with industry-standard software
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {partners.map((partner) => (
              <div key={partner.name} className="grayscale hover:grayscale-0 transition-all duration-300">
                <img src={partner.logo} alt={partner.name} className="h-12" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/20 mix-blend-multiply" />
          <img
            src="/api/placeholder/1920/600"
            alt="CTA background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container relative">
          <div className="max-w-2xl mx-auto text-center text-white space-y-6">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-lg opacity-90">
              Join thousands of production teams already using our platform
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="secondary" size="lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/20">
                <MessageSquare className="mr-2 h-4 w-4" />
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// 'use client'
// import React from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from "@/components/ui/button";
// import { Icons } from "@/components/ui/Icons";

// import { Film, Camera, Users, Building, ShoppingBag, Heart } from 'lucide-react';

// const features = [
//   {
//     icon: Film,
//     title: "Project Creation",
//     description: "Create and manage film projects with ease"
//   },
//   {
//     icon: Camera,
//     title: "Crew Networking",
//     description: "Connect with talented film professionals"
//   },
//   {
//     icon: Building,
//     title: "Resource Management",
//     description: "Access and manage production resources"
//   },
//   {
//     icon: Heart,
//     title: "Community Impact",
//     description: "Connect with NGOs and create meaningful content"
//   }
// ];

// const roles = [
//   {
//     icon: Film,
//     title: "Project Owners",
//     description: "Create and manage film projects"
//   },
//   {
//     icon: Camera,
//     title: "Crew Members",
//     description: "Find work and showcase skills"
//   },
//   {
//     icon: Users,
//     title: "Actors",
//     description: "Discover casting opportunities"
//   },
//   {
//     icon: ShoppingBag,
//     title: "Vendors",
//     description: "Offer equipment and services"
//   }
// ];

// export default function GuestLanding() {
//   const router = useRouter();

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Hero Section */}
//       <section className="relative h-[80vh] flex items-center">
//         <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900">
//           <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] mix-blend-overlay opacity-20" />
//         </div>
        
//         <div className="container relative z-10 space-y-8">
//           <div className="max-w-2xl space-y-4">
//             <h1 className="text-4xl md:text-6xl font-bold text-white">
//               Your Film Production Hub
//             </h1>
//             <p className="text-xl text-gray-300">
//               Connect, Create, and Collaborate with film professionals worldwide
//             </p>
    
//           </div>
//         </div>
//       </section>

//       {/* Features Grid */}
//       <section className="py-20 bg-background">
//         <div className="container">
//           <h2 className="text-3xl font-bold text-center mb-12">
//             Everything You Need
//           </h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {features.map((feature, index) => (
//               <div key={index} className="space-y-4 p-6 rounded-lg bg-card">
//                 <feature.icon className="h-12 w-12 text-primary" />
//                 <h3 className="text-xl font-semibold">{feature.title}</h3>
//                 <p className="text-muted-foreground">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Roles Section */}
//       <section className="py-20 bg-muted">
//         <div className="container">
//           <h2 className="text-3xl font-bold text-center mb-12">
//             For Every Role in Film
//           </h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {roles.map((role, index) => (
//               <div key={index} className="space-y-4 p-6 rounded-lg bg-background">
//                 <role.icon className="h-12 w-12 text-primary" />
//                 <h3 className="text-xl font-semibold">{role.title}</h3>
//                 <p className="text-muted-foreground">{role.description}</p>
//                 <Button 
//                   variant="link" 
//                   onClick={() => router.push('/register')}
//                   className="px-0"
//                 >
//                   Join Now
//                   <Icons.arrowRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-primary text-primary-foreground">
//         <div className="container text-center space-y-8">
//           <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
//           <p className="text-xl max-w-2xl mx-auto">
//             Join our community of film professionals and start creating amazing content
//           </p>
//           <Button 
//             size="lg" 
//             variant="secondary"
//             onClick={() => router.push('/register')}
//           >
//             Create Account
//             <Icons.arrowRight className="ml-2 h-4 w-4" />
//           </Button>
//         </div>
//       </section>
//     </div>
//   );
// }

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