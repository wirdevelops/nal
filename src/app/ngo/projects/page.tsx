'use client'

import { useRouter } from 'next/navigation';
import { useNGOProject } from '@/hooks/useNGOProject';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectFilters } from '../components/ProjectFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, SearchIcon, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useState } from 'react';
import { ProjectCategory, ProjectStatus, Location } from '@/types/ngo/project';

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, isLoading } = useNGOProject();
  const [filters, setFilters] = useState({
    search: '',
    status: 'all' as ProjectStatus | 'all',
    category: 'all' as ProjectCategory | 'all',
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      coordinates: undefined
    } as Location
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      project.description.toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchesStatus = filters.status === 'all' || project.status === filters.status;
    const matchesCategory = filters.category === 'all' || project.category === filters.category;
    const matchesLocation = (
      (!filters.location.city || project.location.city === filters.location.city) &&
      (!filters.location.country || project.location.country === filters.location.country)
    );

    return matchesSearch && matchesStatus && matchesCategory && matchesLocation;
  });

  const stats = {
    total: filteredProjects.length,
    active: filteredProjects.filter(p => p.status === 'ongoing').length,
    completed: filteredProjects.filter(p => p.status === 'completed').length
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            {stats.total} projects • {stats.active} active • {stats.completed} completed
          </p>
        </div>
        <Button onClick={() => router.push('/ngo/projects/create')}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                search: e.target.value
              }))}
              className="pl-9"
            />
          </div>
          <ProjectFilters
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>

        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => router.push(`/ngo/projects/${project.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// import { useState, useCallback, useTransition } from 'react';
// import { useRouter } from 'next/navigation';
// import { useNGOProject } from '@/hooks/useNGOProject';
// import { useVolunteer } from '@/hooks/useVolunteer';
// import { useDonation } from '@/hooks/useDonation';
// import { useImpact } from '@/hooks/useImpact';
// import { useUser } from '@/hooks/useUser';

// import { ProjectHeader } from '.././components/Header';
// import { Overview } from '.././components/Overview';
// import { Team } from '.././components/Team';
// import { Updates } from '.././components/Updates';
// import { DonationForm } from '.././components/DonationForm';
// import { ImpactDashboard } from '.././components/ImpactDashBoard';
// import { ProjectGallery } from '.././components/ProjectGallery';
// import { DonorWall } from '.././components/DonorWall';
// import { ReportGenerator } from '.././components/ReportGenerator';
// import { VolunteerSignupForm } from '@/app/users/volunteer/VolunteerSignupForm';

// import { Button } from '@/components/ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
// import { useToast } from '@/components/ui/use-toast';
// import { Share2, FileText, Loader2 } from 'lucide-react';

// type DialogType = 'donate' | 'volunteer' | 'report' | null;

// export function ProjectDetailsClient({ projectId }: { projectId: string }) {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [isPending, startTransition] = useTransition();
//   const [activeTab, setActiveTab] = useState('overview');
//   const [dialogType, setDialogType] = useState<DialogType>(null);

//   // Hook integration
//   const { user } = useUser();
//   const { 
//     getProjectById, 
//     addProjectMedia, 
//     removeProjectMedia,
//     addProjectUpdate,
//     updateProject,
//     error: projectError,
//     isLoading: projectLoading 
//   } = useNGOProject();

//   const { registerVolunteer } = useVolunteer();
//   const { processDonation } = useDonation();
//   const { addMeasurement, getProjectImpactSummary } = useImpact();

//   const project = getProjectById(projectId);
//   const impactSummary = getProjectImpactSummary(projectId);

//   // Error handling
//   if (projectError) {
//     return (
//       <div className="p-4 text-destructive">
//         Error loading project: {projectError}
//       </div>
//     );
//   }

//   if (!project) {
//     return (
//       <div className="p-4">Project not found</div>
//     );
//   }

//   const handleDonate = useCallback(async (donationData) => {
//     try {
//       await processDonation({
//         ...donationData,
//         projectId,
//         donor: user
//       });
//       toast({ title: 'Thank you for your donation!' });
//       setDialogType(null);
//     } catch (error) {
//       toast({
//         title: 'Donation failed',
//         description: error instanceof Error ? error.message : 'Please try again',
//         variant: 'destructive'
//       });
//     }
//   }, [projectId, user, processDonation, toast]);

//   const handleVolunteer = useCallback(async (volunteerData) => {
//     try {
//       await registerVolunteer({
//         ...volunteerData,
//         projectId,
//         userId: user?.id
//       });
//       toast({ title: 'Application submitted successfully!' });
//       setDialogType(null);
//     } catch (error) {
//       toast({
//         title: 'Application failed',
//         description: error instanceof Error ? error.message : 'Please try again',
//         variant: 'destructive'
//       });
//     }
//   }, [projectId, user?.id, registerVolunteer, toast]);

//   const handleMediaUpload = useCallback(async (files: File[]) => {
//     startTransition(async () => {
//       try {
//         await addProjectMedia(projectId, files);
//         toast({ title: 'Media uploaded successfully' });
//       } catch (error) {
//         toast({
//           title: 'Upload failed',
//           description: error instanceof Error ? error.message : 'Please try again',
//           variant: 'destructive'
//         });
//       }
//     });
//   }, [projectId, addProjectMedia, toast]);

//   const handleGenerateReport = useCallback(async (options) => {
//     try {
//       // Implementation for report generation
//       toast({ title: 'Report generated successfully' });
//       setDialogType(null);
//     } catch (error) {
//       toast({
//         title: 'Report generation failed',
//         description: error instanceof Error ? error.message : 'Please try again',
//         variant: 'destructive'
//       });
//     }
//   }, [toast]);

//   const handleShare = useCallback(async () => {
//     try {
//       await navigator.share({
//         title: project.name,
//         text: project.description,
//         url: window.location.href
//       });
//     } catch (error) {
//       if (error instanceof Error && error.name !== 'AbortError') {
//         toast({
//           title: 'Sharing failed',
//           description: 'Please try copying the link instead',
//           variant: 'destructive'
//         });
//       }
//     }
//   }, [project, toast]);

//   if (projectLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 space-y-8">
//       <ProjectHeader 
//         projectId={projectId}
//         onEdit={() => router.push(`/ngo/projects/${projectId}/update`)}
//         onDonate={() => setDialogType('donate')}
//         onVolunteer={() => setDialogType('volunteer')}
//       />

//       <div className="flex justify-end gap-4">
//         <Button variant="outline" onClick={handleShare}>
//           <Share2 className="w-4 h-4 mr-2" />
//           Share
//         </Button>
//         <Button variant="outline" onClick={() => setDialogType('report')}>
//           <FileText className="w-4 h-4 mr-2" />
//           Generate Report
//         </Button>
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="grid w-full grid-cols-6">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="team">Team</TabsTrigger>
//           <TabsTrigger value="updates">Updates</TabsTrigger>
//           <TabsTrigger value="impact">Impact</TabsTrigger>
//           <TabsTrigger value="donors">Donors</TabsTrigger>
//           <TabsTrigger value="gallery">Gallery</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview">
//           <Overview project={project} />
//         </TabsContent>

//         <TabsContent value="team">
//           <Team 
//             projectId={projectId}
//             onAddMember={() => router.push(`/ngo/projects/${projectId}/team/add`)}
//           />
//         </TabsContent>

//         <TabsContent value="updates">
//           <Updates 
//             updates={project.updates}
//             onAddUpdate={(update) => addProjectUpdate(projectId, update)}
//           />
//         </TabsContent>

//         <TabsContent value="impact">
//           <ImpactDashboard 
//             metrics={project.metrics}
//             stories={project.impactStories}
//             projectId={projectId}
//           />
//         </TabsContent>

//         <TabsContent value="donors">
//           <DonorWall projectId={projectId} />
//         </TabsContent>

//         <TabsContent value="gallery">
//           <ProjectGallery 
//             projectId={projectId}
//             images={project.media}
//             onUpload={handleMediaUpload}
//             onDelete={(mediaId) => removeProjectMedia(projectId, mediaId)}
//             isLoading={isPending}
//           />
//         </TabsContent>
//       </Tabs>

//       <Dialog open={!!dialogType} onOpenChange={() => setDialogType(null)}>
//         <DialogContent className="sm:max-w-md">
//           {dialogType === 'donate' && (
//             <>
//               <DialogTitle>Support {project.name}</DialogTitle>
//               <DonationForm
//                 projectId={projectId}
//                 currentUser={user}
//                 onSuccess={handleDonate}
//                 onCancel={() => setDialogType(null)}
//               />
//             </>
//           )}
          
//           {dialogType === 'volunteer' && (
//             <>
//               <DialogTitle>Join Our Team</DialogTitle>
//               <VolunteerSignupForm
//                 onSuccess={handleVolunteer}
//                 onCancel={() => setDialogType(null)}
//               />
//             </>
//           )}

//           {dialogType === 'report' && (
//             <>
//               <DialogTitle>Generate Report</DialogTitle>
//               <ReportGenerator
//                 projectId={projectId}
//                 onGenerate={handleGenerateReport}
//               />
//             </>
//           )}
//         </DialogContent>
//       </Dialog>

//       {isPending && (
//         <div className="fixed inset-0 bg-background/80 flex items-center justify-center">
//           <Loader2 className="h-16 w-16 animate-spin" />
//         </div>
//       )}
//     </div>
//   );
// }