import { useCallback, useMemo } from 'react';
import { useProjectMediaStore, type Annotation, type ProjectMedia } from '@/stores/useProjectMediaStore';
import { useToast } from '@/components/ui/use-toast';

export function useProjectMedia(projectId: string) {
  const {
    addMedia,
    updateMedia,
    removeMedia,
    getProjectMedia,
    getProjectThumbnail,
    addAnnotation,
    updateAnnotation,
    removeAnnotation,
    createMediaVersion,
    revertToVersion,
  } = useProjectMediaStore();

  const { toast } = useToast();

  // Fetch media data
  const media = useMemo(() => getProjectMedia(projectId), [projectId, getProjectMedia]);
  const thumbnail = useMemo(() => getProjectThumbnail(projectId), [projectId, getProjectThumbnail]);

  // Handle file uploads
  const handleFileUpload = useCallback(async (
    file: File,
    type: ProjectMedia['type'] = 'attachment',
    metadata: Partial<ProjectMedia['metadata']> = {}
  ) => {
    try {
      // In a real implementation, you would upload to your storage service here
      // For now, we'll use URL.createObjectURL
      const url = URL.createObjectURL(file);

      const newMedia = addMedia({
        projectId,
        type,
        url,
        filename: file.name,
        fileType: file.type,
        size: file.size,
        metadata: {
          ...metadata,
          version: 1,
        },
      });

      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });

      return newMedia;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive',
      });
      throw error;
    }
  }, [projectId, addMedia, toast]);

  // Handle thumbnail upload and update
  const handleThumbnailUpload = useCallback(async (file: File) => {
    // Remove existing thumbnail if any
    if (thumbnail) {
      removeMedia(thumbnail.id);
    }

    // Upload new thumbnail
    return handleFileUpload(file, 'thumbnail', {
      width: 0, // This would be set after actual image processing
      height: 0,
    });
  }, [thumbnail, removeMedia, handleFileUpload]);

  // Handle feedback media upload
  const handleFeedbackUpload = useCallback(async (
    file: File,
    description?: string,
    tags?: string[]
  ) => {
    return handleFileUpload(file, 'feedback', {
      description,
      tags,
      annotations: [],
    });
  }, [handleFileUpload]);

  // Handle annotations
  const handleAddAnnotation = useCallback((
    mediaId: string,
    annotationData: Omit<Annotation, 'id' | 'timestamp'>
  ) => {
    try {
      addAnnotation(mediaId, annotationData);
      toast({
        title: 'Success',
        description: 'Annotation added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add annotation',
        variant: 'destructive',
      });
      throw error;
    }
  }, [addAnnotation, toast]);

  // Handle versioning
  const handleCreateVersion = useCallback((mediaId: string) => {
    try {
      createMediaVersion(mediaId);
      toast({
        title: 'Success',
        description: 'New version created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create version',
        variant: 'destructive',
      });
      throw error;
    }
  }, [createMediaVersion, toast]);

  // Filter media by type
  const getMediaByType = useCallback((type: ProjectMedia['type']) => {
    return media.filter(m => m.type === type);
  }, [media]);

  return {
    // Data
    media,
    thumbnail,
    
    // Media operations
    uploadFile: handleFileUpload,
    updateMedia,
    removeMedia,
    
    // Thumbnail specific
    uploadThumbnail: handleThumbnailUpload,
    
    // Feedback specific
    uploadFeedback: handleFeedbackUpload,
    getFeedbackMedia: () => getMediaByType('feedback'),
    
    // Annotations
    addAnnotation: handleAddAnnotation,
    updateAnnotation,
    removeAnnotation,
    
    // Versions
    createVersion: handleCreateVersion,
    revertToVersion,
    
    // Filters
    getMediaByType,
  };
}