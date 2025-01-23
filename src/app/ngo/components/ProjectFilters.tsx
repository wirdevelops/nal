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
import { ProjectStatus, ProjectCategory, ProjectLocation } from '@/types/ngo/project';

interface ProjectFiltersProps {
  onFilterChange: (filters: {
    search: string;
    status: ProjectStatus | 'all';
    category: ProjectCategory | 'all';
    location: ProjectLocation;
  }) => void;
  filters: {
    search: string;
    status: ProjectStatus | 'all';
    category: ProjectCategory | 'all';
    location: ProjectLocation;
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
              {Object.values(ProjectStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace('_', ' ')}
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
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.values(ProjectCategory).map((category) => (
                <SelectItem key={category} value={category}>
                  {category.replace('_', ' ')}
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


// // src/app/ngo/
// ├── page.tsx                    // NGO Dashboard Page (Landing)
// ├── projects/
// │   ├── page.tsx               // Projects List View
// │   ├── [projectId]/
// │   │   ├── page.tsx          // Project Details
// │   │   ├── update/
// │   │   │   └── page.tsx      // Project Update Form
// │   │   ├── report/
// │   │   │   └── page.tsx      // Project Report Generator
// │   │   └── gallery/
// │   │       └── page.tsx      // Project Gallery
// ├── volunteers/
// │   ├── page.tsx               // Volunteers List View
// │   ├── signup/
// │   │   └── page.tsx          // Volunteer Signup
// │   └── [volunteerId]/
// │       └── page.tsx          // Volunteer Details
// ├── donate/
// │   └── page.tsx              // Donation Page
// ├── impact/
// │   └── page.tsx              // Impact Dashboard
// ├── blog/
// │   ├── page.tsx              // Blog/News List
// │   └── [postId]/
// │       └── page.tsx          // Blog Post Detail
// ├── stories/
// │   └── page.tsx              // Success Stories
// ├── events/
// │   └── page.tsx              // Event Calendar
// ├── partners/
// │   └── page.tsx              // Partners & Sponsors
// └── get-involved/
//     └── page.tsx              // Get Involved Landing