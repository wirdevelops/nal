// import React, { useState } from 'react';
// import { ThemeToggle } from '../shared/ThemeToggle';
// import { Button } from '@/components/ui/button';
// import {
//   Menu,
//   X,
//   MessageCircle,
//   Pencil,
//   Video,
//   Image as ImageIcon,
//   PencilRuler,
//   BookOpen,
//   BellDot,
//   Pin,
//   Palette,
//   ClipboardList,
//   Files,
//   Users,
//   Settings,
//   ChevronRight,
//   ChevronLeft,
//   LayoutGrid,
//   Monitor,
//   Inbox,
//   ChevronDown
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Badge } from '@/components/ui/badge';
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from '@/components/ui/tooltip';

// export const ToolCentricLayout = ({ children }) => {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [toolboxExpanded, setToolboxExpanded] = useState(false);
//   const [commsExpanded, setCommsExpanded] = useState(false);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [mobileToolboxOpen, setMobileToolboxOpen] = useState(false);

//   // Navigation Items
//   const mainNavigation = [
//     { icon: Monitor, label: 'Dashboard', href: '/dashboard' },
//     { icon: Video, label: 'Projects', href: '/projects' },
//     { icon: BookOpen, label: 'Scripts', href: '/scripts' },
//     { icon: Users, label: 'Team', href: '/team' },
//     { icon: Files, label: 'Files', href: '/files' },
//     { icon: Settings, label: 'Settings', href: '/settings' }
//   ];

//   // Quick Tools
//   const quickTools = [
//     { icon: Palette, label: 'Mood Board', action: () => {} },
//     { icon: Pencil, label: 'Script Editor', action: () => {} },
//     { icon: PencilRuler, label: 'Storyboard', action: () => {} },
//     { icon: ImageIcon, label: 'Asset Library', action: () => {} },
//     { icon: ClipboardList, label: 'Shot Lists', action: () => {} }
//   ];

//   // Communication Tools
//   const commsTools = [
//     { icon: MessageCircle, label: 'Chat', badge: '3' },
//     { icon: Inbox, label: 'Inbox', badge: '5' },
//     { icon: Users, label: 'Team Chat' },
//     { icon: BellDot, label: 'Notifications', badge: '2' }
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Main Sidebar */}
//       <aside 
//         className={cn(
//           "fixed top-0 left-0 z-30 h-screen border-r bg-card transition-all duration-300",
//           sidebarCollapsed ? "w-16" : "w-64",
//           "hidden md:block"
//         )}
//       >
//         {/* Sidebar Header */}
//         <div className="flex h-16 items-center justify-between px-4 border-b">
//           {!sidebarCollapsed && (
//             <span className="text-xl font-bold text-primary">NE</span>
//           )}
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//           >
//             {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//           </Button>
//         </div>

//         {/* Navigation */}
//         <ScrollArea className="h-[calc(100vh-4rem)]">
//           <div className="p-4 space-y-4">
//             {mainNavigation.map((item, index) => (
//               <TooltipProvider key={index}>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       className={cn(
//                         "w-full justify-start",
//                         sidebarCollapsed && "justify-center px-2"
//                       )}
//                     >
//                       <item.icon className="h-5 w-5" />
//                       {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
//                     </Button>
//                   </TooltipTrigger>
//                   {sidebarCollapsed && (
//                     <TooltipContent side="right">
//                       {item.label}
//                     </TooltipContent>
//                   )}
//                 </Tooltip>
//               </TooltipProvider>
//             ))}
//           </div>
//         </ScrollArea>
//       </aside>

//       {/* Floating Toolbox */}
//       <div 
//         className={cn(
//           "fixed top-20 right-4 z-40 transition-all duration-300 bg-card border rounded-lg shadow-lg",
//           toolboxExpanded ? "w-64" : "w-12"
//         )}
//       >
//         <div 
//           className="absolute -left-3 top-1/2 -translate-y-1/2 bg-background border rounded-full shadow-sm cursor-pointer"
//           onClick={() => setToolboxExpanded(!toolboxExpanded)}
//         >
//           <Button variant="ghost" size="icon" className="h-6 w-6">
//             {toolboxExpanded ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//           </Button>
//         </div>

//         <div className="p-2">
//           <div className="flex items-center justify-between mb-2">
//             {toolboxExpanded && <span className="text-sm font-medium">Quick Tools</span>}
//             <Button variant="ghost" size="icon" className="h-8 w-8">
//               <Pin className="h-4 w-4" />
//             </Button>
//           </div>

//           <div className="space-y-1">
//             {quickTools.map((tool, index) => (
//               <TooltipProvider key={index}>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       className={cn(
//                         "w-full justify-start",
//                         !toolboxExpanded && "justify-center px-2"
//                       )}
//                       onClick={tool.action}
//                     >
//                       <tool.icon className="h-4 w-4" />
//                       {toolboxExpanded && <span className="ml-2">{tool.label}</span>}
//                     </Button>
//                   </TooltipTrigger>
//                   {!toolboxExpanded && (
//                     <TooltipContent side="left">
//                       {tool.label}
//                     </TooltipContent>
//                   )}
//                 </Tooltip>
//               </TooltipProvider>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Communication Panel */}
//       <div 
//         className={cn(
//           "fixed bottom-4 right-4 z-40 transition-all duration-300 bg-card border rounded-lg shadow-lg",
//           commsExpanded ? "w-64 h-96" : "w-12 h-auto"
//         )}
//       >
//         <div className="p-2">
//           <div className="flex items-center justify-between mb-2">
//             {commsExpanded && <span className="text-sm font-medium">Communications</span>}
//             <Button 
//               variant="ghost" 
//               size="icon" 
//               className="h-8 w-8"
//               onClick={() => setCommsExpanded(!commsExpanded)}
//             >
//               {commsExpanded ? <ChevronDown className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
//             </Button>
//           </div>

//           {commsExpanded ? (
//             <ScrollArea className="h-80">
//               <div className="space-y-1">
//                 {commsTools.map((tool, index) => (
//                   <Button
//                     key={index}
//                     variant="ghost"
//                     className="w-full justify-start"
//                   >
//                     <tool.icon className="h-4 w-4" />
//                     <span className="ml-2 flex-1">{tool.label}</span>
//                     {tool.badge && (
//                       <Badge variant="secondary" className="ml-2">
//                         {tool.badge}
//                       </Badge>
//                     )}
//                   </Button>
//                 ))}
//               </div>
//             </ScrollArea>
//           ) : (
//             <div className="space-y-1">
//               {commsTools.map((tool, index) => (
//                 tool.badge && (
//                   <Badge key={index} variant="secondary" className="w-8 justify-center">
//                     {tool.badge}
//                   </Badge>
//                 )
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Mobile Header */}
//       <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b h-16">
//         <div className="flex items-center justify-between px-4 h-full">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setMobileSidebarOpen(true)}
//           >
//             <Menu className="h-5 w-5" />
//           </Button>
//           <span className="text-xl font-bold text-primary">NE</span>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setMobileToolboxOpen(true)}
//           >
//             <LayoutGrid className="h-5 w-5" />
//           </Button>
//         </div>
//       </header>

//       {/* Mobile Sidebar */}
//       <div className={cn(
//         "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all md:hidden",
//         mobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//       )}>
//         <div className={cn(
//           "fixed inset-y-0 left-0 z-50 w-80 bg-background transition-transform",
//           mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         )}>
//           {/* Mobile sidebar content */}
//         </div>
//       </div>

//       {/* Mobile Toolbox */}
//       <div className={cn(
//         "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all md:hidden",
//         mobileToolboxOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//       )}>
//         <div className={cn(
//           "fixed inset-y-0 right-0 z-50 w-80 bg-background transition-transform",
//           mobileToolboxOpen ? "translate-x-0" : "translate-x-full"
//         )}>
//           {/* Mobile toolbox content */}
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className={cn(
//         "transition-all duration-300",
//         "md:ml-64",
//         sidebarCollapsed && "md:ml-16"
//       )}>
//         <div className="min-h-screen pt-16 md:pt-0 px-4 md:px-8 py-6">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// };