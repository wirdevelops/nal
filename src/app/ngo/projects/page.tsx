'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjects } from '@/hooks/useNGOProject';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectFilters } from '../components/ProjectFilters';

import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProjectStatus, ProjectCategory, ProjectLocation } from '@/types/ngo/project';
import { useToast } from '@/components/ui/use-toast';
import { StatsCards } from '../components/StatsCards';
import { DonationForm } from '../components/DonationForm';


interface ProjectFiltersState {
  search: string;
  status: ProjectStatus | 'all';
  category: ProjectCategory | 'all';
  location: ProjectLocation;
}

export default function ProjectsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showDonateDialog, setShowDonateDialog] = useState(false);
  const [filters, setFilters] = useState<ProjectFiltersState>({
    search: '',
    status: 'all',
    category: 'all',
    location: { city: '', country: '' }
  });

  const { projects, metrics, loading, error } = useProjects({
    search: filters.search,
    status: filters.status,
    category: filters.category,
    location: filters.location
  });

  const stats = {
    total: metrics.projectCount,
    ongoing: metrics.ongoingProjects,
    completed: projects.filter(p => p.status === ProjectStatus.COMPLETED).length,
    planned: projects.filter(p => p.status === ProjectStatus.PLANNED).length
  };

  const handleCreateProject = () => {
    router.push('/ngo/projects/new');
  };

  const handleProjectSelect = (projectId: string) => {
    router.push(`/ngo/projects/${projectId}`);
  };

  const handleDonate = (projectId: string) => {
    setSelectedProjectId(projectId);
    setShowDonateDialog(true);
  };

  const handleVolunteer = (projectId: string) => {
    router.push(`/ngo/projects/${projectId}/volunteer`);
  };

  const handleDonationSuccess = () => {
    setShowDonateDialog(false);
    toast({
      title: "Thank you for your donation!",
      description: "Your contribution will help make a difference.",
    });
  };

  if (error) {
    return (
      <Card className="container mx-auto p-8 border-destructive">
        <div className="text-center text-destructive space-y-2">
          <h3 className="text-lg font-semibold">Error Loading Projects</h3>
          <p>{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">NGO Projects</h1>
          <p className="text-lg text-muted-foreground">
            Manage and monitor all your organization's initiatives
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-[400px]">
              <SheetHeader>
                <SheetTitle>Filter Projects</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <ProjectFilters 
                  onFilterChange={setFilters}
                  filters={filters}
                />
              </div>
            </SheetContent>
          </Sheet>
          <Button onClick={handleCreateProject}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <StatsCards stats={stats} isLoading={loading} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[420px] w-full rounded-xl" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectSelect(project.id)}
              onDonate={() => handleDonate(project.id)}
              onVolunteer={() => handleVolunteer(project.id)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or create a new project
          </p>
          <Button onClick={handleCreateProject}>Create Project</Button>
        </Card>
      )}

      <Dialog open={showDonateDialog} onOpenChange={setShowDonateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Make a Donation</DialogTitle>
          </DialogHeader>
          <DonationForm 
            projectId={selectedProjectId ?? undefined}
            onSuccess={handleDonationSuccess}
            onCancel={() => setShowDonateDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}