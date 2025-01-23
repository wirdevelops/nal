'use client'

import { useAppStore } from '@/lib/store'
import { ProductCard } from "@/components/shop/product-card"

interface RelatedProductsProps {
  currentProductId: number
  category: string
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const products = useAppStore((state) => state.products)

  const relatedProducts = products
    .filter(p => p.category === category && p.id !== currentProductId)
    .slice(0, 4)

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-[#1a472a] mb-4">Related Products</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

