// stores/useUserStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, OnboardingStage } from '@/types/user';

type ProfileInitializers = {
  [K in UserRole]: object;
};

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
  updateProfile: <T extends keyof User['profiles']>(
    role: T,
    data: Partial<User['profiles'][T]>
  ) => void;

  addRole: (role: UserRole) => void;
  updateOnboarding: (stage: OnboardingStage, data?: Record<string, unknown>) => void;
  updateSettings: (settings: Partial<User['settings']>) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  verifyEmail: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  completeOnboarding: () => void;
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

const PROFILE_INITIALIZERS: ProfileInitializers = {
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

      setLoading: (loading) => set({ isLoading: loading }),
      setUser: (user) => set({ user, isLoading: false, error: null }),
      clearError: () => set({ error: null }),
      setError: (error) => set({ error, isLoading: false }),
      logout: () => {
        set({ user: null, error: null, isLoading: false });
        localStorage.removeItem('session');
      },

      initializeUser: (email, name) => {
        const newUser: User = {
          id: crypto.randomUUID(),
          email,
          name,
          avatar: undefined,
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
            updatedAt: new Date().toISOString(),
            lastActive: undefined
          },
          isVerified: false
        };
        
        set({ user: newUser });
        localStorage.setItem(`userdata:${newUser.id}`, JSON.stringify(newUser));
      },

      updateProfile: (role, data) => {
        const user = get().user;
        if (!user) return;

        const currentProfile = user.profiles[role] || PROFILE_INITIALIZERS[role];

        const updatedProfile = { ...currentProfile, ...data };

        const updatedUser = {
          ...user,
          profiles: {
            ...user.profiles,
            [role]: updatedProfile
          },
          metadata: {
            ...user.metadata,
            updatedAt: new Date().toISOString()
          }
        };

        set({ user: updatedUser });
        localStorage.setItem(`userdata:${user.id}`, JSON.stringify(updatedUser));
      },

      updateOnboarding: (stage, data = {}) => {
        const user = get().user;
        if (!user) return;

        const completed = user.onboarding.completed.includes(stage)
          ? user.onboarding.completed
          : [...user.onboarding.completed, stage];

        const updatedUser = {
          ...user,
          onboarding: {
            stage,
            completed: completed as OnboardingStage[],
            data: { ...user.onboarding.data, ...data }
          },
          metadata: {
            ...user.metadata,
            updatedAt: new Date().toISOString()
          }
        };

        set({ user: updatedUser });
        localStorage.setItem(`userdata:${user.id}`, JSON.stringify(updatedUser));
      },

      addRole: (role) => {
        const user = get().user;
        if (!user || user.roles.includes(role)) return;

        const updatedUser = {
          ...user,
          roles: [...user.roles, role],
          profiles: {
            ...user.profiles,
            [role]: user.profiles[role] || PROFILE_INITIALIZERS[role]
          },
          metadata: {
            ...user.metadata,
            updatedAt: new Date().toISOString()
          }
        };

        set({ user: updatedUser });
        localStorage.setItem(`userdata:${user.id}`, JSON.stringify(updatedUser));
      },

      updateSettings: (settings) => {
        const user = get().user;
        if (!user) return;

        const updatedUser = {
          ...user,
          settings: {
            ...user.settings,
            ...settings,
            notifications: {
              ...user.settings.notifications,
              ...settings.notifications
            },
            privacy: {
              ...user.settings.privacy,
              ...settings.privacy
            }
          }
        };

        set({ user: updatedUser });
        localStorage.setItem(`userdata:${user.id}`, JSON.stringify(updatedUser));
      },

      verifyEmail: () => {
        const user = get().user;
        if (!user) return;

        const updatedUser = {
          ...user,
          isVerified: true,
          metadata: {
            ...user.metadata,
            updatedAt: new Date().toISOString()
          }
        };

        set({ user: updatedUser });
        localStorage.setItem(`userdata:${user.id}`, JSON.stringify(updatedUser));
      },

      requestPasswordReset: async (email) => {
        const userData = localStorage.getItem(`user:${email}`);
        if (!userData) return;

        const resetToken = crypto.randomUUID();
        const expiresAt = Date.now() + 3600000; // 1 hour expiration
        localStorage.setItem(`reset:${email}`, JSON.stringify({
          token: resetToken,
          expiresAt
        }));
      },

      completeOnboarding: () => {
        const user = get().user;
        if (!user) return;
      
        const updatedUser: User = {
          ...user,
          onboarding: {
            ...user.onboarding,
            stage: 'completed',
            completed: [...user.onboarding.completed, 'completed'] as OnboardingStage[]
          },
          status: 'active'
        };
      
        set({ user: updatedUser });
        localStorage.setItem(`userdata:${user.id}`, JSON.stringify(updatedUser));
      }
    }),
    {
      name: 'user-store',
      partialize: (state) => ({ user: state.user })
    }
  )
);

// Corrected selectors
export const useUser = () => useUserStore((state) => state.user);
export const useUserLoading = () => useUserStore((state) => state.isLoading);

// Single action selector without shallow
export const useUserActions = () => ({
  setLoading: useUserStore(state => state.setLoading),
  setUser: useUserStore(state => state.setUser),
  clearError: useUserStore(state => state.clearError),
  initializeUser: useUserStore(state => state.initializeUser),
  updateProfile: useUserStore(state => state.updateProfile),
  addRole: useUserStore(state => state.addRole),
  updateOnboarding: useUserStore(state => state.updateOnboarding),
  updateSettings: useUserStore(state => state.updateSettings),
  setError: useUserStore(state => state.setError),
  logout: useUserStore(state => state.logout),
  verifyEmail: useUserStore(state => state.verifyEmail),
  requestPasswordReset: useUserStore(state => state.requestPasswordReset),
  completeOnboarding: useUserStore(state => state.completeOnboarding)
});