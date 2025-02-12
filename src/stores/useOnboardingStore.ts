// src/stores/useOnboardingStore.ts
import { create } from 'zustand';
import {
  startOnboarding,
  setBasicInfo,
  setRoleDetails,
  setVerificationData,
  completeOnboarding,
  getOnboardingStatus,
} from '@/lib/api';
import {
  BasicInfo,
  RoleDetails,
    VerificationData,
  GetOnboardingStatusResponse,
    OnboardingStage
} from '@/types/onboarding';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  status: OnboardingStage; // Corrected type
  loading: boolean;
  error: string | null;
  basicInfo: BasicInfo | null;
  roleDetails: RoleDetails | null;
  verificationData: VerificationData | null; // Keep as any, validated separately

  start: () => Promise<void>;
  setBasic: (data: BasicInfo) => Promise<void>;
  setRole: (data: RoleDetails) => Promise<void>;
  setVerification: (data: VerificationData) => Promise<void>;
  complete: () => Promise<void>;
  getStatus: () => Promise<void>;
  clearError: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      status: 'incomplete',
      loading: false,
      error: null,
      basicInfo: null,
      roleDetails: null,
      verificationData: null,

      start: async () => {
        set({ loading: true, error: null });
        try {
          const { status } = await startOnboarding({}); // Destructure the response
          set({ status: status as OnboardingStage, loading: false }); // Cast to correct type
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Failed to start onboarding',
          });
        }
      },
      setBasic: async (data: BasicInfo) => {
        set({ loading: true, error: null });
        try {
          const { status } = await setBasicInfo(data); // Destructure the response
          set({
            basicInfo: data,
            status: status as OnboardingStage, // Cast to correct type
            loading: false,
          });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Failed to save basic info',
          });
        }
      },
      setRole: async (data: RoleDetails) => {
        set({ loading: true, error: null });
        try {
          const { status } = await setRoleDetails(data); // Destructure
          set({
            roleDetails: data,
            status: status as OnboardingStage, // Cast
            loading: false,
          });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Failed to save role details',
          });
        }
      },
      setVerification: async (data: VerificationData) => {
        set({ loading: true, error: null });
        try {
          const { status } = await setVerificationData(data); // Destructure
          set({
            verificationData: data,
            status: status as OnboardingStage,
            loading: false,
          });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Failed to save verification data',
          });
        }
      },
      complete: async () => {
        set({ loading: true, error: null });
        try {
          await completeOnboarding({});
          set({ status: 'complete', loading: false });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Failed to complete onboarding',
          });
        }
      },
      getStatus: async () => {
        set({ loading: true, error: null });
        try {
          const response = await getOnboardingStatus();
          set({ status: response.status, loading: false });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Failed to get onboarding status',
          });
        }
      },
      clearError: () => set({ error: null }),
      resetOnboarding: () =>
        set({
          status: 'incomplete',
          basicInfo: null,
          roleDetails: null,
          verificationData: null,
        }),
    }),
    {
      name: 'onboarding-storage',
    }
  )
);