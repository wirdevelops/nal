// hooks/useUser.ts

import { useCallback } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import type { UserProfile, UserSettings, UserRole, CreatorSpecialty } from '@/types/user';

export function useUser(userId: string) {
  const store = useUserStore();

  // Profile management
    const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      store.updateProfile(updates);
      // Later: API integration - EXAMPLE
      // await fetch('/api/users/profile', {
      //   method: 'PATCH',
      //   body: JSON.stringify(updates)
      // });
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }, []);

  // Role management
  const addRole = useCallback(async (role: UserRole) => {
    try {
      store.addRole(role);
      // Later: API integration
    } catch (error) {
      console.error('Failed to add role:', error);
      throw error;
    }
  }, []);

  // Project management
  const addProjectCollaboration = useCallback(async (
    projectId: string, 
    role: string
  ) => {
    try {
      store.addCollaboration(projectId, role);
      // Later: API integration
    } catch (error) {
      console.error('Failed to add collaboration:', error);
      throw error;
    }
  }, []);

  // Seller features
  const enableSellerFeatures = useCallback(async () => {
    try {
      store.enableSellerFeatures();
      store.addRole('seller');
      // Later: API integration
    } catch (error) {
      console.error('Failed to enable seller features:', error);
      throw error;
    }
  }, []);

  // Settings management
  const updateSettings = useCallback(async (settings: Partial<UserSettings>) => {
    try {
      store.updateSettings(settings);
      // Later: API integration
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }, []);

  // Specialty management
  const updateSpecialties = useCallback(async (specialties: CreatorSpecialty[]) => {
    try {
      // Remove all existing specialties first
      store.currentUser?.specialties?.forEach(specialty => {
        store.removeSpecialty(specialty);
      });
      
      // Add new specialties
      specialties.forEach(specialty => {
        store.addSpecialty(specialty);
      });
      // Later: API integration
    } catch (error) {
      console.error('Failed to update specialties:', error);
      throw error;
    }
  }, []);

  // Professional details
  const updateProfessionalDetails = useCallback(async (
    details: Partial<UserProfile['professionalDetails']>
  ) => {
    try {
      store.updateProfile({
        professionalDetails: {
          ...store.currentUser?.professionalDetails,
          ...details
        }
      });
      // Later: API integration
    } catch (error) {
      console.error('Failed to update professional details:', error);
      throw error;
    }
  }, []);

 


  // Portfolio management
  const updatePortfolio = useCallback(async (
    portfolio: Partial<UserProfile['portfolio']>
  ) => {
    try {
      store.updateProfile({
        portfolio: {
          ...store.currentUser?.portfolio,
          ...portfolio
        }
      });
      // Later: API integration
    } catch (error) {
      console.error('Failed to update portfolio:', error);
      throw error;
    }
  }, []);

  // Stats and metrics
  const updateStats = useCallback(async (
    stats: Partial<UserProfile['stats']>
  ) => {
    try {
      store.updateProfile({
        stats: {
          ...store.currentUser?.stats,
          ...stats
        }
      });
      // Later: API integration
    } catch (error) {
      console.error('Failed to update stats:', error);
      throw error;
    }
  }, []);

  // Project associations
  const linkToProject = useCallback(async (
    projectId: string, 
    { isOwner = false, role }: { isOwner?: boolean; role?: string }
  ) => {
    try {
      store.addProject(projectId, isOwner);
      if (role) {
        store.addCollaboration(projectId, role);
      }
      // Later: API integration
    } catch (error) {
      console.error('Failed to link project:', error);
      throw error;
    }
  }, []);

  // Availability management
  const updateAvailability = useCallback(async (
    availability: UserProfile['professionalDetails']['availability']
  ) => {
    try {
      store.updateProfile({
        professionalDetails: {
          ...store.currentUser?.professionalDetails,
          availability
        }
      });
      // Later: API integration
    } catch (error) {
      console.error('Failed to update availability:', error);
      throw error;
    }
  }, []);

  // Seller profile management
  const updateSellerProfile = useCallback(async (
    updates: Partial<UserProfile['sellerProfile']>
  ) => {
    try {
      store.updateSellerProfile(updates);
      // Later: API integration
    } catch (error) {
      console.error('Failed to update seller profile:', error);
      throw error;
    }
  }, []);

    // Preferences management
    const updatePreferences = useCallback(async (
        preferences: Partial<UserProfile['preferences']>
      ) => {
        try {
          store.updateProfile({
            preferences: {
              ...store.currentUser?.preferences,
              ...preferences
            }
          });
          // Later: API integration
        } catch (error) {
          console.error('Failed to update preferences:', error);
          throw error;
        }
      }, []);

  // Helper functions
  const isRole = useCallback((role: UserRole) => {
    return store.currentUser?.roles.includes(role);
  }, [store.currentUser]);

  const hasSpecialty = useCallback((specialty: CreatorSpecialty) => {
    return store.currentUser?.specialties?.includes(specialty);
  }, [store.currentUser]);

  return {
    // User data
    user: store.currentUser,
    settings: store.userSettings,
    isLoading: store.isLoading,
    error: store.error,

    // Core profile operations
    updateProfile,
    updateSettings,

    // Role and specialty management
    addRole,
    isRole,
    hasSpecialty,
    updateSpecialties,

    // Professional features
    updateProfessionalDetails,
    updatePortfolio,
    updateStats,
    updateAvailability,

    // Project management
    linkToProject,
    addProjectCollaboration,

    // Seller features
    enableSellerFeatures,
    updateSellerProfile,

    // Preferences
    updatePreferences
  };
}