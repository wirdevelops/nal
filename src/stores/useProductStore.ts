import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  DigitalProduct, FilterState,
  PhysicalProduct,
  Product,
  ProductCategory,
} from '@/types/store'; 

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
  filters: FilterState;
}

const INITIAL_FILTERS: FilterState = {
  type: [],
  category: [],
  priceRange: [0, Number.MAX_SAFE_INTEGER],
  condition: [],
  inStock: undefined,
  sortBy: 'relevance',
  search: '',
};

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
  sortProducts: (
    by: 'relevance' | 'price-asc' | 'price-desc' | 'date' | 'popularity'
  ) => void;
  loadNextPage: () => void;
  setItemsPerPage: (count: number) => void;
  invalidateCache: (productId?: string) => void;
  refreshProduct: (productId: string) => Promise<void>;
  batchUpdateProducts: (
    updates: Array<{ id: string; changes: Partial<Product> }>
  ) => void;
  batchRemoveProducts: (ids: string[]) => void;
  applyFilters: () => void;

  decrementStock: (productId: string, quantity: number) => void;
  incrementStock: (productId: string, quantity: number) => void;
  validateStock: (productId: string, quantity: number) => boolean;

  setFilter: (filter: Partial<FilterState>) => void;
  resetFilters: () => void;
}


function isPhysicalProduct(product: Product): product is PhysicalProduct {
    return product?.type === 'physical';
}

function isDigitalProduct(product: Product): product is DigitalProduct {
  return product?.type === 'digital';
}


function buildSearchIndex(product: Product): string[] {
    return [
        product.title,
        product.description,
        product.category,
        ...(product.tags || []),
        isPhysicalProduct(product) ? product.brand : '',
        isPhysicalProduct(product) ? product.model : '',
        isDigitalProduct(product) ? product.fileType : '',
        ...(Object.values(product.metadata || {}))
            .filter(value => typeof value === 'string')
            .map(value => value as string)
    ].filter(Boolean).map(term => term.toLowerCase());
}



const INITIAL_STATE: ProductState = {
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
  filters: INITIAL_FILTERS,
};

function memoizedFilter(
  products: Product[],
  filters: FilterState,
  searchIndex: Record<string, string[]>,
  favoriteIds: string[]
): Product[] {
  let filtered = [...products];

  // Search filter
  if (filters.search) {
    const terms = filters.search.toLowerCase().split(' ');
    filtered = filtered.filter((product) =>
      terms.every((term) =>
        searchIndex[product.id].some((indexTerm) => indexTerm.includes(term))
      )
    );
  }

  // Type filter
  if (filters.type.length > 0) {
    filtered = filtered.filter((p) => filters.type.includes(p.type));
  }

  // Category filter
  if (filters.category.length > 0) {
    filtered = filtered.filter((p) => filters.category.includes(p.category));
  }

  // Price range filter
  filtered = filtered.filter(
    (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
  );

  // Condition filter
    if (filters.condition.length > 0) {
      filtered = filtered.filter((p) => {
        return isPhysicalProduct(p) && filters.condition.includes(p.condition)
      });
    }

  // Stock filter
    if (filters.inStock !== undefined) {
      filtered = filtered.filter((p) => {
        if (isPhysicalProduct(p)) {
          const inStock = p.inventory.stock > 0 || p.inventory.backorder;
          return filters.inStock ? inStock : !inStock;
        }
        return true; // Digital products always pass
      });
    }

  // Sorting
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'date':
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case 'popularity':
        return (favoriteIds.includes(b.id) ? 1 : 0) -
          (favoriteIds.includes(a.id) ? 1 : 0);
        case 'relevance':
            return 0; // Keep the original order if the filter is 'relevance'
      default:
        return 0;
    }
  });

  return filtered;
}

export const useProductStore = create<ProductState & ProductActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      addProduct: (product) => {
        set((state) => ({
          products: [...state.products, product],
          totalItems: state.totalItems + 1,
          lastFetched: { ...state.lastFetched, [product.id]: new Date() },
          searchIndex: {
            ...state.searchIndex,
            [product.id]: buildSearchIndex(product),
          },
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
              updatedAt: new Date().toISOString(),
            };
            
              const typed = isDigitalProduct(product) 
              ? updatedProduct as DigitalProduct 
              : updatedProduct as PhysicalProduct;
              
              return typed;
          });

          const updatedProduct = updatedProducts.find((p) => p.id === id);
          return {
            products: updatedProducts,
            lastFetched: { ...state.lastFetched, [id]: new Date() },
            searchIndex: updatedProduct
              ? { ...state.searchIndex, [id]: buildSearchIndex(updatedProduct) }
              : state.searchIndex,
          };
        });
        get().applyFilters();
      },

      removeProduct: (id) => {
        set((state) => {
          const { [id]: _, ...restIndex } = state.searchIndex;
          const { [id]: __, ...restFetched } = state.lastFetched;

          return {
            products: state.products.filter((p) => p.id !== id),
            totalItems: state.totalItems - 1,
            searchIndex: restIndex,
            lastFetched: restFetched,
          };
        });
        get().applyFilters();
      },

      setProducts: (products) => {
        const lastFetched = products.reduce(
          (acc, p) => ({
            ...acc,
            [p.id]: new Date(),
          }),
          {}
        );

          const searchIndex = products.reduce((acc, p) => ({
            ...acc,
            [p.id]: buildSearchIndex(p)
          }), {});

        set({
          products,
          totalItems: products.length,
          lastFetched,
          searchIndex,
        });
        get().applyFilters();
      },

      startLoading: () => set({ isLoading: true, error: null }),
      stopLoading: () => set({ isLoading: false }),
      setError: (error) => set({ error, isLoading: false }),

      toggleFavorite: (productId) => {
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(productId)
            ? state.favoriteIds.filter((id) => id !== productId)
            : [...state.favoriteIds, productId],
        }));
        get().applyFilters();
      },

      searchProducts: (query) => {
        set((state) => ({
          filters: { ...state.filters, search: query },
          currentPage: 1,
        }));
        get().applyFilters();
      },

      filterByCategory: (category: ProductCategory) => {
        set((state) => ({
            filters: { ...state.filters, category: [category] },
            currentPage: 1,
        }));
        get().applyFilters();
    },

      filterByPriceRange: (min, max) => {
        set((state) => ({
          filters: { ...state.filters, priceRange: [min, max] },
          currentPage: 1,
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

      loadNextPage: () => {
        set((state) => ({
          currentPage: state.currentPage + 1,
            hasNextPage:
            state.filteredProducts.length >
            (state.currentPage + 1) * state.itemsPerPage,
        }));
      },

      setItemsPerPage: (count) => {
        set((state) => ({
          itemsPerPage: count,
          currentPage: 1,
          hasNextPage: state.filteredProducts.length > count,
        }));
      },
      invalidateCache: (productId) => {
          set((state) => ({
              lastFetched: productId
                  ? { ...state.lastFetched, [productId]: undefined }
                  : {}
          }));
      },

      refreshProduct: async (productId) => {
        const state = get();
        const product = state.products.find((p) => p.id === productId);
        if (!product) return;

        try {
          state.startLoading();
          // Implement your API call here
          // const updated = await api.getProduct(productId);
          // state.updateProduct(productId, updated);
        } catch (error) {
          state.setError(
            error instanceof Error ? error.message : 'Failed to refresh product'
          );
        } finally {
          state.stopLoading();
        }
      },

      batchUpdateProducts: (updates) => {
          set((state) => ({
              products: state.products.map((product) => {
                  const update = updates.find((u) => u.id === product.id);
                  if (!update) return product;

                  const base = {
                      ...product,
                      ...update.changes,
                      updatedAt: new Date().toISOString(),
                  };

                  return isDigitalProduct(product)
                    ? base as DigitalProduct
                    : base as PhysicalProduct;
              }),
              lastFetched: updates.reduce(
                  (acc, u) => ({
                      ...acc,
                      [u.id]: new Date(),
                  }),
                  state.lastFetched
              ),
          }));
          get().applyFilters();
      },

      batchRemoveProducts: (ids) => {
          set((state) => ({
              products: state.products.filter((p) => !ids.includes(p.id)),
              totalItems: state.totalItems - ids.length,
              lastFetched: ids.reduce(
                  (acc, id) => ({
                      ...acc,
                      [id]: undefined,
                  }),
                  state.lastFetched
              ),
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
        
        set({
          filteredProducts: filtered.slice(startIndex, endIndex),
          totalItems: filtered.length,
            hasNextPage: filtered.length > endIndex,
        });
      },

        setFilter: (filter) => {
            set((state) => ({
              filters: { ...state.filters, ...filter },
              currentPage: 1,
            }));
            get().applyFilters();
      },
      resetFilters: () => {
        set({ filters: INITIAL_FILTERS, currentPage: 1 });
        get().applyFilters();
      },

        decrementStock: (productId, quantity) => {
            set((state) => ({
              products: state.products.map((product) => {
                if (
                    product.id !== productId ||
                    !isPhysicalProduct(product)
                    )
                return product;

                const newStock = Math.max(0, product.inventory.stock - quantity);
                return {
                    ...product,
                  inventory: {
                    ...product.inventory,
                      stock: newStock,
                      backorder: newStock <= 0 ? true : product.inventory.backorder,
                  },
                };
              }),
            }));
            get().applyFilters();
        },

      incrementStock: (productId, quantity) => {
          set((state) => ({
            products: state.products.map((product) => {
                if (product.id !== productId || !isPhysicalProduct(product))
                    return product;

                return {
                  ...product,
                    inventory: {
                      ...product.inventory,
                        stock: product.inventory.stock + quantity,
                        backorder: false,
                    },
                };
            }),
        }));
        get().applyFilters();
        },

        validateStock: (productId, quantity) => {
          const product = get().products.find((p) => p.id === productId);
          if (!product || !isPhysicalProduct(product)) return false;
          
            return product.inventory.stock >= quantity ||
                (product.inventory.backorder && !!product.inventory.restockDate);
      },
    }),
    {
      name: 'product-storage',
      partialize: (state) => ({
        products: state.products,
        favoriteIds: state.favoriteIds,
        itemsPerPage: state.itemsPerPage,
      }),
    }
  )
);
