'use client'

import { useMemo } from 'react'
import { useAppStore } from "@/lib/store"
import { ProductCard } from "@/components/shop/product-card"

interface ProductsWithCouponsProps {
  onQuickView: (productId: number) => void
}

export function ProductsWithCoupons({ onQuickView }: ProductsWithCouponsProps) {
  const products = useAppStore((state) => state.products)

  const productsWithCoupons = useMemo(() => {
    return products.filter(p => p.coupon)
  }, [products])

  return (
    <section className="mt-8">
      <h2 className="mb-6 text-2xl font-serif font-medium text-primary">
        Special Offers
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {productsWithCoupons.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>
    </section>
  )
}

