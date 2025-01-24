// types/common.ts
import { Type, Static } from '@sinclair/typebox';
import { Coupon, ShippingOption, UUID_PATTERN } from './common';

export const CartItem = Type.Object({
  productId: Type.RegExp(UUID_PATTERN),
  quantity: Type.Integer({ minimum: 1 }),
  options: Type.Optional(Type.Record(Type.String(), Type.Any())),
  addedAt: Type.String({ format: 'date-time' }),
  promotionId: Type.Optional(Type.RegExp(UUID_PATTERN)),
  priceOverride: Type.Optional(Type.Number({ minimum: 0 }))
});
export type CartItem = Static<typeof CartItem>;

export const Cart = Type.Object({
  id: Type.RegExp(UUID_PATTERN),
  userId: Type.RegExp(UUID_PATTERN),
  items: Type.Array(CartItem, { minItems: 1 }),
  appliedCoupons: Type.Array(Coupon, { maxItems: 3 }),
  priceLockUntil: Type.Optional(Type.String({ format: 'date-time' })),
  subtotal: Type.Number({ minimum: 0, multipleOf: 0.01 }),
  discounts: Type.Number({ minimum: 0, multipleOf: 0.01 }),
  tax: Type.Number({ minimum: 0, multipleOf: 0.01 }),
  shipping: Type.Number({ minimum: 0, multipleOf: 0.01 }),
  total: Type.Number({ minimum: 0, multipleOf: 0.01 }),
  currency: Type.String({ pattern: '^[A-Z]{3}$' }),
  expiresAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  shippingOption: Type.Optional(ShippingOption),
  giftMessage: Type.Optional(Type.String({ maxLength: 500 })),
  giftWrap: Type.Optional(Type.Boolean()),
  // For abandoned cart tracking
  lastActiveAt: Type.String({ format: 'date-time' }),
  // For cart versioning
  revision: Type.Integer({ minimum: 1 })
});
export type Cart = Static<typeof Cart>;