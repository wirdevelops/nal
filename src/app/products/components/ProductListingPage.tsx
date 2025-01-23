'use client'
// ProductListingPage.tsx
import { useState, useEffect } from 'react';
import { useProduct } from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import  ProductFilters  from './ProductFilters';
import ProductCard  from './ProductCard';
import  ActiveFilters  from './ActiveFilters';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Filter,
  Search,
  Grid,
  List,
  Heart
} from 'lucide-react';
import type { Product, ProductType, ProductCategory, PhysicalProduct } from '@/types/store';


// Filter type definition
interface FilterState {
  type: ProductType[];
  category: ProductCategory[];
  priceRange: [number, number];
  condition: string[];
    inStock: boolean | undefined;
    sortBy: string;
    search: string
}


export default function ProductListingPage() {
  // State management
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all')

    const [filters, setFilters] = useState<FilterState>({
    type: [],
    category: [],
    priceRange: [0, 5000],
    condition: [],
    inStock: undefined,
    sortBy: 'newest',
    search: ''
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  const { products, isLoading, favoriteIds } = useProduct();

  // Filter products
 const filteredProducts = products.filter(product => {
    // Apply type filter
    if (filters.type.length && !filters.type.includes(product.type)) return false;
    
    // Apply category filter
    if (filters.category.length && !filters.category.includes(product.category)) return false;
    
    // Apply price filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;
    
    // Apply condition filter for physical products
     if (filters.condition?.length && 'condition' in product) {
        if (!filters.condition.includes((product as PhysicalProduct).condition)) return false;
     }


      // Apply inStock filter for physical products
    if (filters.inStock !== undefined && product.type === 'physical') {
        const physicalProduct = product as PhysicalProduct;
         if(filters.inStock && physicalProduct.stock <= 0) return false;
         if(!filters.inStock && physicalProduct.stock > 0) return false;
        }

    // Apply search
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      return (
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });


  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const productsToDisplay = activeTab === 'all'
        ? sortedProducts
       : sortedProducts.filter((product) => favoriteIds.includes(product.id));

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Search and View Controls */}
      <div className="flex items-center gap-4">
         <Button
          variant={activeTab === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('all')}
        >
          All
        </Button>
         <Button
          variant={activeTab === 'favorites' ? 'default' : 'outline'}
           size="sm"
          onClick={() => setActiveTab('favorites')}
        >
          <Heart className="w-4 h-4 mr-2" />
          Favorites
        </Button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search products..."
              value={filters.search}
                onChange={(e) => setFilters(f => ({...f, search: e.target.value}))}
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
            <ProductFilters filters={filters} onChange={setFilters} />
          </SheetContent>
        </Sheet>

        <Select value={filters.sortBy} onValueChange={(value) => setFilters(f => ({ ...f, sortBy: value }))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

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
      </div>

      {/* Active Filters */}
      <ActiveFilters filters={filters} onChange={setFilters} />

      {/* Product Grid/List */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className={cn(
          "grid gap-6",
          view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'
        )}>
          {productsToDisplay.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              view={view}
             isFavorite={favoriteIds.includes(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}