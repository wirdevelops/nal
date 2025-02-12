// src/stores/useAuthStore.ts
import { create } from 'zustand';
import {
  loginUser,
  registerUser,
  logoutUserAPI,
  refreshAccessToken,
} from '@/lib/api';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth'; // Import AuthResponse
import { UserRole } from '@/types/user'; // Import User and UserRole
import { getCurrentUser, redirectTo } from '@/utils/auth';
import { persist } from 'zustand/middleware';

interface AuthState {
  // Use the correct type from AuthResponse for the user
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
    setUser: (user: AuthResponse['user'] | null) => void; // Corrected type
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      login: async (data: LoginRequest) => {
        set({ loading: true, error: null });
        try {
          const response = await loginUser(data);
          // Use the correct property from the response
          set({
            user: response.user,
            isAuthenticated: true,
            loading: false,
          });
          redirectTo('/');
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Login failed',
          });
        }
      },
      register: async (data: RegisterRequest) => {
        set({ loading: true, error: null });
        try {
          const response = await registerUser(data);
          set({
            user: response.user,
            isAuthenticated: true,
            loading: false,
          });
          redirectTo('/');
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Registration failed',
          });
        }
      },
      logout: async () => {
        set({ loading: true, error: null });
        try {
          await logoutUserAPI();
          set({ user: null, isAuthenticated: false, loading: false });
          redirectTo('/login');
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Logout failed',
          });
        }
      },
      refresh: async () => {
        set({ loading: true });
        try {
          await refreshAccessToken();
          const user = await getCurrentUser(); // Get updated user info

          if (user) {
              // map user date to the AuthResponse type
            const authUser: AuthResponse['user'] = {
              id: user.id,
              email: '', // We don't get this from getCurrentUser, fill as needed.
              roles: user.roles as UserRole[], //  assertion
              onboardingStatus: user.onboardingStatus
            };
            set({ user: authUser, isAuthenticated: true, loading: false });
          } else {
            set({ user: null, isAuthenticated: false, loading: false });
          }


        } catch (error: any) {
          console.error('Refresh failed:', error);
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: error.message || 'Refresh Token failed',
          });
          redirectTo('/login');
        }
      },

      clearError: () => set({ error: null }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);