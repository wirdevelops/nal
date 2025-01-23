'use client'

import { useCallback } from 'react'
import Image from "next/image"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"

interface QuickViewModalProps {
  product: {
    id: number
    name: string
    price: number
    volume: string
    image: string
    description: string
  }
  onClose: () => void
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const addToCart = useAppStore((state) => state.addToCart)

  const handleAddToCart = useCallback(() => {
    addToCart(product)
    onClose()
  }, [addToCart, product, onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg max-w-md w-full">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex flex-col items-center">
          <div className="relative w-full aspect-square mb-4">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          <p className="text-lg font-medium mb-2">{formatCurrency(product.price)}</p>
          <p className="text-sm text-gray-600 mb-4">{product.volume}</p>
          <p className="text-sm text-gray-700 mb-6">{product.description}</p>
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

