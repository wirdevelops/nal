'use client'

import { ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"

export function FloatingCart() {
  const cart = useAppStore((state) => state.cart)

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (totalItems === 0) return null

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <Button className="bg-[#1a472a] text-white hover:bg-[#1a472a]/90 shadow-lg">
        <ShoppingCart className="mr-2 h-4 w-4" />
        {totalItems} {totalItems === 1 ? 'item' : 'items'} - {formatCurrency(totalPrice)}
      </Button>
    </div>
  )
}

