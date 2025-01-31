'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Target,
  Heart,
  Globe,
  Zap,
  Trophy,
  Building,
  ArrowRight,
  Mail
} from 'lucide-react';
import Image from 'next/image';

// Company values data
const values = [
  {
    icon: Users,
    title: "People First",
    description: "We believe in empowering our team and fostering a culture of collaboration and growth."
  },
  {
    icon: Target,
    title: "Innovation",
    description: "Constantly pushing boundaries and exploring new possibilities in entertainment technology."
  },
  {
    icon: Heart,
    title: "Impact",
    description: "Creating meaningful impact through storytelling and technological advancement."
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description: "Embracing diversity and bringing stories to audiences worldwide."
  }
];

// Company milestones
const milestones = [
  {
    year: "2020",
    title: "Company Founded",
    description: "Started with a vision to transform entertainment technology."
  },
  {
    year: "2021",
    title: "Global Expansion",
    description: "Opened offices in major entertainment hubs worldwide."
  },
  {
    year: "2022",
    title: "Innovation Award",
    description: "Recognized for breakthrough AI-powered production tools."
  },
  {
    year: "2023",
    title: "Major Partnerships",
    description: "Collaborated with leading studios and production houses."
  },
  {
    year: "2024",
    title: "Platform Launch",
    description: "Released our comprehensive production management platform."
  }
];

// Updated leadership team data with placeholder image paths
const leadership = [
  {
    name: "Tanwei Elvis",
    title: "Chief Executive Officer",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFuJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    bio: "Multi-award winner with 15+ years of industry experience",
    social: { linkedin: "#", twitter: "#" }
  },
  {
    name: "Tonton Michael",
    title: "Chief Technology Officer",
     image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFuJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    bio: "AI and cloud infrastructure pioneer, previously at Amazon Studios",
    social: { linkedin: "#", twitter: "#" }
  },
  {
    name: "David Chofor",
    title: "Chief Product Officer",
    image: "https://images.unsplash.com/photo-1507003211169-0b1e0b1722a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbiUyMHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    bio: "Product visionary with experience at major tech companies",
    social: { linkedin: "#", twitter: "#" }
  },
  {
    name: "Emily Lukong",
    title: "Chief Creative Officer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b9a2cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d29tYW4lMjBwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    bio: "Award-winning creative director with global production experience",
    social: { linkedin: "#", twitter: "#" }
  }
];

// Company metrics
const metrics = [
  {
    icon: Building,
    label: "Global Offices",
    value: "12",
    suffix: "locations"
  },
  {
    icon: Users,
    label: "Team Members",
    value: "250+",
    suffix: "worldwide"
  },
  {
    icon: Trophy,
    label: "Industry Awards",
    value: "25+",
    suffix: "received"
  },
  {
    icon: Zap,
    label: "Projects Powered",
    value: "10K+",
    suffix: "and counting"
  }
];

// Add office gallery images from Unsplash
const officeGallery = [
  "https://images.unsplash.com/photo-1521737711868-e7b549b8ba7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8b2ZmaWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1602286741262-b4b31b852c41?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG9mZmljZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1517390389287-0b306a35780d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG9mZmljZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1586281372085-c1a176972538?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG9mZmljZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
];

export default function AboutPage() {
    const [showComingSoon, setShowComingSoon] = useState(false);

  const handleButtonClick = () => {
      setShowComingSoon(true);
  };

    const handleCloseModal = () => {
    setShowComingSoon(false);
    };
  return (
    <div className="container py-16 space-y-16">
      {/* Coming Soon Modal */}
      {showComingSoon && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Coming Soon!</h2>
                <p className="text-gray-700 mb-4">
                    This feature is under development and will be available soon.
                </p>
              <Button onClick={handleCloseModal}>Close</Button>
            </div>
          </div>
        )}
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full">
          <Badge variant="default">Our Story</Badge>
          <span className="text-sm font-medium">Founded in 2020</span>
        </div>
        <h1 className="text-4xl font-bold">Transforming Entertainment Production</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're on a mission to revolutionize how stories are told through technology
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Our Vision</h3>
            <p className="text-muted-foreground">
              To be the global leader in entertainment technology, empowering creators
              to bring their stories to life in revolutionary ways.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Our Mission</h3>
            <p className="text-muted-foreground">
              To provide cutting-edge tools and technologies that streamline production
              workflows and unleash creative potential.
            </p>
          </CardContent>
        </Card>
      </div>

       {/* Office Gallery Section */}
       <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Our Spaces</h2>
          <p className="text-muted-foreground">Where creativity meets innovation</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {officeGallery.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Office space ${index + 1}`}
              width={500}
              height={300}
              className="rounded-lg h-48 object-cover shadow-sm hover:shadow-md transition-shadow"
            />
          ))}
        </div>
      </div>

      {/* Company Values */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Our Values</h2>
          <p className="text-muted-foreground">The principles that guide everything we do</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <Card key={value.title}>
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Company Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardContent className="pt-6">
                <Icon className="h-6 w-6 text-primary mb-4" />
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold">{metric.value}</h3>
                  <p className="text-sm text-muted-foreground">
                    {metric.label}
                    <br />
                    {metric.suffix}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Milestones */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Our Journey</h2>
          <p className="text-muted-foreground">Key milestones in our growth</p>
        </div>
        <div className="relative border-l border-primary/20 ml-4 space-y-8">
          {milestones.map((milestone, index) => (
            <div key={milestone.year} className="relative pl-8">
              <div className="absolute -left-3 mt-1.5">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs text-white">
                  {index + 1}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{milestone.year}</Badge>
                  <h3 className="font-semibold">{milestone.title}</h3>
                </div>
                <p className="text-muted-foreground">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

        {/* Leadership Team */}
        <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Leadership Team</h2>
          <p className="text-muted-foreground">Meet the people driving our vision forward</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {leadership.map((member) => (
            <Card key={member.name}>
              <CardContent className="pt-6">
                <div className="aspect-square rounded-lg overflow-hidden mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{member.title}</p>
                <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleButtonClick}>
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleButtonClick}>
                    <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Join Us CTA */}
      <div className="relative rounded-lg overflow-hidden">
         <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/20 mix-blend-multiply" />
           <Image
            src="https://images.unsplash.com/photo-1556740714-a8329e7e7c76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNvcm5lcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
            alt="Join our team"
            width={1200}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative p-8 md:p-12 text-white">
          <div className="max-w-3xl space-y-6">
            <h2 className="text-3xl font-bold">Join Our Team</h2>
            <p className="text-lg opacity-90">
              Be part of a team that's revolutionizing the entertainment industry.
              We're always looking for passionate innovators.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary" size="lg" onClick={handleButtonClick}>
                View Openings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/20" onClick={handleButtonClick}>
                <Mail className="mr-2 h-4 w-4" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}