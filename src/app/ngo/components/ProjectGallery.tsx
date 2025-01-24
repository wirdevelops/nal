import React from 'react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileUpload } from '@/components/shared/FileUpload';
import { Trash2, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProjectMedia } from '@/types/ngo/project';

interface ProjectGalleryProps {
  projectId: string;
  images: ProjectMedia[];
  onUpload: (files: File[]) => Promise<void>;
  onDelete: (imageId: string) => Promise<void>;
  isLoading?: boolean;
}

interface GalleryCardProps {
  image: ProjectMedia;
  onDelete: (imageId: string) => void;
  deleteLoading: string | null;
  onClick: () => void;
}

const GalleryCard = React.memo(({ image, onDelete, deleteLoading, onClick }: GalleryCardProps) => (
  <Card
    className="group relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    onClick={onClick}
  >
    <div className="relative aspect-square">
      <Image
        src={image.url}
        alt={image.caption || 'Project image'}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />
      
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Button
          variant="destructive"
          size="sm"
          aria-label={`Delete image ${image.caption || ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(image.id);
          }}
          disabled={deleteLoading === image.id}
        >
          {deleteLoading === image.id ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>

    {image.caption && (
      <CardContent className="p-3">
        <p className="text-sm line-clamp-2">{image.caption}</p>
      </CardContent>
    )}
  </Card>
));

export const ProjectGallery = ({
  projectId,
  images,
  onUpload,
  onDelete,
  isLoading
}: ProjectGalleryProps) => {
  const { toast } = useToast();
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const selectedImageIndex = useMemo(() => 
    images.findIndex(img => img.id === selectedImageId),
  [images, selectedImageId]
  );

  
  const handleDelete = useCallback(async (imageId: string) => {
    try {
      setDeleteLoading(imageId);
      await onDelete(imageId);
      toast({ title: 'Success', description: 'Image removed from gallery' });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Could not remove image',
        variant: 'destructive'
      });
    } finally {
      setDeleteLoading(null);
    }
  }, [onDelete, toast]);

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (selectedImageIndex === -1) return;
    
    const newIndex = direction === 'next' 
      ? (selectedImageIndex + 1) % images.length
      : (selectedImageIndex - 1 + images.length) % images.length;
    
    setSelectedImageId(images[newIndex].id);
  }, [selectedImageIndex, images]);

  const galleryItems = useMemo(() => 
    images.map((image) => (
      <GalleryCard 
        key={image.id}
        image={image}
        onDelete={handleDelete}
        deleteLoading={deleteLoading}
        onClick={() => setSelectedImageId(image.id)}
      />
    )),
  [images, deleteLoading, handleDelete]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageId) {
        if (e.key === 'ArrowLeft') navigateImage('prev');
        if (e.key === 'ArrowRight') navigateImage('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageId, navigateImage]);

  const handleUpload = useCallback(async (files: File[]) => {
    try {
      setUploadLoading(true);
      await onUpload(files);
      setUploadDialogOpen(false);
      toast({ title: 'Upload successful', description: 'Images added to gallery' });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Could not upload images',
        variant: 'destructive'
      });
    } finally {
      setUploadLoading(false);
    }
  }, [onUpload, toast]);


  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Gallery</h2>
        <Button 
          onClick={() => setUploadDialogOpen(true)}
          disabled={uploadLoading}
        >
          {uploadLoading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Upload Images
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryItems}
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Upload Project Images</DialogTitle>
          </DialogHeader>
          <FileUpload
            accept="image/*"
            multiple
            maxSize={10 * 1024 * 1024}
            onUpload={handleUpload}
          />
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!selectedImageId} onOpenChange={() => setSelectedImageId(null)}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          {selectedImageId && (
            <div className="relative aspect-video">
              <Image
                src={images[selectedImageIndex].url}
                alt={images[selectedImageIndex].caption || 'Project image preview'}
                fill
                className="object-contain"
                priority
                quality={90}
                onLoadingComplete={() => window.dispatchEvent(new Event('resize'))}
              />
              
              {images.length > 1 && (
                <div className="absolute top-1/2 w-full flex justify-between px-4 transform -translate-y-1/2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => navigateImage('prev')}
                    className="shadow-lg"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => navigateImage('next')}
                    className="shadow-lg"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};