import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  progress: number;
  location: string;
  date: string;
}

interface ProjectsGridProps {
  title?: string;
  description?: string;
  projects: Project[];
  className?: string;
  onViewAll?: () => void;
}

export function ProjectsGrid({
  title = "Latest Projects",
  description = "Discover our most recent initiatives and creative endeavors",
  projects,
  className,
  onViewAll
}: ProjectsGridProps) {
  return (
    <section className={cn("py-16", className)}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
          {onViewAll && (
            <Button variant="outline" onClick={onViewAll}>
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-black/50 text-white hover:bg-black/60">
            {project.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground gap-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {project.location}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {project.date}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Project Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          <Button className="w-full">Learn More</Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface Project {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    category: string;
    progress: number;
    location: string;
    date: string;
  }