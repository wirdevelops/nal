
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

// import { create } from 'zustand';
// import { v4 as uuidv4 } from 'uuid';
// import { persist, createJSONStorage } from 'zustand/middleware';

// export type FileCategory = 'script' | 'video' | 'image' | 'audio' | 'document';

// export interface FileData {
//   id: string;
//   projectId: string;
//   name: string;
//   type: string;
//   size: number;
//   category: FileCategory;
//   path: string;
//   uploadedAt: string;
//   uploadedBy: string;
//   lastModified: string;
//   folderId?: string; // If the file is in a folder
//   metadata?: Record<string, any>;
// }

// export interface Folder {
//   id: string;
//   projectId: string;
//   name: string;
//   createdAt: string;
//   parentId?: string; // For nested folders
// }

// interface FileStore {
//   files: FileData[];
//   folders: Folder[];
  
//   // File operations
//   addFile: (file: Omit<FileData, 'id' | 'uploadedAt' | 'lastModified'>) => FileData;
//   updateFile: (id: string, updates: Partial<FileData>) => void;
//   deleteFile: (id: string) => void;
  
//   // Folder operations
//   addFolder: (folder: Omit<Folder, 'id' | 'createdAt'>) => Folder;
//   updateFolder: (id: string, updates: Partial<Folder>) => void;
//   deleteFolder: (id: string) => void;
  
//   // Queries
//   getProjectFiles: (projectId: string) => FileData[];
//   getProjectFolders: (projectId: string) => Folder[];
//   getFolderContents: (folderId: string) => FileData[];
// }

// export const useFileStore = create<FileStore>()(
//   persist(
//     (set, get) => ({
//       files: [],
//       folders: [],

//       addFile: (fileData) => {
//         const newFile: FileData = {
//           id: uuidv4(),
//           ...fileData,
//           uploadedAt: new Date().toISOString(),
//           lastModified: new Date().toISOString(),
//         };

//         set((state) => ({
//           files: [...state.files, newFile],
//         }));

//         return newFile;
//       },

//       updateFile: (id, updates) => {
//         set((state) => ({
//           files: state.files.map((file) =>
//             file.id === id
//               ? {
//                   ...file,
//                   ...updates,
//                   lastModified: new Date().toISOString(),
//                 }
//               : file
//           ),
//         }));
//       },

//       deleteFile: (id) => {
//         set((state) => ({
//           files: state.files.filter((file) => file.id !== id),
//         }));
//       },

//       addFolder: (folderData) => {
//         const newFolder: Folder = {
//           id: uuidv4(),
//           ...folderData,
//           createdAt: new Date().toISOString(),
//         };

//         set((state) => ({
//           folders: [...state.folders, newFolder],
//         }));

//         return newFolder;
//       },

//       updateFolder: (id, updates) => {
//         set((state) => ({
//           folders: state.folders.map((folder) =>
//             folder.id === id
//               ? {
//                   ...folder,
//                   ...updates,
//                 }
//               : folder
//           ),
//         }));
//       },

//       deleteFolder: (id) => {
//         // First, get all files in this folder
//         const files = get().files.filter(file => file.folderId === id);
//         // Get all subfolders
//         const subFolders = get().folders.filter(folder => folder.parentId === id);
        
//         // Recursively delete subfolders and their contents
//         subFolders.forEach(folder => get().deleteFolder(folder.id));
        
//         // Delete all files in this folder
//         files.forEach(file => get().deleteFile(file.id));
        
//         // Finally delete the folder itself
//         set((state) => ({
//           folders: state.folders.filter((folder) => folder.id !== id),
//         }));
//       },

//       getProjectFiles: (projectId) => {
//         return get().files.filter((file) => file.projectId === projectId);
//       },

//       getProjectFolders: (projectId) => {
//         return get().folders.filter((folder) => folder.projectId === projectId);
//       },

//       getFolderContents: (folderId) => {
//         return get().files.filter((file) => file.folderId === folderId);
//       },
//     }),
//     {
//       name: 'file-storage',
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// );