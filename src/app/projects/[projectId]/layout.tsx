'use client'

import { useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ProjectSwitcher } from '../components/ProjectSwitcher';
import { ProjectHeader } from '../components/ProjectHeader';
import { useProject } from 'others/useProjectHooks';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/layout/UserMenu';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, Menu, Bell, MoreVertical,
  Film, Users, FileText, Calendar, Settings,
  MessageSquare, DollarSign, Palette
} from 'lucide-react';

const getProjectNavigation = (projectType: string) => {
  const commonNav = [
    { label: 'Overview', href: '', icon: Film },
    { label: 'Team', href: '/team', icon: Users },
    { label: 'Files', href: '/files', icon: FileText },
    { label: 'Schedule', href: '/schedule', icon: Calendar },
    { label: 'Chat', href: '/chat', icon: MessageSquare },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const typeSpecificNav = {
    'film': [
      { label: 'Script', href: '/script', icon: FileText },
      { label: 'Cast', href: '/cast', icon: Users },
      { label: 'Budget', href: '/budget', icon: DollarSign },
      { label: 'Moodboard', href: '/moodboard', icon: Palette },
    ],
    'series': [
      { label: 'Episodes', href: '/episodes', icon: FileText },
      { label: 'Cast', href: '/cast', icon: Users },
      { label: 'Budget', href: '/budget', icon: DollarSign },
    ],
  };

  return [...commonNav, ...(typeSpecificNav[projectType] || [])];
};

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  const params = useParams();
  const pathname = usePathname();
  const projectId = params.projectId as string;
  const { project } = useProject(projectId);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (!project) return null;

  const navigation = getProjectNavigation(project.type);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1 flex items-center gap-4">
            <ProjectSwitcher currentProjectId={projectId} />
            <nav className="hidden md:flex items-center gap-6">
              {navigation.slice(0, 4).map((item) => (
                <Link
                  key={item.href}
                  href={`/projects/${projectId}${item.href}`}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                    pathname === `/projects/${projectId}${item.href}` ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Sidebar */}
        <aside className={cn(
          "fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 border-r bg-background transition-all duration-300 md:sticky",
          sidebarCollapsed && "w-16",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 hidden md:flex"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform",
              sidebarCollapsed && "rotate-180"
            )} />
          </Button>

          <nav className="space-y-1 p-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={`/projects/${projectId}${item.href}`}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname === `/projects/${projectId}${item.href}`
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50"
                )}
              >
                <item.icon className="h-4 w-4" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-x-hidden">
          <div className="p-4 md:p-6 lg:p-8">
            <ProjectHeader project={project} />
            {children}
          </div>
        </main>
      </div>

      {mobileNavOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/80 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
    </div>
  );
}

// 'use client';

// import { useState } from 'react';
// import { useParams } from 'next/navigation';
// import { ProjectNavigation } from '../components/ProjectNavigation';
// import { ProjectSwitcher } from '../components/ProjectSwitcher';
// import { ThemeToggle } from '../../../components/shared/ThemeToggle';
// import { Button } from '@/components/ui/button';
// import { ChevronLeft, Menu, Bell, MoreVertical } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { useProject } from '@/hooks/useProjectHooks';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';

// import { ProjectHeader } from '../components/ProjectHeader';


// interface ProjectLayoutProps {
//   children: React.ReactNode;
// }

// export default function ProjectLayout({ children }: ProjectLayoutProps) {
//   const params = useParams();
//   const projectId = params.projectId as string;
//   const { project } = useProject(projectId);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [mobileNavOpen, setMobileNavOpen] = useState(false);

//   if (!project) return null;

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-14 items-center">
//           {/* Mobile menu button */}
//           <Button
//             variant="ghost"
//             size="icon"
//             className="md:hidden mr-2"
//             onClick={() => setMobileNavOpen(!mobileNavOpen)}
//           >
//             <Menu className="h-5 w-5" />
//           </Button>

//           {/* Project Switcher */}
//           <div className="mr-4">
//             <ProjectSwitcher 
//               currentProjectId={projectId}
//             />
//           </div>

//           {/* Project Status Badges */}
//           <div className="hidden md:flex items-center gap-2">
//             <Badge variant="outline">{project.phase}</Badge>
//             <Badge 
//               variant={project.status === 'active' ? 'default' : 'secondary'}
//             >
//               {project.status}
//             </Badge>
//           </div>

//           {/* Right side items */}
//           <div className="ml-auto flex items-center gap-2">
//             <Button variant="ghost" size="icon">
//               <Bell className="h-5 w-5" />
//             </Button>
//             <ThemeToggle />
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon">
//                   <MoreVertical className="h-5 w-5" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                 <DropdownMenuItem onClick={() => window.location.href = '/projects'}>
//                   All Projects
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => window.location.href = `/projects/${projectId}/settings`}>
//                   Project Settings
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>
//                   Help Center
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>
//                   Documentation
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>
//                   Sign out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="flex min-h-[calc(100vh-3.5rem)]">
//         {/* Sidebar */}
//         <aside className={cn(
//           "fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 border-r bg-background transition-all duration-300 md:sticky",
//           sidebarCollapsed && "w-16",
//           mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//         )}>
//           {/* Collapse button */}
//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute right-2 top-2 hidden md:flex"
//             onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//           >
//             <ChevronLeft className={cn(
//               "h-4 w-4 transition-transform",
//               sidebarCollapsed && "rotate-180"
//             )} />
//           </Button>

//           {/* Navigation */}
//           <ProjectNavigation
//             projectId={projectId}
//             collapsed={sidebarCollapsed}
//           />
//         </aside>

//         {/* Main Content Area */}
//         <main className="flex-1 overflow-x-hidden ">
//           <div className="p-4 md:p-6 lg:p-8">
//             <ProjectHeader project={project} />
//             {children}
//           </div>
//       </main>
//       </div>

//       {/* Mobile Navigation Overlay */}
//       {mobileNavOpen && (
//         <div 
//           className="fixed inset-0 z-20 bg-black/80 md:hidden"
//           onClick={() => setMobileNavOpen(false)}
//         />
//       )}
//     </div>
//   );
// }

// // app/projects/[projectId]/layout.tsx
// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { useParams, usePathname } from 'next/navigation';
// import { useProjectStore } from '@/app/stores/useProjectStore';
// import { 
//   FileText, Users, Calendar, DollarSign,
//   Settings, Home, Bell, MoreVertical,
//   Film, Video, Palette
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { ProjectSwitcher } from '../components/ProjectSwitcher';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';

// // Define navigation items for each project type
// const projectTypeNavigation = {
//   feature: [
//     { icon: Home, label: 'Overview', path: '' },
//     { icon: FileText, label: 'Script', path: '/script' },
//     { icon: Users, label: 'Cast & Crew', path: '/casting' },
//     { icon: Calendar, label: 'Schedule', path: '/schedule' },
//     { icon: DollarSign, label: 'Budget', path: '/budget' },
//     { icon: Settings, label: 'Settings', path: '/settings' },
//   ],
//   series: [
//     { icon: Home, label: 'Overview', path: '' },
//     { icon: FileText, label: 'Episodes', path: '/episodes' },
//     { icon: Users, label: 'Cast & Crew', path: '/casting' },
//     { icon: Video, label: 'Production', path: '/production' },
//     { icon: Settings, label: 'Settings', path: '/settings' },
//   ],
//   // Add navigation for other project types...
// };

// // Default navigation if project type isn't specifically handled
// const defaultNavigation = [
//   { icon: Home, label: 'Overview', path: '' },
//   { icon: Users, label: 'Team', path: '/team' },
//   { icon: Settings, label: 'Settings', path: '/settings' },
// ];

// export default function ProjectLayout({ children }) {
//   const params = useParams();
//   const pathname = usePathname();
//   const projectId = Array.isArray(params.projectId) ? params.projectId[0] : params.projectId; // Corrected line
//   const { projects } = useProjectStore();
//   const project = projects.find(p => p.id === params.projectId);


//   if (!project) return null;

//   // Get navigation items based on project type
//   const navigation = projectTypeNavigation[project.type] || defaultNavigation;

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Top Navigation */}
//       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-14 items-center justify-between">
//           <div className="flex items-center gap-4">
//             <ProjectSwitcher currentProjectId={projectId} />
//             <nav className="flex items-center space-x-4">
//               {navigation.map((item) => {
//                 const isActive = pathname === `/projects/${params.projectId}${item.path}`;
//                 return (
//                   <Link
//                     key={item.path}
//                     href={`/projects/${params.projectId}${item.path}`}
//                     className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground ${
//                       isActive 
//                         ? 'text-foreground' 
//                         : 'text-foreground/60'
//                     }`}
//                   >
//                     <item.icon className="h-4 w-4" />
//                     {item.label}
//                   </Link>
//                 );
//               })}
//             </nav>
//           </div>

//           {/* Right side actions */}
//           <div className="flex items-center gap-2">
//             <Button variant="ghost" size="icon">
//               <Bell className="h-5 w-5" />
//             </Button>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon">
//                   <MoreVertical className="h-5 w-5" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem>Help Center</DropdownMenuItem>
//                 <DropdownMenuItem>Documentation</DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>Sign out</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container py-6">
//         {children}
//       </main>
//     </div>
//   );
// }


// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { useParams, usePathname } from 'next/navigation';
// import { 
//   PencilLine, Users, Palette, 
//   DollarSign, Settings, Home,
//   Bell, MoreVertical
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { ProjectSwitcher } from '../components/ProjectSwitcher';
// import { ProjectHeader } from '../components/ProjectHeader';
// import { useProjectStore } from '@/app/stores/useProjectStore';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';

// export default function ProjectLayout({ children }) {
//   const params = useParams();
//   const pathname = usePathname();
//   const projectId = Array.isArray(params.projectId) ? params.projectId[0] : params.projectId; // Corrected line
//   const { projects } = useProjectStore();
//   const project = projects.find(p => p.id === projectId);

//   const navigation = [
//     {
//       icon: Home,
//       label: 'Overview',
//       href: `/projects/${projectId}`,
//     },
//     {
//       icon: PencilLine,
//       label: 'Script',
//       href: `/projects/${projectId}/script`,
//     },
//     {
//       icon: Users,
//       label: 'Cast & Crew',
//       href: `/projects/${projectId}/casting`,
//     },
//     {
//       icon: Palette,
//       label: 'Moodboard',
//       href: `/projects/${projectId}/moodboard`,
//     },
//     {
//       icon: DollarSign,
//       label: 'Budget',
//       href: `/projects/${projectId}/budget`,
//     },
//     {
//       icon: Settings,
//       label: 'Settings',
//       href: `/projects/${projectId}/settings`,
//     },
//   ];

//   if (!project) return null;

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Top Navigation */}
//       <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         {/* Project Switcher Bar */}
//         <div className="container flex h-14 items-center justify-between border-b">
//           <ProjectSwitcher currentProjectId={projectId} />
          
//           <div className="flex items-center gap-2">
//             <Button variant="ghost" size="icon">
//               <Bell className="h-5 w-5" />
//             </Button>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon">
//                   <MoreVertical className="h-5 w-5" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem>Help Center</DropdownMenuItem>
//                 <DropdownMenuItem>Documentation</DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>Sign out</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
        
//         {/* Project Header */}
//         <div className="container py-6">
//           <ProjectHeader project={project} />
//         </div>

//         {/* Navigation Tabs */}
//         <div className="container border-t">
//           <nav className="flex items-center space-x-4">
//             {navigation.map((item) => {
//               const isActive = pathname === item.href;
//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors hover:text-foreground ${
//                     isActive 
//                       ? 'border-primary text-foreground' 
//                       : 'border-transparent text-foreground/60 hover:border-foreground/20'
//                   }`}
//                 >
//                   <item.icon className="h-4 w-4" />
//                   {item.label}
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container py-6">
//         {children}
//       </main>
//     </div>
//   );
// }

// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { useParams, usePathname } from 'next/navigation';
// import { 
//   PencilLine, Users, Palette, 
//   DollarSign, Settings, Home,
//   Bell, MoreVertical
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { ProjectSwitcher } from '../components/ProjectSwitcher';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';

// export default function ProjectLayout({ children }) {
//   const params = useParams();
//   const pathname = usePathname();
//   const projectId = params.projectId;

//   const navigation = [
//     {
//       icon: Home,
//       label: 'Overview',
//       href: `/projects/${projectId}`,
//     },
//     {
//       icon: PencilLine,
//       label: 'Script',
//       href: `/projects/${projectId}/script`,
//     },
//     {
//       icon: Users,
//       label: 'Cast & Crew',
//       href: `/projects/${projectId}/casting`,
//     },
//     {
//       icon: Palette,
//       label: 'Moodboard',
//       href: `/projects/${projectId}/moodboard`,
//     },
//     {
//       icon: DollarSign,
//       label: 'Budget',
//       href: `/projects/${projectId}/budget`,
//     },
//     {
//       icon: Settings,
//       label: 'Settings',
//       href: `/projects/${projectId}/settings`,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Top Navigation */}
//       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-14 items-center justify-between">
//           <div className="flex items-center gap-4">
//             <ProjectSwitcher currentProjectId={projectId} />
//             <nav className="flex items-center space-x-4">
//               {navigation.map((item) => {
//                 const isActive = pathname === item.href;
//                 return (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground ${
//                       isActive 
//                         ? 'text-foreground' 
//                         : 'text-foreground/60'
//                     }`}
//                   >
//                     <item.icon className="h-4 w-4" />
//                     {item.label}
//                   </Link>
//                 );
//               })}
//             </nav>
//           </div>

//           {/* Right side actions */}
//           <div className="flex items-center gap-2">
//             <Button variant="ghost" size="icon">
//               <Bell className="h-5 w-5" />
//             </Button>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon">
//                   <MoreVertical className="h-5 w-5" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem>Help Center</DropdownMenuItem>
//                 <DropdownMenuItem>Documentation</DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>Sign out</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container py-6">
//         {children}
//       </main>
//     </div>
//   );
// }