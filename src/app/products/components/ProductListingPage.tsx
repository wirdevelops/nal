import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { useUser } from '@/hooks/useUser';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FilterState } from '@/types/store';
import ProductFilters from './ProductFilters';
import ProductCard from './ProductCard';
import ActiveFilters from './ActiveFilters';
import EmptyProjects from './EmptyProjects';
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
  Heart,
  Loader2, 
  Plus
} from 'lucide-react';

export default function ProductListingPage() {
  const { user, userActions } = useUser();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
  
  const {
    filteredProducts,
    isLoading,
    favoriteIds,
    searchProducts,
    filterByCategory,
    filterByPriceRange,
    sortProducts,
    resetFilters,
    loadNextPage,
    hasNextPage,
  } = useProducts();

  const canCreate = user && (
    userActions.hasRole('vendor') || 
    userActions.hasRole('admin')
  );

  useEffect(() => {
    if (debouncedSearch) {
      searchProducts(debouncedSearch);
    }
  }, [debouncedSearch, searchProducts]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isLoading && filteredProducts.length === 0 && !filters.search) {
    return (
      <EmptyProjects 
        onCreateClick={() => setIsCreateModalOpen(true)}
        canCreate={canCreate}
      />
    );
  }

  const productsToDisplay = activeTab === 'all'
    ? filteredProducts
    : filteredProducts.filter((product) => favoriteIds.includes(product.id));

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
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
        
        <div className="flex-1 relative min-w-[200px]">
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
            <ProductFilters 
              filters={filters} 
              onChange={setFilters} 
              isLoading={isLoading}
            />
          </SheetContent>
        </Sheet>

        <Select 
          value={filters.sortBy} 
          onValueChange={(value) => setFilters(f => ({ ...f, sortBy: value }))}
        >
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

      <ActiveFilters 
        filters={filters} 
        onChange={setFilters} 
        isLoading={isLoading}
      />

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className={cn(
            "grid gap-6",
            view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'
          )}>
            {productsToDisplay.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                view={view}
              />
            ))}
          </div>
          
          {hasNextPage && (
            <div className="mt-8 flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => loadNextPage()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}