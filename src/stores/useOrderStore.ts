import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order } from '@/types/store/order';

interface OrderState {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
}

interface OrderActions {
    addOrder: (order: Order) => void;
    updateOrder: (id: string, updates: Partial<Order>) => void;
    removeOrder: (id: string) => void;
    setOrders: (orders: Order[]) => void;
    startLoading: () => void;
    stopLoading: () => void;
    setError: (error: string | null) => void;
}
export const useOrderStore = create<OrderState & OrderActions>()(
    persist(
        (set) => ({
            orders: [],
            isLoading: false,
            error: null,
            addOrder: (order) => {
              set((state) => ({
                orders: [...state.orders, order],
                isLoading: false,
                error: null,
                }));
            },
            updateOrder: (id, updates) => {
              set((state) => ({
                orders: state.orders.map((order) =>
                  order.id === id ? { ...order, ...updates, updatedAt: new Date().toISOString() } : order
                ),
                isLoading: false,
                error: null,
              }));
            },
             removeOrder: (id) => {
                set((state) => ({
                    orders: state.orders.filter((order) => order.id !== id),
                    isLoading: false,
                    error: null,
                }));
            },
            setOrders: (orders) => {
                set({ orders, isLoading: false, error: null });
            },
            startLoading: () => set({ isLoading: true, error: null }),
            stopLoading: () => set({ isLoading: false }),
            setError: (error) => set({ isLoading: false, error }),
        }),
        {
            name: 'order-storage',
        }
    )
);
