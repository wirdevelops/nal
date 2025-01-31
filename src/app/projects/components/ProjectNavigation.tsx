'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { getProjectNavigation, type NavItem, type NavSection } from '../components/projectNavigation';
import { useProject } from 'others/useProjectHooks';

interface ProjectNavigationProps {
  projectId: string;
  collapsed?: boolean;
  onCollapse?: () => void; // Add a callback for sidebar collapsing
}

export function ProjectNavigation({
  projectId,
  collapsed = false,
  onCollapse, // Receive the callback
}: ProjectNavigationProps) {
  const pathname = usePathname();
  const { project } = useProject(projectId);
  const [openSections, setOpenSections] = useState<string[]>([]);

  if (!project) return null;

  const navigation = getProjectNavigation(project.type);

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev =>
        prev.includes(sectionId)
            ? prev.filter(id => id !== sectionId)
            : [...prev, sectionId]
        );
    };

  const isActiveLink = (href: string) => {
    const fullPath = `/projects/${projectId}${href}`;
    return pathname === fullPath;
  };

 const handleLinkClick = useCallback(() => {
    if(onCollapse){
        onCollapse()
    }
 },[onCollapse])

  const renderNavItem = (item: NavItem, isChild = false) => {
    const fullPath = `/projects/${projectId}${item.href}`;

    if (item.availableInPhases &&
        !item.availableInPhases.includes(project.phase)) {
      return null;
    }

    if (item.requiredRole) {
      // Add role check logic
    }

      return (
        <div key={item.id} className={cn("relative", isChild && "ml-4")}>
        {item.children ? (
          <Collapsible
            open={openSections.includes(item.id)}
            onOpenChange={() => toggleSection(item.id)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  collapsed && "justify-center p-2"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4",
                  isActiveLink(item.href) && "text-primary"
                )} />
                {!collapsed && (
                  <>
                    <span>{item.label}</span>
                    <ChevronDown className="h-4 w-4 ml-auto transition-transform" />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              {item.children.map(child => renderNavItem(child, true))}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <Link href={fullPath} passHref onClick={handleLinkClick}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                collapsed && "justify-center p-2",
                isActiveLink(item.href) && "bg-muted"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4",
                isActiveLink(item.href) && "text-primary"
              )} />
              {!collapsed && (
                <>
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          </Link>
        )}
      </div>
    );
  };


  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="space-y-4 py-4">
        {navigation.map((section) => (
          <div key={section.id} className="px-3 py-2">
            {!collapsed && (
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                {section.label}
              </h2>
            )}
            <div className="space-y-1">
              {section.items.map(item => renderNavItem(item))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}