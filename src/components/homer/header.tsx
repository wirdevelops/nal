'use client'

import { useState, useCallback } from 'react'
import { Bell, Search, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAppStore } from "@/lib/store"
import { CartSlideout } from "@/components/cart/cart-slideout"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const userProfile = useAppStore((state) => state.userProfile)

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
            <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{userProfile.name}</span>
        </div>
        <div className="flex items-center gap-4">
          {isSearchOpen ? (
            <div className="flex items-center">
              <Input
                type="search"
                placeholder="Search..."
                className="mr-2 bg-background"
              />
              <Button variant="ghost" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={toggleSearch}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={toggleSearch}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-4 rounded-lg bg-white p-4 shadow">
                  <div className="flex-1">
                    <h3 className="font-medium">New Product Available</h3>
                    <p className="text-sm text-gray-500">Check out our new Organic Face Mask!</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg bg-white p-4 shadow">
                  <div className="flex-1">
                    <h3 className="font-medium">Order Shipped</h3>
                    <p className="text-sm text-gray-500">Your recent order has been shipped.</p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <CartSlideout />
        </div>
      </div>
    </header>
  )
}

