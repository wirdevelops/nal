'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Film, Users, Globe, Heart, Video, Briefcase } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GuestHome() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      if (!user?.onboarding.completed.includes('completed')) {
        router.push(`/auth/onboarding/${user.onboarding.stage}`);
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  const features = [
    {
      icon: <Film className="h-8 w-8" />,
      title: "Project Management",
      description: "Streamline your film projects with powerful collaboration tools"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Talent Network",
      description: "Connect with skilled professionals and build your dream team"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "NGO Initiatives",
      description: "Make an impact through film and visual storytelling"
    }
  ];

  const showcaseProjects = [
    {
      title: "Cinematic Excellence",
      type: "Feature Film",
      imageUrl: "/api/placeholder/600/400",
      category: "In Production"
    },
    {
      title: "Community Stories",
      type: "Documentary Series",
      imageUrl: "/api/placeholder/600/400",
      category: "NGO Project"
    },
    {
      title: "Urban Narratives",
      type: "Short Film",
      imageUrl: "/api/placeholder/600/400",
      category: "Completed"
    }
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Empowering Filmmakers to Create Impact
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join a community of storytellers, connect with NGOs, and access resources
              to bring your vision to life.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/register">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-lg border bg-card">
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Showcase */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12">Featured Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {showcaseProjects.map((project, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                  <span className="text-sm text-primary-foreground mb-2">{project.type}</span>
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  <span className="text-sm text-white/80">{project.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 px-6 bg-muted">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Video className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Professional Tools</h3>
                  <p className="text-muted-foreground">
                    Access industry-standard project management tools designed specifically
                    for film production.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Briefcase className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Career Growth</h3>
                  <p className="text-muted-foreground">
                    Find opportunities, showcase your work, and connect with industry
                    professionals.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Heart className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Social Impact</h3>
                  <p className="text-muted-foreground">
                    Collaborate with NGOs and contribute to meaningful causes through
                    visual storytelling.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/api/placeholder/600/400"
                alt="Platform preview"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join our platform today and be part of a growing community of filmmakers
            and changemakers.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/register">
              Create Your Account <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

// import React from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from "@/components/ui/button";
// import { Icons } from "@/components/ui/Icons";
// import { AuthButtons } from "@/components/auth/auth-buttons";
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
//             <AuthButtons />
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