import { useCallback, useState, useEffect } from 'react';
import { useVolunteerStore } from '@/stores/useVolunteerStore';
import type { Volunteer, TimeLog, Skill, Schedule } from '@/types/ngo/volunteer';
import { toast } from '@/hooks/use-toast';

export function useVolunteer(volunteerId?: string) {
  const store = useVolunteerStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentVolunteer, setCurrentVolunteer] = useState<Volunteer | null>(null);

  const getVolunteer = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const volunteer = store.volunteers.find(v => v.id === id);
      if (volunteer) {
        setCurrentVolunteer(volunteer);
      }
      return volunteer;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch volunteer',
          variant: 'destructive',
        });
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [store.volunteers]);

  // Auto-fetch volunteer if ID is provided
  useEffect(() => {
    if (volunteerId) {
      getVolunteer(volunteerId);
    }
  }, [volunteerId, getVolunteer]);

  const registerVolunteer = useCallback(async (volunteerData: Omit<Volunteer, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      store.addVolunteer(volunteerData);
      toast({
        title: 'Success',
        description: 'Volunteer registered successfully',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: 'Error',
          description: 'Failed to register volunteer',
          variant: 'destructive',
        });
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  }, [store]);

  const logVolunteerHours = useCallback(async (volunteerId: string, timeLog: Omit<TimeLog, 'id'>) => {
    try {
      store.addTimeLog(volunteerId, timeLog);
      toast({
        title: 'Success',
        description: 'Hours logged successfully',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: 'Error',
          description: 'Failed to log hours',
          variant: 'destructive',
        });
        throw error;
      }
    }
  }, [store]);

  const updateVolunteerSkills = useCallback(async (volunteerId: string, skills: Omit<Skill, 'id'>[]) => {
    try {
      skills.forEach(skill => store.addSkill(volunteerId, skill));
      toast({
        title: 'Success',
        description: 'Skills updated successfully',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: 'Error',
          description: 'Failed to update skills',
          variant: 'destructive',
        });
        throw error;
      }
    }
  }, [store]);

  const updateVolunteerSchedule = useCallback(async (volunteerId: string, schedule: Schedule) => {
    try {
      store.updateAvailability(volunteerId, schedule);
      toast({
        title: 'Success',
        description: 'Schedule updated successfully',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: 'Error',
          description: 'Failed to update schedule',
          variant: 'destructive',
        });
        throw error;
      }
    }
  }, [store]);

  return {
    volunteers: store.volunteers,
    volunteer: currentVolunteer,
    isLoading,
    getVolunteer,
    registerVolunteer,
    logVolunteerHours,
    updateVolunteerSkills,
    updateVolunteerSchedule,
  };
}