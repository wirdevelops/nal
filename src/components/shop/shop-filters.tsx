'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { SlidersHorizontal } from 'lucide-react'

interface ShopFiltersProps {
  sortOption: string
  onSortChange: (value: string) => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
}

export function ShopFilters({
  sortOption,
  onSortChange,
  categoryFilter,
  onCategoryChange
}: ShopFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 50000])

  return (
    <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[140px] bg-white">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Products</SelectItem>
          <SelectItem value="body">Body Care</SelectItem>
          <SelectItem value="hair">Hair Care</SelectItem>
          <SelectItem value="face">Face Care</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortOption} onValueChange={onSortChange}>
        <SelectTrigger className="w-[140px] bg-white">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="popular">Most Popular</SelectItem>
        </SelectContent>
      </Select>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex-shrink-0">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Refine your product search with additional filters.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <h3 className="text-sm font-medium mb-2">Price Range</h3>
            <Slider
              min={0}
              max={50000}
              step={1000}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{priceRange[0]} XAF</span>
              <span>{priceRange[1]} XAF</span>
            </div>
          </div>
          {/* Add more filter options here */}
        </SheetContent>
      </Sheet>
    </div>
  )
}

