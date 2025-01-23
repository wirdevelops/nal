'use client'

import { useState, useMemo, useCallback } from 'react'
import { useAppStore } from "@/lib/store"
import { ProductCard } from "@/components/shop/product-card"
import { Button } from "@/components/ui/button"

interface AilmentProductsProps {
  onQuickView: (productId: number) => void
}

export function AilmentProducts({ onQuickView }: AilmentProductsProps) {
  const products = useAppStore((state) => state.products)
  const [selectedAilment, setSelectedAilment] = useState<string | null>(null)

  const ailmentProducts = useMemo(() => {
    return products.filter(p => p.forAilments && p.forAilments.length > 0)
  }, [products])

  const ailments = useMemo(() => {
    return Array.from(new Set(ailmentProducts.flatMap(p => p.forAilments || [])))
  }, [ailmentProducts])

  const filteredProducts = useMemo(() => {
    return selectedAilment
      ? ailmentProducts.filter(p => p.forAilments?.includes(selectedAilment))
      : ailmentProducts
  }, [selectedAilment, ailmentProducts])

  const handleAilmentClick = useCallback((ailment: string) => {
    setSelectedAilment(prev => prev === ailment ? null : ailment)
  }, [])

  return (
    <section className="mt-8">
      <h2 className="mb-6 text-2xl font-serif font-medium text-primary">
        Solutions for Your Concerns
      </h2>
      <div className="mb-4 flex flex-wrap gap-2">
        {ailments.map((ailment) => (
          <Button
            key={ailment}
            variant={selectedAilment === ailment ? "default" : "outline"}
            onClick={() => handleAilmentClick(ailment)}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            {ailment}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>
    </section>
  )
}

