
export interface Address {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }
  
  export interface ShippingOption {
    id: string;
    name: string;
    price: number;
    estimatedDays: number;
    provider: string;
  }
  
  export interface Review {
    id: string;
    productId: string;
    userId: string;
    rating: number;
    title?: string;
    content: string;
    pros?: string[];
    cons?: string[];
    images?: string[];
    createdAt: string;
    updatedAt: string;
    helpful: number;
    verified: boolean;
  }