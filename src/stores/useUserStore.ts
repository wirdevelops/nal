// stores/useUserStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { 
  type User, 
  type UserRole, 
  type OnboardingStage,
  type ActorProfile,
  type CrewProfile,
  type VendorProfile,
  type ProducerProfile,
  type ProjectOwnerProfile,
  type NgoProfile,
  type AdminProfile,
  PROFILE_INITIALIZERS
} from '@/types/user';

type ProfileInitializers = {
  [K in UserRole]: object;
};

interface UserProfiles {
  actor: ActorProfile;
  crew: CrewProfile;
  vendor: VendorProfile;
  producer: ProducerProfile;
  'project-owner': ProjectOwnerProfile;
  ngo: NgoProfile;
  admin: AdminProfile;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  clearError: () => void;
  initializeUser: (email: string, name: User['name']) => void;
  updateProfile: <T extends UserRole>(role: T, data: Partial<UserProfiles[T]>) => void;
  addRole: (role: UserRole) => void;
  updateOnboarding: (stage: OnboardingStage, data?: Record<string, unknown>) => void;
  updateSettings: (settings: Partial<User['settings']>) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  verifyEmail: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  completeOnboarding: () => void;
  switchRole: (role: UserRole) => void;
  getActiveProfile: <T extends UserRole>() => UserProfiles[T] | null;
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

// const PROFILE_INITIALIZERS: ProfileInitializers = {
//   actor: { actingStyles: [], reels: [], unionStatus: '' },
//   producer: { projects: [], collaborations: [] },
//   crew: { department: '', certifications: [], equipment: [] },
//   'project-owner': { currentProjects: [], pastProjects: [] },
//   vendor: { businessName: '', services: [], paymentMethods: [], inventory: [] },
//   ngo: { organizationName: '', focusAreas: [], partners: [] },
//   admin: {}
// };

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      setLoading: (loading) => set({ isLoading: loading }),
      
      setUser: (user) => set({ user }),
      
      clearError: () => set({ error: null }),
      
      initializeUser: (email: string, name: User['name']) => {
        if (get().user) {
          console.warn('User already initialized');
          return;
        }
        
        const newUser: User = {
          id: uuidv4(),
          email,
          isVerified: false,
          name,
          roles: [],
          profiles: {},
          onboarding: {
            stage: 'role-selection',
            completed: [],
            data: {}
          },
          settings: DEFAULT_SETTINGS,
          status: 'pending',
          metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        };
        
        set({ user: newUser });
      },

      updateProfile: (role, data) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              profiles: {
                ...state.user.profiles,
                [role]: {
                  ...(state.user.profiles[role] || PROFILE_INITIALIZERS[role]),
                  ...data
                }
              }
            }
          };
        });
      },

      addRole: (role: UserRole) => {
        set((state) => {
          if (!state.user || state.user.roles.includes(role)) return state;
          
          const newRoles = [...state.user.roles, role];
          return {
            user: {
              ...state.user,
              roles: newRoles,
              activeRole: state.user.activeRole || role, // Corrected this line
              profiles: {
                ...state.user.profiles,
                [role]: PROFILE_INITIALIZERS[role]
              }
            }
          };
        });
      },

      updateOnboarding: (stage, data = {}) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              onboarding: {
                ...state.user.onboarding,
                stage,
                data: { ...state.user.onboarding.data, ...data },
                completed: [...state.user.onboarding.completed, stage]
              }
            }
          };
        });
      },

      updateSettings: (settings) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              settings: { ...state.user.settings, ...settings }
            }
          };
        });
      },

      setError: (error) => set({ error }),
      
      logout: () => {
        useUserStore.persist.clearStorage();
        set({ user: null, error: null, isLoading: false });
      },

      verifyEmail: () => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              isVerified: true,
              metadata: {
                ...state.user.metadata,
                updatedAt: new Date().toISOString()
              }
            }
          };
        });
      },

      requestPasswordReset: async (email) => {
        const resetToken = crypto.randomUUID?.() || uuidv4();
        const expiresAt = Date.now() + 3600000; // 1 hour
        
        // In real implementation, store token securely and send email
        console.log('Password reset token:', resetToken);
      },

      completeOnboarding: () => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              onboarding: {
                ...state.user.onboarding,
                stage: 'completed',
                completed: [...state.user.onboarding.completed, 'completed']
              },
              status: 'active'
            }
          };
        });
      },

      switchRole: (role: UserRole) => {
        set((state) => {
          if (!state.user || !state.user.roles.includes(role)) return state;
          
          return {
            user: {
              ...state.user,
              activeRole: role
            }
          };
        });
      },

      getActiveProfile: <T extends UserRole>(): UserProfiles[T] | null => {
        const user = get().user;
        if (!user?.activeRole) return null;
        return (user.profiles[user.activeRole] as UserProfiles[T]) || null;
      },
    }),
    {
      name: 'user-store',
      partialize: (state) => ({ user: state.user }),
      version: 1
    }
  )
);

// Selectors
export const useUser = () => useUserStore((state) => state.user);
export const useUserLoading = () => useUserStore((state) => state.isLoading);
export const useUserError = () => useUserStore((state) => state.error);

// Action hooks
export const useUserActions = () => ({
  setLoading: useUserStore((state) => state.setLoading),
  setUser: useUserStore((state) => state.setUser),
  clearError: useUserStore((state) => state.clearError),
  initializeUser: useUserStore((state) => state.initializeUser),
  updateProfile: useUserStore((state) => state.updateProfile),
  addRole: useUserStore((state) => state.addRole),
  updateOnboarding: useUserStore((state) => state.updateOnboarding),
  updateSettings: useUserStore((state) => state.updateSettings),
  setError: useUserStore((state) => state.setError),
  logout: useUserStore((state) => state.logout),
  verifyEmail: useUserStore((state) => state.verifyEmail),
  requestPasswordReset: useUserStore((state) => state.requestPasswordReset),
  completeOnboarding: useUserStore((state) => state.completeOnboarding),
  switchRole: useUserStore((state) => state.switchRole),
  getActiveProfile: useUserStore((state) => state.getActiveProfile)
});