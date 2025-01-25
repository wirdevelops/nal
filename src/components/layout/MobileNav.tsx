import Link from 'next/link';
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface MobileNavProps {
  items: NavItem[];
  sectionItems: NavItem[];
  currentPath: string;
}

export function MobileNav({ items, sectionItems, currentPath }: MobileNavProps) {
  const allItems = [...items, ...sectionItems].slice(0, 4); // Limit to 4 items for mobile

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="grid grid-cols-4 h-16">
        {allItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs",
              currentPath === item.href
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            {item.icon && <item.icon className="h-5 w-5" />}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}