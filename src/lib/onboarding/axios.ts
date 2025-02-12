// src/lib/onboarding/axios.ts
import  axios  from '@/lib/axios';
import {
  OnboardingStatus,
  BasicInfoForm,
  RoleDetailsForm,
  VerificationData
} from './types';

export const onboardingApi = {
  startOnboarding: (roles: string[]) => 
    axios.post('/api/v1/onboarding/start', { roles }),
  
  getStatus: () => 
    axios.get<OnboardingStatus>('/api/v1/onboarding/status'),
  
  updateBasicInfo: (data: BasicInfoForm) => 
    axios.put('/api/v1/onboarding/basic-info', data),
  
  updateRoleDetails: (data: RoleDetailsForm) => 
    axios.put('/api/v1/onboarding/role-details', data),
  
  updateVerification: (data: VerificationData) => 
    axios.put('/api/v1/onboarding/verification', data),
  
  completeOnboarding: () => 
    axios.post('/api/v1/onboarding/complete')
};