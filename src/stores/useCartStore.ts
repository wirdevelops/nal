import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem, Coupon, ShippingOption } from '@/types/store';

interface CartState {
  cart: Cart | null;
  availableCoupons: Coupon[];
  shippingOptions: ShippingOption[];
  isLoading: boolean;
  error: string | null;
}

interface CartActions {
  // Cart Management
  addItemToCart: (productId: string, quantity: number, options?: Record<string, any>) => void;
  removeItemFromCart: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  updateItemOptions: (productId: string, options: Record<string, any>) => void;
  clearCart: () => void;
  
  // Coupon Management
  applyCoupon: (code: string) => void;
  removeCoupon: (code: string) => void;
  
  // Shipping Management
  setShippingOption: (option: ShippingOption) => void;
  
  // Gift Options
  setGiftOptions: (message?: string, giftWrap?: boolean) => void;
  
  // Cart Price Management
  lockPrice: (duration: number) => void;
  updateCartTotals: () => void;
  
  // UI State
  setCart: (cart: Cart) => void;
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: string | null) => void;
}

const calculateCartTotals = (cart: Cart): Cart => {
  if (!cart?.items?.length) {
    return {
      ...cart,
      subtotal: 0,
      discounts: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      updatedAt: new Date().toISOString()
    };
  }

  // Mock prices - replace with actual product prices from API/store
  const itemPrices: Record<string, number> = {
    'product1': 99.99,
    'product2': 149.99
  };

  let subtotal = cart.items.reduce((sum, item) => {
    const price = item.priceOverride || itemPrices[item.productId] || 0;
    return sum + (price * item.quantity);
  }, 0);

  const discounts = cart.appliedCoupons.reduce((total, coupon) => {
    switch (coupon.type) {
      case 'percentage':
        return total + (subtotal * (coupon.value / 100));
      case 'fixed':
        return total + coupon.value;
      case 'free_shipping':
        return total;
      default:
        return total;
    }
  }, 0);

  const shipping = cart.shippingOption?.price || 0;
  const taxRate = 0.10; // Replace with actual tax calculation
  const taxableAmount = subtotal - discounts;
  const tax = taxableAmount * taxRate;
  const total = subtotal - discounts + tax + shipping;

  return {
    ...cart,
    subtotal: parseFloat(subtotal.toFixed(2)),
    discounts: parseFloat(discounts.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    updatedAt: new Date().toISOString()
  };
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      cart: null,
      availableCoupons: [],
      shippingOptions: [],
      isLoading: false,
      error: null,

      addItemToCart: (productId, quantity, options) => {
        set((state) => {
          const existingItemIndex = state.cart?.items.findIndex(
            item => item.productId === productId
          );

          let updatedCart: Cart;

          if (state.cart) {
            if (existingItemIndex !== -1) {
              const updatedItems = [...state.cart.items];
              updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                quantity: updatedItems[existingItemIndex].quantity + quantity,
                options: { ...updatedItems[existingItemIndex].options, ...options }
              };
              updatedCart = { ...state.cart, items: updatedItems };
            } else {
              const newItem: CartItem = {
                productId,
                quantity,
                options,
                addedAt: new Date().toISOString()
              };
              updatedCart = { ...state.cart, items: [...state.cart.items, newItem] };
            }
          } else {
            updatedCart = {
              id: crypto.randomUUID(),
              userId: 'current-user',
              items: [{
                productId,
                quantity,
                options,
                addedAt: new Date().toISOString()
              }],
              appliedCoupons: [],
              subtotal: 0,
              discounts: 0,
              tax: 0,
              shipping: 0,
              total: 0,
              currency: 'USD',
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date().toISOString(),
              lastActiveAt: new Date().toISOString(),
              revision: 1
            };
          }

          return { cart: calculateCartTotals(updatedCart) };
        });
      },

      removeItemFromCart: (productId) => {
        set((state) => {
          if (!state.cart) return state;
          const updatedItems = state.cart.items.filter(
            item => item.productId !== productId
          );
          if (updatedItems.length === 0) {
            return { cart: null };
          }
          const updatedCart = { ...state.cart, items: updatedItems };
          return { cart: calculateCartTotals(updatedCart) };
        });
      },

      updateItemQuantity: (productId, quantity) => {
        set((state) => {
          if (!state.cart) return state;
          const updatedItems = state.cart.items.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          );
          const updatedCart = { ...state.cart, items: updatedItems };
          return { cart: calculateCartTotals(updatedCart) };
        });
      },

      updateItemOptions: (productId, options) => {
        set((state) => {
          if (!state.cart) return state;
          const updatedItems = state.cart.items.map(item =>
            item.productId === productId ? { ...item, options: { ...item.options, ...options } } : item
          );
          const updatedCart = { ...state.cart, items: updatedItems };
          return { cart: calculateCartTotals(updatedCart) };
        });
      },

      clearCart: () => set({ cart: null }),

      applyCoupon: (code) => {
        set((state) => {
          if (!state.cart) return state;
          const coupon = state.availableCoupons.find(c => c.code === code);
          if (!coupon) {
            set({ error: 'Invalid coupon code' });
            return state;
          }
          const updatedCart = {
            ...state.cart,
            appliedCoupons: [...state.cart.appliedCoupons, coupon]
          };
          return { cart: calculateCartTotals(updatedCart) };
        });
      },

      removeCoupon: (code) => {
        set((state) => {
          if (!state.cart) return state;
          const updatedCart = {
            ...state.cart,
            appliedCoupons: state.cart.appliedCoupons.filter(c => c.code !== code)
          };
          return { cart: calculateCartTotals(updatedCart) };
        });
      },

      setShippingOption: (option) => {
        set((state) => {
          if (!state.cart) return state;
          const updatedCart = { ...state.cart, shippingOption: option };
          return { cart: calculateCartTotals(updatedCart) };
        });
      },

      setGiftOptions: (message?, giftWrap?) => {
        set((state) => {
          if (!state.cart) return state;
          const updatedCart = {
            ...state.cart,
            giftMessage: message,
            giftWrap
          };
          return { cart: updatedCart };
        });
      },

      lockPrice: (duration) => {
        set((state) => {
          if (!state.cart) return state;
          const updatedCart = {
            ...state.cart,
            priceLockUntil: new Date(Date.now() + duration).toISOString()
          };
          return { cart: updatedCart };
        });
      },

      updateCartTotals: () => {
        set((state) => {
          if (!state.cart) return state;
          return { cart: calculateCartTotals(state.cart) };
        });
      },

      setCart: (cart) => set({ cart }),
      startLoading: () => set({ isLoading: true, error: null }),
      stopLoading: () => set({ isLoading: false }),
      setError: (error) => set({ isLoading: false, error })
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        cart: state.cart
      })
    }
  )
);