'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Minus, Plus, X } from 'lucide-react'
import { formatCurrency } from "@/lib/utils"

export function CartSlideout() {
  const [isOpen, setIsOpen] = useState(false)
  const cart = useAppStore((state) => state.cart)
  const removeFromCart = useAppStore((state) => state.removeFromCart)
  const updateCartItemQuantity = useAppStore((state) => state.updateCartItemQuantity)
  const getCartTotal = useAppStore((state) => state.getCartTotal)

  const [total, setTotal] = useState(getCartTotal())

  useEffect(() => {
    setTotal(getCartTotal())
  }, [cart, getCartTotal])

  const handleRemoveFromCart = useCallback((productId: number) => {
    removeFromCart(productId)
  }, [removeFromCart])

  const handleUpdateQuantity = useCallback((productId: number, newQuantity: number) => {
    updateCartItemQuantity(productId, newQuantity)
  }, [updateCartItemQuantity])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-md">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                  className="w-14 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveFromCart(item.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        {cart.length > 0 ? (
          <div className="mt-8 space-y-4">
            <div className="flex justify-between text-base font-medium">
              <p>Subtotal</p>
              <p>{formatCurrency(total)}</p>
            </div>
            <Link href="/checkout" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 text-center">
            <p className="text-gray-500">Your cart is empty</p>
            <Link href="/shop" onClick={() => setIsOpen(false)}>
              <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

