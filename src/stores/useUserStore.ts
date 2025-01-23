// stores/useUserStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, UserSettings, UserRole, CreatorSpecialty } from '@/types/user';

interface UserState {
  currentUser: UserProfile | null;
  userSettings: UserSettings | null;
  isLoading: boolean;
  error: string | null;

  // User profile operations
  setUser: (user: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearUser: () => void;

  // Role management
  addRole: (role: UserRole) => void;
  removeRole: (role: UserRole) => void;
  addSpecialty: (specialty: CreatorSpecialty) => void;
  removeSpecialty: (specialty: CreatorSpecialty) => void;

  // Project associations
  addProject: (projectId: string, isOwner?: boolean) => void;
  removeProject: (projectId: string) => void;
  addCollaboration: (projectId: string, role: string) => void;
  updateCollaborationStatus: (projectId: string, status: 'active' | 'completed' | 'pending') => void;

  // Seller features
  enableSellerFeatures: () => void;
  updateSellerProfile: (updates: Partial<UserProfile['sellerProfile']>) => void;
  
  // Settings management
  updateSettings: (settings: Partial<UserSettings>) => void;
  updateNotificationPreferences: (updates: Partial<UserSettings['notifications']>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      userSettings: null,
      isLoading: false,
      error: null,

      setUser: (user) => {
        set({ currentUser: user });
      },

      updateProfile: (updates) => {
        set((state) => ({
          currentUser: state.currentUser ? {
            ...state.currentUser,
            ...updates,
            updatedAt: new Date().toISOString()
          } : null
        }));
      },

      clearUser: () => {
        set({ currentUser: null, userSettings: null });
      },

      addRole: (role) => {
        set((state) => {
          if (!state.currentUser) return state;
          const roles = new Set([...state.currentUser.roles, role]);
          return {
            currentUser: {
              ...state.currentUser,
              roles: Array.from(roles),
              updatedAt: new Date().toISOString()
            }
          };
        });
      },

      removeRole: (role) => {
        set((state) => {
          if (!state.currentUser) return state;
          return {
            currentUser: {
              ...state.currentUser,
              roles: state.currentUser.roles.filter(r => r !== role),
              updatedAt: new Date().toISOString()
            }
          };
        });
      },

      addSpecialty: (specialty) => {
        set((state) => {
          if (!state.currentUser) return state;
          const specialties = new Set([...(state.currentUser.specialties || []), specialty]);
          return {
            currentUser: {
              ...state.currentUser,
              specialties: Array.from(specialties),
              updatedAt: new Date().toISOString()
            }
          };
        });
      },

      removeSpecialty: (specialty) => {
        set((state) => {
          if (!state.currentUser) return state;
          return {
            currentUser: {
              ...state.currentUser,
              specialties: state.currentUser.specialties?.filter(s => s !== specialty),
              updatedAt: new Date().toISOString()
            }
          };
        });
      },

      addProject: (projectId, isOwner = false) => {
        set((state) => {
          if (!state.currentUser) return state;
          const newState = { ...state.currentUser };
          
          if (isOwner) {
            newState.ownedProjects = [...newState.ownedProjects, projectId];
          }
          newState.projects = [...newState.projects, projectId];
          
          return {
            currentUser: {
              ...newState,
              updatedAt: new Date().toISOString()
            }
          };
        });
      },

      removeProject: (projectId) => {
        set((state) => {
          if (!state.currentUser) return state;
          return {
            currentUser: {
              ...state.currentUser,
              projects: state.currentUser.projects.filter(id => id !== projectId),
              ownedProjects: state.currentUser.ownedProjects.filter(id => id !== projectId),
              updatedAt: new Date().toISOString()
            }
          };
        });
      },

      addCollaboration: (projectId, role) => {
        set((state) => {
          if (!state.currentUser) return state;
          const collaborations = [
            ...(state.currentUser.collaborations || []),
            {
              projectId,
              role,
              status: 'pending' as const
            }
          ];
          return {
            currentUser: {
              ...state.currentUser,
              collaborations,
              updatedAt: new Date().toISOString()
            }
          };
        });
      },

      updateCollaborationStatus: (projectId, status) => {
        set((state) => {
          if (!state.currentUser) return state;
          const collaborations = state.currentUser.collaborations?.map(collab =>
            collab.projectId === projectId ? { ...collab, status } : collab
          );
          return {
            currentUser: {
              ...state.currentUser,
              collaborations,
              updatedAt: new Date().toISOString()
            }
          };
        });
      },

      enableSellerFeatures: () => {
        set((state) => {
          if (!state.currentUser) return state;
          return {
            currentUser: {
              ...state.currentUser,
              roles: [...state.currentUser.roles, 'seller'],
              sellerProfile: {
                isVerified: false,
                rating: 0,
                totalSales: 0,
                joinedAsSellerDate: new Date().toISOString(),
                products: []
              },
              updatedAt: new Date().toISOString()
            }
          };
        });
      },

      updateSellerProfile: (updates) => {
        set((state) => {
          if (!state.currentUser?.sellerProfile) return state;
          return {
            currentUser: {
              ...state.currentUser,
              sellerProfile: {
                ...state.currentUser.sellerProfile,
                ...updates
              },
              updatedAt: new Date().toISOString()
            }
          };
        });
      },

      updateSettings: (settings) => {
        set((state) => ({
          userSettings: state.userSettings ? {
            ...state.userSettings,
            ...settings
          } : null
        }));
      },

      updateNotificationPreferences: (updates) => {
        set((state) => ({
          userSettings: state.userSettings ? {
            ...state.userSettings,
            notifications: {
              ...state.userSettings.notifications,
              ...updates
            }
          } : null
        }));
      }
    }),
    {
      name: 'user-storage'
    }
  )
);