'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useAppStore } from '@/lib/store'
import { Header } from "@/components/homer/header"
import { BottomNav } from "@/components/homer/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { formatCurrency } from "@/lib/utils"
import { RelatedProducts } from '@/components/product/related-products'
import { ReviewSection } from '@/components/product/review-section'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = Number(params.id)
  const product = useAppStore((state) => state.getProductById(productId))
  const addToCart = useAppStore((state) => state.addToCart)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)
  const favorites = useAppStore((state) => state.favorites)

  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  if (!product) {
    return <div>Product not found</div>
  }

  const isFavorite = favorites.includes(product.id)

  return (
    <div className="min-h-screen bg-[#f8f5f2] pb-16">
      <Header />
      <main className="container px-4 py-6 md:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex gap-2 overflow-auto">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  className={`relative h-20 w-20 overflow-hidden rounded-md ${
                    index === activeImage ? 'ring-2 ring-[#1a472a]' : ''
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image src={img} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-[#1a472a]">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.reviews.length} reviews)</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(product.price)}</p>
            <p className="text-gray-600">{product.description}</p>
            <div>
              <h2 className="font-semibold">Ingredients:</h2>
              <ul className="list-inside list-disc">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-semibold">How to use:</h2>
              <p>{product.usage}</p>
            </div>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20"
              />
              <Button
                className="flex-1 bg-[#1a472a] text-white hover:bg-[#1a472a]/90"
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    addToCart(product)
                  }
                }}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className={`${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                onClick={() => toggleFavorite(product.id)}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
        <ReviewSection productId={product.id} reviews={product.reviews} />
        <RelatedProducts currentProductId={product.id} category={product.category} />
      </main>
      <BottomNav />
    </div>
  )
}

