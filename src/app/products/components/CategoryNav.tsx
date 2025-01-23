// components/store/CategoryNav.tsx
import { useState } from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { 
  Camera, 
  Video, 
  Aperture, 
  Music2, 
  Box, 
  Settings,
  Paintbrush,
  Code,
  FileCode,
  ChevronDown
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import type { ProductCategory } from '@/types/store';

interface CategoryItem {
  title: string;
  href: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
}

const physicalCategories: CategoryItem[] = [
  {
    title: "Cameras",
    href: "/store/category/cameras",
    description: "Professional cameras and video equipment",
    icon: Camera,
    badge: "Popular"
  },
  {
    title: "Lenses",
    href: "/store/category/lenses",
    description: "Camera lenses and accessories",
    icon: Aperture
  },
  {
    title: "Lighting",
    href: "/store/category/lighting",
    description: "Professional lighting equipment",
    icon: Box
  },
  {
    title: "Audio",
    href: "/store/category/audio",
    description: "Microphones and audio gear",
    icon: Music2
  },
  {
    title: "Accessories",
    href: "/store/category/accessories",
    description: "Essential filming accessories",
    icon: Settings
  }
];

const digitalCategories: CategoryItem[] = [
  {
    title: "Presets",
    href: "/store/category/presets",
    description: "Professional color presets and filters",
    icon: Paintbrush,
    badge: "New"
  },
  {
    title: "LUTs",
    href: "/store/category/luts",
    description: "Color grading LUTs",
    icon: Video
  },
  {
    title: "Templates",
    href: "/store/category/templates",
    description: "Project templates and assets",
    icon: FileCode
  },
  {
    title: "Scripts",
    href: "/store/category/scripts",
    description: "Scripts and automation tools",
    icon: Code
  }
];

export function CategoryNav() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <NavigationMenu className="max-w-full justify-start">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            onMouseEnter={() => setActiveCategory('physical')}
          >
            Physical Equipment
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
              {physicalCategories.map((category) => (
                <Link
                  key={category.title}
                  href={category.href}
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      <div className="text-sm font-medium leading-none">
                        {category.title}
                        {category.badge && (
                          <Badge variant="secondary" className="ml-2">
                            {category.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {category.description}
                    </p>
                  </NavigationMenuLink>
                </Link>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger
            onMouseEnter={() => setActiveCategory('digital')}
          >
            Digital Products
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
              {digitalCategories.map((category) => (
                <Link
                  key={category.title}
                  href={category.href}
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      <div className="text-sm font-medium leading-none">
                        {category.title}
                        {category.badge && (
                          <Badge variant="secondary" className="ml-2">
                            {category.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {category.description}
                    </p>
                  </NavigationMenuLink>
                </Link>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}