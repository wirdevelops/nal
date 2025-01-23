'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Plus, Filter, Film,
  PencilLine, Palette, Users, DollarSign,
  ListFilter, Grid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProjectCreationDialog } from './ProjectCreate';

const ProjectsDashboard = () => {
  const router = useRouter();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  // Filter options for different categories
  const filterOptions = {
    status: ['Pre-production', 'Production', 'Post-production', 'Completed', 'On Hold'],
    type: ['Feature Film', 'TV Series', 'Commercial', 'Music Video', 'Documentary'],
    department: ['Direction', 'Production', 'Camera', 'Sound', 'Art', 'Editing'],
    priority: ['High', 'Medium', 'Low'],
  };

  // Quick action buttons configuration with navigation
  const quickActions = [
    {
      icon: <PencilLine className="w-8 h-8" />,
      label: 'New Script',
      description: 'Start with a script first',
      action: () => setCreateDialogOpen(true),
      createType: 'script'
    },
    {
      icon: <Users className="w-8 h-8" />,
      label: 'Cast & Crew Project',
      description: 'Begin with team planning',
      action: () => setCreateDialogOpen(true),
      createType: 'casting'
    },
    {
      icon: <Palette className="w-8 h-8" />,
      label: 'Visual Project',
      description: 'Start with mood boards',
      action: () => setCreateDialogOpen(true),
      createType: 'visual'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      label: 'Budget First',
      description: 'Begin with financial planning',
      action: () => setCreateDialogOpen(true),
      createType: 'budget'
    },
  ];

  const toggleFilter = (category, value) => {
    const filterKey = `${category}:${value}`;
    setActiveFilters(prev => 
      prev.includes(filterKey)
        ? prev.filter(f => f !== filterKey)
        : [...prev, filterKey]
    );
  };

  const removeFilter = (filterKey) => {
    setActiveFilters(prev => prev.filter(f => f !== filterKey));
  };

  
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
      <Film className="w-12 h-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No projects yet</h3>
      <p className="text-muted-foreground text-sm mb-6 text-center max-w-md">
        Start your first project. Choose how you'd like to begin - with a script, 
        cast planning, visual concepts, or budget.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl px-4">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={action.action}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <span className="p-3 rounded-full bg-gray-50">
                  {action.icon}
                </span>
                <h3 className="font-semibold">{action.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Quick Actions Section */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={action.action}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <span className={`${action.color} p-3 rounded-full bg-gray-50`}>
                  {action.icon}
                </span>
                <h3 className="font-semibold text-lg">{action.label}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </div>
                  {options.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => toggleFilter(category, option)}
                      className="flex items-center gap-2"
                    >
                      <div className="w-4 h-4 flex items-center justify-center">
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
            variant="ghost"
            size="icon"
            onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? (
              <Grid className="w-4 h-4" />
            ) : (
              <ListFilter className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
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
      {/* Project Creation Dialog */}
      <ProjectCreationDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        initialType={quickActions.find(a => a.createType === createType)?.type}
      />

    </div>
  );
};

export default ProjectsDashboard;