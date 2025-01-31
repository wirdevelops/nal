'use client'

import Link from 'next/link'
import { cn } from "@/lib/utils"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {  X } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  section?: string
}

interface MobileNavProps {
  items: NavItem[]
  sectionItems: NavItem[]
  currentPath: string
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ items, sectionItems, currentPath, isOpen, onClose }: MobileNavProps) {
  return (
    <>
      {/* Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t">
        <div className="grid grid-cols-4 h-16">
          {items.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs",
                currentPath.startsWith(item.href)
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

      {/* Side Navigation Drawer */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-[300px]">
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-bold">Navigation</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="ml-auto"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg",
                      currentPath.startsWith(item.href)
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                    onClick={onClose}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span>{item.label}</span>
                  </Link>
                ))}

                {/* Section Navigation */}
                {sectionItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg ml-4",
                      currentPath === item.href
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                    onClick={onClose}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

// import Link from 'next/link';
// import { cn } from "@/lib/utils";

// interface NavItem {
//   label: string;
//   href: string;
//   icon?: React.ComponentType<{ className?: string }>;
// }

// interface MobileNavProps {
//   items: NavItem[];
//   sectionItems: NavItem[];
//   currentPath: string;
// }

// export function MobileNav({ items, sectionItems, currentPath }: MobileNavProps) {
//   const allItems = [...items, ...sectionItems].slice(0, 4); // Limit to 4 items for mobile

//   return (
//     <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
//       <div className="grid grid-cols-4 h-16">
//         {allItems.map((item) => (
//           <Link
//             key={item.href}
//             href={item.href}
//             className={cn(
//               "flex flex-col items-center justify-center gap-1 text-xs",
//               currentPath === item.href
//                 ? "text-primary"
//                 : "text-muted-foreground hover:text-primary"
//             )}
//           >
//             {item.icon && <item.icon className="h-5 w-5" />}
//             <span>{item.label}</span>
//           </Link>
//         ))}
//       </div>
//     </nav>
//   );
// }