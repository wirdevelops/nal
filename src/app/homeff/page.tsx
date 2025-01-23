'use client'

import { useState, useCallback, useMemo } from 'react'
import { Header } from "@/components/homer/header"
import { CategoryScroll } from "@/components/homer/category-scroll"
import { FeaturedProducts } from "@/components/homer/featured-products"
import { ProductsWithCoupons } from "@/components/homer/products-with-coupons"
import { Packages } from "@/components/homer/packages"
import { AilmentProducts } from "@/components/homer/ailment-products"
import { Routines } from "@/components/homer/routines"
import { BottomNav } from "@/components/homer/bottom-nav"
import { QuickViewModal } from "@/components/homer/quick-view-modal"
import { useAppStore } from "@/lib/store"

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const products = useAppStore((state) => state.products)

  const handleQuickView = useCallback((productId: number) => {
    setSelectedProduct(productId)
  }, [])

  const handleCloseQuickView = useCallback(() => {
    setSelectedProduct(null)
  }, [])

  const selectedProductData = useMemo(() => {
    return selectedProduct !== null ? products.find(p => p.id === selectedProduct) : null
  }, [selectedProduct, products])

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <Header />
      <main className="container px-4 py-6 md:px-6">
        <h1 className="mb-6 text-3xl font-serif font-medium text-primary">
          Wellness Journey
        </h1>
        <CategoryScroll />
        <FeaturedProducts onQuickView={handleQuickView} />
        <ProductsWithCoupons onQuickView={handleQuickView} />
        <Packages onQuickView={handleQuickView} />
        <AilmentProducts onQuickView={handleQuickView} />
        <Routines onQuickView={handleQuickView} />
      </main>
      <BottomNav />
      {selectedProductData && (
        <QuickViewModal
          product={selectedProductData}
          onClose={handleCloseQuickView}
        />
      )}
    </div>
  )
}

