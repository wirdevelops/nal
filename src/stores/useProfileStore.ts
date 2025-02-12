// src/stores/useProfileStore.ts
import { create } from 'zustand';
import {
  createProfile,
  getProfileById,
    getProfilesByUserId,
  updateProfile,
  deleteProfile,
  listProfiles,
} from '@/lib/api';
import {
  CreateProfileRequest,
  GetProfileResponse,
  UpdateProfileRequest,
  ListProfilesResponse,
   ProfileFilters,
} from '@/types/profile';
import { persist } from 'zustand/middleware';

interface ProfileState {
  profiles: GetProfileResponse[]; // Store an array of profiles
  currentProfile: GetProfileResponse | null;
  loading: boolean;
  error: string | null;
  create: (data: CreateProfileRequest) => Promise<void>;
  getById: (profileId: string) => Promise<void>;
  getByUserId: (userId: string) => Promise<void>; //get all user profiles
  update: (profileId: string, data: UpdateProfileRequest) => Promise<void>;
  remove: (profileId: string) => Promise<void>;
    list: (filters?: ProfileFilters) => Promise<void>; //  list with optional filters
  clearError: () => void;
   setCurrentProfile: (profile: GetProfileResponse | null) => void; // Add this

}

export const useProfileStore = create<ProfileState>()(
    persist(
    (set) => ({
    profiles: [],
    currentProfile: null,
    loading: false,
    error: null,

    create: async (data: CreateProfileRequest) => {
      set({ loading: true, error: null });
      try {
        const response = await createProfile(data);
        set((state) => ({
          profiles: [...state.profiles, response], // Add the new profile to the array
          currentProfile: response,
          loading: false,
        }));
      } catch (error: any) {
        set({
          loading: false,
          error: error.message || 'Failed to create profile',
        });
      }
    },
    getById: async (profileId: string) => {
      set({ loading: true, error: null, currentProfile: null });
      try {
        const response = await getProfileById(profileId);
        set({ currentProfile: response, loading: false });
      } catch (error: any) {
        set({
          loading: false,
          error: error.message || 'Failed to get profile',
        });
      }
    },
      getByUserId: async (userId: string) => {
      set({ loading: true, error: null, profiles: [] });
      try {
        const response = await getProfilesByUserId(userId);
        set({ profiles: response, loading: false });
      } catch (error: any) {
        set({
          loading: false,
          error: error.message || 'Failed to get profiles by user ID',
        });
      }
    },
    update: async (profileId: string, data: UpdateProfileRequest) => {
      set({ loading: true, error: null });
      try {
        const response = await updateProfile(profileId, data);
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.profileID === profileId ? response : p
          ),
          currentProfile: response,
          loading: false,
        }));
      } catch (error: any) {
        set({
          loading: false,
          error: error.message || 'Failed to update profile',
        });
      }
    },
    remove: async (profileId: string) => {
      set({ loading: true, error: null });
      try {
        await deleteProfile(profileId);
        set((state) => ({
          profiles: state.profiles.filter((p) => p.profileID !== profileId),
          currentProfile:
            state.currentProfile?.profileID === profileId
              ? null
              : state.currentProfile,
          loading: false,
        }));
      } catch (error: any) {
        set({
          loading: false,
          error: error.message || 'Failed to delete profile',
        });
      }
    },
      list: async (filters?: ProfileFilters) => {
      set({ loading: true, error: null, profiles: [] }); // Clear existing profiles
      try {
        const response = await listProfiles(filters);
        set({ profiles: response, loading: false }); // Store the fetched profiles
      } catch (error: any) {
        set({
          loading: false,
          error: error.message || 'Failed to list profiles',
        });
      }
    },
    clearError: () => set({ error: null }),
    setCurrentProfile: (profile) => set({ currentProfile: profile }),
  }),
        {
            name: 'profile-storage'
        }
    )
);