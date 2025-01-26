import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { ProductCategory, ProductCondition } from '@/types/store';
import type { FilterState } from '@/types/store';

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  isLoading?: boolean;
}

const formatPrice = (value: number) => 
  new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: 0 
  }).format(value);

export default function ProductFilters({ filters, onChange, isLoading = false }: ProductFiltersProps) {
  const categories = [
    'cameras', 'lenses', 'lighting', 'audio', 'accessories',
    'presets', 'luts', 'templates', 'scripts', 'plugins'
  ] as ProductCategory[];

  const conditions = [
    'new', 'like-new', 'good', 'fair'
  ] as ProductCondition[];

  const handleTypeChange = (type: 'physical' | 'digital') => {
    const newTypes = filters.type.includes(type)
      ? filters.type.filter(t => t !== type)
      : [...filters.type, type];
    onChange({ ...filters, type: newTypes });
  };

  const handleCategoryChange = (category: ProductCategory, checked: boolean) => {
    const newCategories = checked
      ? [...filters.category, category]
      : filters.category.filter(c => c !== category);
    onChange({ ...filters, category: newCategories });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onChange({ ...filters, priceRange: [value[0], value[1]] as [number, number] });
  };

  return (
    <div className="space-y-6">
      <SheetHeader>
        <SheetTitle>Filters</SheetTitle>
      </SheetHeader>

      {/* Product Type */}
      <section aria-labelledby="type-heading" className="space-y-4">
        <h4 id="type-heading" className="font-medium">Product Type</h4>
        <div className="flex flex-col gap-2">
          {[
            { value: 'physical', label: 'Physical Equipment' },
            { value: 'digital', label: 'Digital Products' }
          ].map(({ value, label }) => (
            <Button
              key={value}
              variant={filters.type.includes(value as 'physical' | 'digital') ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeChange(value as 'physical' | 'digital')}
              disabled={isLoading}
            >
              {label}
            </Button>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section aria-labelledby="categories-heading" className="space-y-4">
        <h4 id="categories-heading" className="font-medium">Categories</h4>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2 p-1">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.category.includes(category)}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category, checked as boolean)
                  }
                  disabled={isLoading}
                />
                <Label 
                  htmlFor={`category-${category}`} 
                  className="ml-2 capitalize cursor-pointer"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </section>

      {/* Price Range */}
      <section aria-labelledby="price-heading" className="space-y-4">
  <h4 id="price-heading" className="font-medium">Price Range</h4>
  <div className="space-y-4 px-2">
    <Slider
      min={0}
      max={5000}
      step={100}
      value={filters.priceRange}
      onValueChange={handlePriceRangeChange}
      disabled={isLoading}
      aria-label="Price range"
    />
    <div className="flex justify-between text-sm">
      <span>{formatPrice(filters.priceRange[0])}</span>
      <span>{formatPrice(filters.priceRange[1])}</span>
    </div>
  </div>
</section>

      {/* Condition */}
      {filters.type.includes('physical') && (
        <section aria-labelledby="condition-heading" className="space-y-4">
          <h4 id="condition-heading" className="font-medium">Condition</h4>
          <div className="space-y-2">
            {conditions.map((condition) => (
              <div key={condition} className="flex items-center">
                <Checkbox
                  id={`condition-${condition}`}
                  checked={filters.condition.includes(condition)}
                  onCheckedChange={(checked) => {
                    const newConditions = checked
                      ? [...filters.condition, condition]
                      : filters.condition.filter(c => c !== condition);
                    onChange({ ...filters, condition: newConditions });
                  }}
                  disabled={isLoading}
                />
                <Label 
                  htmlFor={`condition-${condition}`} 
                  className="ml-2 capitalize cursor-pointer"
                >
                  {condition}
                </Label>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Stock Status */}
      {filters.type.includes('physical') && (
        <section aria-labelledby="stock-heading" className="space-y-4">
          <h4 id="stock-heading" className="font-medium">Stock Status</h4>
          <div className="space-y-2">
            {[
              { value: true, label: 'In Stock Only' },
              { value: false, label: 'Out of Stock Only' }
            ].map(({ value, label }) => (
              <div key={label} className="flex items-center">
                <Checkbox
                  id={`stock-${value}`}
                  checked={filters.inStock === value}
                  onCheckedChange={(checked) => {
                    onChange({ ...filters, inStock: checked ? value : undefined });
                  }}
                  disabled={isLoading}
                />
                <Label 
                  htmlFor={`stock-${value}`} 
                  className="ml-2 cursor-pointer"
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}