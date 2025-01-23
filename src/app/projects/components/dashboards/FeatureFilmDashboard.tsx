import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Users, Calendar, DollarSign, 
} from 'lucide-react';

const featureFilmTools = [
  {
    id: 'script',
    title: 'Script Development',
    icon: FileText,
    description: 'Manage script versions, revisions, and notes',
    path: 'script'
  },
  {
    id: 'casting',
    title: 'Cast & Crew',
    icon: Users,
    description: 'Manage talent and production team',
    path: 'casting'
  },
  {
    id: 'schedule',
    title: 'Production Schedule',
    icon: Calendar,
    description: 'Plan and track production timeline',
    path: 'schedule'
  },
  {
    id: 'budget',
    title: 'Budget Management',
    icon: DollarSign,
    description: 'Track expenses and manage funding',
    path: 'budget'
  }
];

const ProductionTools = ({ projectId, onNavigate }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {featureFilmTools.map((tool) => {
      const Icon = tool.icon;
      return (
        <Card 
          key={tool.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onNavigate(tool.path)}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{tool.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    })}
  </div>
);

export function FeatureFilmDashboard({ 
  project, 
  onNavigate 
}) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Project Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Project Stage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {project.scriptStage || 'Not Set'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Runtime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {project.runtime ? `${project.runtime} min` : 'Not Set'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Genre
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {project.genre || 'Not Set'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {project.distributionStrategy || 'Not Set'}
                </div>
              </CardContent>
            </Card>
          </div>

          <ProductionTools projectId={project.id} onNavigate={onNavigate} />
        </TabsContent>

        <TabsContent value="production">
          <Card>
            <CardHeader>
              <CardTitle>Production Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Production details and management tools coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Distribution Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Distribution planning and tracking tools coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}