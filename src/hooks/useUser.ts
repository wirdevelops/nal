// hooks/useUser.ts
import { useCallback, useMemo } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { useProductStore } from '@/stores/useProductStore';
import { toast } from 'react-hot-toast';
import type { User, UserRole, OnboardingStage } from '@/types/user';

export const useUser = () => {
  const {
    user,
    isLoading,
    error,
    initializeUser,
    updateProfile,
    addRole,
    updateOnboarding,
    updateSettings,
    logout // Removed linkToNGO
  } = useUserStore();
  
  const { products } = useProductStore();

  const isAuthenticated = useMemo(() => !!user, [user]);
  const currentRole = useMemo(() => user?.roles[0], [user]);
  const onboardingProgress = useMemo(() => {
    if (!user) return 0;
    return Math.round(
      (user.onboarding.completed.length / Object.keys(user.onboarding.data).length) * 100
    );
  }, [user]);

  const handleError = useCallback((error: unknown, defaultMessage: string) => {
    const message = error instanceof Error ? error.message : defaultMessage;
    toast.error(message);
  }, []);

  const signUp = useCallback(async (
    email: string,
    name: { first: string; last: string }
  ) => {
    try {
      initializeUser(email, name);
      toast.success('Account created successfully');
    } catch (error) {
      handleError(error, 'Failed to create account');
    }
  }, [initializeUser, handleError]);

  const completeOnboardingStep = useCallback(async (data: Record<string, unknown>) => {
    if (!user) return;
    
    try {
      const currentStage = user.onboarding.stage;
      updateOnboarding(currentStage, data);
      
      if (currentStage !== 'completed') {
        const nextStage = getNextOnboardingStage(currentStage);
        updateOnboarding(nextStage);
      }
      
      toast.success('Progress saved');
    } catch (error) {
      handleError(error, 'Failed to save progress');
    }
  }, [user, updateOnboarding, handleError]);

  const getNextOnboardingStage = useCallback((
    current: OnboardingStage
  ): OnboardingStage => {
    const stageOrder: OnboardingStage[] = [
      'role-selection',
      'basic-info',
      'role-details',
      'portfolio',
      'verification',
      'completed'
    ];
    
    const currentIndex = stageOrder.indexOf(current);
    return currentIndex === stageOrder.length - 1 ? current : stageOrder[currentIndex + 1];
  }, []);

  // Fixed type constraint for valid profile keys
  const updateUserProfile = useCallback(async <T extends keyof User['profiles']>(
    role: T,
    data: Partial<User['profiles'][T]>
  ) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      updateProfile(role, data);
      toast.success('Profile updated successfully');
    } catch (error) {
      handleError(error, 'Failed to update profile');
    }
  }, [user, updateProfile, handleError]);

  const addUserRole = useCallback(async (role: UserRole) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      addRole(role);
      toast.success(`Added ${role} role`);
    } catch (error) {
      handleError(error, 'Failed to add role');
    }
  }, [user, addRole, handleError]);

  const verifyAccount = useCallback(async () => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      toast.success('Account verified successfully');
    } catch (error) {
      handleError(error, 'Verification failed');
    }
  }, [user, handleError]);

  const signOut = useCallback(async () => {
    try {
      logout();
      toast.success('Signed out successfully');
    } catch (error) {
      handleError(error, 'Logout failed');
    }
  }, [logout, handleError]);

  const getUserProducts = useMemo(() => {
    if (!user) return [];
    return products.filter(p => p.sellerId === user.id);
  }, [user, products]);

  const hasRole = useCallback((role: UserRole) => {
    return user?.roles.includes(role) ?? false;
  }, [user]);

  const userActions = useMemo(() => ({
    signUp,
    signOut,
    verifyAccount,
    updateProfile: updateUserProfile,
    addRole: addUserRole,
    completeOnboardingStep,
    updateSettings,
    hasRole
  }), [
    signUp,
    signOut,
    verifyAccount,
    updateUserProfile,
    addUserRole,
    completeOnboardingStep,
    updateSettings,
    hasRole
  ]);

  return {
    user,
    isAuthenticated,
    onboardingProgress,
    isLoading,
    error,
    userProducts: getUserProducts,
    userActions
  };
};