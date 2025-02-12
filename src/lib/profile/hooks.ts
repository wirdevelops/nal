// @/lib/profile/hooks.ts
import { useEffect } from 'react';
import useProfileStore from './store';
import {useUserStore} from '@/lib/user/store';
import { CreateProfileRequestType, UpdateProfileType } from '@/lib/user/types';

// Hook to create a profile
export const useCreateProfile = () => {
  const { create, isLoading, error } = useProfileStore();

  const createProfile = async(data: CreateProfileRequestType) => {
    try {
      await create(data)
    } catch(profileError) {
      console.error("Error creating profile", profileError)
    }
  }

  return { createProfile, isLoading, error };
};

// Hook to get a profile by its ID.  Does *not* auto-fetch.
export const useProfileById = (profileId: string) => {
    const { getById, currentProfile, isLoading, error } = useProfileStore();

    useEffect(() => {
        if (profileId) {
            getById(profileId);
        }
        return () => {
          useProfileStore.getState().clearCurrentProfile()
        }
    }, [profileId, getById]);

    return { profile: currentProfile, isLoading, error };
};

// Hook to get all profiles for the current user. Auto-fetches on mount.
export const useProfilesByCurrentUser = () => {
    const { getByUserId, profiles, isLoading, error } = useProfileStore();
    const user = useUserStore(state => state.user)

    useEffect(() => {
        if(user && user.id){
          getByUserId(user.id);
        }
        return () => {
          useProfileStore.getState().clearProfiles()
        }

    }, [getByUserId, user]);

    return { profiles, isLoading, error };
};

// Hook to update a profile
export const useUpdateProfile = () => {
    const { update, isLoading, error } = useProfileStore();

    const updateProfile = async(profileId: string, data: UpdateProfileType) => {
      try{
        await update(profileId, data)
      } catch(updateError) {
        console.error("Error updating profile", updateError)
      }
    }
    return { updateProfile, isLoading, error };
};

// Hook to delete a profile
export const useDeleteProfile = () => {
    const { delete: deleteProfileFn, isLoading, error } = useProfileStore(); // Rename 'delete'

    const deleteProfile = async (profileId: string) => {
      try {
        await deleteProfileFn(profileId)
      } catch(deleteError) {
        console.error("Error deleting profile", deleteError)
      }
    }
    return { deleteProfile, isLoading, error };
};

//Hook to get the list of profiles
export const useProfiles = () => {
    const profiles = useProfileStore(state => state.profiles)
    return profiles
}

//Hook to get current profile
export const useCurrentProfile = () => {
    const currentProfile = useProfileStore(state => state.currentProfile)
    return currentProfile
}