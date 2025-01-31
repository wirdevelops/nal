import { useCallback } from 'react';
import { useOrderStore } from '@/stores/useOrderStore';
import type { LoyaltyProgram } from '@/types/store';
import { toast } from 'react-hot-toast';

interface UseLoyaltyHook {
  loyaltyProgram: LoyaltyProgram | null;
  isLoading: boolean;
  error: string | null;
  updatePoints: (points: number) => Promise<void>;
  redeemPoints: (points: number, reward: string) => Promise<void>;
  checkTierProgress: () => { currentTier: string; nextTier: string; pointsNeeded: number };
  getAvailableRewards: () => Promise<void>;
  transferPoints: (targetUserId: string, points: number) => Promise<void>;
  getPointsHistory: () => Promise<void>;
}

export function useLoyalty(): UseLoyaltyHook {
  const store = useOrderStore();

  const handleAsyncOperation = useCallback(async (
    operation: () => Promise<void>,
    errorMessage: string
  ) => {
    try {
      store.setLoading(true);
      await operation();
    } catch (error) {
      console.error(errorMessage, error);
      store.setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  const updatePoints = useCallback(async (points: number) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // await fetch('/api/loyalty/points', {
      //   method: 'POST',
      //   body: JSON.stringify({ points })
      // });
      store.updateLoyaltyPoints(points);
      toast.success(`${points > 0 ? 'Earned' : 'Deducted'} ${Math.abs(points)} points`);
    }, 'Failed to update points');
  }, [store, handleAsyncOperation]);

  const redeemPoints = useCallback(async (points: number, reward: string) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // await fetch('/api/loyalty/redeem', {
      //   method: 'POST',
      //   body: JSON.stringify({ points, reward })
      // });
      store.updateLoyaltyPoints(-points);
      toast.success(`Redeemed ${points} points for ${reward}`);
    }, 'Failed to redeem points');
  }, [store, handleAsyncOperation]);

  const checkTierProgress = useCallback(() => {
    const program = store.loyaltyProgram;
    if (!program) {
      return { currentTier: 'bronze', nextTier: 'silver', pointsNeeded: 200 };
    }

    const tiers = {
      bronze: { next: 'silver', threshold: 200 },
      silver: { next: 'gold', threshold: 500 },
      gold: { next: 'platinum', threshold: 1000 },
      platinum: { next: 'platinum', threshold: Infinity }
    };

    const currentTierInfo = tiers[program.tier as keyof typeof tiers];
    const pointsNeeded = currentTierInfo.threshold - program.points;

    return {
      currentTier: program.tier,
      nextTier: currentTierInfo.next,
      pointsNeeded: Math.max(0, pointsNeeded)
    };
  }, [store.loyaltyProgram]);

  const getAvailableRewards = useCallback(async () => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // const response = await fetch('/api/loyalty/rewards');
      // return await response.json();
    }, 'Failed to fetch rewards');
  }, [handleAsyncOperation]);

  const transferPoints = useCallback(async (targetUserId: string, points: number) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // await fetch('/api/loyalty/transfer', {
      //   method: 'POST',
      //   body: JSON.stringify({ targetUserId, points })
      // });
      store.updateLoyaltyPoints(-points);
      toast.success(`Transferred ${points} points`);
    }, 'Failed to transfer points');
  }, [store, handleAsyncOperation]);

  const getPointsHistory = useCallback(async () => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // const response = await fetch('/api/loyalty/history');
      // return await response.json();
    }, 'Failed to fetch points history');
  }, [handleAsyncOperation]);

  return {
    loyaltyProgram: store.loyaltyProgram,
    isLoading: store.isLoading,
    error: store.error,
    updatePoints,
    redeemPoints,
    checkTierProgress,
    getAvailableRewards,
    transferPoints,
    getPointsHistory
  };
}