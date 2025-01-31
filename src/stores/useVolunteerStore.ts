import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
    Volunteer,
    Skill,
    Schedule,
    TimeLog,
    BackgroundCheck,
  } from '../types/ngo/volunteer';
import { VolunteerProfile } from '@/types/ngo/volunteer';


interface VolunteerState {
  volunteers: Volunteer[];
  isLoading: boolean;
  error: string | null;

  addVolunteer: (volunteer: Omit<Volunteer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateVolunteer: (id: string, updates: Partial<Volunteer>) => void;
  deleteVolunteer: (id: string) => void;
  addTimeLog: (volunteerId: string, log: Omit<TimeLog, 'id'>) => void;
  addSkill: (volunteerId: string, skill: Omit<Skill, 'id'>) => void;
  updateAvailability: (volunteerId: string, schedule: Schedule) => void;

  initializeVolunteer: (userId: string) => VolunteerProfile;
  updateProfile: (userId: string, updates: Partial<VolunteerProfile>) => void;
  logHours: (userId: string, log: Omit<TimeLog, 'id' | 'verified'>) => void;
  verifyHours: (userId: string, logId: string) => void;
  updateBackgroundCheck: (volunteerId: string, status: BackgroundCheck) => void;
  addTraining: (userId: string, training: { name: string; duration: number }) => void;
  completeTraining: (userId: string, trainingId: string) => void;
  getVolunteerMetrics: (userId: string) => {
    totalHours: number;
    completedTrainings: number;
    activeProjects: number;
  };
}

export const useVolunteerStore = create<VolunteerState>()(
  persist(
    (set, get) => ({
      volunteers: [],
      isLoading: false,
      error: null,

      addVolunteer: (volunteerData) => {
        const newVolunteer: Volunteer = {
          id: uuidv4(),
          ...volunteerData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: '',
          firstName: '',
          lastName: '',
          email: '',
          projects: [],
          skills: [],
          availability: undefined,
          hours: [],
          references: [],
          background: BackgroundCheck.PENDING,
          trainings: [],
          role: '',
          joinDate: '',
          trainingCompleted: false,
          hoursContributed: 0
        };

        set((state) => ({
          volunteers: [...state.volunteers, newVolunteer],
        }));
      },

      updateVolunteer: (id, updates) => {
        set((state) => ({
          volunteers: state.volunteers.map((volunteer) =>
            volunteer.id === id
              ? {
                  ...volunteer,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : volunteer
          ),
        }));
      },

      deleteVolunteer: (id) => {
        set((state) => ({
          volunteers: state.volunteers.filter((volunteer) => volunteer.id !== id),
        }));
      },

      addTimeLog: (volunteerId, log) => {
        set((state) => ({
          volunteers: state.volunteers.map((volunteer) =>
            volunteer.id === volunteerId
              ? {
                  ...volunteer,
                  hours: [...volunteer.hours, { ...log, id: uuidv4() }],
                  updatedAt: new Date().toISOString(),
                }
              : volunteer
          ),
        }));
      },

    addSkill: (volunteerId, skill) => {
        set((state) => ({
          volunteers: state.volunteers.map((volunteer) =>
            volunteer.id === volunteerId
              ? {
                  ...volunteer,
                 skills: [...volunteer.skills, { ...skill, id: uuidv4() } as unknown as Skill],
                  updatedAt: new Date().toISOString(),
                }
              : volunteer
          ),
        }));
      },


      updateAvailability: (volunteerId, schedule) => {
        set((state) => ({
          volunteers: state.volunteers.map((volunteer) =>
            volunteer.id === volunteerId
              ? {
                  ...volunteer,
                  availability: schedule,
                  updatedAt: new Date().toISOString(),
                }
              : volunteer
          ),
        }));
      },

      updateBackgroundCheck: (volunteerId, status) => {
        set((state) => ({
          volunteers: state.volunteers.map((volunteer) =>
            volunteer.id === volunteerId
              ? {
                  ...volunteer,
                  background: status,
                  updatedAt: new Date().toISOString(),
                }
              : volunteer
          ),
        }));
      },
        initializeVolunteer: (userId) => {
          const newProfile: VolunteerProfile = {
              skills: [],
              availability: {
                days: [],
                startTime: "",
                endTime: ""
              },
            hours: [],
            references: [],
            trainings: []
        }
            
            set((state) => ({
            volunteers: state.volunteers.map(volunteer => {
                if(volunteer.userId === userId) {
                    return {
                        ...volunteer,
                        profile: newProfile
                    }
                }
                return volunteer;
            })
            }))
            return newProfile;
        },
        updateProfile: (userId, updates) => {
            set((state) => ({
                volunteers: state.volunteers.map(volunteer => {
                    if(volunteer.userId === userId) {
                        return {
                            ...volunteer,
                            profile: {
                              ...volunteer.profile,
                              ...updates
                            }
                        }
                    }
                    return volunteer;
                })
            }));
        },
         logHours: (userId, log) => {
            set((state) => ({
                volunteers: state.volunteers.map(volunteer => {
                    if(volunteer.userId === userId) {
                        return {
                            ...volunteer,
                           hours: [...volunteer.hours, { ...log, id: uuidv4(), verified: false }],
                            updatedAt: new Date().toISOString(),
                        }
                    }
                  return volunteer;
                })
            }));
          },
          verifyHours: (userId, logId) => {
              set((state) => ({
                  volunteers: state.volunteers.map((volunteer) => {
                      if(volunteer.userId === userId) {
                         return {
                              ...volunteer,
                                hours: volunteer.hours.map(log => {
                                    if(log.id === logId) {
                                        return {
                                            ...log,
                                          verified: true,
                                        }
                                    }
                                   return log;
                                })
                            };
                      }
                      return volunteer;
                  })
              }));
          },
           addTraining: (userId, training) => {
               set((state) => ({
                  volunteers: state.volunteers.map(volunteer => {
                      if(volunteer.userId === userId) {
                          return {
                              ...volunteer,
                              trainings: [...volunteer.trainings, { ...training, id: uuidv4(), completed: false } ]
                          }
                      }
                      return volunteer;
                  })
               }));
           },
           completeTraining: (userId, trainingId) => {
             set((state) => ({
                volunteers: state.volunteers.map(volunteer => {
                  if(volunteer.userId === userId) {
                      return {
                          ...volunteer,
                          trainings: volunteer.trainings.map(training => {
                              if(training.id === trainingId) {
                                  return {
                                      ...training,
                                    completed: true,
                                  }
                              }
                              return training;
                          })
                      }
                    }
                    return volunteer;
                  })
             }))
           },
      getVolunteerMetrics: (userId) => {
          const volunteer = get().volunteers.find(volunteer => volunteer.userId === userId);

          if(!volunteer) {
              return {
                  totalHours: 0,
                  completedTrainings: 0,
                  activeProjects: 0,
                };
            }

            const totalHours = volunteer.hours.reduce((acc, log) => acc + log.hours, 0)
          const completedTrainings = volunteer.trainings.filter(training => training.completed).length;
          const activeProjects = volunteer.projects?.length || 0;
            
            return {
              totalHours,
                completedTrainings,
                activeProjects
            }
          }
    }),
    {
      name: 'volunteer-storage',
    }
  )
);