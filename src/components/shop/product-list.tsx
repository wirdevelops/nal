'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from "@/components/shop/product-card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"

interface ProductListProps {
  sortOption: string
  categoryFilter: string
  currentPage: number
  onPageChange: (page: number) => void
}

const ITEMS_PER_PAGE = 8

export function ProductList({
  sortOption,
  categoryFilter,
  currentPage,
  onPageChange
}: ProductListProps) {
  const allProducts = useAppStore((state) => state.products)
  const [displayedProducts, setDisplayedProducts] = useState(allProducts)

  useEffect(() => {
    let filteredProducts = allProducts

    // Apply category filter
    if (categoryFilter !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === categoryFilter)
    }

    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        // Implement popularity sorting logic here
        break
      default: // 'newest'
        // Assuming products are already sorted by newest
        break
    }

    setDisplayedProducts(filteredProducts)
  }, [allProducts, categoryFilter, sortOption])

  const totalPages = Math.ceil(displayedProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = displayedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-8 flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

