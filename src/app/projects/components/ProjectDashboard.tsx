'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Plus, Filter, Film,
  PencilLine, Palette, Users, DollarSign,
  ListFilter, Grid, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProjectStore } from '@/stores/useProjectStore';
import { format } from 'date-fns';
import { ProjectCreateDialog } from './ProjectCreationDialog';
import { TypeSpecificProjectDialog } from './TypeSpecificProjectDialog';
import { FilteredCreateButton } from './FilteredCreateButton';
import  {CreativeProjectDialog}  from './CreativeProjectDialog';
import { LayoutList } from 'lucide-react';

const quickStartOptions = [
  {
    icon: PencilLine,
    label: 'New Script',
    description: 'Start with a script first',
    type: 'script'
  },
  {
    icon: Users,
    label: 'Cast & Crew',
    description: 'Begin with team planning',
    type: 'casting'
  },
  {
    icon: Palette,
    label: 'Visual Project',
    description: 'Start with mood boards',
    type: 'visual'
  },
  {
    icon: DollarSign,
    label: 'Budget First',
    description: 'Begin with financial planning',
    type: 'budget'
  }
];

export default function ProjectsDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedStartOption, setSelectedStartOption] = useState<string | null>(null);

  const [typeSpecificDialogOpen, setTypeSpecificDialogOpen] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState<string | null>(null);

  const [creativeDialogOpen, setCreativeDialogOpen] = useState(false);

  const { projects } = useProjectStore();

  const filterOptions = {
    status: ['Active', 'Completed', 'On Hold'],
    type: ['Feature Film', 'Short Film', 'Series', 'Commercial', 'Documentary'],
    phase: ['Development', 'Pre-Production', 'Production', 'Post-Production']
  };

  const toggleFilter = (category: string, value: string) => {
    const filterKey = `${category}:${value}`;
    setActiveFilters(prev => 
      prev.includes(filterKey)
        ? prev.filter(f => f !== filterKey)
        : [...prev, filterKey]
    );
  };

  const removeFilter = (filterKey: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filterKey));
  };

  const handleQuickStart = (type: string) => {
    setSelectedStartOption(type);
    setCreateDialogOpen(true);
  };

  const filteredProjects = projects.filter(project => {
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      if (!project.title.toLowerCase().includes(search) &&
          !project.description.toLowerCase().includes(search)) {
        return false;
      }
    }

    if (activeFilters.length > 0) {
      return activeFilters.every(filter => {
        const [category, value] = filter.split(':');
        return project[category.toLowerCase()] === value;
      });
    }

    return true;
  });

  const handleTypeSpecificCreate = (projectType: string) => {
    setSelectedProjectType(projectType);
    setTypeSpecificDialogOpen(true);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
      <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No projects yet</h3>
      <p className="text-muted-foreground text-sm mb-6 text-center max-w-md">
        Start your first project. Choose how you'd like to begin - with a script, 
        cast planning, visual concepts, or budget.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl px-4">
        {quickStartOptions.map((option) => (
          <Card 
            key={option.type}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleQuickStart(option.type)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <span className="p-3 rounded-full bg-secondary">
                  <option.icon className="w-6 h-6" />
                </span>
                <h3 className="font-semibold">{option.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const ProjectGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredProjects.map((project) => (
        <Card 
          key={project.id}
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push(`/projects/${project.id}`)}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              </div>
              <Badge variant={
                project.status === 'active' ? 'default' :
                project.status === 'completed' ? 'secondary' : 'outline'
              }>
                {project.status}
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Team</span>
                <span>{project.team} members</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span>{project.progress}%</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0 border-t mt-6">
            <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
              <span>{project.type}</span>
              <span>Updated {format(new Date(project.updatedAt), 'MMM d, yyyy')}</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const renderActionButtons = () => (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {Object.entries(filterOptions).map(([category, options]) => (
            <DropdownMenuGroup key={category}>
              <DropdownMenuLabel>
                {category}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {options.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => toggleFilter(category, option)}
                >
                  <div className="w-4 h-4 mr-2">
                    {activeFilters.includes(`${category}:${option}`) && "✓"}
                  </div>
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
      >
        {viewMode === 'grid' ? (
          <LayoutList className="w-4 h-4" />
        ) : (
          <Grid className="w-4 h-4" />
        )}
      </Button>
      <Button 
        onClick={() => setCreativeDialogOpen(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 group-hover:translate-x-full duration-1000 transform transition-transform" />
        <Plus className="w-4 h-4 mr-2" />
        New Project
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Add the action buttons here */}
        {renderActionButtons()}
      </div>

      {/* Active Filters Display */}
      <div className="space-y-4">
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => {
              const [category, value] = filter.split(':');
              return (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <span className="text-xs text-muted-foreground">{category}:</span>
                  {value}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeFilter(filter)}
                  >
                    ×
                  </Button>
                </Badge>
              );
            })}
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground text-sm"
              onClick={() => setActiveFilters([])}
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Show FilteredCreateButton when type filter is active */}
        <FilteredCreateButton 
          activeFilters={activeFilters} 
          onClick={handleTypeSpecificCreate}
        />
      </div>

      {/* Projects List or Empty State */}
      {projects.length === 0 ? <EmptyState /> : <ProjectGrid />}

      {/* Dialogs */}
      <CreativeProjectDialog 
        open={creativeDialogOpen}
        onOpenChange={setCreativeDialogOpen}
      />
      
      <ProjectCreateDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        initialType={selectedStartOption}
      />

      <TypeSpecificProjectDialog
        open={typeSpecificDialogOpen}
        onOpenChange={setTypeSpecificDialogOpen}
        selectedType={selectedProjectType}
      />
    </div>
  );
}
