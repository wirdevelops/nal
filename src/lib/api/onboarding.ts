// src/lib/api/onboarding.ts
import api from '@/lib/axios';
import { OnboardingStage } from '../types';

export const onboardingService = {
  startOnboarding: async (roles: string[]) => {
    return api.post<OnboardingAPIResponse>('/auth/onboarding/start', { roles });
  },

  updateStage: async (stage: OnboardingStage, data: Record<string, any>) => {
    return api.put(`/auth/onboarding/${stage}`, data);
  },

  submitVerification: async (documents: FormData) => {
    return api.post('/auth/onboarding/verify', documents, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  completeOnboarding: async () => {
    return api.post('/auth/onboarding/complete');
  }
};