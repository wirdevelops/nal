// // src/components/layout/CommunicationLayout.jsx
// 'use client';
// import React, { useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { ThemeToggle } from '@/components/shared/ThemeToggle';
// import { Badge } from '@/components/ui/badge';
// import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from '@/components/ui/tooltip';
// import {
//   Menu,
//   MessageCircle,
//   Users,
//   Hash,
//   Search,
//   ChevronRight,
//   ChevronLeft,
//   Plus,
//   Files,
//   Image as ImageIcon,
//   AtSign,
//   Send,
//   Smile,
//   Phone,
//   Video,
//   MoreVertical,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { useAppContext } from '@/components/providers/AppContext';

// export const CommunicationLayout = ({ children }) => {
//   const { layout, updateAppState, appState } = useAppContext();

//   // Mock data for demonstration
//   const channels = [
//     { id: 1, name: 'general', type: 'channel', unread: 2 },
//     { id: 2, name: 'project-alpha', type: 'channel', unread: 0 },
//     { id: 3, name: 'design-team', type: 'channel', unread: 5 }
//   ];

//   const directMessages = [
//     { id: 4, name: 'Sarah Director', status: 'online', unread: 1, avatar: '/avatars/1.png' },
//     { id: 5, name: 'Mike Producer', status: 'away', unread: 0, avatar: '/avatars/2.png' },
//     { id: 6, name: 'Alex Writer', status: 'offline', unread: 3, avatar: '/avatars/3.png' }
//   ];

//   const sharedFiles = [
//     { id: 1, name: 'Script_v2.pdf', type: 'document' },
//     { id: 2, name: 'Concept_Art.jpg', type: 'image' },
//     { id: 3, name: 'Budget.xlsx', type: 'spreadsheet' }
//   ];

//   useEffect(() => {
//     if(!layout || layout !== 'communication') return;

//     // When user switches to communication layout, update initial states
//     updateAppState({
//       communicationState: {
//         commsCollapsed: false,
//         selectedChat: null,
//         mobileMenuOpen: false,
//         mobileChatOpen: false,
//       }
//     });

//   }, [layout]);

//    const commsCollapsed = layout === 'communication' ?  appState?.communicationState?.commsCollapsed : false;
//    const selectedChat = layout === 'communication' ?  appState?.communicationState?.selectedChat : null;
//    const mobileMenuOpen = layout === 'communication' ?  appState?.communicationState?.mobileMenuOpen : false;
//    const mobileChatOpen = layout === 'communication' ?  appState?.communicationState?.mobileChatOpen : false;

//    const setCommsCollapsed = (value) => {
//       if(layout !== 'communication') return;
//       updateAppState((prev) => ({
//           communicationState: {
//             ...prev.communicationState,
//             commsCollapsed: value,
//           }
//         }))
//    };

//    const setSelectedChat = (value) => {
//       if(layout !== 'communication') return;
//       updateAppState((prev) => ({
//         communicationState: {
//           ...prev.communicationState,
//           selectedChat: value,
//         }
//       }))
//     };

//    const setMobileMenuOpen = (value) => {
//       if(layout !== 'communication') return;
//       updateAppState((prev) => ({
//         communicationState: {
//           ...prev.communicationState,
//           mobileMenuOpen: value,
//         }
//       }))
//     };

//    const setMobileChatOpen = (value) => {
//       if(layout !== 'communication') return;
//       updateAppState((prev) => ({
//         communicationState: {
//           ...prev.communicationState,
//           mobileChatOpen: value,
//         }
//       }))
//     };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Main Header */}
//       <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur z-50">
//         <div className="flex items-center justify-between h-full px-4">
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

//           <div className="flex items-center gap-2">
//             <div className="relative hidden md:flex w-96">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input className="pl-9" placeholder="Search messages, files, and more..." />
//             </div>
//             <ThemeToggle />
//             <Avatar className="h-8 w-8">
//               <AvatarImage src="/avatars/user.png" alt="User" />
//               <AvatarFallback>U</AvatarFallback>
//             </Avatar>
//           </div>
//         </div>
//       </header>

//       <div className="pt-16 flex h-[calc(100vh-4rem)]">
//         {/* Communication Sidebar */}
//         <aside className={cn(
//           "fixed md:relative inset-y-16 left-0 z-40 bg-card border-r transition-all duration-300",
//           commsCollapsed ? "w-20" : "w-80",
//           mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//         )}>
//           {/* Sidebar Header */}
//           <div className="flex items-center justify-between p-4 border-b">
//             {!commsCollapsed && <h2 className="font-semibold">Communications</h2>}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="hidden md:flex"
//               onClick={() => setCommsCollapsed(!commsCollapsed)}
//             >
//               {commsCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//             </Button>
//           </div>

//           <ScrollArea className="h-[calc(100vh-8rem)]">
//             {/* Communication Tools */}
//             <div className="p-2">
//               {!commsCollapsed && <h3 className="px-2 text-sm font-medium text-muted-foreground mb-2">Tools</h3>}
//               <div className="space-y-1">
//                 {[
//                   { icon: MessageCircle, label: 'Chats', badge: '5' },
//                   { icon: Users, label: 'Teams', badge: '2' },
//                   { icon: Hash, label: 'Channels' },
//                   { icon: AtSign, label: 'Mentions', badge: '3' },
//                   { icon: Files, label: 'Shared Files' }
//                 ].map((item, index) => (
//                   <TooltipProvider key={index}>
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           className={cn(
//                             "w-full justify-start",
//                             commsCollapsed && "justify-center px-2"
//                           )}
//                         >
//                           <item.icon className="h-5 w-5" />
//                           {!commsCollapsed && (
//                             <>
//                               <span className="ml-2 flex-1">{item.label}</span>
//                               {item.badge && (
//                                 <Badge variant="secondary">{item.badge}</Badge>
//                               )}
//                             </>
//                           )}
//                         </Button>
//                       </TooltipTrigger>
//                       {commsCollapsed && (
//                         <TooltipContent side="right">
//                           {item.label}
//                         </TooltipContent>
//                       )}
//                     </Tooltip>
//                   </TooltipProvider>
//                 ))}
//               </div>
//             </div>

//             {/* Channels */}
//             {!commsCollapsed && (
//               <div className="p-2">
//                 <div className="flex items-center justify-between px-2 mb-2">
//                   <h3 className="text-sm font-medium text-muted-foreground">Channels</h3>
//                   <Button variant="ghost" size="icon" className="h-6 w-6">
//                     <Plus className="h-4 w-4" />
//                   </Button>
//                 </div>
//                 <div className="space-y-1">
//                   {channels.map((channel) => (
//                     <Button
//                       key={channel.id}
//                       variant="ghost"
//                       className="w-full justify-start"
//                       onClick={() => setSelectedChat(channel)}
//                     >
//                       <Hash className="h-4 w-4" />
//                       <span className="ml-2 flex-1">{channel.name}</span>
//                       {channel.unread > 0 && (
//                         <Badge variant="secondary">{channel.unread}</Badge>
//                       )}
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Direct Messages */}
//             {!commsCollapsed && (
//               <div className="p-2">
//                 <div className="flex items-center justify-between px-2 mb-2">
//                   <h3 className="text-sm font-medium text-muted-foreground">Direct Messages</h3>
//                   <Button variant="ghost" size="icon" className="h-6 w-6">
//                     <Plus className="h-4 w-4" />
//                   </Button>
//                 </div>
//                 <div className="space-y-1">
//                   {directMessages.map((dm) => (
//                     <Button
//                       key={dm.id}
//                       variant="ghost"
//                       className="w-full justify-start"
//                       onClick={() => setSelectedChat(dm)}
//                     >
//                       <div className="relative">
//                         <Avatar className="h-6 w-6">
//                           <AvatarImage src={dm.avatar} alt={dm.name} />
//                           <AvatarFallback>{dm.name[0]}</AvatarFallback>
//                         </Avatar>
//                         <div className={cn(
//                           "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
//                           dm.status === 'online' ? "bg-green-500" :
//                           dm.status === 'away' ? "bg-yellow-500" : "bg-slate-500"
//                         )} />
//                       </div>
//                       <span className="ml-2 flex-1">{dm.name}</span>
//                       {dm.unread > 0 && (
//                         <Badge variant="secondary">{dm.unread}</Badge>
//                       )}
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </ScrollArea>
//         </aside>

//         {/* Main Content Area */}
//         <main className="flex-1 flex">
//           <div className="flex-1 min-w-0">
//             {children}
//           </div>

//           {/* Chat Panel */}
//           {selectedChat && (
//             <aside className={cn(
//               "fixed md:relative inset-y-16 right-0 z-30 bg-card border-l w-full md:w-[400px] transition-all duration-300",
//               mobileChatOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
//             )}>
//               {/* Chat Header */}
//               <div className="flex items-center justify-between p-4 border-b">
//                 <div className="flex items-center gap-3">
//                   {selectedChat.type === 'channel' ? (
//                     <Hash className="h-5 w-5" />
//                   ) : (
//                     <Avatar className="h-8 w-8">
//                       <AvatarImage src={selectedChat.avatar} />
//                       <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
//                     </Avatar>
//                   )}
//                   <div>
//                     <h3 className="font-semibold">{selectedChat.name}</h3>
//                     {selectedChat.type !== 'channel' && (
//                       <p className="text-sm text-muted-foreground">
//                         {selectedChat.status === 'online' ? 'Online' : 'Offline'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Button variant="ghost" size="icon">
//                     <Phone className="h-4 w-4" />
//                   </Button>
//                   <Button variant="ghost" size="icon">
//                     <Video className="h-4 w-4" />
//                   </Button>
//                   <Button variant="ghost" size="icon">
//                     <MoreVertical className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               {/* Chat Content */}
//               <div className="flex flex-col h-[calc(100vh-12rem)]">
//                 <ScrollArea className="flex-1 p-4">
//                   {/* Messages would go here */}
//                 </ScrollArea>

//                 {/* Message Input */}
//                 <div className="p-4 border-t">
//                   <div className="flex items-center gap-2">
//                     <Button variant="ghost" size="icon">
//                       <Plus className="h-4 w-4" />
//                     </Button>
//                     <Input placeholder="Type a message..." />
//                     <Button variant="ghost" size="icon">
//                       <Smile className="h-4 w-4" />
//                     </Button>
//                     <Button>
//                       <Send className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </aside>
//           )}

//           {/* Shared Resources Panel */}
//           <aside className="hidden lg:block border-l bg-card w-64">
//             <div className="p-4 border-b">
//               <h3 className="font-semibold mb-4">Shared Resources</h3>
//               <div className="space-y-4">
//                 {sharedFiles.map((file) => (
//                   <div key={file.id} className="flex items-center gap-3">
//                     {file.type === 'document' ? (
//                       <Files className="h-4 w-4" />
//                     ) : file.type === 'image' ? (
//                       <ImageIcon className="h-4 w-4" />
//                     ) : (
//                       <Files className="h-4 w-4" />
//                     )}
//                     <span className="text-sm truncate">{file.name}</span>
//                   </div>
//                 ))}
//                 <Button variant="outline" className="w-full">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Share File
//                 </Button>
//               </div>
//             </div>
//           </aside>
//         </main>
//       </div>
//     </div>
//   );
// };