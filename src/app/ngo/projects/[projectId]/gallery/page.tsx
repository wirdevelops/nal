import { ProjectGallery } from '../../../components/ProjectGallery';
import { useNGOProject } from '@/hooks/useNGOProject';
import { toast } from '@/components/ui/use-toast';

export default function ProjectGalleryPage({ params }: { params: { projectId: string } }) {
  const { updateProject, getProjectById } = useNGOProject();
  const project = getProjectById(params.projectId);
  
  const handleUpload = async (files: File[]) => {
    try {
      await updateProject(params.projectId, {
        media: [...(project?.media || []), ...files]
      });
      toast({
        title: 'Success',
        description: 'Images uploaded successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (mediaId: string) => {
    try {
      const updatedMedia = project?.media.filter(m => m.id !== mediaId) || [];
      await updateProject(params.projectId, { media: updatedMedia });
      toast({
        title: 'Success',
        description: 'Image deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive'
      });
    }
  };

  return (
    <ProjectGallery
      projectId={params.projectId}
      images={project?.media || []}
      onUpload={handleUpload}
      onDelete={handleDelete}
    />
  );
}