import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Value } from '@sinclair/typebox/value'; 
import {
  type ImpactCategory,
  type ImpactMeasurement,
  type ImpactGoal,
  type ImpactStory,
  type ImpactSummary,
  ImpactStorySchema,
  ImpactGoalSchema,
  ImpactMeasurementSchema,
} from '@/types/ngo/impactStory';
import { IMPACT_CATEGORY_SCHEMA } from '@/types/ngo/schemas';

interface ImpactState {
  categories: ImpactCategory[];
  measurements: ImpactMeasurement[];
  goals: ImpactGoal[];
  stories: ImpactStory[];
  isLoading: boolean;
  error: string | null;
}

interface ImpactActions {

  deleteMeasurement: (id: string) => void;
  updateGoal: (id: string, updates: Partial<ImpactGoal>) => void;
  deleteGoal: (id: string) => void;
  publishStory: (id: string) => void;
  archiveStory: (id: string) => void;
  

  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;

  // Category management
  addCategory: (category: Omit<ImpactCategory, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<ImpactCategory>) => void;
  deleteCategory: (id: string) => void;

  // Story management
  createStory: (story: Omit<ImpactStory, 'id' | 'metadata'>) => void;
  updateStory: (id: string, updates: Partial<ImpactStory>) => void;
 

  // Measurement management
  addMeasurement: (measurement: Omit<ImpactMeasurement, 'id'>) => void;
  updateMeasurement: (id: string, updates: Partial<ImpactMeasurement>) => void;


  // Goal management
  setGoal: (goal: Omit<ImpactGoal, 'id' | 'progress' | 'status'>) => void;
  updateGoalProgress: (id: string, newValue: number) => void;

  // Analytics
  calculateSummary: () => ImpactSummary;
  getCategoryProgress: (categoryId: string) => number;

  // Queries
  getStoriesByProject: (projectId: string) => ImpactStory[];
  getMeasurementsByCategory: (categoryId: string) => ImpactMeasurement[];
  getGoalsByProject: (projectId: string) => ImpactGoal[];
  getMeasurementsByProject: (projectId: string) => ImpactMeasurement[];
  getProjectImpactSummary: (projectId: string) => ImpactSummary;
}

const DEFAULT_SUMMARY: ImpactSummary = {
  totalImpact: 0,
  volunteerHours: 0,
  goalsProgress: 0,
  efficiency: 0,
  impactTrend: 0,
  volunteerTrend: 0,
  efficiencyTrend: 0,
  measurements: [],
  goals: [],
  progress: {}
};

export const useImpactStore = create<ImpactState & ImpactActions>()(
  persist(
    (set, get) => ({
      categories: [],
      measurements: [],
      goals: [],
      stories: [],
      isLoading: false,
      error: null,

      // Error handling
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Category management
      addCategory: (categoryData) => {
        try {
          const newCategory = Value.Encode(IMPACT_CATEGORY_SCHEMA, {
            id: uuidv4(),
            ...categoryData
          });
          
          set(state => ({
            categories: [...state.categories, newCategory],
            error: null
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Invalid category data' });
        }
      },

      updateCategory: (id, updates) => {
        set(state => ({
          categories: state.categories.map(category => 
            category.id === id 
              ? Value.Encode(IMPACT_CATEGORY_SCHEMA, { ...category, ...updates })
              : category
          )
        }));
      },

      deleteCategory: (id) => {
        set(state => ({
          categories: state.categories.filter(category => category.id !== id)
        }));
      },

      // Story management
      createStory: (storyData) => {
        try {
          const newStory = Value.Encode(ImpactStorySchema, {
            id: uuidv4(),
            ...storyData,
            metadata: {
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              verified: false,
              status: 'draft',
              tags: []
            }
          });
          
          set(state => ({
            stories: [...state.stories, newStory],
            error: null
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Invalid story data' });
        }
      },

      updateStory: (id, updates) => {
        set(state => ({
          stories: state.stories.map(story => 
            story.id === id
              ? Value.Encode(ImpactStorySchema, {
                  ...story,
                  ...updates,
                  metadata: {
                    ...story.metadata,
                    updatedAt: new Date().toISOString()
                  }
                })
              : story
          )
        }));
      },

      // Story management
publishStory: (id) => {
  set(state => ({
    stories: state.stories.map(story => 
      story.id === id
        ? Value.Encode(ImpactStorySchema, {
            ...story,
            metadata: {
              ...story.metadata,
              status: 'published'
            }
          })
        : story
    )
  }));
},

archiveStory: (id) => {
  set(state => ({
    stories: state.stories.map(story => 
      story.id === id
        ? Value.Encode(ImpactStorySchema, {
            ...story,
            metadata: {
              ...story.metadata,
              status: 'archived'
            }
          })
        : story
    )
  }));
},

// Measurement management
deleteMeasurement: (id) => {
  set(state => ({
    measurements: state.measurements.filter(m => m.id !== id)
  }));
},

// Goal management
updateGoal: (id, updates) => {
  set(state => ({
    goals: state.goals.map(goal => 
      goal.id === id
        ? Value.Encode(ImpactGoalSchema, { ...goal, ...updates })
        : goal
    )
  }));
},

deleteGoal: (id) => {
  set(state => ({
    goals: state.goals.filter(g => g.id !== id)
  }));
},

// Category progress
getCategoryProgress: (categoryId) => {
  const measurements = get().measurements.filter(m => m.categoryId === categoryId);
  const goals = get().goals.filter(g => g.categoryId === categoryId);
  
  if (goals.length === 0) return 0;
  
  const totalValue = measurements.reduce((sum, m) => sum + m.value, 0);
  const targetValue = goals.reduce((sum, g) => sum + g.targetValue, 0);
  
  return (totalValue / targetValue) * 100;
},

      // Measurement management
      addMeasurement: (measurementData) => {
        try {
          const newMeasurement = Value.Encode(ImpactMeasurementSchema, {
            id: uuidv4(),
            ...measurementData,
            date: new Date().toISOString()
          });
          
          set(state => ({
            measurements: [...state.measurements, newMeasurement],
            error: null
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Invalid measurement data' });
        }
      },

      updateMeasurement: (id, updates) => {
        set(state => ({
          measurements: state.measurements.map(measurement => 
            measurement.id === id
              ? Value.Encode(ImpactMeasurementSchema, { ...measurement, ...updates })
              : measurement
          )
        }));
      },

      // Goal management
      setGoal: (goalData) => {
        try {
          const newGoal = Value.Encode(ImpactGoalSchema, {
            id: uuidv4(),
            ...goalData,
            progress: 0,
            status: 'pending'
          });
          
          set(state => ({
            goals: [...state.goals, newGoal],
            error: null
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Invalid goal data' });
        }
      },

      updateGoalProgress: (id, progress) => {
        set(state => ({
          goals: state.goals.map(goal => {
            if (goal.id !== id) return goal;
            
            const status = progress >= goal.targetValue
              ? 'achieved'
              : new Date(goal.deadline) < new Date()
                ? 'missed'
                : 'in-progress';

            return Value.Encode(ImpactGoalSchema, {
              ...goal,
              progress,
              status
            });
          })
        }));
      },

      // Analytics
      calculateSummary: (): ImpactSummary => {
        const { measurements, goals } = get();
        
        // Helper function to calculate percentage trends
        const calculateTrend = (values: number[]): number => {
          if (values.length < 2) return 0;
          const current = values[values.length - 1];
          const previous = values[values.length - 2];
          return Number(((current - previous) / previous * 100).toFixed(2));
        };
      
        // Extract historical values for trends
        const impactValues = measurements.map(m => m.value);
        const volunteerValues = measurements.map(m => m.volunteerHours || 0);
        const efficiencyValues = measurements.map(m => 
          m.volunteerHours ? m.value / m.volunteerHours : 0
        );
      
        // Calculate progress per category
        const progress = goals.reduce((acc, goal) => {
          const categoryMeasurements = measurements.filter(m => 
            m.categoryId === goal.categoryId
          );
          const totalValue = categoryMeasurements.reduce(
            (sum, m) => sum + m.value, 0
          );
          acc[goal.categoryId] = Number((totalValue / goal.targetValue * 100).toFixed(2));
          return acc;
        }, {} as Record<string, number>);
      
        return measurements.reduce((acc, measurement) => ({
          totalImpact: acc.totalImpact + measurement.value,
          volunteerHours: acc.volunteerHours + (measurement.volunteerHours || 0),
          goalsProgress: goals.length > 0 
            ? Number((goals.filter(g => g.status === 'achieved').length / goals.length * 100).toFixed(2))
            : 0,
          efficiency: acc.volunteerHours > 0 
            ? Number((acc.totalImpact / acc.volunteerHours).toFixed(2)) 
            : 0,
          impactTrend: calculateTrend(impactValues),
          volunteerTrend: calculateTrend(volunteerValues),
          efficiencyTrend: calculateTrend(efficiencyValues),
          progress,
          measurements: [...acc.measurements, measurement],
          goals: [...acc.goals]
        }), {
          ...DEFAULT_SUMMARY,
          progress // Include initial progress object
        });
      },

      // Query methods
      getStoriesByProject: (projectId) => {
        return get().stories.filter(story => 
          story.metadata.tags.includes(`project:${projectId}`)
        );
      },

getMeasurementsByCategory: (categoryId) => {
  return get().measurements.filter(m => m.categoryId === categoryId);
},

getGoalsByProject: (projectId) => {
  return get().goals.filter(g => g.projectId === projectId);
},

getMeasurementsByProject: (projectId) => {
  return get().measurements.filter(m => m.projectId === projectId);
},

      getProjectImpactSummary: (projectId) => {
        const measurements = get().getMeasurementsByProject(projectId);
        const goals = get().getGoalsByProject(projectId);
        
        return measurements.reduce((summary, measurement) => ({
          ...summary,
          totalImpact: summary.totalImpact + measurement.value,
          volunteerHours: summary.volunteerHours + (measurement.volunteerHours || 0),
          measurements: [...summary.measurements, measurement]
        }), {
          ...DEFAULT_SUMMARY,
          goals,
          progress: goals.reduce((acc, goal) => {
            const categoryMeasurements = measurements.filter(m => 
              m.categoryId === goal.categoryId
            );
            acc[goal.categoryId] = categoryMeasurements.reduce(
              (sum, m) => sum + m.value, 0
            ) / goal.targetValue * 100;
            return acc;
          }, {} as Record<string, number>)
        });
      }
      
    }),
    {
      name: 'impact-storage',
      partialize: (state) => ({
        categories: state.categories,
        measurements: state.measurements,
        goals: state.goals,
        stories: state.stories
      })
    }
  )
);