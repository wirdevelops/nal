import { useEffect, useState } from 'react';
import { useCartStore, Cart, CartItem } from '@/stores/useCartStore';

interface UseCartHook {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addItem: (productId: string, quantity: number, options?: Record<string, any>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  refreshCart: () => void;
}

const useCart = (): UseCartHook => {
  const {
    cart,
      isLoading,
      error,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearCart,
    setCart,
      startLoading,
      stopLoading,
      setError,
      updateCartTotals,
  } = useCartStore();
  
  // State to track if the initial load has been attempted
  const [initialLoadDone, setInitialLoadDone] = useState(false);


  // Function to refresh cart data from API
  const refreshCart = async () => {
      startLoading();
     // try {
          //   const cartFromApi = await fetch('api/cart').then(res => res.json()) // Replace with your API endpoint
          // if (cartFromApi) {
              //    setCart(cartFromApi);
              //   }
      //} catch (err) {
         // setError('Error refreshing the cart')
     //} finally {
          stopLoading();
    //}
        updateCartTotals();
  };

  // Fetch initial cart data on mount (only once), using state to avoid infinite loop on local storage update.
  useEffect(() => {
      if (!initialLoadDone) {
      refreshCart();
       setInitialLoadDone(true);
      }
  }, [initialLoadDone, refreshCart]);


  const addItem = (productId: string, quantity: number, options?: Record<string, any>) => {
      startLoading();
       addItemToCart(productId, quantity, options);
    //  updateCartTotals(); This call is not needed since it is already done in the addItemToCart Action
    stopLoading();
   
  };

  const removeItem = (productId: string) => {
     startLoading();
    removeItemFromCart(productId);
    // updateCartTotals() This call is not needed since it is already done in the removeItemFromCart Action
      stopLoading();
  };

  const updateQuantity = (productId: string, quantity: number) => {
     startLoading();
    updateItemQuantity(productId, quantity);
    // updateCartTotals() This call is not needed since it is already done in the updateItemQuantity Action
     stopLoading();
  };

  const clear = () => {
      startLoading();
    clearCart();
     stopLoading();
  };


  return {
    cart,
    isLoading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    refreshCart,
  };
};

export default useCart;