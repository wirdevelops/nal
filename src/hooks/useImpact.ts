// @hooks/useImpact.ts

import { useImpactStore } from '@/stores/useImpactStore';
import type {
  ImpactCategory,
  ImpactMeasurement,
  ImpactGoal,
  ImpactSummary
} from '@/types/ngo/impactStory';

export const useImpact = () => {
  const store = useImpactStore();

  return {
    // State
    categories: store.categories,
    measurements: store.measurements,
    goals: store.goals,
    isLoading: store.isLoading,
    error: store.error,

    // Error handling
    setError: store.setError,
    clearError: store.clearError,

    // Category methods
    addCategory: store.addCategory,
    updateCategory: store.updateCategory,
    deleteCategory: store.deleteCategory,

    // Measurement methods
    addMeasurement: store.addMeasurement,
    updateMeasurement: store.updateMeasurement,
    deleteMeasurement: store.deleteMeasurement,

    // Goal methods
    addGoal: store.addGoal,
    updateGoal: store.updateGoal,
    deleteGoal: store.deleteGoal,
    updateGoalProgress: store.updateGoalProgress,

    // Query methods
    getMeasurementsByProject: store.getMeasurementsByProject,
    getGoalsByProject: store.getGoalsByProject,
    getMeasurementsByCategory: store.getMeasurementsByCategory,
    getProjectImpactSummary: store.getProjectImpactSummary
  };
};

export type ImpactHookReturn = ReturnType<typeof useImpact>;
// import { useCallback, useState } from 'react';
// import { useImpactStore, type ImpactCategory, type ImpactMeasurement, type ImpactGoal } from '@/stores/useImpactStore';
// import { toast } from '@/hooks/use-toast';

// export function useImpact() {
//   const store = useImpactStore();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//    /**
//    * Creates a new impact category.
//    * @param category - The new impact category data.
//    */
//   const createImpactCategory = useCallback(async (category: Omit<ImpactCategory, 'id'>) => {
//     setIsLoading(true);
//     try {
//         // Real API call implementation
//       // const response = await fetch('/api/impact/categories', {
//       //   method: 'POST',
//       //   body: JSON.stringify(category),
//       //     headers: {
//       //     'Content-Type': 'application/json',
//       //   },
//       // });
//        // if(!response.ok){
//       //    const message = `An error has occured: ${response.status}`;
//       //   throw new Error(message);
//       // }
//       // const data = await response.json()
//       // store.addCategory(data)
//       await new Promise(resolve => setTimeout(resolve, 500));
//        store.addCategory(category); // Local state update
//       toast({
//         title: 'Success',
//         description: 'Impact category created successfully',
//       });
//     } catch (error: any) {
//       toast({
//         title: 'Error',
//         description: 'Failed to create impact category',
//         variant: 'destructive',
//       });
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   /**
//    * Records a new impact measurement.
//    * @param measurement - The new measurement data.
//    */
//   const recordMeasurement = useCallback(async (measurement: Omit<ImpactMeasurement, 'id'>) => {
//     try {
//       // Real API call implementation
//       // const response = await fetch('/api/impact/measurements', {
//       //   method: 'POST',
//       //   body: JSON.stringify(measurement),
//       //   headers: {
//       //     'Content-Type': 'application/json',
//       //   },
//       // });
//        // if(!response.ok){
//       //    const message = `An error has occured: ${response.status}`;
//       //   throw new Error(message);
//       // }
//       // const data = await response.json()
//       // store.addMeasurement(data)
//        store.addMeasurement(measurement); // Local state update
//       toast({
//         title: 'Success',
//         description: 'Measurement recorded successfully',
//       });
//     } catch (error: any) {
//       toast({
//         title: 'Error',
//         description: 'Failed to record measurement',
//         variant: 'destructive',
//       });
//       throw error;
//     }
//   }, []);

//     /**
//    * Sets a new impact goal.
//    * @param goal - The new impact goal data.
//    */
//   const setImpactGoal = useCallback(async (goal: Omit<ImpactGoal, 'id'>) => {
//     try {
//            // Real API call implementation
//       // const response = await fetch('/api/impact/goals', {
//       //   method: 'POST',
//       //   body: JSON.stringify(goal),
//       //    headers: {
//       //     'Content-Type': 'application/json',
//       //   },
//       // });
//        // if(!response.ok){
//       //    const message = `An error has occured: ${response.status}`;
//       //   throw new Error(message);
//       // }
//       // const data = await response.json()
//       // store.addGoal(data)
//       store.addGoal(goal); // Local state update
//       toast({
//         title: 'Success',
//         description: 'Impact goal set successfully',
//       });
//     } catch (error: any) {
//       toast({
//         title: 'Error',
//         description: 'Failed to set impact goal',
//         variant: 'destructive',
//       });
//       throw error;
//     }
//   }, []);

//     /**
//    * Updates the progress of an existing impact goal.
//    * @param goalId - The ID of the goal to update.
//    * @param progress - The new progress value.
//    */
//   const updateGoalProgress = useCallback(async (goalId: string, progress: number) => {
//     try {
//            // Real API call implementation
//       // const response = await fetch(`/api/impact/goals/${goalId}`, {
//       //   method: 'PATCH',
//       //   body: JSON.stringify({progress}),
//       //    headers: {
//       //     'Content-Type': 'application/json',
//       //   },
//       // });
//        // if(!response.ok){
//       //    const message = `An error has occured: ${response.status}`;
//       //   throw new Error(message);
//       // }
//       // const data = await response.json()
//       // store.updateGoalProgress(goalId, data);
//         store.updateGoalProgress(goalId, progress); // Local state update
//       toast({
//         title: 'Success',
//         description: 'Goal progress updated successfully',
//       });
//     } catch (error: any) {
//       toast({
//         title: 'Error',
//         description: 'Failed to update goal progress',
//         variant: 'destructive',
//       });
//       throw error;
//     }
//   }, []);

//   return {
//     categories: store.categories,
//     measurements: store.measurements,
//     goals: store.goals,
//     isLoading,
//     error,
//     createImpactCategory,
//     recordMeasurement,
//     setImpactGoal,
//     updateGoalProgress,
//     getMeasurementsByProject: store.getMeasurementsByProject,
//     getGoalsByProject: store.getGoalsByProject,
//     getMeasurementsByCategory: store.getMeasurementsByCategory,
//     getProjectImpactSummary: store.getProjectImpactSummary,
//   };
// }