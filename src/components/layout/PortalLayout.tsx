// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { ThemeToggle } from '@/components/shared/ThemeToggle';
// import {
//   Heart,
//   BriefcaseIcon,
//   Newspaper,
//   Search,
//   Menu,
//   X,
//   Video,
//   Mail,
//   Globe,
//   ArrowRight,
//   Rss,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';

// export const PortalLayout = ({ children }) => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);

//   // Navigation structure
//   const navItems = {
//     ngo: {
//       label: 'NGO Initiatives',
//       icon: Heart,
//       items: [
//         { title: 'Current Projects', description: 'Our ongoing community initiatives' },
//         { title: 'Get Involved', description: 'Ways to contribute and volunteer' },
//         { title: 'Impact Reports', description: 'Results and achievements' },
//         { title: 'Donations', description: 'Support our causes' }
//       ]
//     },
//     careers: {
//       label: 'Careers',
//       icon: BriefcaseIcon,
//       items: [
//         { title: 'Job Listings', description: 'Available positions' },
//         { title: 'Talent Pool', description: 'Join our database' },
//         { title: 'Casting Calls', description: 'Acting opportunities' },
//         { title: 'Internships', description: 'Learning opportunities' }
//       ]
//     },
//     content: {
//       label: 'Content',
//       icon: Newspaper,
//       items: [
//         { title: 'Blog', description: 'Industry insights and updates' },
//         { title: 'Podcast', description: 'Weekly discussions' },
//         { title: 'Portfolio', description: 'Our work showcase' },
//         { title: 'Resources', description: 'Guides and templates' }
//       ]
//     }
//   };

//   // Featured content
//   const featuredContent = [
//     {
//       type: 'ngo',
//       title: 'Community Film Workshop',
//       description: 'Free filmmaking classes for local youth',
//       icon: Video,
//       color: 'bg-red-500'
//     },
//     {
//       type: 'career',
//       title: 'Production Assistant Positions',
//       description: 'Multiple openings for upcoming projects',
//       icon: BriefcaseIcon,
//       color: 'bg-blue-500'
//     },
//     {
//       type: 'blog',
//       title: 'The Future of Independent Film',
//       description: 'Industry trends and insights',
//       icon: Newspaper,
//       color: 'bg-purple-500'
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-16 items-center justify-between">
//           {/* Left Side */}
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

//           {/* Main Navigation - Desktop */}
//           <NavigationMenu className="hidden md:flex">
//             <NavigationMenuList>
//               {Object.entries(navItems).map(([key, section]) => (
//                 <NavigationMenuItem key={key}>
//                   <NavigationMenuTrigger>
//                     <section.icon className="h-4 w-4 mr-2" />
//                     {section.label}
//                   </NavigationMenuTrigger>
//                   <NavigationMenuContent>
//                     <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
//                       {section.items.map((item) => (
//                         <Button
//                           key={item.title}
//                           variant="ghost"
//                           className="flex h-auto flex-col items-start justify-start p-4 hover:bg-muted"
//                         >
//                           <div className="text-sm font-medium">{item.title}</div>
//                           <div className="text-xs text-muted-foreground">
//                             {item.description}
//                           </div>
//                         </Button>
//                       ))}
//                     </div>
//                   </NavigationMenuContent>
//                 </NavigationMenuItem>
//               ))}
//             </NavigationMenuList>
//           </NavigationMenu>

//           {/* Right Side */}
//           <div className="flex items-center gap-4">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setSearchOpen(!searchOpen)}
//             >
//               <Search className="h-5 w-5" />
//             </Button>
//             <ThemeToggle />
//             <Button variant="outline" size="sm">Contact</Button>
//           </div>
//         </div>

//         {/* Search Bar */}
//         {searchOpen && (
//           <div className="border-t">
//             <div className="container py-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                 <Input
//                   className="w-full pl-9"
//                   placeholder="Search articles, jobs, and initiatives..."
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Mobile Menu */}
//       <div className={cn(
//         "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all md:hidden",
//         mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//       )}>
//         <div className={cn(
//           "fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-background p-6 transition-transform",
//           mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
//         )}>
//           {/* Mobile Menu Header */}
//           <div className="flex items-center justify-between mb-8">
//             <span className="text-xl font-bold text-primary">NE</span>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               <X className="h-5 w-5" />
//             </Button>
//           </div>

//           {/* Mobile Menu Items */}
//           <div className="space-y-6">
//             {Object.entries(navItems).map(([key, section]) => (
//               <div key={key} className="space-y-3">
//                 <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
//                   <section.icon className="h-4 w-4" />
//                   {section.label}
//                 </div>
//                 <div className="ml-6 space-y-1">
//                   {section.items.map((item) => (
//                     <Button
//                       key={item.title}
//                       variant="ghost"
//                       className="w-full justify-start"
//                     >
//                       {item.title}
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Page Content */}
//       <main>
//         {/* Featured Content Grid */}
//         <section className="border-b bg-muted/50">
//           <div className="container py-8">
//             <div className="grid gap-6 md:grid-cols-3">
//               {featuredContent.map((content, index) => (
//                 <div
//                   key={index}
//                   className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-lg transition-all"
//                 >
//                   <div className={cn(
//                     "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 -translate-y-12 translate-x-12 group-hover:opacity-30 transition-opacity",
//                     content.color
//                   )} />
//                   <div className="relative">
//                     <div className={cn(
//                       "inline-flex rounded-lg p-3 mb-4",
//                       content.color + "/10"
//                     )}>
//                       <content.icon className={cn(
//                         "h-6 w-6",
//                         content.color + "/60"
//                       )} />
//                     </div>
//                     <h3 className="text-lg font-semibold mb-2">
//                       {content.title}
//                     </h3>
//                     <p className="text-muted-foreground mb-4">
//                       {content.description}
//                     </p>
//                     <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
//                       Learn more
//                       <ArrowRight className="h-4 w-4 ml-2" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Main Content */}
//         <div className="container py-8">
//           {children}
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="border-t">
//         <div className="container py-12">
//           <div className="grid gap-8 md:grid-cols-4">
//             <div>
//               <h3 className="text-lg font-semibold mb-4">About Us</h3>
//               <p className="text-sm text-muted-foreground mb-4">
//                 Empowering creativity and community through film and media.
//               </p>
//               <div className="flex gap-4">
//                 <Button variant="ghost" size="icon">
//                   <Mail className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="icon">
//                   <Globe className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="icon">
//                   <Rss className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold mb-4">NGO</h3>
//               <div className="space-y-2">
//                 <Button variant="link" className="h-auto p-0">Our Mission</Button>
//                 <Button variant="link" className="h-auto p-0">Impact Reports</Button>
//                 <Button variant="link" className="h-auto p-0">Get Involved</Button>
//                 <Button variant="link" className="h-auto p-0">Donate</Button>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold mb-4">Resources</h3>
//               <div className="space-y-2">
//                 <Button variant="link" className="h-auto p-0">Blog</Button>
//                 <Button variant="link" className="h-auto p-0">Podcast</Button>
//                 <Button variant="link" className="h-auto p-0">Help Center</Button>
//                 <Button variant="link" className="h-auto p-0">Contact</Button>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
//               <p className="text-sm text-muted-foreground mb-4">
//                 Subscribe to stay updated on our latest initiatives and opportunities.
//               </p>
//               <div className="flex gap-2">
//                 <Input placeholder="Email address" />
//                 <Button>Subscribe</Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };