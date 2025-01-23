'use client'

import { useCallback } from 'react'
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Home, ShoppingBag, Heart, User } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/shop', icon: ShoppingBag, label: 'Shop' },
    { href: '/favorites', icon: Heart, label: 'Favorites' },
    { href: '/profile', icon: User, label: 'Profile' },
  ]

  const isActive = useCallback((href: string) => pathname === href, [pathname])

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-around px-4 md:px-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center ${
              isActive(item.href) ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

