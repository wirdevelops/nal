// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { ThemeToggle } from '@/components/shared/ThemeToggle';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import {
//   Film,
//   PenTool,
//   Users,
//   Heart,
//   ShoppingBag,
//   Calendar,
//   BarChart,
//   Plus,
//   Menu,
//   Search,
//   MoreVertical,
//   MessageCircle,
//   Video,
//   ArrowUpRight,
//   BellRing,
//   X
// } from 'lucide-react';
// import { cn } from '@/lib/utils';

// // Dashboard widgets configuration
// const availableWidgets = [
//   {
//     id: 'projects',
//     title: 'Active Projects',
//     description: 'Your current film and video projects',
//     icon: Film,
//     size: 'large',
//     color: 'bg-blue-500'
//   },
//   {
//     id: 'ngo',
//     title: 'NGO Initiatives',
//     description: 'Active community projects and impact',
//     icon: Heart,
//     size: 'medium',
//     color: 'bg-red-500'
//   },
//   {
//     id: 'content',
//     title: 'Content Creation',
//     description: 'Blog posts and podcasts',
//     icon: PenTool,
//     size: 'medium',
//     color: 'bg-purple-500'
//   },
//   {
//     id: 'team',
//     title: 'Team Overview',
//     description: 'Team members and roles',
//     icon: Users,
//     size: 'medium',
//     color: 'bg-green-500'
//   },
//   {
//     id: 'marketplace',
//     title: 'Marketplace',
//     description: 'Tools and services activity',
//     icon: ShoppingBag,
//     size: 'medium',
//     color: 'bg-orange-500'
//   },
//   {
//     id: 'calendar',
//     title: 'Schedule',
//     description: 'Upcoming events and deadlines',
//     icon: Calendar,
//     size: 'large',
//     color: 'bg-yellow-500'
//   },
//   {
//     id: 'analytics',
//     title: 'Analytics',
//     description: 'Platform performance metrics',
//     icon: BarChart,
//     size: 'medium',
//     color: 'bg-cyan-500'
//   },
//   {
//     id: 'communications',
//     title: 'Communications',
//     description: 'Messages and notifications',
//     icon: MessageCircle,
//     size: 'small',
//     color: 'bg-indigo-500'
//   }
// ];

// export const DashboardLayout = ({ children }) => {
//   const [activeWidgets, setActiveWidgets] = useState(availableWidgets);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [widgetDrawerOpen, setWidgetDrawerOpen] = useState(false);

//   // Quick Actions
//   const quickActions = [
//     { icon: Plus, label: 'New Project', action: () => {} },
//     { icon: Video, label: 'Upload Content', action: () => {} },
//     { icon: Calendar, label: 'Schedule Event', action: () => {} },
//     { icon: MessageCircle, label: 'Team Chat', action: () => {}, badge: '3' }
//   ];

//   // Recent Activity
//   const recentActivity = [
//     { type: 'project', title: 'Movie Project Updated', time: '2h ago' },
//     { type: 'blog', title: 'New Blog Post Published', time: '4h ago' },
//     { type: 'ngo', title: 'Community Event Created', time: '1d ago' }
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-14 items-center justify-between">
//           {/* Left */}
//           <div className="flex items-center gap-4">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="md:hidden"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               <Menu className="h-5 w-5" />
//             </Button>
//             <span className="text-xl font-bold text-primary">NE</span>
//           </div>

//           {/* Center - Search */}
//           <div className="hidden md:flex flex-1 max-w-xl mx-8">
//             <div className="relative w-full">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input className="w-full pl-9" placeholder="Search across all features..." />
//             </div>
//           </div>

//           {/* Right */}
//           <div className="flex items-center gap-4">
//             <Button variant="ghost" size="icon" className="relative">
//               <BellRing className="h-5 w-5" />
//               <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
//                 3
//               </span>
//             </Button>
//             <ThemeToggle />
//             <Button variant="outline" size="sm">New</Button>
//           </div>
//         </div>
//       </header>

//       {/* Quick Access Bar */}
//       <div className="border-b bg-muted/50">
//         <div className="container flex h-12 items-center gap-4">
//           {quickActions.map((action, index) => (
//             <Button
//               key={index}
//               variant="ghost"
//               size="sm"
//               onClick={action.action}
//               className="relative"
//             >
//               <action.icon className="h-4 w-4 mr-2" />
//               {action.label}
//               {action.badge && (
//                 <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
//                   {action.badge}
//                 </span>
//               )}
//             </Button>
//           ))}
//         </div>
//       </div>

//       {/* Main Dashboard */}
//       <main className="container py-6">
//         {/* Dashboard Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
//             <p className="text-muted-foreground">
//               Overview of your platform activities
//             </p>
//           </div>
//           <Button onClick={() => setWidgetDrawerOpen(true)}>
//             <Plus className="h-4 w-4 mr-2" />
//             Add Widget
//           </Button>
//         </div>

//         {/* Widgets Grid */}
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {activeWidgets.map((widget) => (
//             <Card
//               key={widget.id}
//               className={cn(
//                 "overflow-hidden",
//                 widget.size === 'large' && "md:col-span-2",
//                 widget.size === 'full' && "md:col-span-3"
//               )}
//             >
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <div className="flex items-center space-x-2">
//                   <div className={cn("p-2 rounded-md", widget.color)}>
//                     <widget.icon className="h-4 w-4 text-white" />
//                   </div>
//                   <div>
//                     <CardTitle className="text-sm font-medium">
//                       {widget.title}
//                     </CardTitle>
//                     <CardDescription>
//                       {widget.description}
//                     </CardDescription>
//                   </div>
//                 </div>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="icon">
//                       <MoreVertical className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem>Customize</DropdownMenuItem>
//                     <DropdownMenuItem>Refresh</DropdownMenuItem>
//                     <DropdownMenuItem>Move Up</DropdownMenuItem>
//                     <DropdownMenuItem>Move Down</DropdownMenuItem>
//                     <DropdownMenuItem className="text-red-600">
//                       Remove
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </CardHeader>
//               <CardContent>
//                 {/* Widget specific content would go here */}
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Recent Activity Feed */}
//         <div className="mt-8">
//           <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
//           <div className="space-y-4">
//             {recentActivity.map((activity, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between p-4 rounded-lg border bg-card"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="rounded-full p-2 bg-muted">
//                     {activity.type === 'project' ? (
//                       <Film className="h-4 w-4" />
//                     ) : activity.type === 'blog' ? (
//                       <PenTool className="h-4 w-4" />
//                     ) : (
//                       <Heart className="h-4 w-4" />
//                     )}
//                   </div>
//                   <div>
//                     <p className="font-medium">{activity.title}</p>
//                     <p className="text-sm text-muted-foreground">{activity.time}</p>
//                   </div>
//                 </div>
//                 <Button variant="ghost" size="icon">
//                   <ArrowUpRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>

//       {/* Widget Drawer */}
//       <div className={cn(
//         "fixed inset-y-0 right-0 w-80 bg-background border-l transform transition-transform",
//         widgetDrawerOpen ? "translate-x-0" : "translate-x-full"
//       )}>
//         <div className="p-4">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="font-semibold">Add Widgets</h3>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setWidgetDrawerOpen(false)}
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//           <div className="space-y-2">
//             {availableWidgets.map((widget) => (
//               <Button
//                 key={widget.id}
//                 variant="outline"
//                 className="w-full justify-start"
//               >
//                 <widget.icon className="h-4 w-4 mr-2" />
//                 {widget.title}
//               </Button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <div className={cn(
//         "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all md:hidden",
//         mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//       )}>
//         <div className={cn(
//           "fixed inset-y-0 left-0 z-50 w-80 bg-background transition-transform",
//           mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
//         )}>
//           <div className="p-4">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               <X className="h-5 w-5" />
//             </Button>
//             {/* Mobile menu content would go here */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };