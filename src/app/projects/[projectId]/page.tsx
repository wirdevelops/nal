'use client';

import { useEffect } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter, usePathname } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, BarChart, Calendar, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function ProjectOverview({ params }) {
  const router = useRouter();
  const pathname = usePathname();
  const { projects } = useProjectStore();
  const project = projects.find(p => p.id === params.projectId);

  useEffect(() => {
    if (!project) {
      router.push('/projects');
    }
  }, [project, router]);

  if (!project) return null;

  const stats = [
    {
      title: 'Days Active',
      icon: Clock,
      content: Math.floor((new Date().getTime() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
    },
    {
      title: 'Team Members',
      icon: Users,
      content: project.team,
    },
    {
      title: 'Progress',
      icon: BarChart,
      content: `${project.progress}%`,
    },
    {
      title: 'Target Date',
      icon: Calendar,
      content: project.targetDate ? format(new Date(project.targetDate), "MMM d") : 'Not set',
    }
  ];

  const handleSettingsClick = () => {
    router.push(`/projects/${project.id}/settings`);
  };

  return (
    <div className="space-y-6 py-4">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full overflow-x-auto md:overflow-visible">
          <TabsTrigger 
            value="overview" 
            className="px-4 py-2 data-[state=active]:bg-accent/50"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="activity" 
            className="px-4 py-2 data-[state=active]:bg-accent/50"
          >
            Activity
          </TabsTrigger>
          <TabsTrigger 
            value="files" 
            className="px-4 py-2 data-[state=active]:bg-accent/50"
          >
            Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card 
                key={stat.title}
                className="hover:shadow-md transition-shadow duration-200"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stat.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-background">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>About this project</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSettingsClick}
                  aria-label="Edit project settings"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
              <CardDescription className="pt-2 text-base">
                {project.description || 'No description provided'}
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground italic">
                Activity feed coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Project Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground italic">
                File management coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// 'use client';

// import { useEffect } from 'react';
// import { useProjectStore } from '@/stores/useProjectStore';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { useRouter, usePathname } from 'next/navigation';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//   Calendar,
//   Clock,
//   Users,
//   FileText,
//   BarChart,
//   Settings,
//   ChevronRight,
// } from 'lucide-react';
// import { format } from 'date-fns';
// import { 
//     PencilLine, Palette, 
//     DollarSign, Home,
//   } from 'lucide-react';

// export default function ProjectOverview({ params }) {
//     const router = useRouter();
//     const pathname = usePathname();
//     const { projects } = useProjectStore();
//     const project = projects.find(p => p.id === params.projectId);
//   useEffect(() => {
//     if (!project) {
//       router.push('/projects');
//     }
//   }, [project, router]);

//   if (!project) return null;

//   const navigation = [
//     {
//       icon: Home,
//       label: 'Overview',
//       href: `/projects/${params.projectId}`,
//     },
//     {
//       icon: PencilLine,
//       label: 'Script',
//       href: `/projects/${params.projectId}/script`,
//     },
//     {
//       icon: Users,
//       label: 'Cast & Crew',
//       href: `/projects/${params.projectId}/casting`,
//     },
//     {
//       icon: Palette,
//       label: 'Moodboard',
//       href: `/projects/${params.projectId}/moodboard`,
//     },
//     {
//       icon: DollarSign,
//       label: 'Budget',
//       href: `/projects/${params.projectId}/budget`,
//     },
//     {
//       icon: Settings,
//       label: 'Settings',
//       href: `/projects/${params.projectId}/settings`,
//     },
//   ];


//   const handleSettingsClick = () => {
//     router.push(`/projects/${project.id}/settings`);
//   };
//   return (
//     <div className="space-y-6 p-4 md:p-6 lg:p-8">
    

//       {/* Project Details */}
//       <Tabs defaultValue="overview" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="activity">Activity</TabsTrigger>
//           <TabsTrigger value="files">Files</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Days Active
//                 </CardTitle>
//                 <Clock className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {Math.floor((new Date().getTime() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Team Members
//                 </CardTitle>
//                 <Users className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{project.team}</div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Progress
//                 </CardTitle>
//                 <BarChart className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{project.progress}%</div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Target Date
//                 </CardTitle>
//                 <Calendar className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {project.targetDate ? format(new Date(project.targetDate), "MMM d") : 'Not set'}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>About this project</CardTitle>
//               <CardDescription>
//                 {project.description}
//               </CardDescription>
//             </CardHeader>
//           </Card>
//         </TabsContent>

//         <TabsContent value="activity">
//           <Card>
//             <CardHeader>
//               <CardTitle>Recent Activity</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm text-muted-foreground">
//                 Activity feed coming soon...
//               </p>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="files">
//           <Card>
//             <CardHeader>
//               <CardTitle>Project Files</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm text-muted-foreground">
//                 File management coming soon...
//               </p>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }