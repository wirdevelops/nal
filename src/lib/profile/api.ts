// @/lib/profile/api.ts
import apiInstance from '@/lib/user/axios';
import { CreateProfileRequestType, ProfileType, UpdateProfileType } from './validations';

// Create a new profile
export const createProfile = async (data: CreateProfileRequestType): Promise<{ message: string }> => {
  try {
    const response = await apiInstance.post<{ message: string }>('/profiles/', data);
    return response.data
  } catch(error) {
    throw error
  }
};

// Get a profile by its ID
export const getProfileById = async (profileId: string): Promise<ProfileType> => {
    try {
        const response = await apiInstance.get<ProfileType>(`/profiles/${profileId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get all profiles for a user ID
export const getProfilesByUserId = async (userId: string): Promise<ProfileType[]> => {
  try {
    const response = await apiInstance.get<ProfileType[]>(`/profiles/user/${userId}`);
    return response.data
  } catch(error) {
    throw error
  }
};

// Update a profile
export const updateProfile = async (profileId: string, data: UpdateProfileType): Promise<{ message: string }> => {
  try {
    const response =  await apiInstance.put<{ message: string }>(`/profiles/${profileId}`, data);
    return response.data
  } catch(error) {
    throw error
  }
};

// Delete a profile
export const deleteProfile = async (profileId: string): Promise<{ message: string }> => {
  try {
    const response = await apiInstance.delete<{ message: string }>(`/profiles/${profileId}`);
    return response.data
  } catch(error) {
    throw error
  }
};