import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProjectStatus, ProjectCategory, Location } from '@/types/ngo/project';

// Add these runtime value arrays based on your schema
const ProjectStatusValues = ['planned', 'ongoing', 'completed', 'on_hold', 'cancelled'] as const;
const ProjectCategoryValues = [
  'education',
  'health',
  'environment',
  'community_development',
  'emergency_relief',
  'other'
] as const;

interface ProjectFiltersProps {
  onFilterChange: (filters: {
    search: string;
    status: ProjectStatus | 'all';
    category: ProjectCategory | 'all';
    location: Location;
  }) => void;
  filters: {
    search: string;
    status: ProjectStatus | 'all';
    category: ProjectCategory | 'all';
    location: Location;
  };
}

export function ProjectFilters({ onFilterChange, filters }: ProjectFiltersProps) {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Search projects..."
        value={filters.search}
        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
      />

      <div className="grid grid-cols-1 gap-4">
      <div className="space-y-2">
  <Label>Status</Label>
  <Select
    value={filters.status}
    onValueChange={(value: ProjectStatus | 'all') => 
      onFilterChange({ ...filters, status: value })
    }
  >
    <SelectTrigger>
      <SelectValue placeholder="Select status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Status</SelectItem>
      {ProjectStatusValues.map((status) => (
        <SelectItem key={status} value={status}>
          {status.replace(/_/g, ' ')}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value: ProjectCategory | 'all') => 
              onFilterChange({ ...filters, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category">
                {filters.category === 'all' ? 'All Categories' : filters.category.replace(/_/g, ' ')}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {ProjectCategoryValues.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Country</Label>
          <Input
            value={filters.location.country}
            onChange={(e) => onFilterChange({
              ...filters,
              location: { ...filters.location, country: e.target.value }
            })}
            placeholder="Enter country"
          />
        </div>

        <div className="space-y-2">
          <Label>City</Label>
          <Input
            value={filters.location.city}
            onChange={(e) => onFilterChange({
              ...filters,
              location: { ...filters.location, city: e.target.value }
            })}
            placeholder="Enter city"
          />
        </div>
      </div>
    </div>
  );
}