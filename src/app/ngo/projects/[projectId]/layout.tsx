import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { ProjectHeader } from '../../components/Header';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Menu, Heart, Users, Bell, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNGOProjectStore } from '@/stores/useNGOProjectStore';

const navigation = [
  { name: 'Overview', href: '', icon: ChevronLeft },
  { name: 'Impact', href: '/impact', icon: Heart },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Gallery', href: '/gallery', icon: Bell },
  { name: 'Stories', href: '/stories', icon: Bell },
  { name: 'Updates', href: '/updates', icon: Bell },
];

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const { getProjectById } = useNGOProjectStore();
  const project = getProjectById(projectId);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (!project) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          {/* Back button */}
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => router.push('/ngo/projects')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">{project.name}</h2>
            <Badge variant="outline">{project.status}</Badge>
          </div>

          {/* Right side items */}
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => {}}>
              <Heart className="h-4 w-4 mr-2" />
              Donate
            </Button>
            <Button variant="outline" size="sm" onClick={() => {}}>
              <Users className="h-4 w-4 mr-2" />
              Volunteer
            </Button>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => {}}>
                  Download Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  Share Project
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/ngo/projects/${projectId}/settings`)}>
                  Project Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Sidebar */}
        <aside className={cn(
          "fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 border-r bg-background transition-all duration-300 md:sticky",
          sidebarCollapsed && "w-16",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          {/* Collapse button */}
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

          {/* Navigation */}
          <nav className="space-y-1 p-4">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  sidebarCollapsed && "justify-center px-2"
                )}
                onClick={() => router.push(`/ngo/projects/${projectId}${item.href}`)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {!sidebarCollapsed && item.name}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden">
          <div className="container p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileNavOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/80 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
    </div>
  );
}

// 'use client'

// import { Suspense } from 'react';
// import { useNGOProject } from '@/hooks/useNGOProject';
// import { ProjectHeader } from './../../components/Header';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Button } from '@/components/ui/button';
// import { Share2, FileText } from 'lucide-react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';

// interface ProjectLayoutProps {
//   params: { id: string };
//   children: React.ReactNode;
// }

// export default function ProjectLayout({ params, children }: ProjectLayoutProps) {
//   const { getProjectById, isLoading } = useNGOProject();
//   const project = getProjectById(params.id);
//   const pathname = usePathname();

//   if (!project) {
//     return <div>Project not found</div>;
//   }

//   const tabs = [
//     { value: 'overview', label: 'Overview', href: `/ngo/projects/${params.id}` },
//     { value: 'team', label: 'Team', href: `/ngo/projects/${params.id}/team` },
//     { value: 'updates', label: 'Updates', href: `/ngo/projects/${params.id}/updates` },
//     { value: 'impact', label: 'Impact', href: `/ngo/projects/${params.id}/impact` },
//     { value: 'donors', label: 'Donors', href: `/ngo/projects/${params.id}/donors` },
//     { value: 'gallery', label: 'Gallery', href: `/ngo/projects/${params.id}/gallery` },
//   ];

//   const currentTab = tabs.find(tab => pathname.includes(tab.value))?.value || 'overview';

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-8 space-y-8">
//         <Suspense fallback={<div>Loading header...</div>}>
//           <ProjectHeader 
//             projectId={params.id}
//             onDonate={() => {}}
//             onVolunteer={() => {}}
//           />
//         </Suspense>

//         <div className="flex justify-end gap-4">
//           <Button variant="outline">
//             <Share2 className="w-4 h-4 mr-2" />
//             Share
//           </Button>
//           <Button variant="outline">
//             <FileText className="w-4 h-4 mr-2" />
//             Generate Report
//           </Button>
//         </div>

//         <Tabs value={currentTab} className="space-y-6">
//           <TabsList className="grid w-full grid-cols-6">
//             {tabs.map(tab => (
//               <TabsTrigger 
//                 key={tab.value} 
//                 value={tab.value}
//                 asChild
//               >
//                 <Link href={tab.href}>{tab.label}</Link>
//               </TabsTrigger>
//             ))}
//           </TabsList>

//           <Suspense 
//             fallback={
//               <div className="w-full h-32 animate-pulse bg-muted rounded-lg" />
//             }
//           >
//             {children}
//           </Suspense>
//         </Tabs>
//       </div>
//     </div>
//   );
// }