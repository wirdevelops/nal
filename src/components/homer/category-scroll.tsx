'use client'

import { useCallback } from 'react'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Leaf, Heart, Calendar, Sparkles, Sun, Moon } from 'lucide-react'
import { useAppStore } from "@/lib/store"

export function CategoryScroll() {
  const products = useAppStore((state) => state.products)

  const categories = [
    { icon: Leaf, label: "Natural" },
    { icon: Heart, label: "Popular" },
    { icon: Calendar, label: "Routine" },
    { icon: Sparkles, label: "New" },
    { icon: Sun, label: "Day" },
    { icon: Moon, label: "Night" },
  ]

  const handleCategoryClick = useCallback((category: string) => {
    // This function will be implemented when we add filtering functionality
    console.log(`Category clicked: ${category}`)
  }, [])

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-4 p-1">
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-full border-[#1a472a]/20"
          onClick={() => handleCategoryClick('All')}
        >
          All
        </Button>
        {categories.map((Category, index) => (
          <Button
            key={index}
            variant="outline"
            className="flex items-center gap-2 rounded-full border-[#1a472a]/20"
            onClick={() => handleCategoryClick(Category.label)}
          >
            <Category.icon className="h-4 w-4 text-[#1a472a]" />
            <span>{Category.label}</span>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="hidden" />
    </ScrollArea>
  )
}

