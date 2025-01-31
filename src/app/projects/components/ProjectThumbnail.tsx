import { useProjectMedia } from 'others/useProjectMedia';
import { FileUpload } from '@/components/shared/FileUpload';

interface ProjectThumbnailProps {
  projectId: string;
  className?: string;
}

export function ProjectThumbnail({ projectId, className }: ProjectThumbnailProps) {
  const { thumbnail, uploadThumbnail, removeMedia } = useProjectMedia(projectId);

  const handleThumbnailUpload = async (file: File) => {
    await uploadThumbnail(file);
  };

  const handleThumbnailRemove = () => {
    if (thumbnail) {
      removeMedia(thumbnail.id);
    }
  };

  return (
    <FileUpload
      value={thumbnail?.url}
      onFileSelect={handleThumbnailUpload}
      onRemove={handleThumbnailRemove}
      accept="image/*"
      maxSize={2 * 1024 * 1024} // 2MB
      aspectRatio="16:9"
      className={className}
    />
  );
}