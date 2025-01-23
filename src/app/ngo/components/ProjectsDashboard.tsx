import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjects } from '@/hooks/useNGOProject';
import { ProjectFilters } from './ProjectFilters';
import { ProjectCard } from './ProjectCard';
import { formatCurrency } from '@/lib/utils';
import { ProjectStatus, ProjectCategory } from '@/types/ngo/project';

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

  const { projects, metrics, loading, error } = useProjects(filters);
  
  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        Error loading projects: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters Section */}
      <ProjectFilters 
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Projects"
          value={metrics.totalProjects}
          loading={loading}
        />
        <MetricCard
          title="Total Budget"
          value={formatCurrency(metrics.totalBudget)}
          loading={loading}
        />
        <MetricCard
          title="Active Projects"
          value={metrics.activeProjects}
          loading={loading}
        />
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
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