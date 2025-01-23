// stores/useProductStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DigitalProduct, PhysicalProduct, Product } from '@/types/store/product';

// Define the ProductState interface
interface ProductState {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    favoriteIds: string[]; // Added favoriteIds to handle favorite
}

// Define the ProductActions interface
interface ProductActions {
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    removeProduct: (id: string) => void;
    setProducts: (products: Product[]) => void;
    startLoading: () => void;
    stopLoading: () => void;
    setError: (error: string | null) => void;
     toggleFavorite: (productId: string) => void; // Added toggleFavorite
}

// Type guard functions
function isPhysicalProduct(product: any): product is PhysicalProduct {
    return product && product.type === 'physical';
}

function isDigitalProduct(product: any): product is DigitalProduct {
    return product && product.type === 'digital';
}

// Create the store by combining ProductState and ProductActions
export const useProductStore = create<ProductState & ProductActions>()(
    persist(
        (set) => ({
            products: [],
            isLoading: false,
            error: null,
            favoriteIds: [], // initial values
            addProduct: (product) => {
                set((state) => ({
                    products: [...state.products, product],
                    isLoading: false,
                    error: null,
                }));
            },
             updateProduct: (id: string, updates: Partial<Product>) => {
        set((state) => ({
          products: state.products.map((product) => {
            if (product.id === id) {
               if (isDigitalProduct(product)) {
                  return { ...product, ...updates, updatedAt: new Date().toISOString() } as DigitalProduct;
                }
                if (isPhysicalProduct(product)) {
                  return { ...product, ...updates, updatedAt: new Date().toISOString() } as PhysicalProduct;
                }
              
          }
            return product;
          }),
          isLoading: false,
          error: null,
        }));
      },
            removeProduct: (id) => {
                set((state) => ({
                    products: state.products.filter((product) => product.id !== id),
                    isLoading: false,
                    error: null,
                }));
            },
            setProducts: (products) => {
                set({ products, isLoading: false, error: null });
            },
            startLoading: () => set({ isLoading: true, error: null }),
            stopLoading: () => set({ isLoading: false }),
            setError: (error) => set({ isLoading: false, error }),
            toggleFavorite: (productId: string) => {
                set((state) => {
                  const isFavorite = state.favoriteIds.includes(productId);
                 
                  return {
                      favoriteIds: isFavorite
                          ? state.favoriteIds.filter((id) => id !== productId)
                          : [...state.favoriteIds, productId],
                  }
               });
            },
        }),
        {
            name: 'product-storage',
        }
    )
);