// stores/useDonationStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  Donation,
  DonationFrequency,
  Receipt,
  ImpactMetric,
  DonationAllocation,
} from '@/types/ngo/donation';

interface DonationState {
  donations: Donation[];
  isLoading: boolean;
  error: string | null;
}

interface DonationActions {
  initializeDonation: (donorInfo: Donation['donor']) => Donation;
  addDonation: (donation: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDonation: (id: string, updates: Partial<Donation>) => void;
  deleteDonation: (id: string) => void;
  generateReceipt: (donationId: string) => void;
  addImpactMetric: (donationId: string, metric: ImpactMetric) => void;
  updateAllocation: (donationId: string, allocation: DonationAllocation[]) => void;
  getDonationsByDonor: (donorId: string) => Donation[];
  getDonationsByProject: (projectId: string) => Donation[];
  getDonationStats: () => DonationStats;
  setError: (error: string | null) => void;
}

type DonationStats = {
  totalAmount: number;
  totalDonors: number;
  totalDonations: number;
  byFrequency: Record<DonationFrequency, number>;
};

export const useDonationStore = create<DonationState & DonationActions>()(
  persist(
    (set, get) => ({
      donations: [],
      isLoading: false,
      error: null,

      initializeDonation: (donorInfo) => {
         const newDonation: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>  = {
           donorId: uuidv4(),
           amount: 0,
           frequency: 'one_time',
           status: 'pending',
           donationDate: new Date().toISOString(),
           paymentMethod: '',
           currency: 'USD',
           allocation: [],
           impact: [],
           donor: donorInfo,
           date: '',
           anonymous: false
         };
          return {
           ...newDonation,
           id: uuidv4(),
              createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Donation;
      },

      addDonation: (donationData: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'> ) => {
        const newDonation: Donation = {
          ...get().initializeDonation(donationData.donor),
          ...donationData,
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          donations: [...state.donations, newDonation],
          error: null
        }));
      },

      updateDonation: (id, updates) => {
        set((state) => ({
          donations: state.donations.map((donation) =>
            donation.id === id
              ? {
                  ...donation,
                  ...updates,
                  updatedAt: new Date().toISOString()
                }
              : donation
          ),
          error: null
        }));
      },

      deleteDonation: (id) => {
        set((state) => ({
          donations: state.donations.filter((donation) => donation.id !== id),
          error: null
        }));
      },

      generateReceipt: (donationId) => {
        set((state) => ({
          donations: state.donations.map((donation) => {
            if (donation.id === donationId) {
              const receipt: Receipt = {
                id: uuidv4(),
                date: new Date().toISOString(),
                url: `/receipts/${donationId}.pdf`
              };
              return { ...donation, receipt };
            }
            return donation;
          })
        }));
      },

      addImpactMetric: (donationId, metric) => {
        set((state) => ({
          donations: state.donations.map((donation) => {
            if (donation.id === donationId) {
              return {
                ...donation,
                impact: [...(donation.impact || []), metric],
                updatedAt: new Date().toISOString()
              };
            }
            return donation;
          })
        }));
      },

      updateAllocation: (donationId, allocation) => {
        set((state) => ({
          donations: state.donations.map((donation) => {
            if (donation.id === donationId) {
              return {
                ...donation,
                allocation,
                updatedAt: new Date().toISOString()
              };
            }
            return donation;
          })
        }));
      },

      getDonationsByDonor: (donorId) => {
        return get().donations.filter((d) => d.donorId === donorId);
      },

      getDonationsByProject: (projectId) => {
        return get().donations.filter((d) => d.projectId === projectId);
      },

      getDonationStats: () => {
        const donations = get().donations;
        return {
          totalAmount: donations.reduce((sum, d) => sum + d.amount, 0),
          totalDonors: new Set(donations.map((d) => d.donorId)).size,
          totalDonations: donations.length,
          byFrequency: donations.reduce((acc, d) => {
            acc[d.frequency] = (acc[d.frequency] || 0) + 1;
            return acc;
          }, {} as Record<DonationFrequency, number>)
        };
      },

      setError: (error) => set({ error })
    }),
    {
      name: 'donation-store',
      partialize: (state) => ({
        donations: state.donations
      })
    }
  )
);