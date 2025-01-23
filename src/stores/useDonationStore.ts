import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
    Donation,
    DonationFrequency,
    PaymentStatus,
    Receipt,
    ImpactMetric
  } from '@/types/ngo';


interface DonationState {
  donations: Donation[];
  isLoading: boolean;
  error: string | null;

  addDonation: (donation: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDonation: (id: string, updates: Partial<Donation>) => void;
  deleteDonation: (id: string) => void;
  generateReceipt: (donationId: string) => void;
  addImpactMetric: (donationId: string, metric: ImpactMetric) => void;
  getDonationsByDonor: (donorId: string) => Donation[];
  getDonationsByProject: (projectId: string) => Donation[];
  getDonationStats: () => {
    totalAmount: number;
    totalDonors: number;
    totalDonations: number;
    byFrequency: Record<DonationFrequency, number>;
  };
}

export const useDonationStore = create<DonationState>()(
  persist(
    (set, get) => ({
      donations: [],
      isLoading: false,
      error: null,

      addDonation: (donationData) => {
        const newDonation: Donation = {
          id: uuidv4(),
          ...donationData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          donations: [...state.donations, newDonation],
        }));
      },

      updateDonation: (id, updates) => {
        set((state) => ({
          donations: state.donations.map((donation) =>
            donation.id === id
              ? {
                  ...donation,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : donation
          ),
        }));
      },

      deleteDonation: (id) => {
        set((state) => ({
          donations: state.donations.filter((donation) => donation.id !== id),
        }));
      },

      generateReceipt: (donationId) => {
        set((state) => ({
          donations: state.donations.map((donation) =>
            donation.id === donationId
              ? {
                  ...donation,
                  receipt: {
                    id: uuidv4(),
                    date: new Date().toISOString(),
                    amount: donation.amount,
                    taxDeductible: true,
                    url: `/receipts/${donationId}.pdf`,
                  },
                  updatedAt: new Date().toISOString(),
                }
              : donation
          ),
        }));
      },

      addImpactMetric: (donationId, metric) => {
        set((state) => ({
          donations: state.donations.map((donation) =>
            donation.id === donationId
              ? {
                  ...donation,
                  impact: [...(donation.impact || []), metric],
                  updatedAt: new Date().toISOString(),
                }
              : donation
          ),
        }));
      },

      getDonationsByDonor: (donorId) => {
        return get().donations.filter((donation) => donation.donorId === donorId);
      },

      getDonationsByProject: (projectId) => {
        return get().donations.filter((donation) => donation.projectId === projectId);
      },
      
       getDonationStats: () => {
        const donations = get().donations;
        return {
          totalAmount: donations.reduce((sum, d) => sum + d.amount, 0),
          totalDonors: new Set(donations.map(d => d.donorId)).size,
          totalDonations: donations.length,
          byFrequency: donations.reduce((acc, d) => {
            acc[d.frequency] = (acc[d.frequency] || 0) + 1;
            return acc;
          }, {} as Record<DonationFrequency, number>)
        };
      },
    }),
    {
      name: 'donation-storage',
    }
  )
);
