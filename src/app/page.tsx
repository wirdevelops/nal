import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';


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
            <Link href="/pro-trial">
              <Button size="lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              </Link>
              <Link href="/projects">
              <Button variant="outline" size="lg">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
              </Link>
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
              <Link href="/blog">
              <Button size="lg">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              </Link>
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
            <Link href="/pro-tial">
              <Button variant="secondary" size="lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              </Link>
              <Link href="/contact">
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/20">
                <MessageSquare className="mr-2 h-4 w-4" />
                Talk to Sales
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
    {/* New Navigation Buttons Section */}
    <section className="py-12 bg-background">
        <div className="container">
          <div className="flex justify-center gap-4">
           <Link href="/ngo">
              <Button 
                variant="outline" 
                size="lg"
                className="min-w-[120px] font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                NGO
            </Button>
            </Link>
             <Link href="/market">
            <Button 
              variant="outline" 
              size="lg"
              className="min-w-[120px] font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Market
            </Button>
            </Link>
            <Link href="/projects">
            <Button 
              variant="outline" 
              size="lg"
              className="min-w-[120px] font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Projects
            </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}