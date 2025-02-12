// src/lib/onboarding/store.ts
import { create } from 'zustand';
import { OnboardingStatus, OnboardingStage } from '@/lib/onboarding/types';

interface OnboardingStore {
  status: OnboardingStatus | null;
  isLoading: boolean;
  // Removed currentStep and setCurrentStep: This is redundant with the 'stage' property
  reset: () => void;
  updateStatus: (newStatus: Partial<OnboardingStatus>) => void; // Changed to Partial
  startOnboarding: () => void; // Added to initialize onboarding
  completeStep: (stage: OnboardingStage) => void;  // Added to mark a step as complete.
}

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({ // Added get
  status: null,
  isLoading: false,
  reset: () => set({
    status: null,
    isLoading: false,
  }),
  // Changed to updateStatus
  updateStatus: (newStatus) =>
    set((state) => ({
      status: state.status ? { ...state.status, ...newStatus } : newStatus as OnboardingStatus, // Important: Handles initial null status
    })),

  startOnboarding: () =>
    set({
      status: {
        stage: 'setup', // Start at the 'setup' stage
        completed: false,
        startedAt: new Date().toISOString(),
      },
    }),

    completeStep: (stage: OnboardingStage) => set((state) => {
        if (!state.status) {
          return state; // Or throw an error, or initialize
        }
        // More robust completion logic, only update if it is the current stage.
        if(state.status.stage !== stage){
            return state;
        }

        const updatedStatus: OnboardingStatus = {
          ...state.status,
          completed: true, //mark the status as completed
          completedAt: new Date().toISOString(),
          stage: getNextStage(stage), // Get the next stage.
        };
        return { status: updatedStatus };
    }),

}));

// Helper Function outside the store:
function getNextStage(currentStage: OnboardingStage): OnboardingStage {
    const stages: OnboardingStage[] = [
      'setup',
      'role-selection',
      'basic-info',
      'role-details',
      'verification',
      'completed',
    ];
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex === -1 || currentIndex === stages.length - 1) {
      return 'completed'; // Or handle as an error
    }
    return stages[currentIndex + 1];
  }


// // @/lib/onboarding/store.ts
// import { create } from 'zustand';
// import { devtools } from 'zustand/middleware';
// import * as api from './api';
// import { OnboardingDataType, OnboardingStatusType, StartOnboardingRequestType } from './types';

// interface OnboardingState {
//     onboardingStatus: OnboardingStatusType | null;
//     isLoading: boolean;
//     error: string | null;
//     start: (roles: StartOnboardingRequestType) => Promise<void>;
//     getStatus: () => Promise<void>;
//     setBasicInfo: (data: OnboardingDataType) => Promise<void>;
//     setRoleDetails: (data: OnboardingDataType) => Promise<void>;
//     setVerificationData: (data: OnboardingDataType) => Promise<void>;
//     complete: () => Promise<void>;
//     clearOnboarding: () => void;
// }

// const useOnboardingStore = create<OnboardingState>()(
//     devtools(
//         (set) => ({
//             onboardingStatus: null,
//             isLoading: false,
//             error: null,

//             start: async (data: StartOnboardingRequestType) => {
//                 set({ isLoading: true, error: null });
//                 try {
//                     await api.startOnboarding(data);
//                     // You might want to fetch the status after starting.
//                     await useOnboardingStore.getState().getStatus()
//                     set({ isLoading: false });
//                 } catch (error: any) {
//                     set({ isLoading: false, error: error.message || 'Failed to start onboarding' });
//                 }
//             },

//             getStatus: async () => {
//                 set({ isLoading: true, error: null });
//                 try {
//                     const status = await api.getOnboardingStatus();
//                     set({ onboardingStatus: status, isLoading: false });
//                 } catch (error: any) {
//                     set({ isLoading: false, error: error.message || 'Failed to get onboarding status' });
//                 }
//             },

//             setBasicInfo: async (data: OnboardingDataType) => {
//                 set({ isLoading: true, error: null });
//                 try {
//                     await api.setBasicInfo(data);
//                      // You might want to fetch the status after updating.
//                     await useOnboardingStore.getState().getStatus()
//                     set({ isLoading: false });
//                 } catch (error: any) {
//                     set({ isLoading: false, error: error.message || 'Failed to set basic info' });
//                 }
//             },

//             setRoleDetails: async (data: OnboardingDataType) => {
//                 set({ isLoading: true, error: null });
//                 try {
//                     await api.setRoleDetails(data);
//                      // You might want to fetch the status after updating.
//                     await useOnboardingStore.getState().getStatus()
//                     set({ isLoading: false });
//                 } catch (error: any) {
//                     set({ isLoading: false, error: error.message || 'Failed to set role details' });
//                 }
//             },

//             setVerificationData: async (data: OnboardingDataType) => {
//                 set({ isLoading: true, error: null });
//                 try {
//                     await api.setVerificationData(data);
//                     // You might want to fetch the status after updating.
//                     await useOnboardingStore.getState().getStatus()
//                     set({ isLoading: false });
//                 } catch (error: any) {
//                     set({ isLoading: false, error: error.message || 'Failed to set verification data' });
//                 }
//             },

//             complete: async () => {
//                 set({ isLoading: true, error: null });
//                 try {
//                     await api.completeOnboarding();
//                     set({ onboardingStatus: null, isLoading: false }); // Reset status on completion
//                 } catch (error: any) {
//                     set({ isLoading: false, error: error.message || 'Failed to complete onboarding' });
//                 }
//             },
//             clearOnboarding: () => {
//                 set({onboardingStatus: null})
//             }
//         })
//     )
// );

// export default useOnboardingStore;

// // // src/lib/onboarding/store.ts
// // import { create } from 'zustand';
// // import { OnboardingStatus, OnboardingStep } from './types';

// // interface OnboardingStore {
// //   status: OnboardingStatus | null;
// //   currentStep: OnboardingStep;
// //   setStatus: (status: OnboardingStatus) => void;
// //   setCurrentStep: (step: OnboardingStep) => void;
// //   resetOnboarding: () => void;
// // }

// // export const useOnboardingStore = create<OnboardingStore>((set) => ({
// //   status: null,
// //   currentStep: OnboardingStep.NOT_STARTED,
// //   setStatus: (status) => set({ status }),
// //   setCurrentStep: (step) => set({ currentStep: step }),
// //   resetOnboarding: () => set({ 
// //     status: null, 
// //     currentStep: OnboardingStep.NOT_STARTED 
// //   }),
// // }));