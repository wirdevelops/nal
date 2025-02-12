// src/lib/onboarding/hooks.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { onboardingApi } from './axios';
import { useOnboardingStore } from './store';
import { useAuthStore } from '@/lib/auth/store';
import { OnboardingStatus } from './types';
import { User } from '@/lib/user/types';

export const useOnboardingStatus = () => {
  const { setStatus } = useOnboardingStore();
  
  return useQuery({
    queryKey: ['onboarding-status'],
    queryFn: async () => {
      const { data } = await onboardingApi.getStatus();
      setStatus(data);
      return data;
    },
    enabled: !!useAuthStore.getState().user?.id
  });
};

export const useStartOnboarding = () => {
  const { setStatus } = useOnboardingStore();
  
  return useMutation({
    mutationFn: onboardingApi.startOnboarding,
    onSuccess: () => {
      setStatus({ stage: 'basic_info', completed: false, startedAt: new Date().toISOString() });
    }
  });
};

export const useCompleteOnboarding = () => {
  const { setStatus } = useOnboardingStore();
  const { setUser } = useAuthStore();
  
  return useMutation({
    mutationFn: onboardingApi.completeOnboarding,
    onSuccess: () => {
      setStatus((prev: OnboardingStatus | null) => 
        prev ? {
          ...prev,
          stage: 'completed' as const,
          completed: true,
          completedAt: new Date().toISOString()
        } : null
      );
      
      setUser((prev: User | null) => 
        prev ? {
          ...prev,
          hasCompletedOnboarding: true
        } : null
      );
    }
  });
};

// // @/lib/onboarding/hooks.ts
// import { useEffect } from 'react';
// import useOnboardingStore from './store';
// import { OnboardingDataType, StartOnboardingRequestType } from './types';

// // Hook to start the onboarding process
// export const useStartOnboarding = () => {
//   const { start, isLoading, error } = useOnboardingStore();

//   const startOnboarding = async (data: StartOnboardingRequestType) => {
//     try{
//       await start(data)
//     } catch(startError) {
//       console.error("Error starting onboarding", startError)
//     }
//   }
//   return { startOnboarding, isLoading, error };
// };

// // Hook to get the current onboarding status. Fetches on mount.
// export const useOnboardingStatus = () => {
//     const { getStatus, onboardingStatus, isLoading, error } = useOnboardingStore();

//     useEffect(() => {
//         getStatus(); // Fetch on mount
//     }, [getStatus]);

//     return { onboardingStatus, isLoading, error, refetch: getStatus }; // Add refetch
// };

// // Hook to set basic onboarding information
// export const useSetBasicInfo = () => {
//     const { setBasicInfo, isLoading, error } = useOnboardingStore();

//     const updateBasicInfo = async(data: OnboardingDataType) => {
//       try {
//         await setBasicInfo(data)
//       } catch(basicInfoError) {
//         console.error("Error updating basic info", basicInfoError)
//       }
//     }
//     return { updateBasicInfo, isLoading, error };
// };

// // Hook to set role-specific onboarding details
// export const useSetRoleDetails = () => {
//     const { setRoleDetails, isLoading, error } = useOnboardingStore();
//     const updateRoleDetails = async (data: OnboardingDataType) => {
//       try {
//         await setRoleDetails(data)
//       } catch(roleError) {
//         console.error("Error updating role details", roleError)
//       }
//     }
//     return { updateRoleDetails, isLoading, error };
// };

// // Hook to set verification data
// export const useSetVerificationData = () => {
//     const { setVerificationData, isLoading, error } = useOnboardingStore();

//     const updateVerification = async (data: OnboardingDataType) => {
//       try {
//         await setVerificationData(data)
//       } catch(verificationError) {
//         console.error("Error updating verification data", verificationError)
//       }
//     }
//     return { updateVerification, isLoading, error };
// };

// // Hook to complete the onboarding process
// export const useCompleteOnboarding = () => {
//     const { complete, isLoading, error } = useOnboardingStore();

//     const completeOnboarding = async () => {
//       try{
//         await complete()
//       } catch(completeError) {
//         console.error("Error completing onboarding", completeError)
//       }
//     }
//     return { completeOnboarding, isLoading, error };
// };

// //Hook to get onboarding status
// export const useOnboarding = () => {
//     const onboardingStatus = useOnboardingStore(state => state.onboardingStatus);
//     return onboardingStatus;
// };

// //Hook to clear onboarding status
// export const useClearOnboarding = () => {
//     const clearOnboarding = useOnboardingStore(state => state.clearOnboarding)
//     return clearOnboarding
// }

// // src/lib/onboarding/hooks.ts
  // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
  // import { useRouter } from 'next/navigation';
  // import { useToast } from '@/components/ui/use-toast';
  // import { onboardingApi } from './api';
  // import { useOnboardingStore } from './store';
  // import { useAuthStore } from '../auth/store';
  
  // export function useOnboardingStatus() {
  //   const { setStatus } = useOnboardingStore();
  
  //   return useQuery({
  //     queryKey: ['onboarding-status'],
  //     queryFn: onboardingApi.getStatus,
  //     onSuccess: (data) => {
  //       setStatus(data);
  //     },
  //   });
  // }
  
  // export function useStartOnboarding() {
  //   const { toast } = useToast();
  //   const router = useRouter();
  //   const queryClient = useQueryClient();
  
  //   return useMutation({
  //     mutationFn: onboardingApi.startOnboarding,
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ['onboarding-status'] });
  //       router.push('/onboarding/basic-info');
  //       toast({
  //         title: 'Onboarding Started',
  //         description: 'Let\'s get your profile set up.',
  //       });
  //     },
  //   });
  // }
  
  // export function useSetBasicInfo() {
  //   const { toast } = useToast();
  //   const router = useRouter();
  //   const queryClient = useQueryClient();
  
  //   return useMutation({
  //     mutationFn: onboardingApi.setBasicInfo,
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ['onboarding-status'] });
  //       router.push('/onboarding/role-details');
  //       toast({
  //         title: 'Basic Info Saved',
  //         description: 'Now let\'s set up your role details.',
  //       });
  //     },
  //   });
  // }
  