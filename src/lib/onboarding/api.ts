// src/lib/onboarding/api.ts

import apiInstance from '@/lib/user/axios'; // Import the configured axios instance.
import {OnboardingStatusType, StartOnboardingRequestType, OnboardingDataType} from '@/lib/onboarding/types'
import { handleOnboardingError } from './errors';

// Start the onboarding process
export const startOnboarding = async (data: StartOnboardingRequestType): Promise<{ message: string }> => {
  try {
      const response = await apiInstance.post<{ message: string }>('/onboarding/start', data);
      return response.data;
  } catch (error) {
      throw handleOnboardingError(error);
  }
};

// Get the current onboarding status
export const getOnboardingStatus = async (): Promise<OnboardingStatusType> => {
  try {
    const response = await apiInstance.get<OnboardingStatusType>('/onboarding/status');
    return response.data
  } catch(error) {
    throw error
  }
};

// Set basic onboarding information
export const setBasicInfo = async (data: OnboardingDataType): Promise<{ message: string }> => {
    try {
        const response = await apiInstance.put<{ message: string }>('/onboarding/basic-info', data);
        return response.data;
    } catch (error) {
      throw error
    }
};

// Set role-specific onboarding details
export const setRoleDetails = async (data: OnboardingDataType): Promise<{ message: string }> => {
  try {
    const response = await apiInstance.put<{ message: string }>('/onboarding/role-details', data)
    return response.data
  } catch(error) {
    throw error
  }
};

// Set verification data
export const setVerificationData = async (data: OnboardingDataType): Promise<{ message: string }> => {
    try {
        const response = await apiInstance.put<{ message: string }>('/onboarding/verification', data);
        return response.data;
    } catch (error) {
        throw error
    }
};

// Complete the onboarding process
export const completeOnboarding = async (): Promise<{ message: string }> => {
    try {
      const response = await apiInstance.post<{ message: string }>('/onboarding/complete');
      return response.data
    } catch(error) {
      throw error
    }
};