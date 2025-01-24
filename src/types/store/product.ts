// types/product.ts
import { Type, Static } from '@sinclair/typebox';
import { ProductCategory, ProductCondition, ShippingOption, UUID_PATTERN } from './common';

export const InventoryAlert = Type.Object({
  enabled: Type.Boolean(),
  threshold: Type.Integer({ minimum: 1 })
});
export type InventoryAlert = Static<typeof InventoryAlert>;

export const Promotion = Type.Object({
  id: Type.RegExp(UUID_PATTERN),
  type: Type.Union([
    Type.Literal('flash_sale'),
    Type.Literal('clearance'),
    Type.Literal('seasonal'),
    Type.Literal('bundle')
  ]),
  discount: Type.Number({ minimum: 0 }),
  validUntil: Type.String({ format: 'date-time' }),
  bundleItems: Type.Optional(Type.Array(Type.RegExp(UUID_PATTERN)))
});
export type Promotion = Static<typeof Promotion>;

export const ProductBase = Type.Object({
  id: Type.RegExp(UUID_PATTERN),
  title: Type.String(),
  description: Type.String(),
  price: Type.Number({ minimum: 0 }),
  type: Type.Union([Type.Literal('physical'), Type.Literal('digital')]),
  category: ProductCategory,
  sellerId: Type.RegExp(UUID_PATTERN),
  images: Type.Array(Type.String({ format: 'uri' })),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  status: Type.Union([
    Type.Literal('active'),
    Type.Literal('sold'),
    Type.Literal('draft')
  ]),
  tags: Type.Optional(Type.Array(Type.String())),
  metadata: Type.Optional(Type.Record(Type.String(), Type.Any()))
});

export type ProductBase = Static<typeof ProductBase>;

export const PhysicalProduct = Type.Composite([
  ProductBase,
  Type.Object({
    type: Type.Literal('physical'),
    condition: ProductCondition,
    brand: Type.String(),
    model: Type.String(),
    specifications: Type.Record(Type.String(), Type.String()),
    includedItems: Type.Array(Type.String()),
    weight: Type.Optional(Type.Number()),
    dimensions: Type.Optional(
      Type.Object({
        length: Type.Number(),
        width: Type.Number(),
        height: Type.Number()
      })
    ),
    shippingOptions: Type.Array(ShippingOption),
    inventory: Type.Object({
      stock: Type.Integer({ minimum: 0 }),
      backorder: Type.Boolean(),
      restockDate: Type.Optional(Type.String({ format: 'date-time' })),
      alerts: Type.Optional(InventoryAlert)
    }),
    promotions: Type.Optional(Type.Array(Promotion)),
    returnPolicy: Type.Object({
      days: Type.Integer({ minimum: 0 }),
      condition: ProductCondition
    })
  })
]);
export type PhysicalProduct = Static<typeof PhysicalProduct>;

export const DigitalProduct = Type.Composite([
  ProductBase,
  Type.Object({
    type: Type.Literal('digital'),
    fileType: Type.String(),
    fileSize: Type.Number(),
    compatibility: Type.Array(Type.String()),
    version: Type.String(),
    downloadUrl: Type.String({ format: 'uri' }),
    previewUrl: Type.Optional(Type.String({ format: 'uri' })),
    requirements: Type.Optional(Type.Array(Type.String())),
    licenseType: Type.Union([
      Type.Literal('single-use'),
      Type.Literal('multi-seat'),
      Type.Literal('subscription')
    ]),
    downloadLimit: Type.Optional(Type.Integer({ minimum: 1 })),
    accessPeriod: Type.Optional(Type.Object({
      start: Type.String({ format: 'date-time' }),
      end: Type.String({ format: 'date-time' })
    })),
    updatesIncluded: Type.Boolean(),
  })
]);

export interface FilterState {
  type: ('digital' | 'physical')[];
  category: ProductCategory[];
  priceRange: [number, number];
  condition: ProductCondition[];
  inStock: boolean | undefined;
  sortBy: string;
  search: string;
}

export type DigitalProduct = Static<typeof DigitalProduct>;

export const Product = Type.Union([PhysicalProduct, DigitalProduct]);
export type Product = Static<typeof Product>;