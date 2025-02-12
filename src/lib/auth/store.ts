// src/lib/auth/store.ts 
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/user/types';
import { OnboardingStage } from '@/lib/onboarding/types'; // Ensure this import is correct
import { authApi } from './api'; // Import your API functions
// No need to import useCallback here anymore

interface AuthState {
  user: User | null;
  onboarding: {
    currentStage: OnboardingStage;
    completedStages: OnboardingStage[];
  };
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; // Flag to prevent premature redirects
  setOnboardingProgress: (stage: OnboardingStage, completed: OnboardingStage[]) => void;
  completeOnboarding: () => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  updateOnboardingStatus: (completed: boolean) => void;
  // initialize: () => Promise<void>; // REMOVE THIS from the interface
  updateUser: (updatedUser: Partial<User>) => void;
  setOnboardingStage: (stage: OnboardingStage) => void;
}

// Helper function to clear user data (localStorage, cookies)
const clearUserProfile = () => {
  localStorage.removeItem('auth-storage');
  // Clear cookies (if used - this is a robust method)
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
  });
};

// Create the store WITHOUT useCallback
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      onboarding: {
        currentStage: 'setup' as OnboardingStage,
        completedStages: [],
      },
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      // Actions (NO useCallback here)
      // initialize: ...  <-- REMOVE initialize FROM HERE

      updateUser: (updatedUser: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
      setOnboardingProgress: (stage: OnboardingStage, completed: OnboardingStage[]) =>
        set((state) => ({
          onboarding: {
            currentStage: stage,
            completedStages: completed.includes(stage)
              ? completed
              : [...completed, stage],
          }
        })),

      setOnboardingStage: (stage: OnboardingStage) =>
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            currentStage: stage,
          },
        })),

      completeOnboarding: () =>
        set((state) => ({
          user: state.user
            ? { ...state.user, hasCompletedOnboarding: true }
            : null,
          onboarding: {
            currentStage: 'completed' as OnboardingStage,
            completedStages: ['completed' as OnboardingStage], // Or all stages
          },
        })),

      setUser: (user: User | null) =>
        set({
          user,
          isAuthenticated: !!user,
          isInitialized: true, // Set isInitialized when user is set (or not)
        }),

      clearAuth: () => {
        clearUserProfile();
        set({
          user: null,
          isAuthenticated: false,
          onboarding: {
            currentStage: 'setup',
            completedStages: [],
          },
          isInitialized: true, // VERY IMPORTANT:  Set isInitialized on clear
        });
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      updateOnboardingStatus: (completed: boolean) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, hasCompletedOnboarding: completed }
            : null,
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        onboarding: state.onboarding,
      }),
    }
  )
);