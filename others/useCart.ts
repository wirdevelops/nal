import { useEffect, useState, useCallback } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import type { Cart, ShippingOption } from '@/types/store';

interface UseCartHook {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addItem: (productId: string, quantity: number, options?: Record<string, any>) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  updateItemOptions: (productId: string, options: Record<string, any>) => Promise<void>;
  clear: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: (code: string) => Promise<void>;
  setShippingOption: (option: ShippingOption) => Promise<void>;
  setGiftOptions: (message?: string, giftWrap?: boolean) => Promise<void>;
  refreshCart: () => Promise<void>;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscounts: () => number;
  getTotal: () => number;
}

const useCart = (): UseCartHook => {
  const {
    cart,
    isLoading,
    error,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    updateItemOptions: updateOptions,
    clearCart,
    setCart,
    applyCoupon: applyCartCoupon,
    removeCoupon: removeCartCoupon,
    setShippingOption: setCartShipping,
    setGiftOptions: setCartGiftOptions,
    startLoading,
    stopLoading,
    setError
  } = useCartStore();

  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const handleAsyncOperation = useCallback(async (
    operation: () => Promise<void> | void,
    errorMessage: string
  ) => {
    try {
      startLoading();
      await operation();
    } catch (err) {
      setError(err instanceof Error ? err.message : errorMessage);
      throw err;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, setError]);

  const refreshCart = useCallback(async () => {
    await handleAsyncOperation(async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Failed to fetch cart');
        const cartData = await response.json();
        setCart(cartData);
      } catch (error) {
        throw new Error('Failed to refresh cart');
      }
    }, 'Error refreshing cart');
  }, [handleAsyncOperation, setCart]);

  useEffect(() => {
    if (!initialLoadDone) {
      refreshCart().finally(() => setInitialLoadDone(true));
    }
  }, [initialLoadDone, refreshCart]);

  const addItem = useCallback(async (
    productId: string,
    quantity: number,
    options?: Record<string, any>
  ) => {
    await handleAsyncOperation(async () => {
      await fetch('/api/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, options })
      });
      addItemToCart(productId, quantity, options);
    }, 'Error adding item to cart');
  }, [handleAsyncOperation, addItemToCart]);

  const removeItem = useCallback(async (productId: string) => {
    await handleAsyncOperation(async () => {
      await fetch(`/api/cart/items/${productId}`, { method: 'DELETE' });
      removeItemFromCart(productId);
    }, 'Error removing item from cart');
  }, [handleAsyncOperation, removeItemFromCart]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    await handleAsyncOperation(async () => {
      await fetch(`/api/cart/items/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity })
      });
      updateItemQuantity(productId, quantity);
    }, 'Error updating item quantity');
  }, [handleAsyncOperation, updateItemQuantity]);

  const updateItemOptions = useCallback(async (
    productId: string,
    options: Record<string, any>
  ) => {
    await handleAsyncOperation(async () => {
      await fetch(`/api/cart/items/${productId}/options`, {
        method: 'PATCH',
        body: JSON.stringify({ options })
      });
      updateOptions(productId, options);
    }, 'Error updating item options');
  }, [handleAsyncOperation, updateOptions]);

  const clear = useCallback(async () => {
    await handleAsyncOperation(async () => {
      await fetch('/api/cart', { method: 'DELETE' });
      clearCart();
    }, 'Error clearing cart');
  }, [handleAsyncOperation, clearCart]);

  const applyCoupon = useCallback(async (code: string) => {
    await handleAsyncOperation(async () => {
      await fetch('/api/cart/coupons', {
        method: 'POST',
        body: JSON.stringify({ code })
      });
      applyCartCoupon(code);
    }, 'Error applying coupon');
  }, [handleAsyncOperation, applyCartCoupon]);

  const removeCoupon = useCallback(async (code: string) => {
    await handleAsyncOperation(async () => {
      await fetch(`/api/cart/coupons/${code}`, { method: 'DELETE' });
      removeCartCoupon(code);
    }, 'Error removing coupon');
  }, [handleAsyncOperation, removeCartCoupon]);

  const setShippingOption = useCallback(async (option: ShippingOption) => {
    await handleAsyncOperation(async () => {
      await fetch('/api/cart/shipping', {
        method: 'PUT',
        body: JSON.stringify(option)
      });
      setCartShipping(option);
    }, 'Error setting shipping option');
  }, [handleAsyncOperation, setCartShipping]);

  const setGiftOptions = useCallback(async (message?: string, giftWrap?: boolean) => {
    await handleAsyncOperation(async () => {
      await fetch('/api/cart/gift-options', {
        method: 'PUT',
        body: JSON.stringify({ message, giftWrap })
      });
      setCartGiftOptions(message, giftWrap);
    }, 'Error setting gift options');
  }, [handleAsyncOperation, setCartGiftOptions]);

  const getTotalItems = useCallback(() => 
    cart?.items.reduce((total, item) => total + item.quantity, 0) || 0,
  [cart?.items]);

  const getSubtotal = useCallback(() => cart?.subtotal || 0, [cart?.subtotal]);
  const getDiscounts = useCallback(() => cart?.discounts || 0, [cart?.discounts]);
  const getTotal = useCallback(() => cart?.total || 0, [cart?.total]);

  return {
    cart,
    isLoading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    updateItemOptions,
    clear,
    applyCoupon,
    removeCoupon,
    setShippingOption,
    setGiftOptions,
    refreshCart,
    getTotalItems,
    getSubtotal,
    getDiscounts,
    getTotal
  };
};

export default useCart;