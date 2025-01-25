import { Button } from "@/components/ui/button";
import { ArrowRight, Film, Users, Globe, Heart, Video, Briefcase } from "lucide-react";
import Link from "next/link";

export default function GuestHome() {
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
                <Link href="/about">Learn More</Link>
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

      {/* Call to Action */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join Nalevel Empire today and be part of a growing community of filmmakers
            and changemakers.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/register">
              Create Your Account <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
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
    </div>
  );
}