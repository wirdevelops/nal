import { useCallback } from 'react';
import type { Product, Order } from '@/types/store';

interface AnalyticsEvent {
  type: 'view' | 'search' | 'add_to_cart' | 'remove_from_cart' | 'purchase' | 'refund' | 'wishlist' | 'share';
  properties: Record<string, any>;
  timestamp: string;
}

interface UseAnalyticsHook {
  trackPageView: (path: string) => void;
  trackProductView: (product: Product) => void;
  trackSearch: (query: string, results: number) => void;
  trackAddToCart: (product: Product, quantity: number) => void;
  trackRemoveFromCart: (product: Product, quantity: number) => void;
  trackPurchase: (order: Order) => void;
  trackRefund: (order: Order, amount: number) => void;
  trackWishlist: (product: Product, action: 'add' | 'remove') => void;
  trackShare: (contentType: 'product' | 'wishlist', id: string) => void;
  getEventHistory: () => AnalyticsEvent[];
}

const sendToAnalytics = async (event: AnalyticsEvent) => {
  // Later: API integration
  // await fetch('/api/analytics', {
  //   method: 'POST',
  //   body: JSON.stringify(event)
  // });
  
  // For now, store locally
  const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
  events.push(event);
  localStorage.setItem('analytics_events', JSON.stringify(events));
};

export function useAnalytics(): UseAnalyticsHook {
  const trackPageView = useCallback((path: string) => {
    sendToAnalytics({
      type: 'view',
      properties: { path },
      timestamp: new Date().toISOString()
    });
  }, []);

  const trackProductView = useCallback((product: Product) => {
    sendToAnalytics({
      type: 'view',
      properties: {
        productId: product.id,
        name: product.title,
        category: product.category,
        price: product.price
      },
      timestamp: new Date().toISOString()
    });
  }, []);

  const trackSearch = useCallback((query: string, results: number) => {
    sendToAnalytics({
      type: 'search',
      properties: { query, results },
      timestamp: new Date().toISOString()
    });
  }, []);

  const trackAddToCart = useCallback((product: Product, quantity: number) => {
    sendToAnalytics({
      type: 'add_to_cart',
      properties: {
        productId: product.id,
        name: product.title,
        price: product.price,
        quantity
      },
      timestamp: new Date().toISOString()
    });
  }, []);

  const trackRemoveFromCart = useCallback((product: Product, quantity: number) => {
    sendToAnalytics({
      type: 'remove_from_cart',
      properties: {
        productId: product.id,
        name: product.title,
        price: product.price,
        quantity
      },
      timestamp: new Date().toISOString()
    });
  }, []);

  const trackPurchase = useCallback((order: Order) => {
    sendToAnalytics({
      type: 'purchase',
      properties: {
        orderId: order.id,
        items: order.items,
        total: order.items.reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0)
      },
      timestamp: new Date().toISOString()
    });
  }, []);

  const trackRefund = useCallback((order: Order, amount: number) => {
    sendToAnalytics({
      type: 'refund',
      properties: {
        orderId: order.id,
        amount,
        reason: order.cancellationReason
      },
      timestamp: new Date().toISOString()
    });
  }, []);

  const trackWishlist = useCallback((product: Product, action: 'add' | 'remove') => {
    sendToAnalytics({
      type: 'wishlist',
      properties: {
        productId: product.id,
        name: product.title,
        action
      },
      timestamp: new Date().toISOString()
    });
  }, []);

  const trackShare = useCallback((contentType: 'product' | 'wishlist', id: string) => {
    sendToAnalytics({
      type: 'share',
      properties: {
        contentType,
        id
      },
      timestamp: new Date().toISOString()
    });
  }, []);

  const getEventHistory = useCallback(() => {
    return JSON.parse(localStorage.getItem('analytics_events') || '[]');
  }, []);

  return {
    trackPageView,
    trackProductView,
    trackSearch,
    trackAddToCart,
    trackRemoveFromCart,
    trackPurchase,
    trackRefund,
    trackWishlist,
    trackShare,
    getEventHistory
  };
}