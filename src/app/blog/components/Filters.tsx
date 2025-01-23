'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCategories, useTags } from '@/hooks/blog';
import { Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FilterState {
  status: string[];
  categories: string[];
  tags: string[];
}

export function PostFilters() {
  const { categories } = useCategories();
  const { tags } = useTags();
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    categories: [],
    tags: [],
  });

  const activeFiltersCount = Object.values(filters).flat().length;

  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }));
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 px-1 min-w-[20px] text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {['Published', 'Draft', 'Scheduled'].map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={filters.status.includes(status)}
              onCheckedChange={() => toggleFilter('status', status)}
            >
              {status}
            </DropdownMenuCheckboxItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Categories</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {categories.map((category) => (
            <DropdownMenuCheckboxItem
              key={category.id}
              checked={filters.categories.includes(category.id)}
              onCheckedChange={() => toggleFilter('categories', category.id)}
            >
              {category.name}
            </DropdownMenuCheckboxItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Tags</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {tags.map((tag) => (
            <DropdownMenuCheckboxItem
              key={tag.id}
              checked={filters.tags.includes(tag.id)}
              onCheckedChange={() => toggleFilter('tags', tag.id)}
            >
              {tag.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([type, values]) =>
            values.map((value) => (
              <Badge
                key={`${type}-${value}`}
                variant="secondary"
                className={cn(
                  "cursor-pointer hover:bg-secondary/80",
                  type === 'status' && 'bg-primary/10',
                  type === 'categories' && 'bg-secondary/10',
                  type === 'tags' && 'bg-muted'
                )}
                onClick={() => toggleFilter(type as keyof FilterState, value)}
              >
                {value}
                <span className="ml-1 text-muted-foreground">×</span>
              </Badge>
            ))
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => setFilters({ status: [], categories: [], tags: [] })}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}