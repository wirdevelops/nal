// types/order.ts
import { Type, Static } from '@sinclair/typebox';
import { Coupon, UUID_PATTERN, ShippingOption } from './common';


export const PaymentMethodDetails = Type.Object({
  gateway: Type.String(),
  transactionId: Type.String(),
  last4: Type.Optional(Type.String({ pattern: '^\\d{4}$' })),
  brand: Type.Optional(Type.String()),
  expiryMonth: Type.Optional(Type.Integer({ minimum: 1, maximum: 12 })),
  expiryYear: Type.Optional(Type.Integer({ minimum: 2024 })),
  billingAddress: Type.Optional(Type.Object({
    street: Type.String(),
    city: Type.String(),
    state: Type.String(),
    country: Type.String(),
    zipCode: Type.String()
  }))
});

export const Fulfillment = Type.Object({
  shippedAt: Type.Optional(Type.String({ format: 'date-time' })),
  deliveredAt: Type.Optional(Type.String({ format: 'date-time' })),
  carrier: Type.Union([
    Type.Literal('ups'),
    Type.Literal('fedex'),
    Type.Literal('usps'),
    Type.Literal('dhl')
  ]),
  trackingNumber: Type.String(),
  trackingUrl: Type.Optional(Type.String({ format: 'uri' })),
  status: Type.Union([
    Type.Literal('pending'),
    Type.Literal('shipped'),
    Type.Literal('in_transit'),
    Type.Literal('delivered'),
    Type.Literal('failed')
  ]),
  estimatedDelivery: Type.Optional(Type.String({ format: 'date-time' })),
  shippingAddress: Type.Object({
    street: Type.String(),
    city: Type.String(),
    state: Type.String(),
    country: Type.String(),
    zipCode: Type.String()
  })
});

export type PaymentMethodDetails = Static<typeof PaymentMethodDetails>;
export type Fulfillment = Static<typeof Fulfillment>;

export const OrderItem = Type.Object({
  productId: Type.RegExp(UUID_PATTERN),
  quantity: Type.Integer({ minimum: 1 }),
  priceAtTime: Type.Number({ minimum: 0 }),
  options: Type.Optional(Type.Record(Type.String(), Type.Any())),
  promotionId: Type.Optional(Type.RegExp(UUID_PATTERN)),
  downloadStatus: Type.Optional(Type.Union([
    Type.Literal('pending'),
    Type.Literal('completed'),
    Type.Literal('failed')
  ]))
});
export type OrderItem = Static<typeof OrderItem>;

export const Order = Type.Object({
  id: Type.RegExp(UUID_PATTERN),
  userId: Type.RegExp(UUID_PATTERN),
  date: Type.String({ format: 'date-time' }),
  total: Type.Number(),
  appliedCoupons: Type.Array(Coupon),
  currency: Type.String({ pattern: '^[A-Z]{3}$' }),
  priceLocked: Type.Boolean(),
  invoiceUrl: Type.Optional(Type.String({ format: 'uri' })),
  paymentMethodDetails: PaymentMethodDetails,
  fulfillment: Type.Optional(Fulfillment),
  items: Type.Array(OrderItem),
  returnStatus: Type.Optional(Type.Union([
    Type.Literal('requested'),
    Type.Literal('approved'),
    Type.Literal('refunded'),
    Type.Literal('rejected')
  ])),
  refundAmount: Type.Optional(Type.Number({ minimum: 0 })),
  cancellationReason: Type.Optional(Type.String({ maxLength: 200 }))
});
export type Order = Static<typeof Order>;

export const Wishlist = Type.Object({
  id: Type.RegExp(UUID_PATTERN),
  userId: Type.RegExp(UUID_PATTERN),
  items: Type.Array(Type.RegExp(UUID_PATTERN)),
  shared: Type.Boolean(),
  createdAt: Type.String({ format: 'date-time' })
});
export type Wishlist = Static<typeof Wishlist>;

export const PriceAlert = Type.Object({
  productId: Type.RegExp(UUID_PATTERN),
  userId: Type.RegExp(UUID_PATTERN),
  targetPrice: Type.Number(),
  createdAt: Type.String({ format: 'date-time' })
});
export type PriceAlert = Static<typeof PriceAlert>;

export const LoyaltyProgram = Type.Object({
  userId: Type.RegExp(UUID_PATTERN),
  points: Type.Integer({ minimum: 0 }),
  tier: Type.Union([
    Type.Literal('bronze'),
    Type.Literal('silver'),
    Type.Literal('gold'),
    Type.Literal('platinum')
  ]),
  nextTierProgress: Type.Number({ minimum: 0, maximum: 100 })
});
export type LoyaltyProgram = Static<typeof LoyaltyProgram>;
