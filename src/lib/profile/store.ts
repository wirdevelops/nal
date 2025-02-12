// @/lib/profile/store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as api from './api';
import {CreateProfileRequestType, ProfileType, UpdateProfileType} from './types'

interface ProfileState {
    profiles: ProfileType[];
    currentProfile: ProfileType | null;
    isLoading: boolean;
    error: string | null;
    create: (data: CreateProfileRequestType) => Promise<void>;
    getById: (profileId: string) => Promise<void>;
    getByUserId: (userId: string) => Promise<void>;
    update: (profileId: string, data: UpdateProfileType) => Promise<void>;
    delete: (profileId: string) => Promise<void>;
    clearProfiles: () => void;
    clearCurrentProfile: () => void
}

const useProfileStore = create<ProfileState>()(
    devtools(
        (set) => ({
            profiles: [],
            currentProfile: null,
            isLoading: false,
            error: null,

            create: async (data: CreateProfileRequestType) => {
                set({ isLoading: true, error: null });
                try {
                    await api.createProfile(data);
                    // You might want to fetch the user's profiles after creation
                    set({isLoading: false})
                } catch (error: any) {
                    set({ isLoading: false, error: error.message || 'Failed to create profile' });
                }
            },

            getById: async (profileId: string) => {
                set({ isLoading: true, error: null, currentProfile: null }); // Clear previous profile
                try {
                    const profile = await api.getProfileById(profileId);
                    set({ currentProfile: profile, isLoading: false });
                } catch (error: any) {
                    set({ isLoading: false, error: error.message || 'Failed to get profile' });
                }
            },

            getByUserId: async (userId: string) => {
              set({ isLoading: true, error: null, profiles: [] }); // Clear previous profiles
                try {
                    const profiles = await api.getProfilesByUserId(userId);
                    set({ profiles, isLoading: false });
                } catch (error: any) {
                    set({ isLoading: false, error: error.message || 'Failed to get profiles' });
                }
            },

            update: async (profileId: string, data: UpdateProfileType) => {
                set({ isLoading: true, error: null });
                try {
                    await api.updateProfile(profileId, data);
                    // You might want to re-fetch the profile after updating
                    set({isLoading: false})
                } catch (error: any) {
                    set({ isLoading: false, error: error.message || 'Failed to update profile' });
                }
            },

            delete: async (profileId: string) => {
                set({ isLoading: true, error: null });
                try {
                    await api.deleteProfile(profileId);
					//Remove the profile from the profiles
					set((state) => ({
						profiles: state.profiles.filter((profile) => profile.id !== profileId),
						isLoading: false
					}))
                    // You might want to clear or refresh the profile list after deletion
                } catch (error: any) {
                    set({ isLoading: false, error: error.message || 'Failed to delete profile' });
                }
            },
            clearProfiles: () => {
                set({profiles: []})
            },
            clearCurrentProfile: () => {
                set({currentProfile: null})
            }
        })
    )
);

export default useProfileStore;