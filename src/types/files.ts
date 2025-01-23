export type FileType = 'image' | 'video' | 'audio' | 'document' | 'script';
export type FileStatus = 'uploading' | 'processing' | 'ready' | 'error';

export interface FileMetadata {
  width?: number;
  height?: number;
  duration?: number;
  lastModified?: number;
  version?: number;
  description?: string;
  tags?: string[];
  isThumbnail?: boolean;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  type: FileType;
  mimeType: string;
  size: number;
  url: string;
  status: FileStatus;
  metadata?: FileMetadata;
  folderId?: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  uploadedBy: string;
}
