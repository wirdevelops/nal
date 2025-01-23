import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
    Volunteer,
    Skill,
    Schedule,
    TimeLog,
    BackgroundCheck,
  } from '../types/ngo';


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
  updateBackgroundCheck: (volunteerId: string, status: BackgroundCheck) => void;
}

export const useVolunteerStore = create<VolunteerState>()(
  persist(
    (set) => ({
      volunteers: [],
      isLoading: false,
      error: null,

      addVolunteer: (volunteerData) => {
        const newVolunteer: Volunteer = {
          id: uuidv4(),
          ...volunteerData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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
    }),
    {
      name: 'volunteer-storage',
    }
  )
);