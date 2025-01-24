import { useState, useEffect, useCallback } from 'react';
import type { 
  Order, 
  OrderItem, 
  PaymentMethodDetails, 
  Fulfillment,
  Wishlist,
  PriceAlert,
  LoyaltyProgram 
} from '@/types/store';
import { useOrderStore } from '@/stores/useOrderStore';

interface UseOrderHook {
  orders: Order[];
  currentOrder: Order | null;
  wishlists: Wishlist[];
  priceAlerts: PriceAlert[];
  loyaltyProgram: LoyaltyProgram | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: Order['returnStatus'] | null;
    dateRange: { start: Date; end: Date } | null;
  };
  
  // Order Management
  createOrder: (items: OrderItem[], paymentDetails: PaymentMethodDetails) => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  removeOrder: (id: string) => Promise<void>;
  getOrderById: (id: string) => Order | null;
  
  // Order Processing
  processRefund: (orderId: string, amount: number, reason: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['returnStatus']) => Promise<void>;
  updateFulfillment: (orderId: string, fulfillment: Fulfillment) => Promise<void>;
  
  // Wishlist Management
  createWishlist: (shared?: boolean) => Promise<void>;
  addToWishlist: (productId: string, wishlistId?: string) => Promise<void>;
  removeFromWishlist: (productId: string, wishlistId?: string) => Promise<void>;
  
  // Price Alerts
  setPriceAlert: (productId: string, targetPrice: number) => Promise<void>;
  removePriceAlert: (productId: string) => Promise<void>;
  
  // Loyalty Program
  updateLoyaltyPoints: (points: number) => Promise<void>;
  
  // Filters & Search
  filterByStatus: (status: Order['returnStatus'] | null) => void;
  filterByDateRange: (start: Date, end: Date) => void;
  searchOrders: (query: string) => void;
  
  // Data Management
  refreshOrders: () => Promise<void>;
}

const useOrder = (): UseOrderHook => {
  const store = useOrderStore();
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const handleAsyncOperation = useCallback(async (
    operation: () => Promise<void> | void,
    errorMessage: string
  ) => {
    try {
      store.setLoading(true);
      await operation();
    } catch (err) {
      store.setError(err instanceof Error ? err.message : errorMessage);
      throw err;
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  const refreshOrders = useCallback(async () => {
    await handleAsyncOperation(async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const ordersData = await response.json();
        store.setOrders(ordersData);
      } catch (error) {
        throw new Error('Failed to refresh orders');
      }
    }, 'Error refreshing orders');
  }, [handleAsyncOperation, store]);

  useEffect(() => {
    if (!initialLoadDone) {
      refreshOrders().finally(() => setInitialLoadDone(true));
    }
  }, [initialLoadDone, refreshOrders]);

  const createOrder = useCallback(async (
    items: OrderItem[],
    paymentDetails: PaymentMethodDetails
  ) => {
    await handleAsyncOperation(async () => {
      await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({ items, paymentDetails })
      });
      store.createOrder(items, paymentDetails);
    }, 'Error creating order');
  }, [handleAsyncOperation, store]);

  const updateOrder = useCallback(async (
    id: string,
    updates: Partial<Order>
  ) => {
    await handleAsyncOperation(async () => {
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      store.updateOrder(id, updates);
    }, 'Error updating order');
  }, [handleAsyncOperation, store]);

  const removeOrder = useCallback(async (id: string) => {
    await handleAsyncOperation(async () => {
      await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      store.removeOrder(id);
    }, 'Error removing order');
  }, [handleAsyncOperation, store]);

  const processRefund = useCallback(async (
    orderId: string,
    amount: number,
    reason: string
  ) => {
    await handleAsyncOperation(async () => {
      await fetch(`/api/orders/${orderId}/refund`, {
        method: 'POST',
        body: JSON.stringify({ amount, reason })
      });
      store.processRefund(orderId, amount, reason);
    }, 'Error processing refund');
  }, [handleAsyncOperation, store]);

  const updateOrderStatus = useCallback(async (
    orderId: string,
    status: Order['returnStatus']
  ) => {
    await handleAsyncOperation(async () => {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      store.updateOrderStatus(orderId, status);
    }, 'Error updating order status');
  }, [handleAsyncOperation, store]);

  const updateFulfillment = useCallback(async (
    orderId: string,
    fulfillment: Fulfillment
  ) => {
    await handleAsyncOperation(async () => {
      await fetch(`/api/orders/${orderId}/fulfillment`, {
        method: 'PATCH',
        body: JSON.stringify(fulfillment)
      });
      store.updateFulfillment(orderId, fulfillment);
    }, 'Error updating fulfillment');
  }, [handleAsyncOperation, store]);

  const createWishlist = useCallback(async (shared = false) => {
    await handleAsyncOperation(async () => {
      await fetch('/api/wishlists', {
        method: 'POST',
        body: JSON.stringify({ shared })
      });
      store.createWishlist(shared);
    }, 'Error creating wishlist');
  }, [handleAsyncOperation, store]);

  const addToWishlist = useCallback(async (
    productId: string,
    wishlistId?: string
  ) => {
    await handleAsyncOperation(async () => {
      await fetch(`/api/wishlists/${wishlistId || 'default'}/items`, {
        method: 'POST',
        body: JSON.stringify({ productId })
      });
      store.addToWishlist(productId, wishlistId);
    }, 'Error adding to wishlist');
  }, [handleAsyncOperation, store]);

  const removeFromWishlist = useCallback(async (
    productId: string,
    wishlistId?: string
  ) => {
    await handleAsyncOperation(async () => {
      await fetch(`/api/wishlists/${wishlistId || 'default'}/items/${productId}`, {
        method: 'DELETE'
      });
      store.removeFromWishlist(productId, wishlistId);
    }, 'Error removing from wishlist');
  }, [handleAsyncOperation, store]);

  const setPriceAlert = useCallback(async (
    productId: string,
    targetPrice: number
  ) => {
    await handleAsyncOperation(async () => {
      await fetch('/api/price-alerts', {
        method: 'POST',
        body: JSON.stringify({ productId, targetPrice })
      });
      store.setPriceAlert(productId, targetPrice);
    }, 'Error setting price alert');
  }, [handleAsyncOperation, store]);

  const removePriceAlert = useCallback(async (productId: string) => {
    await handleAsyncOperation(async () => {
      await fetch(`/api/price-alerts/${productId}`, { method: 'DELETE' });
      store.removePriceAlert(productId);
    }, 'Error removing price alert');
  }, [handleAsyncOperation, store]);

  const updateLoyaltyPoints = useCallback(async (points: number) => {
    await handleAsyncOperation(async () => {
      await fetch('/api/loyalty/points', {
        method: 'POST',
        body: JSON.stringify({ points })
      });
      store.updateLoyaltyPoints(points);
    }, 'Error updating loyalty points');
  }, [handleAsyncOperation, store]);

  return {
    orders: store.orders,
    currentOrder: store.currentOrder,
    wishlists: store.wishlists,
    priceAlerts: store.priceAlerts,
    loyaltyProgram: store.loyaltyProgram,
    isLoading: store.isLoading,
    error: store.error,
    filters: store.filters,
    createOrder,
    updateOrder,
    removeOrder,
    getOrderById: store.getOrderById,
    processRefund,
    updateOrderStatus,
    updateFulfillment,
    createWishlist,
    addToWishlist,
    removeFromWishlist,
    setPriceAlert,
    removePriceAlert,
    updateLoyaltyPoints,
    filterByStatus: store.filterByStatus,
    filterByDateRange: store.filterByDateRange,
    searchOrders: store.searchOrders,
    refreshOrders
  };
};

export default useOrder;