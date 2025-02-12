// components/layout/HeaderWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Film,
  Menu,
  UserPlus,
  LogIn,
  LogOut
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext'; // Use the useAuth hook
import { useState } from 'react';
import { MobileNav } from './MobileNav';

const GUEST_NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' }
];
const PRIMARY_NAV = [
  { label: 'Projects', href: '/projects', icon: Film},
];

const HIDDEN_HEADER_PATHS = [
  /^\/auth\/.*/,  // All auth pages
];

export function HeaderWrapper() {
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuth(); // Get auth status and user
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const shouldHideHeader = HIDDEN_HEADER_PATHS.some(pattern => pattern.test(pathname));
    if (shouldHideHeader) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2 mr-auto">
          <Film className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">
            CineVerse
          </span>
        </Link>
         {/* Mobile Menu Button */}
         <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

        {/* Guest Navigation */}
        {!isAuthenticated && (
          <>
            <nav className="hidden md:flex items-center ml-8 space-x-6">
              {GUEST_NAV.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center space-x-4 ml-auto">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </Link>
              </Button>
            </div>
          </>
        )}

        {/* Authenticated Navigation */}
        {isAuthenticated && (
          <>
            <nav className="hidden md:flex items-center ml-8 space-x-6">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                  pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
            <div className="flex items-center space-x-4 ml-auto">
               <p className="text-sm text-muted-foreground">
                  Logged in as: {user?.email}
                </p>
              <Button variant="ghost" onClick={logout}>
                <LogOut className='h-4 w-4 mr-2'/>
                Logout
              </Button>
            </div>
          </>
        )}
      </div>
       {/* Mobile Navigation */}
       <MobileNav
        items={isAuthenticated? PRIMARY_NAV : GUEST_NAV}
        sectionItems={[]}
        currentPath={pathname}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}

// 'use client'

// import { useState, useEffect } from 'react';
// import { usePathname } from 'next/navigation';
// import Link from 'next/link';
// import { Button } from "@/components/ui/button";
// import {
//   Film, Briefcase, Globe, Menu,
//   MessageSquare, BellRing,
//   UserPlus,
//   LogIn
// } from 'lucide-react';
// import { UserMenu } from './UserMenu';
// import { MobileNav } from './MobileNav';
// import { cn } from "@/lib/utils";
// import { useUserStore } from '@/stores/useUserStore';

// // const SECTIONS = {
// //   projects: {
// //     title: 'Projects',
// //     nav: [
// //       { label: 'Dashboard', href: '/dashboard', icon: Film },
// //       { label: 'My Projects', href: '/projects', icon: Video },
// //       { label: 'Ideas Bank', href: '/ideas', icon: Lightbulb },
// //       { label: 'Teams', href: '/teams', icon: Users }
// //     ],
// //     actions: [{ label: 'New Project', icon: Plus, href: '/projects/new' }]
// //   },
// //   marketplace: {
// //     title: 'Marketplace',
// //     nav: [
// //       { label: 'Equipment', href: '/market/equipment' },
// //       { label: 'Digital Assets', href: '/market/digital' },
// //       { label: 'Services', href: '/market/services' }
// //     ]
// //   },
// //   opportunities: {
// //     title: 'Opportunities',
// //     nav: [
// //       { label: 'Job Board', href: '/jobs', icon: Briefcase },
// //       { label: 'Casting Calls', href: '/casting', icon: Users },
// //       { label: 'NGO Projects', href: '/ngo', icon: HandHeart }
// //     ]
// //   },
// //   communication: {
// //     title: 'Communication',
// //     nav: [
// //       { label: 'Project Chats', href: '/chats/projects' },
// //       { label: 'Team Spaces', href: '/chats/teams' },
// //       { label: 'Direct Messages', href: '/chats/direct' }
// //     ]
// //   },
// //   content: {
// //     title: 'Content',
// //     nav: [
// //       { label: 'Blog', href: '/blog', icon: FileText },
// //       { label: 'Podcast', href: '/podcast', icon: Mic },
// //       { label: 'Resources', href: '/resources' }
// //     ]
// //   }
// // };

// const GUEST_NAV = [
//   { label: 'Home', href: '/' },
//   { label: 'About', href: '/about' },
//   { label: 'Features', href: '/features' },
//   { label: 'Pricing', href: '/pricing' },
//   { label: 'Contact', href: '/contact' }
// ];

// const PRIMARY_NAV = [
//   { label: 'Projects', href: '/projects', icon: Film, section: 'projects' },
//   { label: 'Opportunities', href: '/jobs', icon: Briefcase, section: 'opportunities' },
//   { label: 'Communication', href: '/chats', icon: MessageSquare, section: 'communication' },
//   { label: 'Marketplace', href: '/market', icon: Globe, section: 'marketplace' }
// ];

// const HIDDEN_HEADER_PATHS = [
//   /^\/auth\/.*/,  // All auth pages
//   /^\/preview\/.*/,  // Preview pages
//   /^\/print\/.*/   // Print pages
// ];

// export function HeaderWrapper() {
//   const pathname = usePathname();
//   const { user } = useUserStore();
//   const [, setCurrentSection] = useState('projects');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const shouldHideHeader = HIDDEN_HEADER_PATHS.some(pattern => pattern.test(pathname));

//   useEffect(() => {
//     if (user) {
//       if (pathname.startsWith('/market')) setCurrentSection('marketplace');
//       else if (pathname.startsWith('/jobs') || pathname.startsWith('/casting') || pathname.startsWith('/ngo')) 
//         setCurrentSection('opportunities');
//       else if (pathname.startsWith('/chats')) setCurrentSection('communication');
//       else if (pathname.startsWith('/blog') || pathname.startsWith('/podcast')) 
//         setCurrentSection('content');
//       else setCurrentSection('projects');
//     }
//   }, [pathname, user]);

//   if (shouldHideHeader) return null;

//    // Guest Header
//    if (!user) {
//     return (
//       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-14 items-center">
//           {/* Logo Section */}
//           <div className="flex-1 flex justify-start">
//             <Link href="/" className="flex items-center space-x-2">
//               <Film className="h-6 w-6 text-primary" />
//               <span className="font-bold text-xl hidden md:inline-block">
//                 Na Level Empire
//               </span>
//             </Link>
//           </div>

//           {/* Centered Navigation */}
//           <nav className="flex-1 hidden md:flex items-center justify-center">
//             <div className="flex items-center space-x-8">
//               {GUEST_NAV.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className={cn(
//                     "text-sm font-medium transition-colors hover:text-primary",
//                     pathname === link.href ? "text-primary" : "text-muted-foreground"
//                   )}
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//             </div>
//           </nav>

//           {/* Auth Buttons */}
//           <div className="flex-1 flex items-center justify-end space-x-4">
//             <Button variant="ghost" asChild>
//               <Link href="/auth/login">
//                 <LogIn className="h-4 w-4 mr-2" />
//                 Sign In
//               </Link>
//             </Button>
//             <Button asChild className="bg-primary">
//               <Link href="/auth/register">
//                 <UserPlus className="h-4 w-4 mr-2" />
//                 Create Account
//               </Link>
//             </Button>

//             {/* Mobile Menu Button */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="md:hidden"
//               onClick={() => setIsMobileMenuOpen(true)}
//             >
//               <Menu className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>
//       </header>
//     );
//   }
  
//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container flex h-14 items-center">
//         <div className="flex items-center gap-6 flex-1">
//           <Link href="/dashboard" className="flex items-center space-x-2">
//             <Film className="h-6 w-6 text-primary" />
//             <span className="font-bold text-xl hidden md:inline-block">
//               Na Level Empire
//             </span>
//           </Link>

//           <nav className="hidden md:flex items-center gap-6">
//             {PRIMARY_NAV.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={cn(
//                   "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
//                   pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground"
//                 )}
//               >
//                 <item.icon className="h-4 w-4" />
//                 {item.label}
//               </Link>
//             ))}
//           </nav>
//         </div>

//         <div className="flex items-center gap-2">
//           <Button variant="ghost" size="icon" className="relative">
//             <BellRing className="h-5 w-5" />
//           </Button>

//           <Button variant="ghost" size="icon" className="relative">
//             <MessageSquare className="h-5 w-5" />
//           </Button>

//           <UserMenu />

//           <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
//             <Menu className="h-5 w-5" />
//           </Button>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       <MobileNav 
//         items={PRIMARY_NAV}
//         sectionItems={[]}
//         currentPath={pathname}
//         isOpen={isMobileMenuOpen}
//         onClose={() => setIsMobileMenuOpen(false)}
//       />
//       <MobileNav 
//       items={GUEST_NAV}
//       sectionItems={[]}
//       currentPath={pathname}
//       isOpen={isMobileMenuOpen}
//       onClose={() => setIsMobileMenuOpen(false)}
//     />
//     </header>
//   );
// }