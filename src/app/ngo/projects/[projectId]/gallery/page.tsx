import { ProjectGallery } from '../../../components/ProjectGallery';
import { useNGOProjectStore } from '@/stores/useNGOProjectStore';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

export default function ProjectGalleryPage({ params }: { params: { projectId: string } }) {
  const { updateProject, getProjectById } = useNGOProjectStore();
  const project = getProjectById(params.projectId);
  
  const handleUpload = async (files: File[]) => {
    try {
      // 1. Upload Files and get URLs
      const uploadedMedia = await Promise.all(files.map(async (file) => {
          // Here you would use an API or a library for uploading
          // I'm using a placeholder here
          // upload the file somewhere to a cloud storage etc
          // then return the metadata

          const url = await uploadFileToCloud(file); 
          return {
              id: uuidv4(), 
              url,
              type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'document',
          };
      }));

      // 2. Update the project with transformed media
      updateProject(params.projectId, {
        // 
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

// Placeholder function you would replace with your own code to upload the file
const uploadFileToCloud = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        // here you would implement upload to whatever platform
        // like S3, Google Cloud Storage, your own API, etc.
        // and return the url of the uploaded file
        setTimeout(() => {
            resolve(`https://fake-storage-url.com/${file.name}`);
        }, 1000)
    });
}

  const handleDelete = async (mediaId: string) => {
    try {
      const updatedMedia = project?.media.filter(m => m.id !== mediaId) || [];
      updateProject(params.projectId, { media: updatedMedia });
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