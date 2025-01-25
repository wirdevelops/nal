'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { 
  Filter, 
  Search,
  Grid, 
  List,
  Plus,
} from 'lucide-react';
// import { MarketplaceHeader } from './components/MarketplaceHeader';
import ProductFilters from './components/ProductFilters';
import ProductCard from './components/ProductCard';
import ActiveFilters from './components/ActiveFilters';
import { CategoryNav } from './components/CategoryNav';
import { useProductStore } from '@/stores/useProductStore';
import type { FilterState, ProductCategory, ProductCondition } from '@/types/store';

export default function MarketplacePage() {
  const [view, setView] = useState('grid');
  const [filters, setFilters] = useState<FilterState>({
    type: [] as ('physical' | 'digital')[],
    category: [] as ProductCategory[],
    priceRange: [0, 5000] as [number, number],
    condition: [] as ProductCondition[],
    inStock: undefined,
    sortBy: 'newest',
    search: ''
  });

  const { products, isLoading } = useProductStore();

  return (
    <div className="min-h-screen">
      {/* <MarketplaceHeader /> */}
      
      {/* Categories Navigation */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-2">
          <CategoryNav />
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Search and Filters Bar */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <ProductFilters 
                filters={filters}
                onChange={setFilters}
                isLoading={isLoading}
              />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant={view === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setView('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setView('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Product
            </Button>
          </div>
        </div>

        <ActiveFilters 
          filters={filters} 
          onChange={setFilters}
          isLoading={isLoading}
        />

        {/* Product Grid */}
        <div className={
          view === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              view={view === 'grid' ? 'grid' : 'list'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}