'use client'

import { useState, useMemo, useCallback } from 'react'
import { useAppStore } from "@/lib/store"
import { ProductCard } from "@/components/shop/product-card"
import { Button } from "@/components/ui/button"

interface RoutinesProps {
  onQuickView: (productId: number) => void
}

export function Routines({ onQuickView }: RoutinesProps) {
  const products = useAppStore((state) => state.products)
  const [selectedRoutine, setSelectedRoutine] = useState<'morning' | 'evening' | 'both' | null>(null)

  const routineProducts = useMemo(() => {
    return products.filter(p => p.routine)
  }, [products])

  const filteredProducts = useMemo(() => {
    return selectedRoutine
      ? routineProducts.filter(p => p.routine === selectedRoutine || p.routine === 'both')
      : routineProducts
  }, [selectedRoutine, routineProducts])

  const handleRoutineClick = useCallback((routine: 'morning' | 'evening' | 'both') => {
    setSelectedRoutine(prev => prev === routine ? null : routine)
  }, [])

  return (
    <section className="mt-8">
      <h2 className="mb-6 text-2xl font-serif font-medium text-primary">
        Daily Routines
      </h2>
      <div className="mb-4 flex gap-2">
        <Button
          variant={selectedRoutine === 'morning' ? "default" : "outline"}
          onClick={() => handleRoutineClick('morning')}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          Morning
        </Button>
        <Button
          variant={selectedRoutine === 'evening' ? "default" : "outline"}
          onClick={() => handleRoutineClick('evening')}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          Evening
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>
    </section>
  )
}

