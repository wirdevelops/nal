'use client';

import { useState, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { NGOProject, ProjectMedia } from '@/types/ngo/project';
import { ProjectHeader } from '.././components/Header';
import { Overview } from '.././components/Overview';
import { Team } from '.././components/Team';
import { Updates } from '.././components/Updates';
import { DonationForm } from '.././components/DonationForm';
import { ImpactDashboard } from '.././components/ImpactDashBoard';
import { ProjectGallery } from '.././components/ProjectGallery';
import { DonorWall } from '.././components/DonorWall';
import { ReportGenerator } from '.././components/ReportGenerator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  Share2, 
  FileText,
  Loader2
} from 'lucide-react';
import { VolunteerSignupForm } from '@/app/users/volunteer/VolunteerSignupForm';
import { useNGOProjectStore } from '@/stores/useNGOProjectStore';

type DialogType = 'donate' | 'volunteer' | 'report' | null;
type SuccessType = 'donate' | 'volunteer' | 'report';

export function ProjectDetailsClient({ project }: { project: NGOProject }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState('overview');
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const { addProjectMedia, removeProjectMedia } = useNGOProjectStore();
  
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
      if (!(error instanceof Error) || error.name !== 'AbortError') {
        toast({
          title: 'Sharing failed',
          description: 'Please try copying the link instead',
          variant: 'destructive'
        });
      }
    }
  }, [project, toast]);

  const handleDialogOpen = useCallback((type: DialogType) => {
    setDialogType(type);
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogType(null);
  }, []);

  const handleSuccess = useCallback((type: SuccessType) => {
    handleDialogClose();
    toast({
      title: {
        donate: 'Thank you for your donation!',
        volunteer: 'Application submitted!',
        report: 'Report generated!',
      }[type],
      description: 'We appreciate your support.',
    });
  }, [toast, handleDialogClose]);

  const handleImageUpload = useCallback(async (files: File[]) => {
    startTransition(async () => {
      try {
        await addProjectMedia(project.id, files);
        toast({
          title: 'Upload successful',
          description: `${files.length} media items added`,
        });
      } catch (error) {
        toast({
          title: 'Upload failed',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive'
        });
      }
    });
  }, [project.id, addProjectMedia, toast]);

  const handleImageDelete = useCallback(async (mediaId: string) => {
    startTransition(async () => {
      try {
        await removeProjectMedia(project.id, mediaId);
        toast({ title: 'Media removed successfully' });
      } catch (error) {
        toast({
          title: 'Delete failed',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive'
        });
      }
    });
  }, [project.id, removeProjectMedia, toast]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <ProjectHeader 
        projectId={project.id}
        onEdit={handleEdit}
        onDonate={() => handleDialogOpen('donate')}
        onVolunteer={() => handleDialogOpen('volunteer')}
      />

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button 
          variant="outline" 
          onClick={() => handleDialogOpen('report')}
          disabled={isPending}
        >
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
            isLoading={isPending}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={!!dialogType} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          {dialogType === 'donate' && (
            <>
              <DialogTitle>Support {project.name}</DialogTitle>
              <DonationForm
                projectId={project.id}
                onSuccess={() => handleSuccess('donate')}
                onCancel={handleDialogClose}
              />
            </>
          )}
          
          {dialogType === 'volunteer' && (
            <>
              <DialogTitle>Join Our Team</DialogTitle>
              <VolunteerSignupForm
                onSuccess={() => handleSuccess('volunteer')}
                onCancel={handleDialogClose}
              />
            </>
          )}

          {dialogType === 'report' && (
            <>
              <DialogTitle>Generate Report</DialogTitle>
              <ReportGenerator
                projectId={project.id}
                onGenerate={() => handleSuccess('report')}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      {isPending && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin" />
        </div>
      )}
    </div>
  );
}