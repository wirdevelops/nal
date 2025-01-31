import { useState } from 'react';
import { FileUpload } from '@/components/shared/FileUpload';
import { Button } from '@/components/ui/button';
import { useProjectMedia } from 'others/useProjectMedia';
import { useFileStore } from '@/stores/useFileStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Image, Upload, FolderOpen } from 'lucide-react';
import { analyzeImage } from '@/lib/imageOptimization';

interface ThumbnailSelectorProps {
  projectId: string;
  onSelect?: (url: string) => void;
  className?: string;
}

// Define the ImageAnalysis type to match the return type of analyzeImage
interface ImageAnalysis {
  size: number;
  dimensions: {
    width: number;
    height: number;
  };
  format: string;
  suggestions: string[];
}

export function ThumbnailSelector({ projectId, onSelect, className }: ThumbnailSelectorProps) {
  const [fileSelectorOpen, setFileSelectorOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysis | null>(null);
  const { thumbnail, uploadThumbnail, removeMedia } = useProjectMedia(projectId);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleImageSelect = async (file: File) => {
    setSelectedImage(file);
    const analysis = await analyzeImage(file);
    setImageAnalysis(analysis);
    setEditDialogOpen(true);
  };

  const { getProjectFiles } = useFileStore();

  // Get all image files from the project
  const projectImages = getProjectFiles(projectId).filter(file => 
    file.type.startsWith('image/')
  );

  const handleThumbnailUpload = async (file: File) => {
    const newThumbnail = await uploadThumbnail(file);
    onSelect?.(newThumbnail.url);
  };

  const handleThumbnailRemove = () => {
    if (thumbnail) {
      removeMedia(thumbnail.id);
      onSelect?.('');
    }
  };

  const handleFileSelect = (url: string) => {
    onSelect?.(url);
    setFileSelectorOpen(false);
  };

  return (
    <div className={className}>
      <div className="space-y-2">
        {/* Thumbnail Preview/Upload */}
        <FileUpload
          value={thumbnail?.url}
          onFileSelect={handleThumbnailUpload}
          onRemove={handleThumbnailRemove}
          accept="image/*"
          maxSize={2 * 1024 * 1024} // 2MB
          aspectRatio="16:9"
        />

        {/* File Selection Button */}
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() => setFileSelectorOpen(true)}
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          Select from Project Files
        </Button>
      </div>

      {/* File Selection Dialog */}
      <Dialog open={fileSelectorOpen} onOpenChange={setFileSelectorOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Thumbnail</DialogTitle>
            <DialogDescription>
              Choose an image from your project files or upload a new one
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="files">
            <TabsList>
              <TabsTrigger value="files">
                <FolderOpen className="w-4 h-4 mr-2" />
                Project Files
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload New
              </TabsTrigger>
            </TabsList>

            <TabsContent value="files" className="mt-4">
              <div className="grid grid-cols-3 gap-4">
                {projectImages.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => handleFileSelect(file.url)}
                    className="relative group aspect-video rounded-lg overflow-hidden border hover:border-primary transition-colors"
                  >
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm">Select</span>
                    </div>
                  </button>
                ))}
              </div>
              {projectImages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No image files found in your project
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload" className="mt-4">
              <FileUpload
                onFileSelect={async (file) => {
                  await handleThumbnailUpload(file);
                  setFileSelectorOpen(false);
                }}
                accept="image/*"
                maxSize={2 * 1024 * 1024}
                aspectRatio="16:9"
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}