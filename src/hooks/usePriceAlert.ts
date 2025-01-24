import { useCallback } from 'react';
import { useOrderStore } from '@/stores/useOrderStore';
import type { PriceAlert } from '@/types/store';
import { toast } from 'react-hot-toast';

interface UsePriceAlertHook {
  priceAlerts: PriceAlert[];
  isLoading: boolean;
  error: string | null;
  setPriceAlert: (productId: string, targetPrice: number) => Promise<void>;
  removePriceAlert: (productId: string) => Promise<void>;
  updatePriceAlert: (productId: string, targetPrice: number) => Promise<void>;
  getActiveAlerts: () => PriceAlert[];
  checkPriceAlerts: () => Promise<void>;
  batchUpdateAlerts: (updates: Array<{ productId: string; targetPrice: number }>) => Promise<void>;
}

export function usePriceAlert(): UsePriceAlertHook {
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

  const setPriceAlert = useCallback(async (productId: string, targetPrice: number) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // await fetch('/api/price-alerts', {
      //   method: 'POST',
      //   body: JSON.stringify({ productId, targetPrice })
      // });
      store.setPriceAlert(productId, targetPrice);
      toast.success('Price alert set');
    }, 'Failed to set price alert');
  }, [store, handleAsyncOperation]);

  const removePriceAlert = useCallback(async (productId: string) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // await fetch(`/api/price-alerts/${productId}`, {
      //   method: 'DELETE'
      // });
      store.removePriceAlert(productId);
      toast.success('Price alert removed');
    }, 'Failed to remove price alert');
  }, [store, handleAsyncOperation]);

  const updatePriceAlert = useCallback(async (productId: string, targetPrice: number) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // await fetch(`/api/price-alerts/${productId}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ targetPrice })
      // });
      store.removePriceAlert(productId);
      store.setPriceAlert(productId, targetPrice);
      toast.success('Price alert updated');
    }, 'Failed to update price alert');
  }, [store, handleAsyncOperation]);

  const getActiveAlerts = useCallback(() => {
    return store.priceAlerts.filter(alert => {
      const now = new Date();
      return new Date(alert.createdAt) <= now;
    });
  }, [store.priceAlerts]);

  const checkPriceAlerts = useCallback(async () => {
    await handleAsyncOperation(async () => {
      // Later: API integration to check current prices against alerts
      // const response = await fetch('/api/price-alerts/check');
      // const triggeredAlerts = await response.json();
      // triggeredAlerts.forEach(alert => {
      //   toast.success(`Price alert triggered for product ${alert.productId}`);
      // });
    }, 'Failed to check price alerts');
  }, [handleAsyncOperation]);

  const batchUpdateAlerts = useCallback(async (
    updates: Array<{ productId: string; targetPrice: number }>
  ) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // await fetch('/api/price-alerts/batch', {
      //   method: 'PATCH',
      //   body: JSON.stringify({ updates })
      // });
      updates.forEach(({ productId, targetPrice }) => {
        store.removePriceAlert(productId);
        store.setPriceAlert(productId, targetPrice);
      });
      toast.success('Price alerts updated');
    }, 'Failed to update price alerts');
  }, [store, handleAsyncOperation]);

  return {
    priceAlerts: store.priceAlerts,
    isLoading: store.isLoading,
    error: store.error,
    setPriceAlert,
    removePriceAlert,
    updatePriceAlert,
    getActiveAlerts,
    checkPriceAlerts,
    batchUpdateAlerts
  };
}