'use client'

import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { Header } from "@/components/homer/header"
import { BottomNav } from "@/components/homer/bottom-nav"
import { ProductCard } from "@/components/shop/product-card"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from 'lucide-react'

export default function FavoritesPage() {
  const favorites = useAppStore((state) => state.favorites)
  const products = useAppStore((state) => state.products)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)
  const addToCart = useAppStore((state) => state.addToCart)

  const favoriteProducts = products.filter((product) => favorites.includes(product.id))

  return (
    <div className="min-h-screen bg-[#f8f5f2] pb-16">
      <Header />
      <main className="container px-4 py-6 md:px-6">
        <h1 className="text-3xl font-bold text-[#1a472a] mb-6">Your Favorites</h1>
        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {favoriteProducts.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
                <Button
                  variant="secondary"
                  className="absolute top-2 right-2 p-2"
                  onClick={() => toggleFavorite(product.id)}
                >
                  Remove
                </Button>
                <Button
                  className="mt-2 w-full bg-[#1a472a] text-white hover:bg-[#1a472a]/90"
                  onClick={() => addToCart(product)}
                >
                  Move to Cart
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your favorites list is empty</h2>
            <p className="text-gray-600 mb-4">Start adding products you love to your favorites!</p>
            <Link href="/shop">
              <Button className="bg-[#1a472a] text-white hover:bg-[#1a472a]/90">
                Explore Products
              </Button>
            </Link>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}

