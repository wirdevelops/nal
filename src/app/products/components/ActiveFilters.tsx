import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import  { FilterState } from '@/types/store';
import { Skeleton } from "@/components/ui/skeleton";

const FilterSkeleton = () => (
  <Skeleton className="h-8 w-24 rounded-full" />
);

interface ActiveFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  isLoading?: boolean;
}

const DEFAULT_PRICE_RANGE: [number, number] = [0, 5000];
const DEFAULT_FILTERS: FilterState = {
  type: [],
  category: [],
  priceRange: DEFAULT_PRICE_RANGE,
  condition: [],
  inStock: undefined,
  sortBy: 'popularity',
  search: ''
};

const hasActiveFilters = (filters: FilterState): boolean => {
  return (
    filters.type.length > 0 ||
    filters.category.length > 0 ||
    filters.priceRange[0] !== DEFAULT_PRICE_RANGE[0] ||
    filters.priceRange[1] !== DEFAULT_PRICE_RANGE[1] ||
    filters.condition.length > 0 ||
    filters.inStock !== undefined
  );
};

export default function ActiveFilters({ filters, onChange, isLoading = false }: ActiveFiltersProps) {
  const handleRemoveFilter = (key: keyof FilterState, value?: any) => {
    const newFilters = { ...filters };
    
    switch (key) {
      case 'type':
        newFilters.type = filters.type.filter(t => t !== value);
        break;
      case 'category':
        newFilters.category = filters.category.filter(c => c !== value);
        break;
      case 'condition':
        newFilters.condition = filters.condition.filter(c => c !== value);
        break;
      case 'priceRange':
        newFilters.priceRange = DEFAULT_PRICE_RANGE;
        break;
      case 'inStock':
        newFilters.inStock = undefined;
        break;
      default:
        break;
    }
    
    onChange(newFilters);
  };

  const handleClearAll = () => {
    onChange(DEFAULT_FILTERS);
  };

  if (!hasActiveFilters(filters)) {
    return null;
  }


  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        <FilterSkeleton />
        <FilterSkeleton />
        <FilterSkeleton />
      </div>
    );
  }


  return (
    <div aria-live="polite" aria-atomic="true">
    <div className="flex flex-wrap gap-2">
      {filters.type.map(type => (
        <Badge 
          key={`type-${type}`}
          variant="secondary"
          className="flex items-center gap-1"
        >
          <span className="capitalize">{type === 'physical' ? 'Physical Products' : 'Digital Products'}</span>
          <button
            onClick={() => handleRemoveFilter('type', type)}
            className="ml-1 hover:bg-muted rounded-full p-1"
            aria-label={`Remove ${type} filter`}
            disabled={isLoading}
          >
            <span aria-hidden="true">×</span>
          </button>
        </Badge>
      ))}
      
      {filters.category.map(category => (
        <Badge 
          key={`category-${category}`}
          variant="secondary"
          className="flex items-center gap-1"
        >
          <span className="capitalize">{category}</span>
          <button
            onClick={() => handleRemoveFilter('category', category)}
            className="ml-1 hover:bg-muted rounded-full p-1"
            aria-label={`Remove ${category} filter`}
            disabled={isLoading}
          >
            <span aria-hidden="true">×</span>
          </button>
        </Badge>
      ))}
      
      {(filters.priceRange[0] !== DEFAULT_PRICE_RANGE[0] || 
        filters.priceRange[1] !== DEFAULT_PRICE_RANGE[1]) && (
        <Badge 
          variant="secondary"
          className="flex items-center gap-1"
        >
          <span>
            ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
          </span>
          <button
            onClick={() => handleRemoveFilter('priceRange')}
            className="ml-1 hover:bg-muted rounded-full p-1"
            aria-label="Reset price range"
            disabled={isLoading}
          >
            <span aria-hidden="true">×</span>
          </button>
        </Badge>
      )}
      
      {filters.inStock !== undefined && (
        <Badge
          variant="secondary"
          className="flex items-center gap-1"
        >
          {filters.inStock ? 'In Stock Only' : 'Out of Stock Only'}
          <button
            onClick={() => handleRemoveFilter('inStock')}
            className="ml-1 hover:bg-muted rounded-full p-1"
            aria-label="Remove stock status filter"
            disabled={isLoading}
          >
            <span aria-hidden="true">×</span>
          </button>
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={handleClearAll}
        disabled={isLoading}
      >
        Clear all
      </Button>
    </div>
    </div>
  );
}