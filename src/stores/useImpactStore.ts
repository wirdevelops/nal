// @stores/useImpactStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  ImpactCategory,
  ImpactMeasurement,
  ImpactGoal,
  ImpactSummary
} from '@/types/ngo/impactStory';

interface ImpactState {
  categories: ImpactCategory[];
  measurements: ImpactMeasurement[];
  goals: ImpactGoal[];
  isLoading: boolean;
  error: string | null;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;

  // Category methods
  addCategory: (category: Omit<ImpactCategory, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<ImpactCategory>) => void;
  deleteCategory: (id: string) => void;

  // Measurement methods
  addMeasurement: (measurement: Omit<ImpactMeasurement, 'id'>) => void;
  updateMeasurement: (id: string, updates: Partial<ImpactMeasurement>) => void;
  deleteMeasurement: (id: string) => void;

  // Goal methods
  addGoal: (goal: Omit<ImpactGoal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<ImpactGoal>) => void;
  deleteGoal: (id: string) => void;
  updateGoalProgress: (id: string, progress: number) => void;

  // Query methods
  getMeasurementsByProject: (projectId: string) => ImpactMeasurement[];
  getGoalsByProject: (projectId: string) => ImpactGoal[];
  getMeasurementsByCategory: (categoryId: string) => ImpactMeasurement[];
  getProjectImpactSummary: (projectId: string) => ImpactSummary;
}

export const useImpactStore = create<ImpactState>()(
  persist(
    (set, get) => ({
      categories: [],
      measurements: [],
      goals: [],
      isLoading: false,
      error: null,

      // Error handling
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Category management
      addCategory: (categoryData) => {
        const newCategory: ImpactCategory = {
          id: uuidv4(),
          ...categoryData
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
          error: null
        }));
      },

      updateCategory: (id, updates) => set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? { ...category, ...updates } : category
        )
      })),

      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((category) => category.id !== id)
      })),

      // Measurement management
      addMeasurement: (measurementData) => {
        const newMeasurement: ImpactMeasurement = {
          id: uuidv4(),
          ...measurementData
        };
        set((state) => ({
          measurements: [...state.measurements, newMeasurement]
        }));
      },

      updateMeasurement: (id, updates) => set((state) => ({
        measurements: state.measurements.map((measurement) =>
          measurement.id === id ? { ...measurement, ...updates } : measurement
        )
      })),

      deleteMeasurement: (id) => set((state) => ({
        measurements: state.measurements.filter((m) => m.id !== id)
      })),

      // Goal management
      addGoal: (goalData) => {
        const newGoal: ImpactGoal = {
          id: uuidv4(),
          ...goalData,
          status: 'pending'
        };
        set((state) => ({
          goals: [...state.goals, newGoal]
        }));
      },

      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map((goal) =>
          goal.id === id ? { ...goal, ...updates } : goal
        )
      })),

      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((goal) => goal.id !== id)
      })),

      updateGoalProgress: (id, progress) => set((state) => ({
        goals: state.goals.map((goal) => 
          goal.id === id ? {
            ...goal,
            progress,
            status: progress >= goal.targetValue
              ? 'achieved'
              : new Date(goal.deadline) < new Date()
                ? 'missed'
                : 'in-progress'
          } : goal
        )
      })),

      // Query methods
      getMeasurementsByProject: (projectId) => 
        get().measurements.filter((m) => m.projectId === projectId),

      getGoalsByProject: (projectId) => 
        get().goals.filter((g) => g.projectId === projectId),

      getMeasurementsByCategory: (categoryId) => 
        get().measurements.filter((m) => m.categoryId === categoryId),

      getProjectImpactSummary: (projectId) => {
        const measurements = get().getMeasurementsByProject(projectId);
        const goals = get().getGoalsByProject(projectId);
      
        // Helper function to calculate percentage trend
        const calculateTrend = (values: number[]) => {
          if (values.length < 2) return 0;
          const current = values[values.length - 1];
          const previous = values[values.length - 2];
          return ((current - previous) / previous) * 100;
        };
      
        // Extract values for trend calculations
        const impactValues = measurements.map(m => m.value);
        const volunteerValues = measurements.map(m => m.volunteerHours || 0);
        const efficiencyValues = measurements.map(m => 
          (m.value || 0) / (m.volunteerHours || 1)
        );
      
        return {
          measurements,
          goals,
          progress: goals.reduce((acc, goal) => {
            const categoryMeasurements = measurements.filter(m => 
              m.categoryId === goal.categoryId
            );
            const totalValue = categoryMeasurements.reduce(
              (sum, m) => sum + m.value, 0
            );
            acc[goal.categoryId] = (totalValue / goal.targetValue) * 100;
            return acc;
          }, {} as Record<string, number>),
          
          totalImpact: impactValues.reduce((sum, val) => sum + val, 0),
          volunteerHours: volunteerValues.reduce((sum, val) => sum + val, 0),
          goalsProgress: goals.length > 0 
            ? (goals.filter(g => g.status === 'achieved').length / goals.length) * 100 
            : 0,
          efficiency: efficiencyValues.reduce((sum, val) => sum + val, 0) / efficiencyValues.length || 0,
          
          // Trend calculations
          impactTrend: calculateTrend(impactValues),
          volunteerTrend: calculateTrend(volunteerValues),
          efficiencyTrend: calculateTrend(efficiencyValues)
        };
      }
    }),
    {
      name: 'impact-storage',
      version: 1
    }
  )
);