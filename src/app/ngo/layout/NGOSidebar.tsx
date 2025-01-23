// src/ngo/layout/NGOSidebar.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Home,
  FileText,
  Users,
  Heart,
  Calendar,
  BarChart,
  Settings,
  Mail,
  PieChart,
  Image,
  Globe,
  BookOpen,
} from 'lucide-react';

interface SidebarLink {
  title: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
}

const mainLinks: SidebarLink[] = [
  { title: 'Dashboard', icon: Home, href: '/ngo' },
  { title: 'Projects', icon: FileText, href: '/ngo/projects' },
  { title: 'Volunteers', icon: Users, href: '/ngo/volunteers' },
  { title: 'Donations', icon: Heart, href: '/ngo/donate' },
  { title: 'Events', icon: Calendar, href: '/ngo/events' },
  { title: 'Impact', icon: BarChart, href: '/ngo/impact' },
];

const resourceLinks: SidebarLink[] = [
  { title: 'Blog', icon: BookOpen, href: '/ngo/blog' },
  { title: 'Gallery', icon: Image, href: '/ngo/gallery' },
  { title: 'Success Stories', icon: PieChart, href: '/ngo/stories' },
  { title: 'Partners', icon: Globe, href: '/ngo/partners' },
  { title: 'Contact', icon: Mail, href: '/ngo/contact' },
];

interface NGOSidebarProps {
  collapsed?: boolean;
}

export function NGOSidebar({ collapsed = false }: NGOSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "flex flex-col h-screen border-r bg-background",
      collapsed ? "w-[74px]" : "w-[240px]"
    )}>
      <ScrollArea className="flex-1 pt-4">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                >
                  <Button
                    variant={pathname === link.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      collapsed ? "px-2" : "px-4"
                    )}
                  >
                    <link.icon className={cn(
                      "h-5 w-5",
                      collapsed ? "mr-0" : "mr-2"
                    )} />
                    {!collapsed && <span>{link.title}</span>}
                    {!collapsed && link.badge && (
                      <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="px-3 py-2">
            <h2 className={cn(
              "mb-2 text-xs font-semibold tracking-tight",
              collapsed ? "text-center" : "px-4"
            )}>
              Resources
            </h2>
            <div className="space-y-1">
              {resourceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                >
                  <Button
                    variant={pathname === link.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      collapsed ? "px-2" : "px-4"
                    )}
                  >
                    <link.icon className={cn(
                      "h-5 w-5",
                      collapsed ? "mr-0" : "mr-2"
                    )} />
                     {!collapsed && <span>{link.title}</span>}
                    {!collapsed && link.badge && (
                      <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Settings/Profile Section */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            collapsed ? "px-2" : "px-4"
          )}
        >
          <Settings className={cn(
            "h-5 w-5",
            collapsed ? "mr-0" : "mr-2"
          )} />
          {!collapsed && <span>Settings</span>}
        </Button>
      </div>
    </div>
  );
}