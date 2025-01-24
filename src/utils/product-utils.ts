import type { Product, PhysicalProduct } from '@/types/store';

export function isPhysicalProduct(product: Product): product is PhysicalProduct {
  return product.type === 'physical';
}

export function getInventoryStatus(product: Product) {
  if (!isPhysicalProduct(product)) {
    return {
      isOutOfStock: false,
      showLowStockBadge: false,
      stock: undefined,
      backorder: undefined,
      alerts: undefined
    };
  }

  const inventory = product.inventory;
  const isOutOfStock = inventory?.stock <= 0 && !inventory?.backorder;
  const showLowStockBadge = inventory?.alerts?.enabled && 
    inventory.stock <= (inventory.alerts.threshold || 0);

  return {
    isOutOfStock,
    showLowStockBadge,
    stock: inventory?.stock,
    backorder: inventory?.backorder,
    alerts: inventory?.alerts
  };
}