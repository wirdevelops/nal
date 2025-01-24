import { useCallback } from 'react';
import { useOrderStore } from '@/stores/useOrderStore';
import type { Wishlist } from '@/types/store';
import { toast } from 'react-hot-toast';

interface UseWishlistHook {
  wishlists: Wishlist[];
  isLoading: boolean;
  error: string | null;
  createWishlist: (shared?: boolean) => Promise<void>;
  addToWishlist: (productId: string, wishlistId?: string) => Promise<void>;
  removeFromWishlist: (productId: string, wishlistId?: string) => Promise<void>;
  shareWishlist: (wishlistId: string) => Promise<void>;
  mergeWishlists: (sourceId: string, targetId: string) => Promise<void>;
  getWishlistProducts: (wishlistId: string) => Promise<void>;
  clearWishlist: (wishlistId: string) => Promise<void>;
}

export function useWishlist(): UseWishlistHook {
  const store = useOrderStore();

  const handleAsyncOperation = useCallback(async (
    operation: () => Promise<void>,
    errorMessage: string
  ) => {
    try {
      store.setLoading(true);
      await operation();
    } catch (error) {
      console.error(errorMessage, error);
      store.setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  const createWishlist = useCallback(async (shared = false) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // await fetch('/api/wishlists', {
      //   method: 'POST',
      //   body: JSON.stringify({ shared })
      // });
      store.createWishlist(shared);
      toast.success('Wishlist created');
    }, 'Failed to create wishlist');
  }, [store, handleAsyncOperation]);

  const addToWishlist = useCallback(async (productId: string, wishlistId?: string) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // await fetch(`/api/wishlists/${wishlistId || 'default'}/items`, {
      //   method: 'POST',
      //   body: JSON.stringify({ productId })
      // });
      store.addToWishlist(productId, wishlistId);
      toast.success('Added to wishlist');
    }, 'Failed to add to wishlist');
  }, [store, handleAsyncOperation]);

  const removeFromWishlist = useCallback(async (productId: string, wishlistId?: string) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // await fetch(`/api/wishlists/${wishlistId || 'default'}/items/${productId}`, {
      //   method: 'DELETE'
      // });
      store.removeFromWishlist(productId, wishlistId);
      toast.success('Removed from wishlist');
    }, 'Failed to remove from wishlist');
  }, [store, handleAsyncOperation]);

  const shareWishlist = useCallback(async (wishlistId: string) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // const response = await fetch(`/api/wishlists/${wishlistId}/share`, {
      //   method: 'POST'
      // });
      // const { shareUrl } = await response.json();
      toast.success('Wishlist shared');
    }, 'Failed to share wishlist');
  }, [handleAsyncOperation]);

  const mergeWishlists = useCallback(async (sourceId: string, targetId: string) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // await fetch(`/api/wishlists/${targetId}/merge`, {
      //   method: 'POST',
      //   body: JSON.stringify({ sourceId })
      // });
      toast.success('Wishlists merged');
    }, 'Failed to merge wishlists');
  }, [handleAsyncOperation]);

  const getWishlistProducts = useCallback(async (wishlistId: string) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // const response = await fetch(`/api/wishlists/${wishlistId}/products`);
      // const products = await response.json();
      // return products;
    }, 'Failed to fetch wishlist products');
  }, [handleAsyncOperation]);

  const clearWishlist = useCallback(async (wishlistId: string) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // await fetch(`/api/wishlists/${wishlistId}`, {
      //   method: 'DELETE'
      // });
      toast.success('Wishlist cleared');
    }, 'Failed to clear wishlist');
  }, [handleAsyncOperation]);

  return {
    wishlists: store.wishlists,
    isLoading: store.isLoading,
    error: store.error,
    createWishlist,
    addToWishlist,
    removeFromWishlist,
    shareWishlist,
    mergeWishlists,
    getWishlistProducts,
    clearWishlist
  };
}