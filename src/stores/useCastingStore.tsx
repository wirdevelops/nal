// app/stores/useCastingStore.tsx
'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Define Types for our Casting Store

export type Member = {
  id: string;
  name: string;
  type: 'cast' | 'crew';
  role: string;
  department?: string;
  contact: string;
  notes?: string;
  imageUrl?: string;
  status?: 'Confirmed' | 'In Consideration' | 'Pending' | 'Active'
};

export type Audition = {
  id: string;
  role: string;
  date: Date | null;
  startTime: string;
  endTime: string;
  location: string;
  slotDuration: number;
  requirements?: string;
  applicants: string[];
  status?: 'Scheduled' | 'Completed' | 'Cancelled'
};

export type Applicant = {
    id: string;
    memberId: string;
    auditionId: string;
    resume?: string;
    demoReel?: string;
    video?: string;
    audio?: string;
    notes?: string;
    rating?: number
}

interface CastingState {
  members: Member[];
  auditions: Audition[];
  applicants: Applicant[];
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, updatedMember: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  addAudition: (audition: Omit<Audition, 'id' | 'applicants' | 'status'>) => void;
  updateAudition: (id: string, updatedAudition: Partial<Audition>) => void;
  deleteAudition: (id: string) => void;
  addApplicant: (applicant: Omit<Applicant, 'id'>) => void;
  updateApplicant: (id: string, updatedApplicant: Partial<Applicant>) => void;
  deleteApplicant: (id: string) => void;
}


export const useCastingStore = create<CastingState>((set) => ({
  members: [],
  auditions: [],
  applicants: [],
  addMember: (member) =>
    set((state) => ({
      members: [...state.members, { id: uuidv4(), ...member }],
    })),
  updateMember: (id, updatedMember) =>
    set((state) => ({
      members: state.members.map((member) =>
        member.id === id ? { ...member, ...updatedMember } : member
      ),
    })),
  deleteMember: (id) =>
      set((state) => ({
        members: state.members.filter((member) => member.id !== id),
    })),
    addAudition: (audition) =>
    set((state) => ({
        auditions: [...state.auditions, { id: uuidv4(), applicants: [], status: 'Scheduled', ...audition }],
    })),
    updateAudition: (id, updatedAudition) =>
        set((state) => ({
            auditions: state.auditions.map((audition) =>
            audition.id === id ? { ...audition, ...updatedAudition } : audition
            ),
        })),
    deleteAudition: (id) =>
        set((state) => ({
            auditions: state.auditions.filter((audition) => audition.id !== id),
    })),
    addApplicant: (applicant) =>
        set((state) => ({
            applicants: [...state.applicants, { id: uuidv4(), ...applicant }],
        })),
    updateApplicant: (id, updatedApplicant) =>
        set((state) => ({
            applicants: state.applicants.map((applicant) =>
            applicant.id === id ? { ...applicant, ...updatedApplicant } : applicant
            ),
        })),
    deleteApplicant: (id) =>
        set((state) => ({
            applicants: state.applicants.filter((applicant) => applicant.id !== id),
    })),
}));