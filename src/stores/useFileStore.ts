
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProjectFile, FileType, FileMetadata } from '../types/files';

interface FileStore {
  files: ProjectFile[];
  uploadProgress: Record<string, number>;
  
  // Core file operations
  addFile: (file: Omit<ProjectFile, 'id' | 'createdAt' | 'updatedAt'>) => ProjectFile;
  updateFile: (id: string, updates: Partial<ProjectFile>) => void;
  deleteFile: (id: string) => void;
  
  // Project-specific operations
  getProjectFiles: (projectId: string, type?: FileType) => ProjectFile[];
  getProjectThumbnail: (projectId: string) => ProjectFile | undefined;
  setProjectThumbnail: (projectId: string, file: ProjectFile) => void;
  
  // Upload tracking
  setUploadProgress: (fileId: string, progress: number) => void;
  clearUploadProgress: (fileId: string) => void;
}

export const useFileStore = create<FileStore>()(
  persist(
    (set, get) => ({
      files: [],
      uploadProgress: {},

      addFile: (fileData) => {
        const newFile: ProjectFile = {
          id: crypto.randomUUID(),
          ...fileData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          files: [...state.files, newFile],
        }));

        return newFile;
      },

      updateFile: (id, updates) => {
        set((state) => ({
          files: state.files.map((file) =>
            file.id === id
              ? {
                  ...file,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : file
          ),
        }));
      },

      deleteFile: (id) => {
        set((state) => ({
          files: state.files.filter((file) => file.id !== id),
        }));
      },

      getProjectFiles: (projectId, type) => {
        const { files } = get();
        return files.filter(
          (f) => f.projectId === projectId && (!type || f.type === type)
        );
      },

      getProjectThumbnail: (projectId) => {
        const { files } = get();
        return files.find(
          (f) => f.projectId === projectId && f.type === 'image' && f.metadata?.isThumbnail
        );
      },

      setProjectThumbnail: (projectId, file) => {
        const { files, updateFile } = get();
        
        // Remove thumbnail flag from any existing thumbnail
        const currentThumbnail = files.find(
          (f) => f.projectId === projectId && f.metadata?.isThumbnail
        );
        
        if (currentThumbnail) {
          updateFile(currentThumbnail.id, {
            metadata: { ...currentThumbnail.metadata, isThumbnail: false },
          });
        }

        // Set new thumbnail
        updateFile(file.id, {
          metadata: { ...file.metadata, isThumbnail: true },
        });
      },

      setUploadProgress: (fileId, progress) => {
        set((state) => ({
          uploadProgress: {
            ...state.uploadProgress,
            [fileId]: progress,
          },
        }));
      },

      clearUploadProgress: (fileId) => {
        set((state) => {
          const { [fileId]: _, ...rest } = state.uploadProgress;
          return { uploadProgress: rest };
        });
      },
    }),
    {
      name: 'file-storage',
    }
  )
);