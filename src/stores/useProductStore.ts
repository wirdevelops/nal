import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DigitalProduct, PhysicalProduct, Product, ProductCategory } from '@/types/store';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  searchIndex: Record<string, string[]>;
  isLoading: boolean;
  error: string | null;
  favoriteIds: string[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  hasNextPage: boolean;
  lastFetched: Record<string, Date>;
  staleTimeout: number;
  filters: {
    search: string;
    category: ProductCategory | null;
    priceRange: { min: number; max: number } | null;
    sortBy: 'price' | 'date' | 'popularity' | null;
  };
}

interface ProductActions {
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  setProducts: (products: Product[]) => void;
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: string | null) => void;
  toggleFavorite: (productId: string) => void;
  searchProducts: (query: string) => void;
  filterByCategory: (category: ProductCategory) => void;
  filterByPriceRange: (min: number, max: number) => void;
  sortProducts: (by: 'price' | 'date' | 'popularity') => void;
  resetFilters: () => void;
  loadNextPage: () => void;
  setItemsPerPage: (count: number) => void;
  invalidateCache: (productId?: string) => void;
  refreshProduct: (productId: string) => Promise<void>;
  batchUpdateProducts: (updates: Array<{id: string, changes: Partial<Product>}>) => void;
  batchRemoveProducts: (ids: string[]) => void;
  applyFilters: () => void;
}

function isPhysicalProduct(product: any): product is PhysicalProduct {
  return product?.type === 'physical';
}

function isDigitalProduct(product: any): product is DigitalProduct {
  return product?.type === 'digital';
}

function buildSearchIndex(product: Product): string[] {
  return [
    product.title,
    product.description,
    product.category,
    ...product.tags || [],
    isPhysicalProduct(product) ? product.brand : '',
    isPhysicalProduct(product) ? product.model : '',
    isDigitalProduct(product) ? product.fileType : '',
    ...(Object.values(product.metadata || {}))
      .filter(value => typeof value === 'string')
      .map(value => value as string)
  ].filter(Boolean).map(term => term.toLowerCase());
}

const INITIAL_STATE: Partial<ProductState> = {
  products: [],
  filteredProducts: [],
  searchIndex: {},
  isLoading: false,
  error: null,
  favoriteIds: [],
  currentPage: 1,
  itemsPerPage: 20,
  totalItems: 0,
  hasNextPage: false,
  lastFetched: {},
  staleTimeout: 5 * 60 * 1000,
  filters: {
    search: '',
    category: null,
    priceRange: null,
    sortBy: null
  }
};

function memoizedFilter(
  products: Product[], 
  filters: ProductState['filters'],
  searchIndex: Record<string, string[]>,
  favoriteIds: string[]
): Product[] {
  let filtered = [...products];

  if (filters.search) {
    const terms = filters.search.toLowerCase().split(' ');
    filtered = filtered.filter(product => 
      terms.every(term => 
        searchIndex[product.id].some(indexTerm => indexTerm.includes(term))
      )
    );
  }

  if (filters.category) {
    filtered = filtered.filter(p => p.category === filters.category);
  }

  if (filters.priceRange) {
    const { min, max } = filters.priceRange;
    filtered = filtered.filter(p => {
      const price = p.price || 0;
      return price >= min && price <= max;
    });
  }

  if (filters.sortBy) {
    filtered.sort((a, b) => {
      const aPrice = a.price || 0;
      const bPrice = b.price || 0;
      
      switch (filters.sortBy) {
        case 'price':
          return aPrice - bPrice;
        case 'date':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'popularity':
          return (favoriteIds.includes(b.id) ? 1 : 0) - 
                 (favoriteIds.includes(a.id) ? 1 : 0);
        default:
          return 0;
      }
    });
  }

  return filtered;
}

export const useProductStore = create<ProductState & ProductActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE as ProductState,

      addProduct: (product) => {
        set((state) => ({
          products: [...state.products, product],
          totalItems: state.totalItems + 1,
          lastFetched: { ...state.lastFetched, [product.id]: new Date() },
          searchIndex: { 
            ...state.searchIndex, 
            [product.id]: buildSearchIndex(product)
          }
        }));
        get().applyFilters();
      },

      updateProduct: (id, updates) => {
        set((state) => {
          const updatedProducts = state.products.map((product) => {
            if (product.id !== id) return product;
            
            const updatedProduct = {
              ...product,
              ...updates,
              updatedAt: new Date().toISOString()
            };
            
            const typed = isDigitalProduct(product) 
              ? updatedProduct as DigitalProduct 
              : updatedProduct as PhysicalProduct;
              
            return typed;
          });

          const updatedProduct = updatedProducts.find(p => p.id === id);
          return {
            products: updatedProducts,
            lastFetched: { ...state.lastFetched, [id]: new Date() },
            searchIndex: updatedProduct 
              ? { ...state.searchIndex, [id]: buildSearchIndex(updatedProduct) }
              : state.searchIndex
          };
        });
        get().applyFilters();
      },

      removeProduct: (id) => {
        set((state) => {
          const { [id]: _, ...restIndex } = state.searchIndex;
          const { [id]: __, ...restFetched } = state.lastFetched;
          
          return {
            products: state.products.filter(p => p.id !== id),
            totalItems: state.totalItems - 1,
            searchIndex: restIndex,
            lastFetched: restFetched
          };
        });
        get().applyFilters();
      },

      setProducts: (products) => {
        const lastFetched = products.reduce((acc, p) => ({
          ...acc,
          [p.id]: new Date()
        }), {});
        
        const searchIndex = products.reduce((acc, p) => ({
          ...acc,
          [p.id]: buildSearchIndex(p)
        }), {});
        
        set({
          products,
          totalItems: products.length,
          lastFetched,
          searchIndex
        });
        get().applyFilters();
      },

      startLoading: () => set({ isLoading: true, error: null }),
      stopLoading: () => set({ isLoading: false }),
      setError: (error) => set({ error, isLoading: false }),

      toggleFavorite: (productId) => {
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(productId)
            ? state.favoriteIds.filter(id => id !== productId)
            : [...state.favoriteIds, productId]
        }));
        get().applyFilters();
      },

      searchProducts: (query) => {
        set(state => ({
          filters: { ...state.filters, search: query },
          currentPage: 1
        }));
        get().applyFilters();
      },

      filterByCategory: (category) => {
        set(state => ({
          filters: { ...state.filters, category },
          currentPage: 1
        }));
        get().applyFilters();
      },

      filterByPriceRange: (min, max) => {
        set(state => ({
          filters: { ...state.filters, priceRange: { min, max } },
          currentPage: 1
        }));
        get().applyFilters();
      },

      sortProducts: (by) => {
        set(state => ({
          filters: { ...state.filters, sortBy: by },
          currentPage: 1
        }));
        get().applyFilters();
      },

      resetFilters: () => {
        set(state => ({
          filters: INITIAL_STATE.filters!,
          currentPage: 1,
        }));
        get().applyFilters(); // Trigger filtering after reset
      },

      loadNextPage: () => {
        set(state => ({
          currentPage: state.currentPage + 1,
          hasNextPage: state.filteredProducts.length > (state.currentPage + 1) * state.itemsPerPage
        }));
      },

      setItemsPerPage: (count) => {
        set(state => ({
          itemsPerPage: count,
          currentPage: 1,
          hasNextPage: state.filteredProducts.length > count
        }));
      },

      

      invalidateCache: (productId) => {
        if (productId) {
          set(state => ({
            lastFetched: { ...state.lastFetched, [productId]: undefined }
          }));
        } else {
          set({ lastFetched: {} });
        }
      },

      refreshProduct: async (productId) => {
        const state = get();
        const product = state.products.find(p => p.id === productId);
        if (!product) return;

        try {
          state.startLoading();
          // Implement your API call here
          // const updated = await api.getProduct(productId);
          // state.updateProduct(productId, updated);
        } catch (error) {
          state.setError(error instanceof Error ? error.message : 'Failed to refresh product');
        } finally {
          state.stopLoading();
        }
      },

      batchUpdateProducts: (updates) => {
        set(state => ({
          products: state.products.map(product => {
            const update = updates.find(u => u.id === product.id);
            if (!update) return product;

            const base = {
              ...product,
              ...update.changes,
              updatedAt: new Date().toISOString()
            };

            return isDigitalProduct(product)
              ? base as DigitalProduct
              : base as PhysicalProduct;
          }),
          lastFetched: updates.reduce((acc, u) => ({
            ...acc,
            [u.id]: new Date()
          }), state.lastFetched)
        }));
        get().applyFilters();
      },

      batchRemoveProducts: (ids) => {
        set(state => ({
          products: state.products.filter(p => !ids.includes(p.id)),
          totalItems: state.totalItems - ids.length,
          lastFetched: ids.reduce((acc, id) => ({
            ...acc,
            [id]: undefined
          }), state.lastFetched)
        }));
        get().applyFilters();
      },

      applyFilters: () => {
        const state = get();
        const filtered = memoizedFilter(
          state.products,
          state.filters,
          state.searchIndex,
          state.favoriteIds
        );
        
        const startIndex = (state.currentPage - 1) * state.itemsPerPage;
        const endIndex = startIndex + state.itemsPerPage;
        const paginatedResults = filtered.slice(startIndex, endIndex);
        
        set({
          filteredProducts: paginatedResults,
          totalItems: filtered.length,
          hasNextPage: filtered.length > endIndex
        });
      },
    }),
    {
      name: 'product-storage',
      partialize: (state) => ({
        products: state.products,
        favoriteIds: state.favoriteIds,
        itemsPerPage: state.itemsPerPage
      })
    }
  )
);