// stores/useUserStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, OnboardingStage } from '@/types/user';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  initializeUser: (email: string, name: User['name']) => void;
  updateProfile: <T extends keyof User['profiles']>( // Constrain to valid profile keys
    role: T, 
    data: Partial<User['profiles'][T]>
  ) => void;
  addRole: (role: UserRole) => void;
  updateOnboarding: (stage: OnboardingStage, data?: Record<string, unknown>) => void;
  updateSettings: (settings: Partial<User['settings']>) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

const DEFAULT_SETTINGS: User['settings'] = {
  notifications: {
    email: true,
    projects: true,
    messages: true
  },
  privacy: {
    profile: 'public',
    contactInfo: false
  }
};

const PROFILE_INITIALIZERS: Record<UserRole, object> = {
  actor: { actingStyles: [], reels: [], unionStatus: '' },
  producer: { projects: [], collaborations: [] },
  crew: { department: '', certifications: [], equipment: [] },
  'project-owner': { currentProjects: [], pastProjects: [] },
  vendor: { businessName: '', services: [], paymentMethods: [], inventory: [] },
  ngo: { organizationName: '', focusAreas: [], partners: [] },
  admin: {}
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      initializeUser: (email, name) => {
        set({
          user: {
            id: crypto.randomUUID(),
            email,
            name,
            avatar: undefined,
            roles: [],
            profiles: {
              actor: undefined,
              crew: undefined,
              vendor: undefined
            },
            onboarding: {
              stage: 'role-selection',
              completed: [],
              data: {}
            },
            settings: DEFAULT_SETTINGS,
            status: 'pending',
            metadata: {
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              lastActive: undefined
            },
            isVerified: false
          }
        });
      },

      updateProfile: (role, data) => {
        const { user } = get();
        if (!user) return;
      
        set({
          user: {
            ...user,
            profiles: {
              ...user.profiles,
              [role]: {
                ...((user.profiles[role] || PROFILE_INITIALIZERS[role]) as object),
                ...data
              }
            },
            metadata: {
              ...user.metadata,
              updatedAt: new Date().toISOString()
            }
          }
        });
      },
      addRole: (role) => {
        const { user } = get();
        if (!user) return;

        set({
          user: {
            ...user,
            roles: Array.from(new Set([...user.roles, role])),
            metadata: {
              ...user.metadata,
              updatedAt: new Date().toISOString()
            }
          }
        });
      },

      updateOnboarding: (stage, data = {}) => {
        const { user } = get();
        if (!user) return;
      
        set({
          user: {
            ...user,
            onboarding: {
              stage,
              completed: user.onboarding.completed.includes(stage) 
                ? user.onboarding.completed 
                : [...user.onboarding.completed, stage],
              data: { ...user.onboarding.data, ...data }
            },
            metadata: {
              ...user.metadata,
              updatedAt: new Date().toISOString()
            }
          }
        });
      },

      updateSettings: (settings) => {
        const { user } = get();
        if (!user) return;

        set({
          user: {
            ...user,
            settings: {
              ...user.settings,
              ...settings
            }
          }
        });
      },

      setError: (error) => set({ error }),
      logout: () => set({ user: null, error: null })
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        user: state.user
      })
    }
  )
);

// // stores/useUserStore.ts
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { v4 as uuidv4 } from 'uuid';
// import type { User, UserRole, OnboardingStage, RoleSpecificFormState } from '@/types/user';

// interface UserState {
//   currentUser: User | null;
//   isLoading: boolean;
//   error: string | null;
//   onboardingData: Partial<User>;
//   roleSpecificForms: Record<UserRole, RoleSpecificFormState>;
// }

// interface UserActions {
//   initializeUser: () => void;
//   startOnboarding: (roles: UserRole[]) => void;
//   updateOnboardingData: (data: Partial<User>) => void;
//   completeOnboardingStage: (stage: OnboardingStage) => void;
//   addUserRole: (role: UserRole, initialData?: Record<string, any>) => void;
//   removeUserRole: (role: UserRole) => void;
//   updateRoleSpecificData: (role: UserRole, data: Record<string, any>) => void;
//   finalizeOnboarding: () => void;
//   updateProfile: (updates: Partial<User>) => void;
//   updateSettings: (settings: Partial<User['settings']>) => void;
//   mergeVolunteerData: (volunteerData: any) => void;
//   logout: () => void;
// }

// const initialOnboardingState = {
//   currentStage: 'role-selection' as OnboardingStage,
//   completedStages: [],
//   roleSpecificStages: {}
// };

// export const useUserStore = create<UserState & UserActions>()(
//   persist(
//     (set, get) => ({
//       currentUser: null,
//       isLoading: false,
//       error: null,
//       onboardingData: {},
//       roleSpecificForms: {} as Record<UserRole, RoleSpecificFormState>,

//       initializeUser: () => {
//         if (!get().currentUser) {
//           set({
//             currentUser: {
//               id: uuidv4(),
//               email: '',
//               roles: [],
//               createdAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//               onboarding: initialOnboardingState,
//               isVerified: false,
//               firstName: '',
//               lastName: '',
//               settings: {
//                 notifications: {
//                   email: true,
//                   sms: false,
//                   push: true
//                 },
//                 theme: 'system',
//                 language: 'en'
//               }
//             }
//           });
//         }
//       },

//       startOnboarding: (roles: UserRole[]) => {
//         set(state => ({
//           currentUser: state.currentUser ? {
//             ...state.currentUser,
//             roles: Array.from(new Set([...state.currentUser.roles, ...roles])),
//             onboarding: {
//               ...state.currentUser.onboarding,
//               currentStage: 'role-selection' as const,
//               // Ensure arrays are initialized if not present
//               completedStages: state.currentUser.onboarding.completedStages || [],
//               roleSpecificStages: state.currentUser.onboarding.roleSpecificStages || {}
//             }
//           } : null
//         }));
//       },

//       updateOnboardingData: (data) => {
//         set({
//           onboardingData: { ...get().onboardingData, ...data }
//         });
//       },

//       completeOnboardingStage: (stage) => {
//         set(state => ({
//           currentUser: state.currentUser ? {
//             ...state.currentUser,
//             onboarding: {
//               ...state.currentUser.onboarding,
//               currentStage: stage,
//               completedStages: [...state.currentUser.onboarding.completedStages, stage]
//             }
//           } : null
//         }));
//       },

//       addUserRole: (role: UserRole, initialData: Partial<RoleSpecificFormState['data']> = {}) => {
//         set(state => {
//           if (!state.currentUser) return state;
          
//           // Fix 1: Proper role merging with type safety
//           const newRoles = state.currentUser.roles.includes(role) 
//             ? state.currentUser.roles 
//             : [...state.currentUser.roles, role];
      
//           // Fix 2: Proper initialization of role-specific profiles
//           const baseProfile = {
//             ...state.currentUser,
//             roles: newRoles,
//             ...(role === 'volunteer' && !state.currentUser.volunteerProfile ? {
//               volunteerProfile: {
//                 skills: [],
//                 availability: {
//                   availability: [],
//                   timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//                   recurring: false
//                 },
//                 hoursLogged: 0,
//                 certifications: []
//               }
//             } : {}),
//             ...(role === 'creator' && !state.currentUser.creatorProfile ? {
//               creatorProfile: {
//                 specialties: [],
//                 portfolio: []
//               }
//             } : {}),
//             ...(role === 'seller' && !state.currentUser.sellerProfile ? {
//               sellerProfile: {
//                 paymentMethods: [],
//                 totalSales: 0,
//                 sellerRating: 0
//               }
//             } : {})
//           };
      
//           // Fix 3: Proper type initialization for roleSpecificForms
//           const newForms = {
//             ...state.roleSpecificForms,
//             [role]: {
//               role,
//               data: {
//                 ...initialData,
//                 ...(role === 'volunteer' && { 
//                   availability: {
//                     availability: [],
//                     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//                     recurring: false
//                   }
//                 })
//               }
//             }
//           };
      
//           return {
//             currentUser: baseProfile,
//             roleSpecificForms: newForms
//           };
//         });
//       },

//       removeUserRole: (role) => {
//         set(state => {
//           if (!state.currentUser) return state;
//           return {
//             currentUser: {
//               ...state.currentUser,
//               roles: state.currentUser.roles.filter(r => r !== role)
//             }
//           };
//         });
//       },

//       updateRoleSpecificData: (role, data) => {
//         set(state => ({
//           roleSpecificForms: {
//             ...state.roleSpecificForms,
//             [role]: {
//               ...state.roleSpecificForms[role],
//               data: {
//                 ...state.roleSpecificForms[role]?.data,
//                 ...data
//               }
//             }
//           }
//         }));
//       },

//       finalizeOnboarding: () => {
//         set(state => {
//           if (!state.currentUser) return state;
          
//           // Merge all role-specific data into user profile
//           const mergedProfile = Object.values(state.roleSpecificForms).reduce((acc, form) => {
//             return {
//               ...acc,
//               ...form.data
//             };
//           }, {});

//           return {
//             currentUser: {
//               ...state.currentUser,
//               ...mergedProfile,
//               onboarding: {
//                 ...state.currentUser.onboarding,
//                 currentStage: 'completed',
//                 completedStages: [...state.currentUser.onboarding.completedStages, 'completed']
//               }
//             },
//             onboardingData: {},
//             roleSpecificForms: {}
//           };
//         });
//       },

//       updateProfile: (updates) => {
//         set(state => ({
//           currentUser: state.currentUser ? {
//             ...state.currentUser,
//             ...updates,
//             updatedAt: new Date().toISOString()
//           } : null
//         }));
//       },

//       updateSettings: (settings) => {
//         set(state => ({
//           currentUser: state.currentUser ? {
//             ...state.currentUser,
//             settings: {
//               ...state.currentUser.settings,
//               ...settings
//             }
//           } : null
//         }));
//       },

//       mergeVolunteerData: (volunteerData) => {
//         set(state => ({
//           currentUser: state.currentUser ? {
//             ...state.currentUser,
//             volunteerProfile: {
//               ...state.currentUser.volunteerProfile,
//               ...volunteerData
//             }
//           } : null
//         }));
//       },

//       logout: () => {
//         set({
//           currentUser: null,
//           onboardingData: {},
//           roleSpecificForms: {
//             user: ,
//             creator: ,
//             seller: ,
//             admin: 
//           }
//         });
//       }
//     }),
//     {
//       name: 'user-storage',
//       partialize: (state) => ({
//         currentUser: state.currentUser,
//         roleSpecificForms: state.roleSpecificForms
//       })
//     }
//   )
// );

// // stores/useUserStore.ts
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import type { UserProfile, UserSettings, UserRole, CreatorSpecialty } from '@/types/user';

// interface UserState {
//   currentUser: UserProfile | null;
//   userSettings: UserSettings | null;
//   isLoading: boolean;
//   error: string | null;

//   // User profile operations
//   setUser: (user: UserProfile) => void;
//   updateProfile: (updates: Partial<UserProfile>) => void;
//   clearUser: () => void;

//   // Role management
//   addRole: (role: UserRole) => void;
//   removeRole: (role: UserRole) => void;
//   addSpecialty: (specialty: CreatorSpecialty) => void;
//   removeSpecialty: (specialty: CreatorSpecialty) => void;

//   // Project associations
//   addProject: (projectId: string, isOwner?: boolean) => void;
//   removeProject: (projectId: string) => void;
//   addCollaboration: (projectId: string, role: string) => void;
//   updateCollaborationStatus: (projectId: string, status: 'active' | 'completed' | 'pending') => void;

//   // Seller features
//   enableSellerFeatures: () => void;
//   updateSellerProfile: (updates: Partial<UserProfile['sellerProfile']>) => void;
  
//   // Settings management
//   updateSettings: (settings: Partial<UserSettings>) => void;
//   updateNotificationPreferences: (updates: Partial<UserSettings['notifications']>) => void;
// }

// export const useUserStore = create<UserState>()(
//   persist(
//     (set, get) => ({
//       currentUser: null,
//       userSettings: null,
//       isLoading: false,
//       error: null,

//       setUser: (user) => {
//         set({ currentUser: user });
//       },

//       updateProfile: (updates) => {
//         set((state) => ({
//           currentUser: state.currentUser ? {
//             ...state.currentUser,
//             ...updates,
//             updatedAt: new Date().toISOString()
//           } : null
//         }));
//       },

//       clearUser: () => {
//         set({ currentUser: null, userSettings: null });
//       },

//       addRole: (role) => {
//         set((state) => {
//           if (!state.currentUser) return state;
//           const roles = new Set([...state.currentUser.roles, role]);
//           return {
//             currentUser: {
//               ...state.currentUser,
//               roles: Array.from(roles),
//               updatedAt: new Date().toISOString()
//             }
//           };
//         });
//       },

//       removeRole: (role) => {
//         set((state) => {
//           if (!state.currentUser) return state;
//           return {
//             currentUser: {
//               ...state.currentUser,
//               roles: state.currentUser.roles.filter(r => r !== role),
//               updatedAt: new Date().toISOString()
//             }
//           };
//         });
//       },

//       addSpecialty: (specialty) => {
//         set((state) => {
//           if (!state.currentUser) return state;
//           const specialties = new Set([...(state.currentUser.specialties || []), specialty]);
//           return {
//             currentUser: {
//               ...state.currentUser,
//               specialties: Array.from(specialties),
//               updatedAt: new Date().toISOString()
//             }
//           };
//         });
//       },

//       removeSpecialty: (specialty) => {
//         set((state) => {
//           if (!state.currentUser) return state;
//           return {
//             currentUser: {
//               ...state.currentUser,
//               specialties: state.currentUser.specialties?.filter(s => s !== specialty),
//               updatedAt: new Date().toISOString()
//             }
//           };
//         });
//       },

//       addProject: (projectId, isOwner = false) => {
//         set((state) => {
//           if (!state.currentUser) return state;
//           const newState = { ...state.currentUser };
          
//           if (isOwner) {
//             newState.ownedProjects = [...newState.ownedProjects, projectId];
//           }
//           newState.projects = [...newState.projects, projectId];
          
//           return {
//             currentUser: {
//               ...newState,
//               updatedAt: new Date().toISOString()
//             }
//           };
//         });
//       },

//       removeProject: (projectId) => {
//         set((state) => {
//           if (!state.currentUser) return state;
//           return {
//             currentUser: {
//               ...state.currentUser,
//               projects: state.currentUser.projects.filter(id => id !== projectId),
//               ownedProjects: state.currentUser.ownedProjects.filter(id => id !== projectId),
//               updatedAt: new Date().toISOString()
//             }
//           };
//         });
//       },

//       addCollaboration: (projectId, role) => {
//         set((state) => {
//           if (!state.currentUser) return state;
//           const collaborations = [
//             ...(state.currentUser.collaborations || []),
//             {
//               projectId,
//               role,
//               status: 'pending' as const
//             }
//           ];
//           return {
//             currentUser: {
//               ...state.currentUser,
//               collaborations,
//               updatedAt: new Date().toISOString()
//             }
//           };
//         });
//       },

//       updateCollaborationStatus: (projectId, status) => {
//         set((state) => {
//           if (!state.currentUser) return state;
//           const collaborations = state.currentUser.collaborations?.map(collab =>
//             collab.projectId === projectId ? { ...collab, status } : collab
//           );
//           return {
//             currentUser: {
//               ...state.currentUser,
//               collaborations,
//               updatedAt: new Date().toISOString()
//             }
//           };
//         });
//       },

//       enableSellerFeatures: () => {
//         set((state) => {
//           if (!state.currentUser) return state;
//           return {
//             currentUser: {
//               ...state.currentUser,
//               roles: [...state.currentUser.roles, 'seller'],
//               sellerProfile: {
//                 isVerified: false,
//                 rating: 0,
//                 totalSales: 0,
//                 joinedAsSellerDate: new Date().toISOString(),
//                 products: []
//               },
//               updatedAt: new Date().toISOString()
//             }
//           };
//         });
//       },

//       updateSellerProfile: (updates) => {
//         set((state) => {
//           if (!state.currentUser?.sellerProfile) return state;
//           return {
//             currentUser: {
//               ...state.currentUser,
//               sellerProfile: {
//                 ...state.currentUser.sellerProfile,
//                 ...updates
//               },
//               updatedAt: new Date().toISOString()
//             }
//           };
//         });
//       },

//       updateSettings: (settings) => {
//         set((state) => ({
//           userSettings: state.userSettings ? {
//             ...state.userSettings,
//             ...settings
//           } : null
//         }));
//       },

//       updateNotificationPreferences: (updates) => {
//         set((state) => ({
//           userSettings: state.userSettings ? {
//             ...state.userSettings,
//             notifications: {
//               ...state.userSettings.notifications,
//               ...updates
//             }
//           } : null
//         }));
//       }
//     }),
//     {
//       name: 'user-storage'
//     }
//   )
// );