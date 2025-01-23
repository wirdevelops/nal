// types/store/product.ts
import {ShippingOption} from './common';

export type ProductType = 'physical' | 'digital';
export type ProductCategory =
    // Physical categories
    | 'cameras'
    | 'lenses'
    | 'lighting'
    | 'audio'
    | 'accessories'
    // Digital categories
    | 'presets'
    | 'luts'
    | 'templates'
    | 'scripts'
    | 'plugins';

export type ProductCondition = 'new' | 'like-new' | 'good' | 'fair';

export interface ProductBase {
    id: string;
    title: string;
    description: string;
    price: number;
    type: ProductType;
    category: ProductCategory;
    sellerId: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
    status: 'active' | 'sold' | 'draft';
    tags?: string[];
}

// Physical product specific fields
export interface PhysicalProduct extends ProductBase {
    type: 'physical';
    condition: ProductCondition;
    brand: string;
    model: string;
    specifications: Record<string, string>;
    includedItems: string[];
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    shippingOptions: ShippingOption[];
    stock: number; // Added stock only to PhysicalProduct
}

// Digital product specific fields
export interface DigitalProduct extends ProductBase {
    type: 'digital';
    fileType: string;
    fileSize: number;
    compatibility: string[];
    version: string;
    downloadUrl: string;
    previewUrl?: string;
    requirements?: string[];
}

export type Product = PhysicalProduct | DigitalProduct;