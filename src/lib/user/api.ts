// @/lib/user/api.ts
import axios from 'axios';
import { UserUpdateInput, ActiveRoleInput } from './validations';
import { UserProfileResponse } from './types';
import { UserSettings } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

export const userApi = {
  async getProfile(): Promise<UserProfileResponse> {
    const response = await axios.get(`${API_BASE_URL}/users/me`, { 
      withCredentials: true 
    });
    return response.data;
  },

  async updateProfile(data: UserUpdateInput): Promise<{ message: string }> {
    const response = await axios.put(`${API_BASE_URL}/users/me`, data, { 
      withCredentials: true 
    });
    return response.data;
  },

  async setActiveRole(data: ActiveRoleInput): Promise<{ message: string }> {
    const response = await axios.put(`${API_BASE_URL}/users/me/active-role`, data, { 
      withCredentials: true 
    });
    return response.data;
  },

  async updateSettings(settings: UserSettings): Promise<{ message: string }> {
    const response = await axios.patch(`${API_BASE_URL}/users/me/settings`, settings, { 
      withCredentials: true 
    });
    return response.data;
  },

  async deleteAccount(): Promise<{ message: string }> {
    const response = await axios.delete(`${API_BASE_URL}/users/me`, { 
      withCredentials: true 
    });
    return response.data;
  }
};