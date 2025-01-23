"use client"

import React, { useState } from 'react';
import {
  Search,
  Menu,
  X,
  Film,
  Users,
  ShoppingBag,
  Heart,
  Mic,
  Newspaper,
  BriefcaseIcon,
  Folder,
  Home,
  Settings,
  ChevronDown, 
  Calendar, 
  Clock, 
  MessageSquare, 
  VideoIcon 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { ThemeToggle } from '../shared/ThemeToggle';
import { Button } from '@/components/ui/button';

// Layout 1: Modern Sidebar with Collapsible Menu
const SidebarLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const menuItems = [
    { icon: <Film className="w-5 h-5" />, label: 'Projects', href: '/projects' },
    { icon: <Users className="w-5 h-5" />, label: 'Crew', href: '/crew' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Schedule', href: '/schedule' },
    { icon: <VideoIcon className="w-5 h-5" />, label: 'Assets', href: '/assets' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Communications', href: '/communications' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-background">
      <aside className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 border-r bg-card`}>
        <div className="flex items-center justify-between p-4">
          {!collapsed && <span className="text-xl font-bold text-red-600">NE</span>}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </Button>
        </div>
        <nav className="mt-4">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-200 dark:hover:bg-red-900/20"
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <header className="flex items-center justify-between p-4 border-b">
          <h1 className="text-2xl font-bold text-red-600">Nalevel Empire</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline">Sign Out</Button>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

// Layout 2: Top Navigation with Quick Access
const TopNavLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-red-600 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl font-bold">NE</span>
              <nav className="hidden md:ml-8 md:flex md:space-x-6">
                <a href="/projects" className="px-3 py-2 hover:bg-red-500 rounded-md">Projects</a>
                <a href="/crew" className="px-3 py-2 hover:bg-red-500 rounded-md">Crew</a>
                <a href="/schedule" className="px-3 py-2 hover:bg-red-500 rounded-md">Schedule</a>
                <a href="/assets" className="px-3 py-2 hover:bg-red-500 rounded-md">Assets</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="outline" className="text-white border-white hover:bg-red-500">
                Sign Out
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-6 h-6 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      {mobileMenuOpen && (
        <div className="md:hidden bg-red-600 text-white">
          <nav className="px-4 py-2 space-y-2">
            <a href="/projects" className="block px-3 py-2 hover:bg-red-500 rounded-md">Projects</a>
            <a href="/crew" className="block px-3 py-2 hover:bg-red-500 rounded-md">Crew</a>
            <a href="/schedule" className="block px-3 py-2 hover:bg-red-500 rounded-md">Schedule</a>
            <a href="/assets" className="block px-3 py-2 hover:bg-red-500 rounded-md">Assets</a>
          </nav>
        </div>
      )}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {children}
      </main>
    </div>
  );
};

// Layout 3: Split View with Context Navigation
const SplitViewLayout = ({ children }) => {
  const [selectedContext, setSelectedContext] = useState('projects');
  
  const contexts = {
    projects: {
      icon: <Folder className="w-5 h-5" />,
      items: ['Active Projects', 'Drafts', 'Archived', 'Templates']
    },
    crew: {
      icon: <Users className="w-5 h-5" />,
      items: ['Directory', 'Teams', 'Availability', 'Skills']
    },
    schedule: {
      icon: <Clock className="w-5 h-5" />,
      items: ['Timeline', 'Calendar', 'Deadlines', 'Milestones']
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <span className="text-2xl font-bold text-red-600">NE</span>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="outline">Sign Out</Button>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex gap-6">
          <aside className="w-48 flex-shrink-0">
            <nav className="space-y-1">
              {Object.entries(contexts).map(([key, { icon }]) => (
                <button
                  key={key}
                  onClick={() => setSelectedContext(key)}
                  className={`w-full flex items-center px-4 py-2 rounded-md ${
                    selectedContext === key
                      ? 'bg-red-600 text-white'
                      : 'hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20'
                  }`}
                >
                  {icon}
                  <span className="ml-3 capitalize">{key}</span>
                </button>
              ))}
            </nav>
          </aside>
          <div className="flex-1">
            <div className="mb-6 border-b">
              <nav className="flex space-x-4">
                {contexts[selectedContext].items.map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="px-3 py-2 text-sm font-medium hover:text-red-600"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Layout 4: MegaMenu

// Option 1: MegaMenu Style Layout
export const MegaMenuLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavItems = [
    {
      label: 'Projects',
      icon: Film,
      items: ['My Projects', 'Templates', 'Browse', 'Activity']
    },
    {
      label: 'Content',
      icon: Newspaper,
      items: ['Blog', 'Podcast', 'Reviews', 'News']
    },
    {
      label: 'Community',
      icon: Users,
      items: ['NGO', 'Donations', 'Impact', 'Events']
    },
    {
      label: 'Marketplace',
      icon: ShoppingBag,
      items: ['Tools', 'Resources', 'Services', 'Deals']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <span className="text-xl font-bold text-primary">NE</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {mainNavItems.map((item, index) => (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                      <ChevronDown className="w-3 h-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {item.items.map((subItem, i) => (
                      <DropdownMenuItem key={i}>
                        {subItem}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </nav>

            {/* Quick Actions */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Access Bar */}
        <div className="border-t bg-muted/50">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex h-10 items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <BriefcaseIcon className="w-4 h-4 mr-2" />
                  Jobs
                </Button>
                <Button variant="ghost" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Casting
                </Button>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-8" placeholder="Search..." />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 z-50 bg-background md:hidden transition-transform duration-300 transform",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full overflow-auto py-6 px-4">
          {mainNavItems.map((item, index) => (
            <div key={index} className="py-2">
              <div className="flex items-center gap-2 font-medium py-2">
                <item.icon className="w-5 h-5" />
                {item.label}
              </div>
              <div className="ml-6 space-y-1">
                {item.items.map((subItem, i) => (
                  <Button key={i} variant="ghost" className="w-full justify-start">
                    {subItem}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {children}
      </main>
    </div>
  );
};

// Option 2: Sidebar with Categories Layout
export const SidebarCategoryLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    {
      label: 'Create',
      items: [
        { icon: Film, label: 'Projects' },
        { icon: Folder, label: 'Assets' },
        { icon: Users, label: 'Teams' }
      ]
    },
    {
      label: 'Explore',
      items: [
        { icon: Newspaper, label: 'Blog' },
        { icon: Mic, label: 'Podcast' },
        { icon: BriefcaseIcon, label: 'Jobs' }
      ]
    },
    {
      label: 'Community',
      items: [
        { icon: Heart, label: 'NGO' },
        { icon: Users, label: 'Casting' }
      ]
    },
    {
      label: 'Shop',
      items: [
        { icon: ShoppingBag, label: 'Tools' },
        { icon: Users, label: 'Services' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="md:hidden border-b bg-card">
        <div className="flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="text-xl font-bold text-primary">NE</span>
          <ThemeToggle />
        </div>
      </header>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        "hidden md:block border-r bg-card"
      )}>
        <div className="flex h-16 items-center justify-between px-4">
          {!collapsed && <span className="text-xl font-bold text-primary">NE</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
        </div>

        <div className="space-y-6 p-4">
          {categories.map((category, index) => (
            <div key={index}>
              {!collapsed && (
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {category.label}
                </h3>
              )}
              <div className="space-y-1">
                {category.items.map((item, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      collapsed && "px-2"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {!collapsed && <span className="ml-3">{item.label}</span>}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 z-50 bg-background md:hidden transition-transform duration-300 transform",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full overflow-auto py-6 px-4">
          {categories.map((category, index) => (
            <div key={index} className="py-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {category.label}
              </h3>
              <div className="space-y-1">
                {category.items.map((item, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300",
        collapsed ? "md:ml-16" : "md:ml-64",
        "md:p-6"
      )}>
        <div className="mx-auto max-w-7xl px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

// Option 3: Hub Style Layout
export const HubLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hubs = [
    {
      id: 'create',
      label: 'Create',
      icon: Film,
      color: 'bg-blue-500'
    },
    {
      id: 'content',
      label: 'Content',
      icon: Newspaper,
      color: 'bg-purple-500'
    },
    {
      id: 'community',
      label: 'Community',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      id: 'marketplace',
      label: 'Shop',
      icon: ShoppingBag,
      color: 'bg-orange-500'
    }
  ];

  const quickActions = [
    { icon: BriefcaseIcon, label: 'Jobs' },
    { icon: Users, label: 'Casting' },
    { icon: Heart, label: 'NGO' },
    { icon: Mic, label: 'Podcast' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <span className="text-xl font-bold text-primary">NE</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {hubs.map((hub, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <div className={cn(
                "w-2 h-2 rounded-full mr-3",
                hub.color
              )} />
              <hub.icon className="w-5 h-5 mr-2" />
              {hub.label}
            </Button>
          ))}

          <div className="mt-4 pt-4 border-t">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Quick Actions
            </h3>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start mb-2"
              >
                <action.icon className="w-5 h-5 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Hub Context Menu - Desktop */}
        <div className="hidden md:flex mb-8 items-center justify-between">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Overview
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
                <DropdownMenuItem>Favorites</DropdownMenuItem>
                <DropdownMenuItem>Recent</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Preferences
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Share</Button>
            <Button size="sm">Create New</Button>
          </div>
        </div>

        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="grid grid-cols-4 h-16">
          {hubs.map((hub, index) => (
            <Button
              key={index}
              variant="ghost"
              className="h-full rounded-none flex flex-col items-center justify-center gap-1"
            >
              <hub.icon className="w-5 h-5" />
              <span className="text-xs">{hub.label}</span>
            </Button>
          ))}
        </div>
      </nav>
      </header>
    </div>
  );
};

export { SidebarLayout, TopNavLayout, SplitViewLayout };