import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pencil,
  Palette,
  LayoutPanelLeft,
  LayoutPanelTop,
  Video,
  Image as ImageIcon,
  FileText,
  Grid,
  Users,
  MessageCircle,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Maximize2,
  Save,
  Share2,
  MoreVertical,
  PanelLeftClose,
  PanelRightClose,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Workspace panels that can be toggled
const panels = {
  tools: {
    id: 'tools',
    title: 'Tools',
    icon: Grid,
    tools: [
      { id: 'script', icon: Pencil, label: 'Script' },
      { id: 'moodboard', icon: Palette, label: 'Mood Board' },
      { id: 'storyboard', icon: Video, label: 'Storyboard' },
      { id: 'assets', icon: ImageIcon, label: 'Assets' },
      { id: 'shotlist', icon: FileText, label: 'Shot List' }
    ]
  },
  team: {
    id: 'team',
    title: 'Team',
    icon: Users,
    members: [
      { id: 1, name: 'Sarah Director', role: 'Director', online: true },
      { id: 2, name: 'Mike Producer', role: 'Producer', online: false },
      { id: 3, name: 'Alex Writer', role: 'Writer', online: true }
    ]
  },
  comments: {
    id: 'comments',
    title: 'Comments',
    icon: MessageCircle,
    comments: [
      { id: 1, user: 'Sarah', text: 'Updated the mood board', time: '2m ago' },
      { id: 2, user: 'Mike', text: 'Added new shots', time: '5m ago' }
    ]
  }
};

export const WorkspaceLayout = ({ children }) => {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeTool, setActiveTool] = useState('script');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Context-aware toolbar options based on active tool
  const toolbarOptions = {
    script: [
      { icon: Save, label: 'Save' },
      { icon: FileText, label: 'Versions' },
      { icon: Share2, label: 'Share' }
    ],
    moodboard: [
      { icon: Plus, label: 'Add Image' },
      { icon: Grid, label: 'Layout' },
      { icon: Share2, label: 'Share' }
    ],
    storyboard: [
      { icon: Plus, label: 'New Frame' },
      { icon: Video, label: 'Preview' },
      { icon: Share2, label: 'Share' }
    ]
  };

  const currentToolbar = toolbarOptions[activeTool] || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-4">
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

          {/* Context-aware Toolbar */}
          <div className="flex items-center gap-2">
            {currentToolbar.map((tool, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="hidden md:flex"
              >
                <tool.icon className="h-4 w-4 mr-2" />
                {tool.label}
              </Button>
            ))}

            <div className="flex items-center gap-2 ml-4">
              <ThemeToggle />
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left Panel */}
        <aside 
          className={cn(
            "w-64 border-r bg-card transition-all duration-300",
            !leftPanelOpen && "-ml-64"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">{panels.tools.title}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLeftPanelOpen(false)}
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {panels.tools.tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={activeTool === tool.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTool(tool.id)}
                >
                  <tool.icon className="h-4 w-4 mr-2" />
                  {tool.label}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Tool-specific Header */}
          <div className="h-12 border-b bg-muted/30 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!leftPanelOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLeftPanelOpen(true)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
              <h2 className="font-semibold">
                {panels.tools.tools.find(t => t.id === activeTool)?.label}
              </h2>
            </div>

            <Button variant="ghost" size="icon">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </main>

        {/* Right Panel */}
        <aside 
          className={cn(
            "w-80 border-l bg-card transition-all duration-300",
            !rightPanelOpen && "-mr-80"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Workspace</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setRightPanelOpen(false)}
            >
              <PanelRightClose className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              {/* Team Section */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Team Members</h3>
                <div className="space-y-2">
                  {panels.team.members.map((member) => (
                    <div 
                      key={member.id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                    >
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        member.online ? "bg-green-500" : "bg-muted-foreground"
                      )} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments Section */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Comments</h3>
                <div className="space-y-2">
                  {panels.comments.comments.map((comment) => (
                    <div 
                      key={comment.id}
                      className="p-2 rounded-md hover:bg-muted"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{comment.user}</span>
                        <span className="text-xs text-muted-foreground">{comment.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </aside>

        {/* Panel Toggle Buttons */}
        <div className="fixed bottom-4 right-4 flex gap-2">
          {!rightPanelOpen && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setRightPanelOpen(true)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Show Workspace
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
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
              {/* Mobile tools menu */}
              {panels.tools.tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={activeTool === tool.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTool(tool.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  <tool.icon className="h-5 w-5 mr-2" />
                  {tool.label}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};