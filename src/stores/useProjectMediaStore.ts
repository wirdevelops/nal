import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProjectMedia {
  id: string;
  projectId: string;
  type: 'thumbnail' | 'feedback' | 'reference' | 'attachment';
  url: string;
  filename: string;
  fileType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    annotations?: Annotation[];
    version?: number;
    description?: string;
    tags?: string[];
    versions?: {
      [version: number]: {
        annotations: Annotation[];
        timestamp: string;
      };
    };
  };
}

export interface Annotation {
  id: string;
  type: 'comment' | 'drawing' | 'marker';
  content: string;
  position: { x: number; y: number };
  timestamp: string;
  author: string;
  resolved?: boolean;
  // For drawing annotations
  path?: string;
  color?: string;
  // For timecode-based annotations (video)
  timecode?: number;
}

interface ProjectMediaStore {
  media: ProjectMedia[];

  // Basic media operations
  addMedia: (
    media: Omit<ProjectMedia, 'id' | 'createdAt' | 'updatedAt'>
  ) => ProjectMedia;
  updateMedia: (id: string, updates: Partial<ProjectMedia>) => void;
  removeMedia: (id: string) => void;

  // Project-specific queries
  getProjectMedia: (
    projectId: string,
    type?: ProjectMedia['type']
  ) => ProjectMedia[];
  getProjectThumbnail: (projectId: string) => ProjectMedia | undefined;

  // Annotation operations
  addAnnotation: (
    mediaId: string,
    annotation: Omit<Annotation, 'id' | 'timestamp'>
  ) => void;
  updateAnnotation: (
    mediaId: string,
    annotationId: string,
    updates: Partial<Annotation>
  ) => void;
  removeAnnotation: (mediaId: string, annotationId: string) => void;

  // Version control
  createMediaVersion: (mediaId: string) => void;
  revertToVersion: (mediaId: string, version: number) => void;
}

export const useProjectMediaStore = create<ProjectMediaStore>()(
  persist(
    (set, get) => ({
      media: [],

      addMedia: (mediaData) => {
        const newMedia: ProjectMedia = {
          id: crypto.randomUUID(),
          ...mediaData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          media: [...state.media, newMedia],
        }));

        return newMedia;
      },

      updateMedia: (id, updates) => {
        set((state) => ({
          media: state.media.map((media) =>
            media.id === id
              ? {
                  ...media,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : media
          ),
        }));
      },

      removeMedia: (id) => {
        set((state) => ({
          media: state.media.filter((media) => media.id !== id),
        }));
      },

      getProjectMedia: (projectId, type) => {
        const { media } = get();
        return media.filter(
          (m) => m.projectId === projectId && (!type || m.type === type)
        );
      },

      getProjectThumbnail: (projectId) => {
        const { media } = get();
        return media.find(
          (m) => m.projectId === projectId && m.type === 'thumbnail'
        );
      },

      addAnnotation: (mediaId, annotation) => {
        set((state) => ({
          media: state.media.map((media) =>
            media.id === mediaId
              ? {
                  ...media,
                  metadata: {
                    ...media.metadata,
                    annotations: [
                      ...(media.metadata?.annotations || []),
                      {
                        id: crypto.randomUUID(),
                        timestamp: new Date().toISOString(),
                        ...annotation,
                      },
                    ],
                  },
                  updatedAt: new Date().toISOString(),
                }
              : media
          ),
        }));
      },

      updateAnnotation: (mediaId, annotationId, updates) => {
        set((state) => ({
          media: state.media.map((media) =>
            media.id === mediaId && media.metadata?.annotations
              ? {
                  ...media,
                  metadata: {
                    ...media.metadata,
                    annotations: media.metadata.annotations.map((ann) =>
                      ann.id === annotationId ? { ...ann, ...updates } : ann
                    ),
                  },
                  updatedAt: new Date().toISOString(),
                }
              : media
          ),
        }));
      },

      removeAnnotation: (mediaId, annotationId) => {
        set((state) => ({
          media: state.media.map((media) =>
            media.id === mediaId && media.metadata?.annotations
              ? {
                  ...media,
                  metadata: {
                    ...media.metadata,
                    annotations: media.metadata.annotations.filter(
                      (ann) => ann.id !== annotationId
                    ),
                  },
                  updatedAt: new Date().toISOString(),
                }
              : media
          ),
        }));
      },

      createMediaVersion: (mediaId) => {
        set((state) => ({
          media: state.media.map((media) => {
            if (media.id !== mediaId) return media;

            const currentVersion = media.metadata?.version || 0;
            const newVersion = currentVersion + 1;

            return {
              ...media,
              metadata: {
                ...media.metadata,
                version: newVersion,
                versions: {
                  ...media.metadata?.versions,
                  [newVersion]: {
                    annotations: media.metadata?.annotations || [],
                    timestamp: new Date().toISOString(),
                  },
                },
              },
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },


      revertToVersion: (mediaId, version) => {
        set((state) => ({
          media: state.media.map((media) => {
            if (media.id !== mediaId) return media;
            
            const selectedVersion = media.metadata?.versions?.[version];
            
            if(!selectedVersion) return media;


            return {
                ...media,
                metadata: {
                  ...media.metadata,
                    annotations: selectedVersion.annotations,
                },
                updatedAt: new Date().toISOString(),
              };
            })
        }));
      },
    }),
    {
      name: 'project-media-storage',
    }
  )
);