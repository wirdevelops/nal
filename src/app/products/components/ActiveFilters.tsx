import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProductType, ProductCategory } from '@/types/store';

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

// Active Filters Component
function ActiveFilters({ 
    filters, 
    onChange 
  }: { 
    filters: FilterState; 
    onChange: (filters: FilterState) => void; 
  }) {
    if (!filters.type.length && !filters.category.length && filters.priceRange[0] === 0 && filters.priceRange[1] === 5000 && !filters.condition.length && filters.inStock === undefined) {
      return null;
    }
  
    return (
      <div className="flex flex-wrap gap-2">
        {filters.type.map(type => (
          <Badge 
            key={type}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {type}
            <button
              onClick={() => {
                const newTypes = filters.type.filter(t => t !== type);
                onChange({ ...filters, type: newTypes });
              }}
              className="ml-1 hover:bg-muted rounded-full"
            >
              ×
            </button>
          </Badge>
        ))}
        
        {filters.category.map(category => (
          <Badge 
            key={category}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {category}
            <button
              onClick={() => {
                const newCategories = filters.category.filter(c => c !== category);
                onChange({ ...filters, category: newCategories });
              }}
              className="ml-1 hover:bg-muted rounded-full"
            >
              ×
            </button>
          </Badge>
        ))}
        
        {filters.condition?.map(condition => (
            <Badge
              key={condition}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {condition}
              <button
                onClick={() => {
                  const newConditions = filters.condition?.filter(c => c !== condition);
                  onChange({ ...filters, condition: newConditions });
                }}
                className="ml-1 hover:bg-muted rounded-full"
              >
                ×
              </button>
            </Badge>
          ))}
  
        {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 5000) && (
          <Badge 
            variant="secondary"
            className="flex items-center gap-1"
          >
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
            <button
              onClick={() => {
                onChange({ ...filters, priceRange: [0, 5000] });
              }}
              className="ml-1 hover:bg-muted rounded-full"
            >
              ×
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
                onClick={() => {
                  onChange({ ...filters, inStock: undefined });
                }}
                className="ml-1 hover:bg-muted rounded-full"
              >
                ×
              </button>
            </Badge>
          )}
  
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onChange({
              type: [],
              category: [],
              priceRange: [0, 5000],
              condition: [],
              inStock: undefined,
              sortBy: 'newest',
                search: ''
            });
          }}
        >
          Clear all
        </Button>
      </div>
    );
  }
  
  export default ActiveFilters;