// types/common.ts
import { Type, Static } from '@sinclair/typebox';

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const ShippingOption = Type.Object({
  id: Type.RegExp(UUID_PATTERN),
  name: Type.String(),
  description: Type.String(),
  price: Type.Number(),
  estimatedDelivery: Type.String({ format: 'date-time' }),
  serviceLevel: Type.Optional(Type.String())
});
export type ShippingOption = Static<typeof ShippingOption>;

export const ProductCategory = Type.Union([
  Type.Literal('cameras'),
  Type.Literal('lenses'),
  Type.Literal('lighting'),
  Type.Literal('audio'),
  Type.Literal('accessories'),
  Type.Literal('presets'),
  Type.Literal('luts'),
  Type.Literal('templates'),
  Type.Literal('scripts'),
  Type.Literal('plugins')
]);
export type ProductCategory = Static<typeof ProductCategory>;

export const ProductCondition = Type.Union([
  Type.Literal('new'),
  Type.Literal('like-new'),
  Type.Literal('good'),
  Type.Literal('fair')
]);
export type ProductCondition = Static<typeof ProductCondition>;

export const CouponType = Type.Union([
  Type.Literal('percentage'),
  Type.Literal('fixed'),
  Type.Literal('free_shipping'),
  Type.Literal('bogo')
]);
export type CouponType = Static<typeof CouponType>;

export const Coupon = Type.Object({
  code: Type.String({ pattern: '^[A-Z0-9]{5,15}$' }),
  type: CouponType,
  value: Type.Number({ minimum: 0 }),
  minOrder: Type.Optional(Type.Number({ minimum: 0 })),
  maxDiscount: Type.Optional(Type.Number({ minimum: 0 })),
  applicableCategories: Type.Optional(Type.Array(ProductCategory)),
  applicableProducts: Type.Optional(Type.Array(Type.RegExp(UUID_PATTERN))),
  validFrom: Type.String({ format: 'date-time' }),
  validUntil: Type.String({ format: 'date-time' }),
  usageLimit: Type.Optional(Type.Integer({ minimum: 1 })),
  userUsageLimit: Type.Optional(Type.Integer({ minimum: 1 })),
  stackable: Type.Boolean({ default: false }),
  firstTimeOnly: Type.Boolean({ default: false })
});
export type Coupon = Static<typeof Coupon>;