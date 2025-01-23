import { useCallback, useState, useEffect } from 'react';
import { useVolunteerStore } from '@/stores/useVolunteerStore';
import type { Volunteer, TimeLog, Skill, Schedule } from '@/types/ngo';
import { toast } from '@/hooks/use-toast';

export function useVolunteer(volunteerId?: string) {
  const store = useVolunteerStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentVolunteer, setCurrentVolunteer] = useState<Volunteer | null>(null);

  // Auto-fetch volunteer if ID is provided
  useEffect(() => {
    if (volunteerId) {
      getVolunteer(volunteerId);
    }
  }, [volunteerId]);

  const getVolunteer = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const volunteer = store.volunteers.find(v => v.id === id);
      if (volunteer) {
        setCurrentVolunteer(volunteer);
      }
      return volunteer;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch volunteer',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [store.volunteers]);

  /**
   * Registers a new volunteer.
   * @param volunteerData - The data for the new volunteer.
   */
  const registerVolunteer = useCallback(async (volunteerData: Omit<Volunteer, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      // Real API call implementation
      // const response = await fetch('/api/volunteers', {
      //   method: 'POST',
      //   body: JSON.stringify(volunteerData),
      //    headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
        // if(!response.ok){
      //    const message = `An error has occured: ${response.status}`;
      //   throw new Error(message);
      // }
      // const data = await response.json()
      // store.addVolunteer(data)
        store.addVolunteer(volunteerData); // Local state update
      toast({
        title: 'Success',
        description: 'Volunteer registered successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to register volunteer',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);


  /**
   * Logs volunteer hours.
   * @param volunteerId - The ID of the volunteer.
   * @param timeLog - The time log data.
   */
  const logVolunteerHours = useCallback(async (volunteerId: string, timeLog: Omit<TimeLog, 'id'>) => {
    try {
      // Real API call implementation
    //   const response = await fetch(`/api/volunteers/${volunteerId}/hours`, {
    //     method: 'POST',
    //     body: JSON.stringify(timeLog),
    //      headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
       // if(!response.ok){
      //    const message = `An error has occured: ${response.status}`;
      //   throw new Error(message);
      // }
      // const data = await response.json()
      // store.addTimeLog(volunteerId, data)
      store.addTimeLog(volunteerId, timeLog); // Local state update
      toast({
        title: 'Success',
        description: 'Hours logged successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to log hours',
        variant: 'destructive',
      });
      throw error;
    }
  }, []);


  /**
   * Updates volunteer skills.
   * @param volunteerId - The ID of the volunteer.
   * @param skills - The skills to add to the volunteer.
   */
  const updateVolunteerSkills = useCallback(async (volunteerId: string, skills: Omit<Skill, 'id'>[]) => {
    try {
        // Real API call implementation
      // const response = await fetch(`/api/volunteers/${volunteerId}/skills`, {
      //   method: 'PATCH',
      //    body: JSON.stringify(skills),
      //    headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
       // if(!response.ok){
      //    const message = `An error has occured: ${response.status}`;
      //   throw new Error(message);
      // }
      // const data = await response.json()
      // data.forEach(skill =>  store.addSkill(volunteerId, skill));
      skills.forEach(skill => store.addSkill(volunteerId, skill)); // Local state update
      toast({
        title: 'Success',
        description: 'Skills updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update skills',
        variant: 'destructive',
      });
      throw error;
    }
  }, []);

  /**
   * Updates volunteer schedule.
   * @param volunteerId - The ID of the volunteer.
   * @param schedule - The updated schedule.
   */
  const updateVolunteerSchedule = useCallback(async (volunteerId: string, schedule: Schedule) => {
    try {
          // Real API call implementation
      // const response = await fetch(`/api/volunteers/${volunteerId}/schedule`, {
      //   method: 'PATCH',
      //   body: JSON.stringify(schedule),
      //    headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
       // if(!response.ok){
      //    const message = `An error has occured: ${response.status}`;
      //   throw new Error(message);
      // }
      // const data = await response.json()
       // store.updateAvailability(volunteerId, data);
        store.updateAvailability(volunteerId, schedule); // Local state update
      toast({
        title: 'Success',
        description: 'Schedule updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update schedule',
        variant: 'destructive',
      });
      throw error;
    }
  }, []);

  return {
    volunteers: store.volunteers,
    volunteer: currentVolunteer,
    isLoading,
    getVolunteer,
    registerVolunteer: useCallback(async (volunteerData: Omit<Volunteer, 'id' | 'createdAt' | 'updatedAt'>) => {
      setIsLoading(true);
      try {
        store.addVolunteer(volunteerData);
        toast({ title: 'Success', description: 'Volunteer registered successfully' });
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to register volunteer', variant: 'destructive' });
        throw error;
      } finally {
        setIsLoading(false);
      }
    }, [store.addVolunteer]),
    
    logVolunteerHours: useCallback(async (volunteerId: string, timeLog: Omit<TimeLog, 'id'>) => {
      try {
        store.addTimeLog(volunteerId, timeLog);
        toast({ title: 'Success', description: 'Hours logged successfully' });
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to log hours', variant: 'destructive' });
        throw error;
      }
    }, [store.addTimeLog]),

    updateVolunteerSkills: useCallback(async (volunteerId: string, skills: Omit<Skill, 'id'>[]) => {
      try {
        skills.forEach(skill => store.addSkill(volunteerId, skill));
        toast({ title: 'Success', description: 'Skills updated successfully' });
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to update skills', variant: 'destructive' });
        throw error;
      }
    }, [store.addSkill]),

    updateVolunteerSchedule: useCallback(async (volunteerId: string, schedule: Schedule) => {
      try {
        store.updateAvailability(volunteerId, schedule);
        toast({ title: 'Success', description: 'Schedule updated successfully' });
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to update schedule', variant: 'destructive' });
        throw error;
      }
    }, [store.updateAvailability])
  };
}