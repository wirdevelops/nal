import { useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNGOProjectStore } from '@/stores/useNGOProjectStore';
import { ProjectFilters } from './ProjectFilters';
import { ProjectCard } from './ProjectCard';
import { formatCurrency } from '@/lib/utils';
import type { ProjectStatus, ProjectCategory, NGOProject } from '@/types/ngo/project';

interface ProjectFiltersState {
  search: string;
  status: ProjectStatus | 'all';
  category: ProjectCategory | 'all';
  location: 'all' | 'local' | 'national' | 'international';
}

export const ProjectsDashboard = () => {
  const [filters, setFilters] = useState<ProjectFiltersState>({
    search: '',
    status: 'all',
    category: 'all',
    location: 'all'
  });

  // Get store data
  const { projects, isLoading, error } = useNGOProjectStore();
  
  // Filter projects based on current filters
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = filters.status === 'all' || project.status === filters.status;
      const matchesCategory = filters.category === 'all' || project.category === filters.category;
      
      // Location filter logic (example using US as local country)
      const isUSProject = project.location.country === 'United States';
      const matchesLocation = filters.location === 'all' || 
        (filters.location === 'local' && isUSProject) ||
        (filters.location === 'national' && isUSProject) || // Adjust as needed
        (filters.location === 'international' && !isUSProject);

      return matchesSearch && matchesStatus && matchesCategory && matchesLocation;
    });
  }, [projects, filters]);

  // Calculate metrics from filtered projects
  const metrics = useMemo(() => ({
    totalProjects: filteredProjects.length,
    totalBudget: filteredProjects.reduce((sum, p) => sum + p.budget.total, 0),
    activeProjects: filteredProjects.filter(p => p.status === 'ongoing').length
  }), [filteredProjects]);

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        Error loading projects: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ProjectFilters 
        filters={filters}
        onFilterChange={setFilters}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Projects"
          value={metrics.totalProjects}
          loading={isLoading}
        />
        <MetricCard
          title="Total Budget"
          value={formatCurrency(metrics.totalBudget)}
          loading={isLoading}
        />
        <MetricCard
          title="Active Projects"
          value={metrics.activeProjects}
          loading={isLoading}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ title, value, loading }: { 
  title: string;
  value: string | number;
  loading: boolean;
}) => (
  <div className="border rounded-lg p-4">
    <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
    {loading ? (
      <Skeleton className="h-8 w-1/2 mt-2" />
    ) : (
      <div className="text-2xl font-bold mt-2">{value}</div>
    )}
  </div>
);