import { useCallback, useState } from 'react';
import type { ProductCategory } from '@/types/store';
import { toast } from 'react-hot-toast';

interface CategoryStats {
  count: number;
  averagePrice: number;
  topSellers: string[];
}

interface UseCategories {
  categories: ProductCategory[];
  selectedCategory: ProductCategory | null;
  isLoading: boolean;
  error: string | null;
  getCategoryStats: (category: ProductCategory) => Promise<CategoryStats>;
  selectCategory: (category: ProductCategory) => void;
  getSubcategories: (category: ProductCategory) => Promise<ProductCategory[]>;
  getCategoryProducts: (category: ProductCategory, page?: number) => Promise<void>;
  getTopCategories: (limit?: number) => Promise<ProductCategory[]>;
  getCategoryBreadcrumb: (category: ProductCategory) => string[];
}

export function useCategories(): UseCategories {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories] = useState<ProductCategory[]>([
    'cameras', 'lenses', 'lighting', 'audio', 'accessories',
    'presets', 'luts', 'templates', 'scripts', 'plugins'
  ]);

  const handleAsyncOperation = useCallback(async (
    operation: () => Promise<any>,
    errorMessage: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await operation();
      return result;
    } catch (err) {
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectCategory = useCallback((category: ProductCategory) => {
    setSelectedCategory(category);
  }, []);

  const getCategoryStats = useCallback(async (category: ProductCategory): Promise<CategoryStats> => {
    return handleAsyncOperation(async () => {
      // Later: API integration
      // const response = await fetch(`/api/categories/${category}/stats`);
      // return response.json();
      
      return {
        count: 0,
        averagePrice: 0,
        topSellers: []
      };
    }, `Failed to fetch stats for ${category}`);
  }, [handleAsyncOperation]);

  const getSubcategories = useCallback(async (category: ProductCategory): Promise<ProductCategory[]> => {
    return handleAsyncOperation(async () => {
      // Later: API integration
      // const response = await fetch(`/api/categories/${category}/subcategories`);
      // return response.json();
      
      return categories.filter(cat => cat.startsWith(category));
    }, `Failed to fetch subcategories for ${category}`);
  }, [categories, handleAsyncOperation]);

  const getCategoryProducts = useCallback(async (category: ProductCategory, page = 1) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // const response = await fetch(`/api/categories/${category}/products?page=${page}`);
      // return response.json();
    }, `Failed to fetch products for ${category}`);
  }, [handleAsyncOperation]);

  const getTopCategories = useCallback(async (limit = 5): Promise<ProductCategory[]> => {
    return handleAsyncOperation(async () => {
      // Later: API integration
      // const response = await fetch(`/api/categories/top?limit=${limit}`);
      // return response.json();
      
      return categories.slice(0, limit);
    }, 'Failed to fetch top categories');
  }, [categories, handleAsyncOperation]);

  const getCategoryBreadcrumb = useCallback((category: ProductCategory): string[] => {
    const parts = category.split('/');
    return parts.reduce((acc: string[], curr: string, idx: number) => {
      acc.push(parts.slice(0, idx + 1).join('/'));
      return acc;
    }, []);
  }, []);

  return {
    categories,
    selectedCategory,
    isLoading,
    error,
    getCategoryStats,
    selectCategory,
    getSubcategories,
    getCategoryProducts,
    getTopCategories,
    getCategoryBreadcrumb
  };
}