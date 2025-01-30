import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Order, 
  OrderItem, 
  PaymentMethodDetails, 
  Fulfillment,
  Wishlist,
  PriceAlert,
  LoyaltyProgram 
} from '@/types/store';

interface OrderState {
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
}

interface OrderActions {
  // Order Management
  createOrder: (items: OrderItem[], paymentDetails: PaymentMethodDetails) => Order;
  setOrders: (orders: Order[]) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  removeOrder: (id: string) => void;
  getOrderById: (id: string) => Order | null;
  
  // Order Processing
  processRefund: (orderId: string, amount: number, reason: string) => void;
  updateOrderStatus: (orderId: string, status: Order['returnStatus']) => void;
  updateFulfillment: (orderId: string, fulfillment: Fulfillment) => void;
  
  // Wishlist Management
  createWishlist: (shared?: boolean) => void;
  addToWishlist: (productId: string, wishlistId?: string) => void;
  removeFromWishlist: (productId: string, wishlistId?: string) => void;
  
  // Price Alerts
  setPriceAlert: (productId: string, targetPrice: number) => void;
  removePriceAlert: (productId: string) => void;
  
  // Loyalty Program
  updateLoyaltyPoints: (points: number) => void;
  
  // Filters & Search
  filterByStatus: (status: Order['returnStatus'] | null) => void;
  filterByDateRange: (start: Date, end: Date) => void;
  searchOrders: (query: string) => void;
  
  // UI State
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const calculateLoyaltyTier = (points: number): LoyaltyProgram['tier'] => {
  if (points >= 1000) return 'platinum';
  if (points >= 500) return 'gold';
  if (points >= 200) return 'silver';
  return 'bronze';
};

const calculateNextTierProgress = (points: number, tier: LoyaltyProgram['tier']): number => {
  const thresholds = {
    bronze: 200,
    silver: 500,
    gold: 1000,
    platinum: Infinity
  };
  const nextThreshold = thresholds[tier];
  return tier === 'platinum' ? 100 : (points / nextThreshold) * 100;
};

export const useOrderStore = create<OrderState & OrderActions>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,
      wishlists: [],
      priceAlerts: [],
      loyaltyProgram: null,
      isLoading: false,
      error: null,
      filters: {
        status: null,
        dateRange: null
      },

      // In the store implementation:
createOrder: (items, paymentDetails) => {
  const newOrder: Order = {
    id: crypto.randomUUID(),
    userId: 'current-user',
    date: new Date().toISOString(),
    total: 0, // Will be calculated from items
    items,
    appliedCoupons: [],
    currency: 'USD',
    priceLocked: true,
    paymentMethodDetails: paymentDetails
  };

  // Calculate actual total
  newOrder.total = items.reduce((sum, item) => 
    sum + (item.priceAtTime * item.quantity), 0
  );

  set(state => ({
    orders: [...state.orders, newOrder],
    currentOrder: newOrder
  }));
  
  return newOrder; // Return the created order
},

      setOrders: (orders) => set({ orders }),
      
      updateOrder: (id, updates) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === id
              ? { ...order, ...updates, updatedAt: new Date().toISOString() }
              : order
          )
        }));
      },

      removeOrder: (id) => {
        set(state => ({
          orders: state.orders.filter(order => order.id !== id),
          currentOrder: state.currentOrder?.id === id ? null : state.currentOrder
        }));
      },

      getOrderById: (id) => {
        return get().orders.find(order => order.id === id) || null;
      },

      processRefund: (orderId, amount, reason) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? {
                  ...order,
                  returnStatus: 'refunded',
                  refundAmount: amount,
                  cancellationReason: reason,
                  updatedAt: new Date().toISOString()
                }
              : order
          )
        }));
      },

      updateOrderStatus: (orderId, status) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { ...order, returnStatus: status, updatedAt: new Date().toISOString() }
              : order
          )
        }));
      },

      updateFulfillment: (orderId, fulfillment) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { ...order, fulfillment, updatedAt: new Date().toISOString() }
              : order
          )
        }));
      },

      createWishlist: (shared = false) => {
        const newWishlist: Wishlist = {
          id: crypto.randomUUID(),
          userId: 'current-user',
          items: [],
          shared,
          createdAt: new Date().toISOString()
        };
        
        set(state => ({
          wishlists: [...state.wishlists, newWishlist]
        }));
      },

      addToWishlist: (productId, wishlistId) => {
        set(state => {
          const targetWishlist = wishlistId 
            ? state.wishlists.find(w => w.id === wishlistId)
            : state.wishlists[0];
      
          if (!targetWishlist) {
            const newWishlist: Wishlist = {
              id: crypto.randomUUID(),
              userId: 'current-user',
              items: [productId],
              shared: false,
              createdAt: new Date().toISOString()
            };
            return { wishlists: [...state.wishlists, newWishlist] };
          }
      
          const uniqueItems = Array.from(new Set([...targetWishlist.items, productId]));
          
          return {
            wishlists: state.wishlists.map(wishlist =>
              wishlist.id === targetWishlist.id
                ? { ...wishlist, items: uniqueItems }
                : wishlist
            )
          };
        });
      },

      removeFromWishlist: (productId, wishlistId) => {
        set(state => ({
          wishlists: state.wishlists.map(wishlist =>
            (!wishlistId || wishlist.id === wishlistId)
              ? { ...wishlist, items: wishlist.items.filter(id => id !== productId) }
              : wishlist
          )
        }));
      },

      setPriceAlert: (productId, targetPrice) => {
        const newAlert: PriceAlert = {
          productId,
          userId: 'current-user',
          targetPrice,
          createdAt: new Date().toISOString()
        };
        
        set(state => ({
          priceAlerts: [...state.priceAlerts, newAlert]
        }));
      },

      removePriceAlert: (productId) => {
        set(state => ({
          priceAlerts: state.priceAlerts.filter(alert => alert.productId !== productId)
        }));
      },

      updateLoyaltyPoints: (points) => {
        set(state => {
          const currentPoints = (state.loyaltyProgram?.points || 0) + points;
          const tier = calculateLoyaltyTier(currentPoints);
          const nextTierProgress = calculateNextTierProgress(currentPoints, tier);

          return {
            loyaltyProgram: {
              userId: 'current-user',
              points: currentPoints,
              tier,
              nextTierProgress
            }
          };
        });
      },
      
      filterByStatus: (status) => {
        set(state => ({
          filters: { ...state.filters, status }
        }));
      },

      filterByDateRange: (start, end) => {
        set(state => ({
          filters: { ...state.filters, dateRange: { start, end } }
        }));
      },

      searchOrders: (query) => {
        const searchTerm = query.toLowerCase();
        set(state => {
          const filtered = state.orders.filter(order => 
            order.id.toLowerCase().includes(searchTerm) ||
            order.items.some(item => item.productId.toLowerCase().includes(searchTerm))
          );
          return { orders: filtered };
        });
      },

      setLoading: (loading) => set({ isLoading: loading, error: loading ? null : get().error }),
      setError: (error) => set({ error, isLoading: false })
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({
        orders: state.orders,
        wishlists: state.wishlists,
        priceAlerts: state.priceAlerts,
        loyaltyProgram: state.loyaltyProgram
      })
    }
  )
);