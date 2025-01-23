import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Label } from "@/components/ui/label";
import type { ProductType, ProductCategory } from '@/types/store';

// Filter type definition
interface FilterState {
  type: ProductType[];
  category: ProductCategory[];
  priceRange: [number, number];
  condition: string[];
  inStock: boolean | undefined;
  sortBy: string;
  search: string;
}

// Product Filters Component
function ProductFilters({ 
    filters, 
    onChange 
  }: { 
    filters: FilterState; 
    onChange: (filters: FilterState) => void; 
  }) {
    return (
      <div className="space-y-6">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Refine your product search
          </SheetDescription>
        </SheetHeader>
  
        <div className="space-y-4">
          {/* Product Type */}
          <div>
            <h4 className="font-medium mb-2">Product Type</h4>
            <div className="space-y-2">
              <Button
                variant={filters.type.includes('physical') ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  const newTypes = filters.type.includes('physical')
                    ? filters.type.filter(t => t !== 'physical')
                    : [...filters.type, 'physical'];
                  onChange({ ...filters, type: newTypes as ProductType[] });
                }}
              >
                Physical Equipment
              </Button>
              <Button
                variant={filters.type.includes('digital') ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  const newTypes = filters.type.includes('digital')
                    ? filters.type.filter(t => t !== 'digital')
                    : [...filters.type, 'digital'];
                  onChange({ ...filters, type: newTypes as ProductType[] });
                }}
              >
                Digital Products
              </Button>
            </div>
          </div>
  
          {/* Categories */}
          <div>
            <h4 className="font-medium mb-2">Categories</h4>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {['cameras', 'lenses', 'lighting', 'audio', 'accessories', 'presets', 'luts', 'templates', 'scripts', 'plugins'].map((category) => (
                  <div key={category} className="flex items-center">
                    <Checkbox
                      checked={filters.category.includes(category as ProductCategory)}
                      onCheckedChange={(checked) => {
                        const newCategories = checked
                          ? [...filters.category, category as ProductCategory]
                          : filters.category.filter(c => c !== category);
                        onChange({ ...filters, category: newCategories });
                      }}
                    />
                    <Label className="ml-2 capitalize">{category}</Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
  
          {/* Price Range */}
          <div>
            <h4 className="font-medium mb-2">Price Range</h4>
            <div className="space-y-4">
              <Slider
                min={0}
                max={5000}
                step={100}
                value={filters.priceRange}
                onValueChange={(value) => onChange({ ...filters, priceRange: value as [number, number] })}
              />
              <div className="flex justify-between text-sm">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>
  
          {/* Condition (for physical products) */}
          {filters.type.includes('physical') && (
            <div>
              <h4 className="font-medium mb-2">Condition</h4>
              <div className="space-y-2">
                {['new', 'like-new', 'good', 'fair'].map((condition) => (
                  <div key={condition} className="flex items-center">
                    <Checkbox
                      checked={filters.condition?.includes(condition)}
                      onCheckedChange={(checked) => {
                        const newConditions = checked
                          ? [...(filters.condition || []), condition]
                          : (filters.condition || []).filter(c => c !== condition);
                        onChange({ ...filters, condition: newConditions });
                      }}
                    />
                    <Label className="ml-2 capitalize">{condition}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

            {/* In Stock (for physical products) */}
            {filters.type.includes('physical') && (
                <div>
                    <h4 className="font-medium mb-2">In Stock</h4>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <Checkbox
                                checked={filters.inStock === true}
                                onCheckedChange={(checked) => {
                                    onChange({ ...filters, inStock: checked === true ? true : undefined});
                                }}
                            />
                            <Label className="ml-2 capitalize">In Stock Only</Label>
                        </div>

                         <div className="flex items-center">
                            <Checkbox
                                checked={filters.inStock === false}
                                onCheckedChange={(checked) => {
                                    onChange({ ...filters, inStock: checked === true ? false : undefined });
                                }}
                            />
                            <Label className="ml-2 capitalize">Out of Stock Only</Label>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    );
  }
  

  export default ProductFilters;