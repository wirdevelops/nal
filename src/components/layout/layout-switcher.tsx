import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLayoutStore } from '@/stores/useLayoutStore';
import { DashboardLayout } from './DashboardLayout';
import { ToolCentricLayout } from './ToolCentricLayout';
import { CommunicationLayout } from './CommunicationLayout';
import { EnhancedHubLayout } from './EnhancedHubLayout';
import { WorkspaceLayout } from './WorkspaceLayout';
import { PortalLayout } from './PortalLayout';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Layout,
  Grid,
  Palette,
  MessageSquare,
  MonitorDot,
  Compass,
  User,
  Settings,
  Check
} from 'lucide-react';

// Layout configuration
const layouts = {
    dashboard: {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Widget-based overview layout',
      icon: Grid,
      component: DashboardLayout,
      suitableFor: ['overview', 'analytics', 'management'],
      features: ['widgets', 'quick-access', 'customizable']
    },
    toolCentric: {
      id: 'toolCentric',
      label: 'Tool Centric',
      description: 'Focus on tools and workspace',
      icon: Palette,
      component: ToolCentricLayout,
      suitableFor: ['projects', 'creation', 'production'],
      features: ['tools', 'workspace', 'collaboration']
    },
    communication: {
      id: 'communication',
      label: 'Communication',
      description: 'Team collaboration layout',
      icon: MessageSquare,
      component: CommunicationLayout,
      suitableFor: ['team', 'messaging', 'feedback'],
      features: ['chat', 'sharing', 'presence']
    },
    hub: {
      id: 'hub',
      label: 'Hub',
      description: 'Section-based organization',
      icon: Compass,
      component: EnhancedHubLayout,
      suitableFor: ['navigation', 'discovery', 'browsing'],
      features: ['categorization', 'discovery', 'browsing']
    },
    workspace: {
      id: 'workspace',
      label: 'Workspace',
      description: 'Focused work environment',
      icon: MonitorDot,
      component: WorkspaceLayout,
      suitableFor: ['creation', 'editing', 'review'],
      features: ['focus', 'tools', 'panels']
    },
    portal: {
      id: 'portal',
      label: 'Portal',
      description: 'Content-first public layout',
      icon: User,
      component: PortalLayout,
      suitableFor: ['public', 'content', 'engagement'],
      features: ['content', 'navigation', 'engagement']
    }
  };
  


// Layout Switcher Component
export const LayoutSwitcher = () => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const { 
      globalLayout,
      sectionLayouts,
      setGlobalLayout,
      setSectionLayout,
      resetSectionLayout
    } = useLayoutStore();
  
    // Get current section from pathname
    const currentSection = pathname.split('/')[1] || 'root';
  
    // Get effective layout for current section
    const currentLayout = sectionLayouts[currentSection] || globalLayout;
  
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Layout className="h-4 w-4 mr-2" />
              Layout
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel className="flex items-center justify-between">
              Current Layout
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.entries(layouts).map(([id, layout]) => (
              <DropdownMenuItem
                key={id}
                onClick={() => setSectionLayout(currentSection, id as keyof typeof layouts)}
                className="flex items-center gap-2"
              >
                <layout.icon className="h-4 w-4" />
                <span className="flex-1">{layout.label}</span>
                {currentLayout === id && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => resetSectionLayout(currentSection)}
              className="text-muted-foreground"
            >
              Reset to Global Default
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
  
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Layout Settings</DialogTitle>
              <DialogDescription>
                Configure layout preferences for different sections
              </DialogDescription>
            </DialogHeader>
  
            <ScrollArea className="h-[400px] pr-4">
              {/* Global Layout Settings */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-base">Global Default</CardTitle>
                  <CardDescription>
                    Default layout for all sections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={globalLayout}
                    onValueChange={(value) => setGlobalLayout(value as keyof typeof layouts)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(layouts).map(([id, layout]) => (
                        <SelectItem key={id} value={id}>
                          <div className="flex items-center gap-2">
                            <layout.icon className="h-4 w-4" />
                            {layout.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
  
              {/* Layout Overview */}
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(layouts).map(([id, layout]) => (
                  <Card key={id}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <layout.icon className="h-5 w-5" />
                        <CardTitle className="text-base">{layout.label}</CardTitle>
                      </div>
                      <CardDescription>{layout.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Best For</h4>
                          <div className="flex flex-wrap gap-2">
                            {layout.suitableFor.map((item) => (
                              <Badge key={item} variant="secondary">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Features</h4>
                          <div className="flex flex-wrap gap-2">
                            {layout.features.map((feature) => (
                              <Badge key={feature} variant="outline">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </>
    );
  };
  
  // Layout Provider Component
  export const LayoutProvider = ({ children }) => {
    const pathname = usePathname();
    const { globalLayout, sectionLayouts } = useLayoutStore();
  
    // Get current section from pathname
    const currentSection = pathname.split('/')[1] || 'root';
  
    // Get effective layout for current section
    const currentLayout = sectionLayouts[currentSection] || globalLayout;
  
    // Get layout component
    const LayoutComponent = layouts[currentLayout].component;
  
    return <LayoutComponent>{children}</LayoutComponent>;
  };