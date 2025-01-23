import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface CartItem {
  productId: string;
  quantity: number;
  options?: Record<string, any>;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  couponCode?: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  updatedAt: string;
}


interface CartState {
    cart: Cart | null;
    isLoading: boolean;
    error: string | null;
}

interface CartActions {
  addItemToCart: (productId: string, quantity: number, options?: Record<string, any>) => void;
  removeItemFromCart: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
    setCart: (cart: Cart) => void;
    startLoading: () => void;
    stopLoading: () => void;
    setError: (error: string | null) => void;
  updateCartTotals: () => void;
}

const calculateCartTotals = (cart: Cart): Cart => {
    if (!cart || !cart.items) {
        return { ...cart, subtotal: 0, tax: 0, shipping: 0, total: 0, updatedAt: new Date().toISOString()}
      }
        let subtotal = 0;
        // placeholder for item prices, replace with your logic
        const itemPrices: Record<string, number> = {
             'product1': 10,
            'product2': 20,
            'product3': 30,
        };
        for (const item of cart.items) {
            const itemPrice = itemPrices[item.productId] || 0;
            subtotal += itemPrice * item.quantity
        }

    const taxRate = 0.10;
    const shippingCost = subtotal > 0 ? 5 : 0;
    const tax = subtotal * taxRate;
    const total = subtotal + tax + shippingCost;

    return {
        ...cart,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shippingCost.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      updatedAt: new Date().toISOString(),
    };
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      cart: null,
        isLoading: false,
        error: null,

      addItemToCart: (productId, quantity, options) => {
          set((state) => {
              const newItem: CartItem = { productId, quantity, options };
            const updatedCart = state.cart
              ? { ...state.cart, items: [...state.cart.items, newItem] }
              : {id: Date.now().toString(), userId: 'test', items: [newItem], subtotal: 0, tax: 0, shipping: 0, total: 0, updatedAt: new Date().toISOString()};

             const calculatedCart = calculateCartTotals(updatedCart)

            return { cart: calculatedCart, isLoading: false, error: null };
          });
        },
      removeItemFromCart: (productId) => {
        set((state) => {
          if (!state.cart) return state;
          const updatedItems = state.cart.items.filter((item) => item.productId !== productId);
          const updatedCart = { ...state.cart, items: updatedItems };
            const calculatedCart = calculateCartTotals(updatedCart)
          return {cart: calculatedCart,  isLoading: false, error: null};
        });
      },
      updateItemQuantity: (productId, quantity) => {
            set((state) => {
                if(!state.cart) return state;
                const updatedItems = state.cart.items.map((item) => {
                if (item.productId === productId) {
                  return { ...item, quantity: quantity };
                }
                  return item;
              });
                const updatedCart = { ...state.cart, items: updatedItems };
              const calculatedCart = calculateCartTotals(updatedCart)
              return {cart: calculatedCart, isLoading: false, error: null};
            });
      },
      clearCart: () => {
        set({ cart: null, isLoading: false, error: null });
      },
        setCart: (cart) => set({ cart, isLoading: false, error: null }),
        startLoading: () => set({ isLoading: true, error: null }),
        stopLoading: () => set({ isLoading: false }),
        setError: (error) => set({ isLoading: false, error }),
      updateCartTotals: () => {
            set((state) => {
             if (!state.cart) return state;
                const updatedCart = calculateCartTotals(state.cart);
                return {cart: updatedCart, isLoading: false, error: null }
            })
       }

    }),
    {
      name: 'cart-storage',
    }
  )
);