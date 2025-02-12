// src/stores/useUserStore.ts
import { create } from 'zustand';
import { getUserById, updateUser, deleteUser, updateEmail } from '@/lib/api';
import { User, UpdateUserRequest, UpdateEmailRequest } from '@/types/user';
import { useAuthStore } from './useAuthStore';
import { persist } from 'zustand/middleware';

interface UserState {
  userData: Omit<User, 'roles' | 'onboardingStatus'> | null;
  loading: boolean;
  error: string | null;
  getUser: (userId: string) => Promise<void>;
  update: (userId: string, data: UpdateUserRequest) => Promise<void>;
  updateUserEmail: (data: UpdateEmailRequest) => Promise<void>;
  remove: (userId: string) => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userData: null,
      loading: false,
      error: null,

      getUser: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const response = await getUserById(userId);
          set({ userData: response, loading: false });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Failed to get user',
          });
        }
      },
      update: async (userId: string, data: UpdateUserRequest) => {
        set({ loading: true, error: null });
        try {
          const response = await updateUser(userId, data);
          set({ userData: response, loading: false });
          // Update the user data in the auth store as well, if needed
          const authUser = useAuthStore.getState().user;
          if (authUser && authUser.id === userId) {
            //  ensure you're only updating the allowed properties
              const updatedAuthUser = {
              ...authUser,
              ...(data.firstName && { firstName: data.firstName }), // Update firstName if provided
              ...(data.lastName && { lastName: data.lastName }),    // Update lastName if provided

            };
            useAuthStore.getState().setUser(updatedAuthUser);
          }
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Failed to update user',
          });
        }
      },
      updateUserEmail: async (data: UpdateEmailRequest) => {
        set({ loading: true, error: null });
        try {
          await updateEmail(data);
          const { user, setUser } = useAuthStore.getState();
          if (user) {
            // Update the email in the auth store using the correct type
            const updatedAuthUser: typeof user = { ...user, email: data.newEmail };
            setUser(updatedAuthUser);
          }
          //  update email in the user store as well, if needed
          set((state) => ({
            userData: state.userData
              ? { ...state.userData, email: data.newEmail }
              : null,
            loading: false,
          }));
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Failed to update email',
          });
        }
      },
      remove: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          await deleteUser(userId);
          set({ userData: null, loading: false });
          const { user, logout } = useAuthStore.getState();
          if (user && user.id === userId) {
            await logout();
          }
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Failed to delete user',
          });
        }
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);

// mport { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { v4 as uuidv4 } from 'uuid';
// import {
//     type User,
//     type UserRole,
//     type OnboardingStage,
//     type ActorProfile,
//     type CrewProfile,
//     type VendorProfile,
//     type ProducerProfile,
//     type ProjectOwnerProfile,
//     type NgoProfile,
//     type AdminProfile,
//     PROFILE_INITIALIZERS
// } from '@/types/user';

// import {
//   AuthTokens,
//   LoginData,
//   RegistrationData,
// } from '@/types/auth';
// import api from '@/lib/axios';

// interface UserProfiles {
//     actor: ActorProfile;
//     crew: CrewProfile;
//     vendor: VendorProfile;
//     producer: ProducerProfile;
//     'project-owner': ProjectOwnerProfile;
//     ngo: NgoProfile;
//     admin: AdminProfile;
// }

// interface AuthState {
//   accessToken: string | null;
//   refreshToken: string | null;
// }

// interface UserState {
//     user: User | null;
//     isLoading: boolean;
//     error: string | null;
// }

// interface UserActions {
//   setLoading: (loading: boolean) => void;
//     setUser: (user: User | null) => void;
//     clearError: () => void;
//    register: (registerData: RegistrationData) => Promise<void>;
//    login: (loginData: LoginData) => Promise<AuthTokens | null>;
//    logout: () => void;
//     initializeUser: (email: string, name: User['name']) => void;
//     updateProfile: <T extends UserRole>(role: T, data: Partial<UserProfiles[T]>) => void;
//     updateUser: (data: Partial<User>) => void;
//     addRole: (role: UserRole) => void;
//     removeRole: (role: UserRole) => void;
//     updateOnboarding: (stage: OnboardingStage, data?: Record<string, unknown>) => void;
//     updateSettings: (settings: Partial<User['settings']>) => void;
//     setError: (error: string | null) => void;
//     verifyEmail: () => void;
//     requestPasswordReset: (email: string) => Promise<void>;
//     completeOnboarding: () => void;
//     switchRole: (role: UserRole) => void;
//     getActiveProfile: <T extends UserRole>() => UserProfiles[T] | null;
// }

// const DEFAULT_SETTINGS: User['settings'] = {
//     notifications: {
//         email: true,
//         projects: true,
//         messages: true
//     },
//     privacy: {
//         profile: 'public',
//         contactInfo: false
//     }
// };


// export const useUserStore = create<AuthState & UserState & UserActions>()(
//     persist(
//         (set, get) => ({
//           accessToken: null,
//           refreshToken: null,
//             user: null,
//             isLoading: false,
//             error: null,

//             setLoading: (loading) => set({ isLoading: loading }),

//             setUser: (user) => set({ user }),

//             clearError: () => set({ error: null }),

//               register: async (registerData: RegistrationData) => {
//                 set({ isLoading: true, error: null });
//                 try {
//                     await api.post('/auth/register', registerData);
//                     set({ isLoading: false });
//                 } catch (error: any) {
//                     set({
//                         isLoading: false,
//                         error: error.response?.data?.error || error.message || 'Registration failed',
//                     });
//                 }
//               },
//               login: async (loginData: LoginData) => {
//                 set({ isLoading: true, error: null });
//                 try {
//                     const response = await api.post<AuthTokens>('/auth/login', loginData);
//                     const { accessToken, refreshToken } = response.data;

//                     set({ accessToken, refreshToken, isLoading: false });

//                     localStorage.setItem('accessToken', accessToken);
//                     localStorage.setItem('refreshToken', refreshToken);

//                   return { accessToken, refreshToken }
//                 } catch (error: any) {
//                     set({
//                         isLoading: false,
//                         error: error.response?.data?.error || error.message || 'Login failed',
//                     });
//                     return null;
//                 }
//               },

//             logout: () => {
//                 localStorage.removeItem("accessToken");
//                 localStorage.removeItem("refreshToken");
//                 useUserStore.persist.clearStorage();
//                 set({ user: null, error: null, isLoading: false });
//             },

//             initializeUser: (email: string, name: User['name']) => {
//                 if (get().user) {
//                     console.warn('User already initialized');
//                     return;
//                 }

//                 const newUser: User = {
//                     id: uuidv4(),
//                     email,
//                     isVerified: false,
//                     name,
//                     roles: [],
//                     profiles: {},
//                     onboarding: {
//                         stage: 'role-selection',
//                         completed: [],
//                         data: {}
//                     },
//                     settings: DEFAULT_SETTINGS,
//                     status: 'pending',
//                     metadata: {
//                         createdAt: new Date().toISOString(),
//                         updatedAt: new Date().toISOString()
//                     }
//                 };

//                 set({ user: newUser });
//             },

//             updateProfile: async (role, data) => {
//               set({ isLoading: true, error: null });
//               try {
//                   const token = localStorage.getItem("accessToken");
//                   api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//                   // Make API call to update the profile on the backend
//                   const response = await api.put(`/users/profile/${role}`, data); // Replace with your actual API endpoint
//                   const updatedProfile = response.data; // Assuming the API returns the updated profile

//                   set((state) => {
//                       if (!state.user) return state;
//                       return {
//                           user: {
//                               ...state.user,
//                               profiles: {
//                                   ...state.user.profiles,
//                                   [role]: {
//                                       ...(state.user.profiles[role] || PROFILE_INITIALIZERS[role]),
//                                       ...updatedProfile // Merge the updated profile data
//                                   }
//                               }
//                           }
//                       };
//                   });
//               } catch (error: any) {
//                   set({
//                       isLoading: false,
//                       error: error.response?.data?.error || error.message || 'Failed to update profile'
//                   });
//               } finally {
//                   set({ isLoading: false });
//               }
//             },

//             updateUser: (data) => {
//                 set((state) => {
//                     if (!state.user) return state;
//                     return {
//                         user: {
//                             ...state.user,
//                             ...data
//                         }
//                     };
//                 });
//             },
//             addRole: (role: UserRole) => {
//                 set((state) => {
//                     if (!state.user || state.user.roles.includes(role)) return state;

//                     const newRoles = [...state.user.roles, role];
//                     return {
//                         user: {
//                             ...state.user,
//                             roles: newRoles,
//                             activeRole: state.user.activeRole || role, // Corrected this line
//                             profiles: {
//                                 ...state.user.profiles,
//                                 [role]: PROFILE_INITIALIZERS[role]
//                             }
//                         }
//                     };
//                 });
//             },
//             removeRole: (role: UserRole) => {
//                 set((state) => {
//                     if (!state.user || !state.user.roles.includes(role)) return state;

//                     const newRoles = state.user.roles.filter((r) => r !== role);
//                     return {
//                         user: {
//                             ...state.user,
//                             roles: newRoles,
//                              activeRole: newRoles.length > 0 ? (state.user.activeRole === role ? newRoles[0] : state.user.activeRole) : undefined,
//                             profiles: {
//                               ...state.user.profiles,
//                               [role]: undefined
//                             }
//                         }
//                     };
//                 });
//             },


//             updateOnboarding: (stage, data = {}) => {
//                 set((state) => {
//                     if (!state.user) return state;
//                     return {
//                         user: {
//                             ...state.user,
//                             onboarding: {
//                                 ...state.user.onboarding,
//                                 stage,
//                                 data: { ...state.user.onboarding.data, ...data },
//                                 completed: [...state.user.onboarding.completed, stage]
//                             }
//                         }
//                     };
//                 });
//             },

//             updateSettings: (settings) => {
//                 set((state) => {
//                     if (!state.user) return state;
//                     return {
//                         user: {
//                             ...state.user,
//                             settings: { ...state.user.settings, ...settings }
//                         }
//                     };
//                 });
//             },

//             setError: (error) => set({ error }),

//              verifyEmail: () => {
//                 set((state) => {
//                     if (!state.user) return state;
//                     return {
//                         user: {
//                             ...state.user,
//                             isVerified: true,
//                             metadata: {
//                                 ...state.user.metadata,
//                                 updatedAt: new Date().toISOString()
//                             }
//                         }
//                     };
//                 });
//             },

//             requestPasswordReset: async (email: string) => {
//                set({ isLoading: true, error: null });
//                 try {
//                   await api.post('/auth/forgot-password', { email });
//                   console.log("reset-token success")
//                   set({ isLoading: false });
//                 } catch (error: any) {
//                   set({
//                     isLoading: false,
//                     error: error.response?.data?.error || error.message || 'Could not sent to this email',
//                   });
//                 }
//             },

//             completeOnboarding: () => {
//                 set((state) => {
//                     if (!state.user) return state;
//                     return {
//                         user: {
//                             ...state.user,
//                             onboarding: {
//                                 ...state.user.onboarding,
//                                 stage: 'completed',
//                                 completed: [...state.user.onboarding.completed, 'completed']
//                             },
//                             status: 'active'
//                         }
//                     };
//                 });
//             },

//             switchRole: (role: UserRole) => {
//                 set((state) => {
//                     if (!state.user || !state.user.roles.includes(role)) return state;

//                     return {
//                         user: {
//                             ...state.user,
//                             activeRole: role
//                         }
//                     };
//                 });
//             },

//             getActiveProfile: <T extends UserRole>(): UserProfiles[T] | null => {
//                 const user = get().user;
//                 if (!user?.activeRole) return null;
//                 return (user.profiles[user.activeRole] as UserProfiles[T]) || null;
//             },
//         }),
//         {
//             name: 'user-store',
//             partialize: (state) => ({ user: state.user }),
//             version: 1
//         }
//     )
// );

// // Selectors
// export const useUser = () => useUserStore((state) => state.user);
// export const useUserLoading = () => useUserStore((state) => state.isLoading);
// export const useUserError = () => useUserStore((state) => state.error);
// export const useAccessToken = () => useUserStore((state) => state.accessToken);
// export const useRefreshToken = () => useUserStore((state) => state.refreshToken);

// // Action hooks
// export const useUserActions = () => {
//   return {
//     setLoading: useUserStore((state) => state.setLoading),
//     setUser: useUserStore((state) => state.setUser),
//     clearError: useUserStore((state) => state.clearError),
//      register: useUserStore((state) => state.register),
//     login: useUserStore((state) => state.login),
//     logout: useUserStore((state) => state.logout),
//     initializeUser: useUserStore((state) => state.initializeUser),
//     updateProfile: useUserStore((state) => state.updateProfile),
//     updateUser: useUserStore((state) => state.updateUser),
//     addRole: useUserStore((state) => state.addRole),
//     removeRole: useUserStore((state) => state.removeRole),
//     updateOnboarding: useUserStore((state) => state.updateOnboarding),
//     updateSettings: useUserStore((state) => state.updateSettings),
//     setError: useUserStore((state) => state.setError),
//     verifyEmail: useUserStore((state) => state.verifyEmail),
//     requestPasswordReset: useUserStore((state) => state.requestPasswordReset),
//     completeOnboarding: useUserStore((state) => state.completeOnboarding),
//     switchRole: useUserStore((state) => state.switchRole),
//     getActiveProfile: useUserStore((state) => state.getActiveProfile)
//   }
// };