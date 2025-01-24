'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { NGOProject } from '@/types/ngo/project';
import { Header } from '../../components/Header';
import { Overview } from '../../components/Overview';
import { Team } from '../../components/Team';
import { Updates } from '../../components/Updates';
import { DonationForm } from '../../components/DonationForm';
import { ImpactDashboard } from '../../components/ImpactDashBoard';
import { ProjectGallery } from '../../components/ProjectGallery';
import { DonorWall } from '../../components/DonorWall';
import { ReportGenerator } from '../../components/ReportGenerator';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  Share2, 
  FileText, 
  AlertTriangle,
  Camera
} from 'lucide-react';
import { VolunteerSignupForm } from '@/app/users/volunteer/VolunteerSignupForm';

interface ProjectDetailsClientProps {
  project: NGOProject;
}

export function ProjectDetailsClient({ project }: ProjectDetailsClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [dialogState, setDialogState] = useState<{
    type: 'donate' | 'volunteer' | 'report' | 'share' | null;
    open: boolean;
  }>({ type: null, open: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = useCallback(() => {
    router.push(`/ngo/projects/${project.id}/update`);
  }, [project.id, router]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.share({
        title: project.name,
        text: project.description,
        url: window.location.href
      });
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: 'Unable to share',
          description: 'Please try copying the link manually',
          variant: 'destructive'
        });
      }
    }
  }, [project, toast]);

  const handleDialogOpen = useCallback((type: 'donate' | 'volunteer' | 'report' | 'share') => {
    setDialogState({ type, open: true });
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogState({ type: null, open: false });
  }, []);

  const handleSuccess = useCallback((type: string) => {
    handleDialogClose();
    const messages = {
      donate: 'Thank you for your donation!',
      volunteer: 'Application submitted successfully!',
      report: 'Report generated successfully!',
    };
    toast({
      title: messages[type as keyof typeof messages],
      description: 'We appreciate your support.',
    });
  }, [toast, handleDialogClose]);

  const handleImageUpload = useCallback(async (files: File[]) => {
    setIsLoading(true);
    try {
      // Handle image upload logic
      router.refresh();
      toast({
        title: 'Images uploaded successfully',
        description: `${files.length} images have been added to the gallery.`
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [router, toast]);

  const handleImageDelete = useCallback(async (imageId: string) => {
    setIsLoading(true);
    try {
      // Handle image deletion logic
      router.refresh();
      toast({
        title: 'Image removed',
        description: 'The image has been deleted from the gallery.'
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [router, toast]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Header 
        project={project}
        onEdit={handleEdit}
        onDonate={() => handleDialogOpen('donate')}
        onVolunteer={() => handleDialogOpen('volunteer')}
      />

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button variant="outline" onClick={() => handleDialogOpen('report')}>
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="donors">Donors</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Overview project={project} />
        </TabsContent>

        <TabsContent value="team">
          <Team 
            members={project.team}
            onAddMember={() => router.push(`/ngo/projects/${project.id}/team/add`)}
          />
        </TabsContent>

        <TabsContent value="updates">
          <Updates 
            updates={project.updates}
            onAddUpdate={() => router.push(`/ngo/projects/${project.id}/updates/new`)}
          />
        </TabsContent>

        <TabsContent value="impact">
          <ImpactDashboard 
            projectId={project.id}
            metrics={project.metrics}
            stories={project.impactStories}
            className="mt-6"
          />
        </TabsContent>

        <TabsContent value="donors">
          <DonorWall
            donors={project.donors}
            projectId={project.id}
          />
        </TabsContent>

        <TabsContent value="gallery">
          <ProjectGallery 
            projectId={project.id}
            images={project.media}
            onUpload={handleImageUpload}
            onDelete={handleImageDelete}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      <Dialog 
        open={dialogState.open} 
        onOpenChange={(open) => !open && handleDialogClose()}
      >
        <DialogContent className="sm:max-w-md">
          {dialogState.type === 'donate' && (
            <>
              <DialogTitle>Support {project.name}</DialogTitle>
              <DonationForm
                projectId={project.id}
                onSuccess={() => handleSuccess('donate')}
                onCancel={handleDialogClose}
              />
            </>
          )}
          
          {dialogState.type === 'volunteer' && (
            <>
              <DialogTitle>Join Our Team</DialogTitle>
              <VolunteerSignupForm
                onSuccess={() => handleSuccess('volunteer')}
                onCancel={handleDialogClose}
              />
            </>
          )}

          {dialogState.type === 'report' && (
            <>
              <DialogTitle>Generate Project Report</DialogTitle>
              <ReportGenerator
                projectId={project.id}
                onGenerate={async () => handleSuccess('report')}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      {isLoading && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>
      )}
    </div>
  );
}