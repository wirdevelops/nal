'use client'

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Eye } from 'lucide-react'
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"

interface ProductGridProps {
  onQuickView: (productId: number) => void
}

export function ProductGrid({ onQuickView }: ProductGridProps) {
  const products = useAppStore((state) => state.products)
  const addToCart = useAppStore((state) => state.addToCart)

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden border-[#1a472a]/10">
          <div className="relative aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-medium text-[#1a472a]">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.volume}</p>
            <p className="mt-1 font-medium">{formatCurrency(product.price)}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button
              className="flex-1 mr-2 bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
              onClick={() => addToCart(product)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={() => onQuickView(product.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

