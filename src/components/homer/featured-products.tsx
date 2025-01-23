'use client'

import { useMemo } from 'react'
import { useAppStore } from "@/lib/store"
import { ProductCard } from "@/components/shop/product-card"

interface FeaturedProductsProps {
  onQuickView: (productId: number) => void
}

export function FeaturedProducts({ onQuickView }: FeaturedProductsProps) {
  const products = useAppStore((state) => state.products)
  
  const featuredProducts = useMemo(() => {
    return products.filter(p => p.isFeatured)
  }, [products])

  return (
    <section className="mt-8">
      <h2 className="mb-6 text-2xl font-serif font-medium text-primary">
        Featured Products
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>
    </section>
  )
}

