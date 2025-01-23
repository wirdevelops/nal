import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Film,
  Newspaper,
  Users,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Search,
  Bell,
  Plus,
  MessageCircle,
  Settings,
  Home,
  Briefcase,
  Mic,
  Pencil,
  Video,
  Image as ImageIcon,
  FileText,
  LayoutGrid,
  Palette,
  ChevronRight,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const EnhancedHubLayout = ({ children }) => {
  const [currentHub, setCurrentHub] = useState('create');
  const [quickAccessOpen, setQuickAccessOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hubs = [
    {
      id: 'create',
      label: 'Create',
      icon: Film,
      color: 'bg-blue-500',
      subItems: [
        { label: 'Projects', icon: Film },
        { label: 'Scripts', icon: FileText },
        { label: 'Storyboard', icon: Palette },
        { label: 'Shot Lists', icon: Video }
      ]
    },
    {
      id: 'content',
      label: 'Content',
      icon: Newspaper,
      color: 'bg-purple-500',
      subItems: [
        { label: 'Blog Posts', icon: Pencil },
        { label: 'Podcasts', icon: Mic },
        { label: 'Media Library', icon: ImageIcon },
        { label: 'Portfolio', icon: LayoutGrid }
      ]
    },
    {
      id: 'community',
      label: 'Community',
      icon: Users,
      color: 'bg-green-500',
      subItems: [
        { label: 'NGO Projects', icon: Heart },
        { label: 'Team Members', icon: Users },
        { label: 'Events', icon: Video },
        { label: 'Impact', icon: ChevronRight }
      ]
    },
    {
      id: 'marketplace',
      label: 'Shop',
      icon: ShoppingBag,
      color: 'bg-orange-500',
      subItems: [
        { label: 'Filmmaking Tools', icon: Video },
        { label: 'Templates', icon: FileText },
        { label: 'Services', icon: Users },
        { label: 'Resources', icon: FileText }
      ]
    }
  ];

  const quickTools = [
    { id: 'moodboard', icon: Palette, label: 'Mood Board', badge: 'New' },
    { id: 'scripts', icon: FileText, label: 'Script Editor' },
    { id: 'messages', icon: MessageCircle, label: 'Messages', badge: '3' },
    { id: 'jobs', icon: Briefcase, label: 'Jobs', badge: '5' }
  ];

  const recentItems = [
    { type: 'project', label: 'Action Movie Project', updated: '2h ago' },
    { type: 'script', label: 'Episode 1 Draft', updated: '5h ago' },
    { type: 'ngo', label: 'Community Film Workshop', updated: '1d ago' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="text-xl font-bold text-primary">NE</span>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            {hubs.map((hub) => (
              <Button
                key={hub.id}
                variant={currentHub === hub.id ? 'default' : 'ghost'}
                className="flex items-center gap-2"
                onClick={() => setCurrentHub(hub.id)}
              >
                <div className={cn("w-2 h-2 rounded-full", hub.color)} />
                <hub.icon className="h-4 w-4" />
                <span>{hub.label}</span>
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:flex w-40 lg:w-64">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-8" placeholder="Search..." />
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setQuickAccessOpen(!quickAccessOpen)}
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="border-t">
          <div className="container flex h-10 items-center">
            {currentHub && (
              <nav className="flex items-center space-x-4">
                {hubs.find(h => h.id === currentHub)?.subItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="h-8"
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Quick Access Panel */}
      <div className={cn(
        "fixed right-0 top-14 z-40 w-80 border-l bg-background transition-transform duration-300",
        quickAccessOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Quick Access</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuickAccessOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Quick Tools */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Tools</h4>
              <div className="grid grid-cols-2 gap-2">
                {quickTools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant="outline"
                    className="justify-start h-auto py-4"
                  >
                    <div className="flex flex-col items-center text-center w-full">
                      <tool.icon className="h-6 w-6 mb-1" />
                      <span className="text-sm">{tool.label}</span>
                      {tool.badge && (
                        <Badge variant="secondary" className="mt-1">
                          {tool.badge}
                        </Badge>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Recent Items */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Recent</h4>
              <div className="space-y-1">
                {recentItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <span className="flex-1 text-left">{item.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.updated}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all md:hidden",
        mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 bg-background transition-transform",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex h-14 items-center justify-between px-4 border-b">
            <span className="text-xl font-bold text-primary">NE</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-3.5rem)]">
            <div className="p-4 space-y-4">
              {hubs.map((hub) => (
                <div key={hub.id}>
                  <Button
                    variant={currentHub === hub.id ? 'default' : 'ghost'}
                    className="w-full justify-start mb-2"
                    onClick={() => setCurrentHub(hub.id)}
                  >
                    <hub.icon className="h-5 w-5 mr-2" />
                    {hub.label}
                  </Button>
                  {currentHub === hub.id && (
                    <div className="ml-6 space-y-1">
                      {hub.subItems.map((item, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <main className={cn(
        "container py-6 relative",
        quickAccessOpen && "mr-80"
      )}>
        {children}
      </main>
    </div>
  );
};