// types/store/order.ts
import { Address } from './common';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  options?: Record<string, any>;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  items: OrderItem[];
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingAddress?: Address;
  billingAddress?: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  notes?: string;
}