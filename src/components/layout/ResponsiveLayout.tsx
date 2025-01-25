// 'use client'

// import { useState, useEffect } from 'react';
// import { usePathname } from 'next/navigation';
// import Link from 'next/link';
// import { Button } from "@/components/ui/button";
// import {
//   ShoppingCart, Bell, Globe, Menu, Plus,
//   Home, Users,
// } from 'lucide-react';
// import { UserMenu } from './UserMenu';
// import { ShoppingCartSheet } from './ShoppingCartSheet';
// import { MobileNav } from './MobileNav';
// import { cn } from "@/lib/utils";

// const SECTIONS = {
//   home: {
//     title: 'Home',
//     nav: [
//       { label: 'Dashboard', href: '/' },
//       { label: 'Activity', href: '/activity' },
//       { label: 'Notifications', href: '/notifications' }
//     ]
//   },
//   marketplace: {
//     title: 'Marketplace',
//     nav: [
//       { label: 'Browse', href: '/products' },
//       { label: 'Deals', href: '/deals' },
//       { label: 'Categories', href: '/categories' },
//       { label: 'Sellers', href: '/sellers' }
//     ],
//     actions: [
//       { label: 'List Item', icon: Plus, href: '/products/new' }
//     ]
//   },
//   community: {
//     title: 'Community',
//     nav: [
//       { label: 'Forums', href: '/forums' },
//       { label: 'Members', href: '/members' },
//       { label: 'Events', href: '/events' }
//     ]
//   }
// };

// export function DynamicHeader() {
//   const pathname = usePathname();
//   const [currentSection, setCurrentSection] = useState('home');

//   useEffect(() => {
//     // Determine current section based on pathname
//     if (pathname.startsWith('/products')) setCurrentSection('marketplace');
//     else if (pathname.startsWith('/community')) setCurrentSection('community');
//     else setCurrentSection('home');
//   }, [pathname]);

//   const section = SECTIONS[currentSection];

//   const commonNav = [
//     { label: 'Home', href: '/', icon: Home },
//     { label: 'Marketplace', href: '/products', icon: ShoppingCart },
//     { label: 'Community', href: '/community', icon: Users }
//   ];

//   return (
//     <>
//       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         {/* Main Navigation */}
//         <div className="container flex h-14 items-center">
//           <div className="flex items-center gap-6 flex-1">
//             {/* Logo */}
//             <Link href="/" className="flex items-center space-x-2">
//               <Globe className="h-6 w-6 text-primary" />
//               <span className="font-bold text-xl hidden md:inline-block">
//                 {section.title}
//               </span>
//             </Link>

//             {/* Primary Navigation */}
//             <nav className="hidden md:flex items-center gap-6">
//               {commonNav.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className={cn(
//                     "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
//                     pathname === item.href ? "text-primary" : "text-muted-foreground"
//                   )}
//                 >
//                   <item.icon className="h-4 w-4" />
//                   {item.label}
//                 </Link>
//               ))}
//             </nav>
//           </div>

//           {/* Right Actions */}
//           <div className="flex items-center gap-2">
//             <ShoppingCartSheet />
            
//             <Button variant="ghost" size="icon" className="relative">
//               <Bell className="h-5 w-5" />
//             </Button>

//             <UserMenu />

//             {section.actions?.map((action) => (
//               <Button key={action.href} asChild className="hidden md:flex">
//                 <Link href={action.href}>
//                   <action.icon className="h-4 w-4 mr-2" />
//                   {action.label}
//                 </Link>
//               </Button>
//             ))}
//           </div>
//         </div>

//         {/* Section-Specific Navigation */}
//         {section.nav && (
//           <div className="border-t">
//             <div className="container">
//               <nav className="hidden md:flex -mb-px flex-1 items-center gap-6">
//                 {section.nav.map((item) => (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className={cn(
//                       "py-3 border-b-2 text-sm transition-colors hover:text-primary",
//                       pathname === item.href 
//                         ? "border-primary text-primary" 
//                         : "border-transparent text-muted-foreground"
//                     )}
//                   >
//                     {item.label}
//                   </Link>
//                 ))}
//               </nav>
//             </div>
//           </div>
//         )}
//       </header>

//       <MobileNav 
//         items={commonNav}
//         sectionItems={section.nav || []}
//         currentPath={pathname}
//       />
//     </>
//   );
// }

// 'use client'

// import { useState } from 'react';
// import { usePathname } from 'next/navigation';
// import Link from 'next/link';
// import { Button } from "@/components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Bell,
//   ShoppingCart,
//   UserCircle,
//   LogOut,
//   Settings,
//   Heart,
//   Package,
//   Menu,
//   Globe,
//   Plus,
//   Home
// } from 'lucide-react';
// import { cn } from "@/lib/utils";
// //import { CartItemList } from '@/app/products/components/CartItemList';
// import { useCartStore } from '@/stores/useCartStore';
// import { useUserStore } from '@/stores/useUserStore';
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { ThemeToggle } from '../shared/ThemeToggle';

// export function AppLayout({ children }: { children: React.ReactNode }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const pathname = usePathname();
//   const { cart } = useCartStore();
//   const { user, logout } = useUserStore();

//   const cartItemCount = cart?.items?.length || 0;
//   const notificationCount = 3; // Example count
//   const initials = `${user?.name?.first?.[0] || ''}${user?.name?.last?.[0] || ''}`;

//   const navigationItems = [
//     { href: '/', label: 'Home', icon: Home },
//     { href: '/products', label: 'Market', icon: ShoppingCart },
//     { href: '/community', label: 'Community', icon: Globe },
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-16 items-center justify-between">
//           <div className="flex items-center gap-8">
//             <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="lg:hidden">
//               <Menu />
//             </Button>
            
//             <Link href="/" className="flex items-center space-x-2">
//               <Globe className="h-6 w-6 text-primary" />
//               <span className="font-bold text-xl">Marketplace</span>
//             </Link>

//             <nav className="hidden lg:flex items-center gap-6">
//               {navigationItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className={cn(
//                     "text-sm font-medium transition-colors hover:text-primary",
//                     pathname === item.href ? "text-primary" : "text-muted-foreground"
//                   )}
//                 >
//                   <span>{item.label}</span>
//                 </Link>
//               ))}
//             </nav>
//           </div>

//           <div className="flex items-center gap-4">
//             <Button variant="ghost" size="icon" className="relative">
//               <Bell className="h-5 w-5" />
//               {notificationCount > 0 && (
//                 <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
//                   {notificationCount}
//                 </Badge>
//               )}
//             </Button>

//             <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
//               <SheetTrigger asChild>
//                 <Button variant="ghost" size="icon" className="relative">
//                   <ShoppingCart className="h-5 w-5" />
//                   {cartItemCount > 0 && (
//                     <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
//                       {cartItemCount}
//                     </Badge>
//                   )}
//                 </Button>
//               </SheetTrigger>
//               {/* <SheetContent>
//                 <div className="h-full flex flex-col">
//                   <h2 className="font-semibold text-lg mb-4">Shopping Cart</h2>
//                   <div className="flex-1 overflow-auto">
//                     <CartItemList />
//                   </div>
//                   {cartItemCount > 0 && (
//                     <div className="pt-4 border-t">
//                       <Button className="w-full" asChild>
//                         <Link href="/checkout">Checkout</Link>
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               </SheetContent> */}
//             </Sheet>

//             <ThemeToggle />

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage src={user?.avatar} alt={user?.name?.first} />
//                     <AvatarFallback>{initials}</AvatarFallback>
//                   </Avatar>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56">
//                 <DropdownMenuLabel className="font-normal">
//                   <div className="flex flex-col space-y-1">
//                     <p className="text-sm font-medium leading-none">
//                       {user?.name?.first} {user?.name?.last}
//                     </p>
//                     <p className="text-xs leading-none text-muted-foreground">
//                       {user?.email}
//                     </p>
//                   </div>
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem asChild>
//                   <Link href="/profile">
//                     <UserCircle className="mr-2 h-4 w-4" />
//                     Profile
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link href="/orders">
//                     <Package className="mr-2 h-4 w-4" />
//                     Orders
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link href="/wishlist">
//                     <Heart className="mr-2 h-4 w-4" />
//                     Wishlist
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link href="/settings">
//                     <Settings className="mr-2 h-4 w-4" />
//                     Settings
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={logout}>
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Log out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>

//             <Button>
//               <Plus className="mr-2 h-4 w-4" />
//               List Item
//             </Button>
//           </div>
//         </div>
//       </header>

//       <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
//         <SheetContent side="left">
//           <nav className="grid gap-2 py-4">
//             {navigationItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={cn(
//                   "flex items-center gap-2 px-2 py-1 text-sm rounded-md hover:bg-accent",
//                   pathname === item.href ? "bg-accent" : ""
//                 )}
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <item.icon className="h-4 w-4" />
//                 {item.label}
//               </Link>
//             ))}
//           </nav>
//         </SheetContent>
//       </Sheet>

//       <main>{children}</main>
//     </div>
//   );
// }

// 'use client'
// import { useState } from 'react';
// import { usePathname } from 'next/navigation';
// import { cn } from '@/lib/utils';
// import Link from 'next/link';
// import { Button } from '../ui/button';
// import { Home, Globe, Lightbulb, ShoppingCart, Mic, Menu, FileText, Youtube, Briefcase, Users, BookOpen, Calendar, MapPin } from 'lucide-react';
// import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
// import { ThemeToggle } from '../shared/ThemeToggle';
// import { HandHeart } from 'lucide-react';

// const NavigationStructure = [
//     { 
//       section: 'Main',
//       items: [
//         { icon: <Home />, label: 'Home', href: '/' },
//         { icon: <Globe />, label: 'NGO Initiative', href: '/ngo' },
//         { icon: <Lightbulb />, label: 'Projects', href: '/ngo/projects' },
//         { icon: <ShoppingCart />, label: 'Market', href: '/products' }
//       ]
//     },
//     {
//       section: 'Content',
//       items: [
//         { icon: <Mic />, label: 'Podcast', href: '/podcast' },
//         { icon: <FileText />, label: 'Blog', href: '/blog' },
//         { icon: <Youtube />, label: 'Videos', href: '/videos' }
//       ]
//     },
//     {
//       section: 'Opportunities',
//       items: [
//         { icon: <Briefcase />, label: 'Jobs', href: '/careers' },
//         { icon: <Users />, label: 'Casting', href: '/casting' },
//         { icon: <HandHeart />, label: 'Volunteer', href: '/volunteer' }
//       ]
//     }
//   ];
  
//   export function AppLayout({ children }: { children: React.ReactNode }) {
//     const [sidebarOpen, setSidebarOpen] = useState(false);
//     const pathname = usePathname();
  
//     return (
//       <div className="min-h-screen bg-background">
//         {/* Top Navigation */}
//         <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
//           <div className="flex h-16 items-center px-4 gap-4">
//             <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="lg:hidden">
//               <Menu />
//             </Button>
            
//             <div className="flex-1 flex items-center gap-6">
//               <Link href="/" className="flex items-center gap-2">
//                 <Globe className="h-6 w-6 text-primary" />
//                 <span className="font-bold text-xl">Nalevel Empire</span>
//               </Link>
  
//               <nav className="hidden lg:flex items-center gap-6">
//                 {NavigationStructure[0].items.map((item) => (
//                   <Link 
//                     key={item.href}
//                     href={item.href}
//                     className={cn(
//                       "text-sm font-medium transition-colors flex items-center gap-2",
//                       pathname === item.href 
//                         ? "text-primary" 
//                         : "text-muted-foreground hover:text-primary"
//                     )}
//                   >
//                     {item.icon}
//                     {item.label}
//                   </Link>
//                 ))}
//               </nav>
//             </div>
  
//             <div className="flex items-center gap-4">
//               <ThemeToggle />
//               <Button>Join Us</Button>
//             </div>
//           </div>
//         </header>
  
//         {/* Sidebar */}
//         <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
//           <SheetContent side="left" className="w-72">
//             <div className="space-y-8 py-4">
//               {NavigationStructure.map((section) => (
//                 <div key={section.section} className="space-y-3">
//                   <h4 className="font-semibold text-sm text-muted-foreground px-2">
//                     {section.section}
//                   </h4>
//                   <nav className="space-y-1">
//                     {section.items.map((item) => (
//                       <Link
//                         key={item.href}
//                         href={item.href}
//                         className={cn(
//                           "flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm font-medium",
//                           pathname === item.href 
//                             ? "bg-muted text-primary" 
//                             : "hover:bg-muted"
//                         )}
//                         onClick={() => setSidebarOpen(false)}
//                       >
//                         {item.icon}
//                         {item.label}
//                       </Link>
//                     ))}
//                   </nav>
//                 </div>
//               ))}
//             </div>
//           </SheetContent>
//         </Sheet>
  
//         {/* Main Content */}
//         <main className="flex-1">{children}</main>
  
//         {/* Mobile Bottom Nav */}
//         <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t">
//           <div className="grid grid-cols-4 h-16">
//             {NavigationStructure[0].items.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={cn(
//                   "flex flex-col items-center justify-center gap-1 text-xs",
//                   pathname === item.href 
//                     ? "text-primary" 
//                     : "text-muted-foreground hover:text-primary"
//                 )}
//               >
//                 {item.icon}
//                 <span>{item.label}</span>
//               </Link>
//             ))}
//           </div>
//         </nav>
//       </div>
//     );
//   }

// 'use client'

// import React, { useState, useEffect } from 'react';
// import { ThemeToggle } from '@/components//shared/ThemeToggle';
// import {
//     Home,
//     Film,
//     Users,
//     Calendar,
//     Bell,
//     Menu,
//     ShoppingCart,
//     Handshake,
//     Building,
//     Settings,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';


// const ResponsiveLayout = ({ children }) => {
//     const [scrolled, setScrolled] = useState(false);
//     const [lastScrollY, setLastScrollY] = useState(0);
//     const [hideHeader, setHideHeader] = useState(false);
//     const pathname = usePathname();

//     useEffect(() => {
//         const handleScroll = () => {
//             const currentScrollY = window.scrollY;

//             // Show/hide header based on scroll direction
//             if (currentScrollY > lastScrollY) {
//                 setHideHeader(true);
//             } else {
//                 setHideHeader(false);
//             }

//             // Add background when scrolled
//             setScrolled(currentScrollY > 20);
//             setLastScrollY(currentScrollY);
//         };

//         window.addEventListener('scroll', handleScroll, { passive: true });
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, [lastScrollY]);

//     const navigationItems = [
//         { icon: <Home className="w-5 h-5" />, label: 'Home', href: '/', exact: true },
//         { icon: <Film className="w-5 h-5" />, label: 'Filmmaking', href: '/filmmaking' },
//         { icon: <ShoppingCart className="w-5 h-5" />, label: 'Marketplace', href: '/marketplace' },
//         { icon: <Handshake className="w-5 h-5" />, label: 'NGOs', href: '/ngos' },
//         { icon: <Users className="w-5 h-5" />, label: 'Community', href: '/community' },
//         { icon: <Calendar className="w-5 h-5" />, label: 'Schedule', href: '/schedule' },
//         { icon: <Bell className="w-5 h-5" />, label: 'Notifications', href: '/notifications' },
//         { icon: <Building className="w-5 h-5" />, label: 'Organizations', href: '/organizations' },
//         { icon: <Settings className="w-5 h-5" />, label: 'Settings', href: '/settings' },

//     ];

//     return (
//         <div className="min-h-screen bg-background">
//             {/* Header */}
//             <header
//                 className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${hideHeader ? '-translate-y-full' : 'translate-y-0'
//                     } ${scrolled ? 'bg-background/80 backdrop-blur-md border-b' : 'bg-transparent'
//                     }`}
//             >
//                 <div className="mx-auto max-w-7xl px-4">
//                     <div className="flex h-16 items-center justify-between">
//                         <div className="flex items-center gap-4">
//                             <Button variant="ghost" size="icon" className="md:hidden">
//                                 <Menu className="w-5 h-5" />
//                             </Button>
//                             <span className="text-xl font-bold text-red-600">NE</span>
//                         </div>

//                         {/* Desktop Navigation */}
//                         <nav className="hidden md:flex items-center space-x-6">
//                             {navigationItems.map((item, index) => (
//                                 <Link
//                                     key={index}
//                                     href={item.href}
//                                     className={`flex items-center gap-2 text-sm font-medium hover:text-red-600 transition-colors ${pathname === item.href ? 'text-red-600' : 'text-foreground'}`}
//                                 >
//                                     {item.icon}
//                                     <span>{item.label}</span>
//                                 </Link>
//                             ))}
//                         </nav>

//                         <div className="flex items-center gap-4">
//                             <ThemeToggle />
//                             <Button variant="outline" size="sm" className="hidden md:flex">
//                                 Sign Out
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             {/* Main Content */}
//             <main className="pt-16 pb-20 md:pb-6">
//                 <div className="mx-auto max-w-7xl px-4 py-6">
//                     {children}
//                 </div>
//             </main>

//             {/* Bottom Navigation for Mobile */}
//             <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t z-50">
//                 <div className="grid grid-cols-5 h-16">
//                     {navigationItems.map((item, index) => (
//                         <Link
//                             key={index}
//                             href={item.href}
//                             className={`flex flex-col items-center justify-center gap-1 text-xs font-medium hover:text-red-600 transition-colors ${pathname === item.href ? 'text-red-600' : 'text-foreground'}`}
//                         >
//                             {item.icon}
//                             <span>{item.label}</span>
//                         </Link>
//                     ))}
//                 </div>
//             </nav>
//         </div>
//     );
// };

// export default ResponsiveLayout;

// 'use client'

// import React, { useState, useEffect } from 'react';
// import { ThemeToggle } from '@/components//shared/ThemeToggle';
// import { Film, Users, Calendar, Bell, Menu, Home } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';

// const ResponsiveLayout = ({ children }) => {
//   const [scrolled, setScrolled] = useState(false);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const [hideHeader, setHideHeader] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
      
//       // Show/hide header based on scroll direction
//       if (currentScrollY > lastScrollY) {
//         setHideHeader(true); 
//       } else {
//         setHideHeader(false);
//       }
      
//       // Add background when scrolled
//       setScrolled(currentScrollY > 20);
//       setLastScrollY(currentScrollY);
//     };

//     window.addEventListener('scroll', handleScroll, { passive: true });
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [lastScrollY]);

//   const navigationItems = [
//     { icon: <Home className="w-5 h-5" />, label: 'Home', href: '/' },
//     { icon: <Film className="w-5 h-5" />, label: 'Projects', href: '/projects' },
//     { icon: <Users className="w-5 h-5" />, label: 'Crew', href: '/crew' },
//     { icon: <Calendar className="w-5 h-5" />, label: 'Schedule', href: '/schedule' },
//     { icon: <Bell className="w-5 h-5" />, label: 'Notifications', href: '/notifications' },
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header 
//         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//           hideHeader ? '-translate-y-full' : 'translate-y-0'
//         } ${
//           scrolled ? 'bg-background/80 backdrop-blur-md border-b' : 'bg-transparent'
//         }`}
//       >
//         <div className="mx-auto max-w-7xl px-4">
//           <div className="flex h-16 items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Button variant="ghost" size="icon" className="md:hidden">
//                 <Menu className="w-5 h-5" />
//               </Button>
//               <span className="text-xl font-bold text-red-600">NE</span>
//             </div>
            
//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex items-center space-x-6">
//               {navigationItems.map((item, index) => (
//                 <Link
//                   key={index}
//                   href={item.href}
//                   className="flex items-center gap-2 text-sm font-medium hover:text-red-600 transition-colors"
//                 >
//                   {item.icon}
//                   <span>{item.label}</span>
//                 </Link>
//               ))}
//             </nav>
            
//             <div className="flex items-center gap-4">
//               <ThemeToggle />
//               <Button variant="outline" size="sm" className="hidden md:flex">
//                 Sign Out
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="pt-16 pb-20 md:pb-6">
//         <div className="mx-auto max-w-7xl px-4 py-6">
//           {children}
//         </div>
//       </main>

//       {/* Bottom Navigation for Mobile */}
//       <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t z-50">
//         <div className="grid grid-cols-5 h-16">
//           {navigationItems.map((item, index) => (
//             <Link
//               key={index}
//               href={item.href}
//               className="flex flex-col items-center justify-center gap-1 text-xs font-medium hover:text-red-600 transition-colors"
//             >
//               {item.icon}
//               <span>{item.label}</span>
//             </Link>
//           ))}
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default ResponsiveLayout;