'use client'

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Film, Video, Briefcase, Users, Globe, Menu,
  MessageSquare, Lightbulb, Mic, FileText, HandHeart,
  Plus, BellRing
} from 'lucide-react';
import { UserMenu } from './UserMenu';
import { ShoppingCartSheet } from './ShoppingCartSheet';
import { MobileNav } from './MobileNav';
import { cn } from "@/lib/utils";

const SECTIONS = {
  projects: {
    title: 'Projects',
    nav: [
      { label: 'Dashboard', href: '/dashboard', icon: Film },
      { label: 'My Projects', href: '/projects', icon: Video },
      { label: 'Ideas Bank', href: '/ideas', icon: Lightbulb },
      { label: 'Teams', href: '/teams', icon: Users }
    ],
    actions: [{ label: 'New Project', icon: Plus, href: '/projects/new' }]
  },
  marketplace: {
    title: 'Marketplace',
    nav: [
      { label: 'Equipment', href: '/market/equipment' },
      { label: 'Digital Assets', href: '/market/digital' },
      { label: 'Services', href: '/market/services' }
    ]
  },
  opportunities: {
    title: 'Opportunities',
    nav: [
      { label: 'Job Board', href: '/jobs', icon: Briefcase },
      { label: 'Casting Calls', href: '/casting', icon: Users },
      { label: 'NGO Projects', href: '/ngo', icon: HandHeart }
    ]
  },
  communication: {
    title: 'Communication',
    nav: [
      { label: 'Project Chats', href: '/chats/projects' },
      { label: 'Team Spaces', href: '/chats/teams' },
      { label: 'Direct Messages', href: '/chats/direct' }
    ]
  },
  content: {
    title: 'Content',
    nav: [
      { label: 'Blog', href: '/blog', icon: FileText },
      { label: 'Podcast', href: '/podcast', icon: Mic },
      { label: 'Resources', href: '/resources' }
    ]
  }
};

const PRIMARY_NAV = [
  { label: 'Projects', href: '/dashboard', icon: Film, section: 'projects' },
  { label: 'Opportunities', href: '/jobs', icon: Briefcase, section: 'opportunities' },
  { label: 'Communication', href: '/chats', icon: MessageSquare, section: 'communication' },
  { label: 'Marketplace', href: '/market', icon: Globe, section: 'marketplace' }
];

export function DynamicHeader() {
  const pathname = usePathname();
  const [currentSection, setCurrentSection] = useState('projects');

  useEffect(() => {
    // Map pathname to section
    if (pathname.startsWith('/market')) setCurrentSection('marketplace');
    else if (pathname.startsWith('/jobs') || pathname.startsWith('/casting') || pathname.startsWith('/ngo')) 
      setCurrentSection('opportunities');
    else if (pathname.startsWith('/chats')) setCurrentSection('communication');
    else if (pathname.startsWith('/blog') || pathname.startsWith('/podcast')) 
      setCurrentSection('content');
    else setCurrentSection('projects');
  }, [pathname]);

  const section = SECTIONS[currentSection];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-6 flex-1">
            <Link href="/" className="flex items-center space-x-2">
              <Film className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl hidden md:inline-block">
                Na Level Empire
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {PRIMARY_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                    currentSection === item.section ? "text-primary" : "text-muted-foreground"
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
              <BellRing className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare className="h-5 w-5" />
            </Button>

            {currentSection === 'marketplace' && <ShoppingCartSheet />}
            
            <UserMenu />

            {section.actions?.map((action) => (
              <Button key={action.href} asChild className="hidden md:flex">
                <Link href={action.href}>
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {section.nav && (
          <div className="border-t">
            <div className="container">
              <nav className="hidden md:flex -mb-px flex-1 items-center gap-6">
                {section.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "py-3 border-b-2 text-sm transition-colors hover:text-primary flex items-center gap-2",
                      pathname === item.href 
                        ? "border-primary text-primary" 
                        : "border-transparent text-muted-foreground"
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      <MobileNav 
        items={PRIMARY_NAV}
        sectionItems={section.nav || []}
        currentPath={pathname}
      />
    </>
  );
}