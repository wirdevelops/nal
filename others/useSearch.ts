import { useCallback, useState } from 'react';
import { useProductStore } from '@/stores/useProductStore';
import { useOrderStore } from '@/stores/useOrderStore';
import type { Product, Order } from '@/types/store';

interface SearchResults {
  products: Product[];
  orders: Order[];
  totalResults: number;
}

interface UseSearchHook {
  results: SearchResults;
  isLoading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  searchOrders: (query: string) => Promise<void>;
  clearResults: () => void;
  getRecentSearches: () => string[];
  getSuggestions: (query: string) => Promise<string[]>;
}

export function useSearch(): UseSearchHook {
  const productStore = useProductStore();
  const orderStore = useOrderStore();
  const [results, setResults] = useState<SearchResults>({
    products: [],
    orders: [],
    totalResults: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsyncOperation = useCallback(async (
    operation: () => Promise<void>,
    errorMessage: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await operation();
    } catch (err) {
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const search = useCallback(async (query: string) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      // const data = await response.json();
      
      const products = productStore.products.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );
      
      const orders = orderStore.orders.filter(o => 
        o.id.toLowerCase().includes(query.toLowerCase())
      );

      setResults({
        products,
        orders,
        totalResults: products.length + orders.length
      });

      // Save to recent searches
      const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      searches.unshift(query);
      localStorage.setItem('recentSearches', JSON.stringify(
        Array.from(new Set(searches)).slice(0, 10)
      ));
    }, 'Search failed');
  }, [productStore.products, orderStore.orders, handleAsyncOperation]);

  const searchProducts = useCallback(async (query: string) => {
    await handleAsyncOperation(async () => {
      productStore.searchProducts(query);
      setResults(prev => ({
        ...prev,
        products: productStore.filteredProducts,
        totalResults: productStore.filteredProducts.length + prev.orders.length
      }));
    }, 'Product search failed');
  }, [productStore, handleAsyncOperation]);

  const searchOrders = useCallback(async (query: string) => {
    await handleAsyncOperation(async () => {
      orderStore.searchOrders(query);
      setResults(prev => ({
        ...prev,
        orders: orderStore.orders,
        totalResults: prev.products.length + orderStore.orders.length
      }));
    }, 'Order search failed');
  }, [orderStore, handleAsyncOperation]);

  const clearResults = useCallback(() => {
    setResults({
      products: [],
      orders: [],
      totalResults: 0
    });
  }, []);

  const getRecentSearches = useCallback(() => {
    return JSON.parse(localStorage.getItem('recentSearches') || '[]');
  }, []);

  const getSuggestions = useCallback(async (query: string) => {
    // Later: API integration
    // const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
    // return await response.json();
    
    const recentSearches = getRecentSearches();
    return recentSearches.filter(search => 
      search.toLowerCase().includes(query.toLowerCase())
    );
  }, [getRecentSearches]);

  return {
    results,
    isLoading,
    error,
    search,
    searchProducts,
    searchOrders,
    clearResults,
    getRecentSearches,
    getSuggestions
  };
}