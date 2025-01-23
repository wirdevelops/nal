import { useState, useEffect } from 'react';
import {Order} from '@/types/store/order';
import { useOrderStore } from '@/stores/useOrderStore';

interface UseOrderHook {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
    addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  removeOrder: (id: string) => void;
  refreshOrders: () => void;
}

const useOrder = (): UseOrderHook => {
  const {
    orders,
    addOrder: addOrderStore,
    updateOrder: updateOrderStore,
    removeOrder: removeOrderStore,
    setOrders,
      isLoading,
      error,
    startLoading,
    stopLoading,
      setError,
  } = useOrderStore();

    // State to track if the initial load has been attempted
    const [initialLoadDone, setInitialLoadDone] = useState(false);
  const refreshOrders = async () => {
      startLoading();
   //    try {
        //  const ordersFromApi = await fetch('api/orders').then(res => res.json())
      //    if (ordersFromApi) {
      //        setOrders(ordersFromApi)
      //    }
        //} catch (err) {
      //    setError('Error refreshing orders');
   //   } finally {
           stopLoading();
    //  }
  };

    useEffect(() => {
      if (!initialLoadDone) {
           refreshOrders();
           setInitialLoadDone(true);
      }
   }, [initialLoadDone, refreshOrders])

  const addOrder = (order: Order) => {
      startLoading();
      addOrderStore(order);
       stopLoading();
  };

    const updateOrder = (id: string, updates: Partial<Order>) => {
      startLoading();
       updateOrderStore(id, updates);
      stopLoading();
  };
    const removeOrder = (id: string) => {
      startLoading();
        removeOrderStore(id);
        stopLoading();
    };

  return {
    orders,
    isLoading,
    error,
      addOrder,
    updateOrder,
      removeOrder,
    refreshOrders,
  };
};

export default useOrder;