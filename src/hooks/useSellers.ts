
import { useState, useCallback } from 'react';
import type { SellerProfile } from '@/types/store';

export function useSellers() {
  const [sellers, setSellers] = useState<SellerProfile[]>(() => {
    const saved = localStorage.getItem('sellers');
    return saved ? JSON.parse(saved) : [];
  });

  const createSellerProfile = useCallback(async (userId: string, data: Partial<SellerProfile>) => {
    try {
      // TODO: Replace with API call
      const newSeller: SellerProfile = {
        id: crypto.randomUUID(),
        userId,
        description: '',
        contactEmail: '',
        rating: 0,
        totalSales: 0,
        joinedDate: new Date().toISOString(),
        verificationStatus: 'pending',
        paymentDetails: {},
        policies: {},
        ...data
      };

      const updatedSellers = [...sellers, newSeller];
      localStorage.setItem('sellers', JSON.stringify(updatedSellers));
      setSellers(updatedSellers);
      return newSeller;
    } catch (error) {
      console.error('Failed to create seller profile:', error);
      throw error;
    }
  }, [sellers]);

  return { sellers, createSellerProfile };
}