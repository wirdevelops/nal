// Update ProjectFilters component
import { ProjectStatus, ProjectCategory } from '@/types/ngo/project';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProjectFilters {
  search: string;
  status: ProjectStatus | 'all';
  category: ProjectCategory | 'all';
  location: 'all' | 'local' | 'national' | 'international';
}

interface ProjectFiltersProps {
  onFilterChange: (filters: ProjectFilters) => void;
  filters: ProjectFilters;
}

export function ProjectFilters({ onFilterChange, filters }: ProjectFiltersProps) {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Search projects..."
        value={filters.search}
        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
  value={filters.status}
  onValueChange={(value: ProjectStatus | 'all') => 
    onFilterChange({ ...filters, status: value })
  }
>
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

        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
  value={filters.category}
  onValueChange={(value: ProjectCategory | 'all') => 
    onFilterChange({ ...filters, category: value })
  }
>
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

        {/* Location Filter */}
        <div className="space-y-2">
          <Label>Location</Label>
          <Select
            value={filters.location}
            onValueChange={(value) => onFilterChange({ ...filters, location: value as 'all' | 'local' | 'national' | 'international' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="local">Local</SelectItem>
              <SelectItem value="national">National</SelectItem>
              <SelectItem value="international">International</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}