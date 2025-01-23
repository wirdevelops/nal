export interface CartItem {
    type: string;
    productId: string;
    quantity: number;
    options?: Record<string, any>;
  }
  
  export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    couponCode?: string;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    updatedAt: string;
  }
  