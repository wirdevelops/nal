// @/lib/user/hooks.ts
import { useState } from 'react';
import { userApi } from './api';
import { UserUpdateInput, ActiveRoleInput } from './validations';
import { UserSettings } from '@/lib/types';
import { useAuthStore } from '@/lib/auth/store';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const useUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, clearUser } = useAuthStore();
  const router = useRouter();

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const profile = await userApi.getProfile();
      setUser(profile as any);
      return profile;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch profile');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UserUpdateInput) => {
    setIsLoading(true);
    try {
      const response = await userApi.updateProfile(data);
      await fetchProfile(); // Refresh user data
      toast.success(response.message);
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const setActiveRole = async (data: ActiveRoleInput) => {
    setIsLoading(true);
    try {
      const response = await userApi.setActiveRole(data);
      await fetchProfile(); // Refresh user data
      toast.success(response.message);
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to set active role');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (settings: UserSettings) => {
    setIsLoading(true);
    try {
      const response = await userApi.updateSettings(settings);
      await fetchProfile(); // Refresh user data
      toast.success(response.message);
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.deleteAccount();
      clearUser(); // Clear user from store
      toast.success(response.message);
      router.push('/login');
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchProfile,
    updateProfile,
    setActiveRole,
    updateSettings,
    deleteAccount,
    isLoading
  };
};