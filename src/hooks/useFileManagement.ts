
import { useCallback, useState } from 'react';
import { useFileStore } from '@/stores/useFileStore';
import { useToast } from '@/components/ui/use-toast';
import type { FileType, ProjectFile } from '@/types/files';

interface UploadOptions {
  type?: FileType;
  folderId?: string;
  metadata?: Record<string, any>;
  onProgress?: (progress: number) => void;
}

export function useFileManagement(projectId: string) {
  const [isUploading, setIsUploading] = useState(false);
  const fileStore = useFileStore();
  const { toast } = useToast();

  const uploadFile = useCallback(async (
    file: File,
    options: UploadOptions = {}
  ) => {
    const fileId = crypto.randomUUID();
    setIsUploading(true);

    try {
      // Start upload progress tracking
      fileStore.setUploadProgress(fileId, 0);

      // In a real implementation, this would be your API upload call
      // For now, we'll simulate the upload
      const url = URL.createObjectURL(file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        const currentProgress = fileStore.uploadProgress[fileId] || 0;
        if (currentProgress < 100) {
          fileStore.setUploadProgress(fileId, Math.min(currentProgress + 10, 100));
          options.onProgress?.(Math.min(currentProgress + 10, 100));
        }
      }, 200);

      // Wait for simulated upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearInterval(progressInterval);

      // Create the file record
      const newFile = fileStore.addFile({
        projectId,
        name: file.name,
        type: options.type || getFileType(file.type),
        mimeType: file.type,
        size: file.size,
        url,
        status: 'ready',
        metadata: {
          ...options.metadata,
          lastModified: file.lastModified,
        },
        folderId: options.folderId,
        uploadedBy: 'Current User', // In real app, get from auth
      });

      fileStore.clearUploadProgress(fileId);
      setIsUploading(false);

      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });

      return newFile;
    } catch (error) {
      fileStore.clearUploadProgress(fileId);
      setIsUploading(false);

      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive',
      });

      throw error;
    }
  }, [projectId, fileStore, toast]);

  const uploadProjectThumbnail = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Thumbnail must be an image file');
    }

    const thumbnail = await uploadFile(file, {
      type: 'image',
      metadata: {
        isThumbnail: true,
      },
    });

    fileStore.setProjectThumbnail(projectId, thumbnail);
    return thumbnail;
  }, [projectId, uploadFile, fileStore]);

  const getFileType = (mimeType: string): FileType => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf')) return 'script';
    return 'document';
  };

  return {
    files: fileStore.getProjectFiles(projectId),
    thumbnail: fileStore.getProjectThumbnail(projectId),
    uploadProgress: fileStore.uploadProgress,
    isUploading,
    uploadFile,
    uploadProjectThumbnail,
    deleteFile: fileStore.deleteFile,
    updateFile: fileStore.updateFile,
  };
}


// // hooks/useFileManagement.ts
// import { useCallback, useState } from 'react';
// import { useFileStore, type FileData, type Folder, type FileCategory } from '@/stores/useFileStore';

// export function useFileManagement(projectId: string) {
//   const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
//   const [isUploading, setIsUploading] = useState(false);
  
//   const {
//     files,
//     folders,
//     addFile,
//     updateFile,
//     deleteFile,
//     addFolder,
//     updateFolder,
//     deleteFolder,
//     getProjectFiles,
//     getProjectFolders,
//   } = useFileStore();

//   const projectFiles = getProjectFiles(projectId);
//   const projectFolders = getProjectFolders(projectId);

//   const handleFileUpload = useCallback(async (files: File[], folderId?: string) => {
//     setIsUploading(true);
//     const uploadPromises = Array.from(files).map(async (file) => {
//       try {
//         // Here you would normally upload to your API/storage
//         // For now, we'll simulate an upload
//         const fileId = Math.random().toString(36).substring(7);
        
//         // Simulate upload progress
//         let progress = 0;
//         const progressInterval = setInterval(() => {
//           progress += 10;
//           setUploadProgress(prev => ({
//             ...prev,
//             [fileId]: Math.min(progress, 100)
//           }));
          
//           if (progress >= 100) {
//             clearInterval(progressInterval);
//           }
//         }, 200);

//         // Determine file category
//         const category: FileCategory = getFileCategory(file.type);

//         // Add file to store
//         const fileData = {
//           projectId,
//           name: file.name,
//           type: file.type,
//           size: file.size,
//           category,
//           path: URL.createObjectURL(file), // In real implementation, this would be the storage URL
//           uploadedBy: 'Current User', // In real implementation, this would be the actual user
//           folderId,
//           metadata: {
//             lastModified: file.lastModified,
//           },
//         };

//         // Wait for simulated upload to complete
//         await new Promise(resolve => setTimeout(resolve, 2000));

//         const newFile = addFile(fileData);
//         return newFile;
//       } catch (error) {
//         console.error('Error uploading file:', error);
//         throw error;
//       }
//     });

//     try {
//       const uploadedFiles = await Promise.all(uploadPromises);
//       setIsUploading(false);
//       setUploadProgress({});
//       return uploadedFiles;
//     } catch (error) {
//       setIsUploading(false);
//       setUploadProgress({});
//       throw error;
//     }
//   }, [projectId, addFile]);

//   const createFolder = useCallback((name: string, parentId?: string) => {
//     return addFolder({
//       projectId,
//       name,
//       parentId,
//     });
//   }, [projectId, addFolder]);

//   const moveFile = useCallback((fileId: string, newFolderId?: string) => {
//     updateFile(fileId, { folderId: newFolderId });
//   }, [updateFile]);

//   const moveFolder = useCallback((folderId: string, newParentId?: string) => {
//     updateFolder(folderId, { parentId: newParentId });
//   }, [updateFolder]);

//   const getFileCategory = (mimeType: string): FileCategory => {
//     if (mimeType.startsWith('video/')) return 'video';
//     if (mimeType.startsWith('image/')) return 'image';
//     if (mimeType.startsWith('audio/')) return 'audio';
//     if (mimeType.includes('pdf') || mimeType.includes('document')) return 'script';
//     return 'document';
//   };

//   const getFolderPath = useCallback((folderId: string): Folder[] => {
//     const path: Folder[] = [];
//     let currentFolder = folders.find(f => f.id === folderId);
    
//     while (currentFolder) {
//       path.unshift(currentFolder);
//       currentFolder = currentFolder.parentId 
//         ? folders.find(f => f.id === currentFolder?.parentId)
//         : undefined;
//     }
    
//     return path;
//   }, [folders]);

//   const searchFiles = useCallback((query: string) => {
//     const searchLower = query.toLowerCase();
//     return projectFiles.filter(file => 
//       file.name.toLowerCase().includes(searchLower) ||
//       file.type.toLowerCase().includes(searchLower)
//     );
//   }, [projectFiles]);

//   return {
//     files: projectFiles,
//     folders: projectFolders,
//     uploadProgress,
//     isUploading,
//     uploadFiles: handleFileUpload,
//     createFolder,
//     deleteFile,
//     deleteFolder,
//     moveFile,
//     moveFolder,
//     getFolderPath,
//     searchFiles,
//   };
// }

// // Optional: Add a hook for file preview
// export function useFilePreview(file?: FileData) {
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

//   useCallback(() => {
//     if (!file) {
//       setPreviewUrl(null);
//       return;
//     }

//     // In a real implementation, you might need to fetch the file or generate a preview
//     setPreviewUrl(file.path);
//   }, [file]);

//   return {
//     previewUrl,
//   };
// }