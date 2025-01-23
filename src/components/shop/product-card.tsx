'use client'

import { useCallback, useMemo } from 'react'
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"

interface Product {
  id: number
  name: string
  price: number
  volume: string
  image: string
  category: string
  coupon?: {
    code: string
    discount: number
  }
  isPackage?: boolean
}

interface ProductCardProps {
  product: Product
  onQuickView: (productId: number) => void
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const addToCart = useAppStore((state) => state.addToCart)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)
  const favorites = useAppStore((state) => state.favorites)

  const isFavorite = useMemo(() => favorites.includes(product.id), [favorites, product.id])

  const handleAddToCart = useCallback(() => {
    addToCart(product)
  }, [addToCart, product])

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(product.id)
  }, [toggleFavorite, product.id])

  const handleQuickView = useCallback(() => {
    onQuickView(product.id)
  }, [onQuickView, product.id])

  return (
    <Card className="overflow-hidden border-[#1a472a]/10">
      <div className="relative aspect-square">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 hover:bg-background text-foreground"
          onClick={handleToggleFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-primary">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.volume}</p>
        <div className="mt-1 flex items-center justify-between">
          <p className="font-medium">{formatCurrency(product.price)}</p>
          {product.coupon && (
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
              {product.coupon.discount}% OFF
            </span>
          )}
        </div>
        {product.isPackage && (
          <span className="mt-1 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded block">
            Package
          </span>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button
          className="flex-1 mr-2 bg-primary text-primary-foreground hover:bg-primary/90"
          size="sm"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          onClick={handleQuickView}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

